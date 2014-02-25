(function(L){
  // shallow object clone for feature properties and attributes
  // from http://jsperf.com/cloning-an-object/2
  function clone(obj) {
    var target = {};
    for (var i in obj) {
      if (obj.hasOwnProperty(i)) {
        target[i] = obj[i];
      }
    }
    return target;
  }

  // determine if polygon ring coordinates are clockwise. clockwise signifies outer ring, counter-clockwise an inner ring
  // or hole. this logic was found at http://stackoverflow.com/questions/1165647/how-to-determine-if-a-list-of-polygon-
  // points-are-in-clockwise-order
  function ringIsClockwise(ringToTest) {
    var total = 0,i = 0;
    var rLength = ringToTest.length;
    var pt1 = ringToTest[i];
    var pt2;
    for (i; i < rLength - 1; i++) {
      pt2 = ringToTest[i + 1];
      total += (pt2[0] - pt1[0]) * (pt2[1] + pt1[1]);
      pt1 = pt2;
    }
    return (total >= 0);
  }

  // ported from terraformer.js https://github.com/Esri/Terraformer/blob/master/terraformer.js#L504-L519
  function vertexIntersectsVertex(a1, a2, b1, b2) {
    var ua_t = (b2[0] - b1[0]) * (a1[1] - b1[1]) - (b2[1] - b1[1]) * (a1[0] - b1[0]);
    var ub_t = (a2[0] - a1[0]) * (a1[1] - b1[1]) - (a2[1] - a1[1]) * (a1[0] - b1[0]);
    var u_b  = (b2[1] - b1[1]) * (a2[0] - a1[0]) - (b2[0] - b1[0]) * (a2[1] - a1[1]);

    if ( u_b !== 0 ) {
      var ua = ua_t / u_b;
      var ub = ub_t / u_b;

      if ( 0 <= ua && ua <= 1 && 0 <= ub && ub <= 1 ) {
        return true;
      }
    }

    return false;
  }

  // ported from terraformer.js https://github.com/Esri/Terraformer/blob/master/terraformer.js#L521-L531
  function arrayIntersectsArray(a, b) {
    for (var i = 0; i < a.length - 1; i++) {
      for (var j = 0; j < b.length - 1; j++) {
        if (vertexIntersectsVertex(a[i], a[i + 1], b[j], b[j + 1])) {
          return true;
        }
      }
    }

    return false;
  }

  // ported from terraformer.js https://github.com/Esri/Terraformer/blob/master/terraformer.js#L470-L480
  function coordinatesContainPoint(coordinates, point) {
    var contains = false;
    for(var i = -1, l = coordinates.length, j = l - 1; ++i < l; j = i) {
      if (((coordinates[i][1] <= point[1] && point[1] < coordinates[j][1]) ||
           (coordinates[j][1] <= point[1] && point[1] < coordinates[i][1])) &&
          (point[0] < (coordinates[j][0] - coordinates[i][0]) * (point[1] - coordinates[i][1]) / (coordinates[j][1] - coordinates[i][1]) + coordinates[i][0])) {
        contains = !contains;
      }
    }
    return contains;
  }

  // ported from terraformer-arcgis-parser.js https://github.com/Esri/terraformer-arcgis-parser/blob/master/terraformer-arcgis-parser.js#L106-L113
  function coordinatesContainCoordinates(outer, inner){
    var intersects = arrayIntersectsArray(outer, inner);
    var contains = coordinatesContainPoint(outer, inner[0]);
    if(!intersects && contains){
      return true;
    }
    return false;
  }

  // do any polygons in this array contain any other polygons in this array?
  // used for checking for holes in arcgis rings
  // ported from terraformer-arcgis-parser.js https://github.com/Esri/terraformer-arcgis-parser/blob/master/terraformer-arcgis-parser.js#L117-L172
  function convertRingsToGeoJSON(rings){
    var outerRings = [];
    var holes = [];

    // for each ring
    for (var r = 0; r < rings.length; r++) {
      var ring = rings[r].slice(0);

      // is this ring an outer ring? is it clockwise?
      if(ringIsClockwise(ring)){
        var polygon = [ ring ];
        outerRings.push(polygon); // push to outer rings
      } else {
        holes.push(ring); // counterclockwise push to holes
      }
    }

    // while there are holes left...
    while(holes.length){
      // pop a hole off out stack
      var hole = holes.pop();
      var matched = false;

      // loop over all outer rings and see if they contain our hole.
      for (var x = outerRings.length - 1; x >= 0; x--) {
        var outerRing = outerRings[x][0];
        if(coordinatesContainCoordinates(outerRing, hole)){
          // the hole is contained push it into our polygon
          outerRings[x].push(hole);

          // we matched the hole
          matched = true;

          // stop checking to see if other outer rings contian this hole
          break;
        }
      }

      // no outer rings contain this hole turn it into and outer ring (reverse it)
      if(!matched){
        outerRings.push([ hole.reverse() ]);
      }
    }

    if(outerRings.length === 1){
      return {
        type: "Polygon",
        coordinates: outerRings[0]
      };
    } else {
      return {
        type: "MultiPolygon",
        coordinates: outerRings
      };
    }
  }

  function calculateBoundsFromArray (array) {
    var x1 = null, x2 = null, y1 = null, y2 = null;

    for (var i = 0; i < array.length; i++) {
      var lonlat = array[i];
      var lon = lonlat[0];
      var lat = lonlat[1];

      if (x1 === null) {
        x1 = lon;
      } else if (lon < x1) {
        x1 = lon;
      }

      if (x2 === null) {
        x2 = lon;
      } else if (lon > x2) {
        x2 = lon;
      }

      if (y1 === null) {
        y1 = lat;
      } else if (lat < y1) {
        y1 = lat;
      }

      if (y2 === null) {
        y2 = lat;
      } else if (lat > y2) {
        y2 = lat;
      }
    }

    return [x1, y1, x2, y2 ];
  }

  function calculateBoundsFromNestedArrays (array) {
    var x1 = null, x2 = null, y1 = null, y2 = null;

    for (var i = 0; i < array.length; i++) {
      var inner = array[i];

      for (var j = 0; j < inner.length; j++) {
        var lonlat = inner[j];

        var lon = lonlat[0];
        var lat = lonlat[1];

        if (x1 === null) {
          x1 = lon;
        } else if (lon < x1) {
          x1 = lon;
        }

        if (x2 === null) {
          x2 = lon;
        } else if (lon > x2) {
          x2 = lon;
        }

        if (y1 === null) {
          y1 = lat;
        } else if (lat < y1) {
          y1 = lat;
        }

        if (y2 === null) {
          y2 = lat;
        } else if (lat > y2) {
          y2 = lat;
        }
      }
    }

    return [x1, y1, x2, y2 ];
  }

  function calculateBoundsFromNestedArrayOfArrays (array) {
    var x1 = null, x2 = null, y1 = null, y2 = null;

    for (var i = 0; i < array.length; i++) {
      var inner = array[i];

      for (var j = 0; j < inner.length; j++) {
        var innerinner = inner[j];
        for (var k = 0; k < innerinner.length; k++) {
          var lonlat = innerinner[k];

          var lon = lonlat[0];
          var lat = lonlat[1];

          if (x1 === null) {
            x1 = lon;
          } else if (lon < x1) {
            x1 = lon;
          }

          if (x2 === null) {
            x2 = lon;
          } else if (lon > x2) {
            x2 = lon;
          }

          if (y1 === null) {
            y1 = lat;
          } else if (lat < y1) {
            y1 = lat;
          }

          if (y2 === null) {
            y2 = lat;
          } else if (lat > y2) {
            y2 = lat;
          }
        }
      }
    }

    return [x1, y1, x2, y2];
  }

  // This function ensures that rings are oriented in the right directions
  // outer rings are clockwise, holes are counterclockwise
  // used for converting GeoJSON Polygons to ArcGIS Polygons
  function orientRings(poly){
    var output = [];
    var polygon = poly.slice(0);
    var outerRing = polygon.shift().slice(0);

    if(!ringIsClockwise(outerRing)){
      outerRing.reverse();
    }

    output.push(outerRing);

    for (var i = 0; i < polygon.length; i++) {
      var hole = polygon[i].slice(0);
      if(ringIsClockwise(hole)){
        hole.reverse();
      }
      output.push(hole);
    }

    return output;
  }

  // This function flattens holes in multipolygons to one array of polygons
  // used for converting GeoJSON Polygons to ArcGIS Polygons
  function flattenMultiPolygonRings(rings){
    var output = [];
    for (var i = 0; i < rings.length; i++) {
      var polygon = orientRings(rings[i]);
      for (var x = polygon.length - 1; x >= 0; x--) {
        var ring = polygon[x].slice(0);
        output.push(ring);
      }
    }
    return output;
  }

  // General utility namespace
  L.esri.Util = {
    // make it so that passed `function` never gets called
    // twice within `delay` milliseconds. Used to throttle
    // `move` events on layers.
    // http://remysharp.com/2010/07/21/throttling-function-calls/
    debounce: function (fn, delay, context) {
      var timer = null;
      return function() {
        var context = this||context, args = arguments;
        clearTimeout(timer);
        timer = setTimeout(function () {
          fn.apply(context, args);
        }, delay);
      };
    },
    // round a number away from zero used to snap
    // row/columns away from the origin of the grid
    roundAwayFromZero: function (num){
      return (num > 0) ? Math.ceil(num) : Math.floor(num);
    },
    // trim whitespace on strings
    // used to clean urls
    trim: function(str) {
      return str.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
    },
    // trim whitespace and add a tailing slash is needed to a url
    cleanUrl: function(url){
      url = L.esri.Util.trim(url);

      //add a trailing slash to the url if the user omitted it
      if(url[url.length-1] !== "/"){
        url += "/";
      }

      return url;
    },
    // quick and dirty param serialization
    serialize: function(params){
      var qs="";

      for(var param in params){
        if(params.hasOwnProperty(param)){
          var key = param;
          var value = params[param];
          qs+=encodeURIComponent(key);
          qs+="=";
          qs+=encodeURIComponent(value);
          qs+="&";
        }
      }

      return qs.substring(0, qs.length - 1);
    },

    // index of polyfill, needed for IE 8
    indexOf: function(arr, obj, start){
      start = start || 0;
      if(arr.indexOf){
        return arr.indexOf(obj, start);
      }
      for (var i = start, j = arr.length; i < j; i++) {
        if (arr[i] === obj) { return i; }
      }
      return -1;
    },

    // convert an extent (ArcGIS) to LatLngBounds (Leaflet)
    extentToBounds: function(extent){
      var sw = new L.LatLng(extent.ymin, extent.xmin);
      var ne = new L.LatLng(extent.ymax, extent.xmax);
      return new L.LatLngBounds(sw, ne);
    },

    mercatorExtentToBounds: function(extent, map){
      var sw = map.unproject(L.point([extent.ymin, extent.xmin]));
      var ne = map.unproject(L.point([extent.ymax, extent.xmax]));
      return new L.LatLngBounds(sw, ne);
    },

    // convert an LatLngBounds (Leaflet) to extent (ArcGIS)
    boundsToExtent: function(bounds) {
      return {
        "xmin": bounds.getSouthWest().lng,
        "ymin": bounds.getSouthWest().lat,
        "xmax": bounds.getNorthEast().lng,
        "ymax": bounds.getNorthEast().lat,
        "spatialReference": {
          "wkid" : 4326
        }
      };
    },

    // convert a LatLngBounds (Leaflet) to a Envelope (Terraformer.Rtree)
    boundsToEnvelope: function(bounds){
      var extent = L.esri.Util.boundsToExtent(bounds);
      return {
        x: extent.xmin,
        y: extent.ymin,
        w: Math.abs(extent.xmin - extent.xmax),
        h: Math.abs(extent.ymin - extent.ymax)
      };
    },
    arcgisToGeojson: function (arcgis, options){
      var geojson = {};

      options = options || {};
      options.idAttribute = options.idAttribute || undefined;

      if(arcgis.x && arcgis.y){
        geojson.type = "Point";
        geojson.coordinates = [arcgis.x, arcgis.y];
      }

      if(arcgis.points){
        geojson.type = "MultiPoint";
        geojson.coordinates = arcgis.points.slice(0);
      }

      if(arcgis.paths) {
        if(arcgis.paths.length === 1){
          geojson.type = "LineString";
          geojson.coordinates = arcgis.paths[0].slice(0);
        } else {
          geojson.type = "MultiLineString";
          geojson.coordinates = arcgis.paths.slice(0);
        }
      }

      if(arcgis.rings) {
        geojson = convertRingsToGeoJSON(arcgis.rings.slice(0));
      }

      if(arcgis.geometry || arcgis.attributes) {
        geojson.type = "Feature";
        geojson.geometry = (arcgis.geometry) ? L.esri.Util.arcgisToGeojson(arcgis.geometry) : null;
        geojson.properties = (arcgis.attributes) ? clone(arcgis.attributes) : null;
        if(arcgis.attributes) {
          geojson.id =  arcgis.attributes[options.idAttribute] || arcgis.attributes.OBJECTID || arcgis.attributes.FID;
        }
      }

      return geojson;
    },

    // GeoJSON -> ArcGIS
    geojsonToArcGIS: function(geojson, options){
      var idAttribute = (options && options.idAttribute) ? options.idAttribute : "OBJECTID";
      var spatialReference = (options && options.sr) ? { wkid: options.sr } : { wkid: 4326 };
      var result = {};
      var i;

      switch(geojson.type){
      case "Point":
        result.x = geojson.coordinates[0];
        result.y = geojson.coordinates[1];
        result.spatialReference = spatialReference;
        break;
      case "MultiPoint":
        result.points = geojson.coordinates.slice(0);
        result.spatialReference = spatialReference;
        break;
      case "LineString":
        result.paths = [geojson.coordinates.slice(0)];
        result.spatialReference = spatialReference;
        break;
      case "MultiLineString":
        result.paths = geojson.coordinates.slice(0);
        result.spatialReference = spatialReference;
        break;
      case "Polygon":
        result.rings = orientRings(geojson.coordinates.slice(0));
        result.spatialReference = spatialReference;
        break;
      case "MultiPolygon":
        result.rings = flattenMultiPolygonRings(geojson.coordinates.slice(0));
        result.spatialReference = spatialReference;
        break;
      case "Feature":
        if(geojson.geometry) {
          result.geometry = L.esri.Util.geojsonToArcGIS(geojson.geometry, options);
        }
        result.attributes = (geojson.properties) ? L.esri.Util.clone(geojson.properties) : {};
        result.attributes[idAttribute] = geojson.id;
        break;
      case "FeatureCollection":
        result = [];
        for (i = 0; i < geojson.features.length; i++){
          result.push(L.esri.Util.geojsonToArcGIS(geojson.features[i], options));
        }
        break;
      case "GeometryCollection":
        result = [];
        for (i = 0; i < geojson.geometries.length; i++){
          result.push(L.esri.Util.geojsonToArcGIS(geojson.geometries[i], options));
        }
        break;
      }

      return result;
    },
    geojsonBounds: function(geojson) {
      if(geojson.type){
        switch (geojson.type) {
          case 'Point':
            return [ geojson.coordinates[0], geojson.coordinates[1], geojson.coordinates[0], geojson.coordinates[1]];

          case 'MultiPoint':
            return calculateBoundsFromArray(geojson.coordinates);

          case 'LineString':
            return calculateBoundsFromArray(geojson.coordinates);

          case 'MultiLineString':
            return calculateBoundsFromNestedArrays(geojson.coordinates);

          case 'Polygon':
            return calculateBoundsFromNestedArrays(geojson.coordinates);

          case 'MultiPolygon':
            return calculateBoundsFromNestedArrayOfArrays(geojson.coordinates);

          case 'Feature':
            return geojson.geometry? L.esri.Util.geojsonBounds(geojson.geometry) : null;

          default:
            throw new Error("Unknown type: " + geojson.type);
        }
      }
      return null;
    }
  };
})(L);