/*! Esri-Leaflet - v0.0.1-beta.4 - 2014-02-24
*   Copyright (c) 2014 Environmental Systems Research Institute, Inc.
*   Apache License*/
/* globals L */

L.esri = {
  _callback: {}
};

// Namespace for various support variables we need to track
L.esri.Support = {
  // from: https://github.com/Modernizr/Modernizr/blob/master/feature-detects/cors.js#L20
  CORS: !!(window.XMLHttpRequest && 'withCredentials' in new XMLHttpRequest())
};

// AJAX handlers for CORS (modern browsers) or JSONP (older browsers)
L.esri.RequestHandlers = {
  CORS: function(url, params, callback, context){
    var httpRequest = new XMLHttpRequest();

    params.f="json";

    httpRequest.onreadystatechange = function(){
      var response;
      if (httpRequest.readyState === 4) {
        try {
          response = JSON.parse(httpRequest.responseText);
        } catch(e) {
          response = {
            error: "Could not parse response as JSON."
          };
        }
        if(context){
          callback.call(context, response);
        } else {
          callback(response);
        }
      }
    };

    httpRequest.open('GET', url + '?' + L.esri.Util.serialize(params), true);
    httpRequest.send(null);
  },
  JSONP: function(url, params, callback, context){
    var callbackId = "c"+(Math.random() * 1e9).toString(36).replace(".", "_");

    params.f="json";
    params.callback="L.esri._callback."+callbackId;

    var script = L.DomUtil.create('script', null, document.body);
    script.type = 'text/javascript';
    script.src = url + '?' +  L.esri.Util.serialize(params);
    script.id = callbackId;

    L.esri._callback[callbackId] = function(response){
      if(context){
        callback.call(context, response);
      } else {
        callback(response);
      }
      document.body.removeChild(script);
      delete L.esri._callback[callbackId];
    };

  }
};

// Choose the correct AJAX handler depending on CORS support
L.esri.get = (L.esri.Support.CORS) ? L.esri.RequestHandlers.CORS : L.esri.RequestHandlers.JSONP;

L.esri.Mixins = {};

L.esri.Mixins.featureGrid = {
  _activeRequests: 0,
  _initializeFeatureGrid: function(map){
    this._map = map;
    this._previousCells = [];
    this.center = this._map.getCenter();
    this.origin = this._map.project(this.center);

    this._moveHandler = L.esri.Util.debounce(function(e){
      if(e.type === "zoomend"){
        this.origin = this._map.project(this.center);
        this._previousCells = [];
      }
      this._requestFeatures(e.target.getBounds());
    }, this.options.debounce, this);

    map.on("zoomend resize move", this._moveHandler, this);

    this._requestFeatures(map.getBounds());
  },
  _destroyFeatureGrid: function(map){
    map.off("zoomend resize move", this._moveHandler, this);
  },
  _requestFeatures: function(bounds){
    var cells = this._cellsWithin(bounds);
    if(cells && cells.length > 0) {
      this.fire("loading", {
        bounds: bounds
      });
    }
    for (var i = 0; i < cells.length; i++) {
      this._makeRequest(cells[i], cells, bounds);
    }
  },
  _makeRequest: function(cell, cells, bounds){
    this._activeRequests++;

    var requestOptions = {
      geometryType: "esriGeometryEnvelope",
      geometry: JSON.stringify(L.esri.Util.boundsToExtent(cell.bounds)),
      outFields: this.options.fields.join(","),
      outSR: 4326,
      inSR: 4326,
      where: this.options.where
    };

    if(this.options.token){
      requestOptions.token = this.options.token;
    }

    L.esri.get(this.url+"query", requestOptions, function(response){
      //deincriment the request counter
      this._activeRequests--;

      // if there are no more active requests fire a load event for this view
      if(this._activeRequests <= 0){
        this.fire("load", {
          bounds: bounds
        });
      }

      // if there is a invalid token error...
      if(response.error && (response.error.code === 499 || response.error.code === 498)) {

        // if we have already asked for authentication
        if(!this._authenticating){

          // ask for authentication
          this._authenticating = true;

          // ask for authentication. developer should fire the retry() method with the new token
          this.fire('authenticationrequired', {
            retry: L.Util.bind(function(token){
              // we are no longer authenticating
              this._authenticating = false;

              // set the new token
              this.options.token = token;

              // clear the previously loaded cells, since they failed to load successfully
              this._previousCells = [];

              // request the features in the current map view again
              this._requestFeatures(this._map.getBounds());
            }, this)
          });
        }
      } else {
        // call the render method to render features
        this._render(response);
      }
    }, this);
  },
  _cellsWithin: function(mapBounds){
    var size = this._map.getSize();
    var offset = this._map.project(this._map.getCenter());
    var padding = Math.min(this.options.cellSize/size.x, this.options.cellSize/size.y);
    var bounds = mapBounds.pad(0.1);
    var cells = [];

    var topLeftPoint = this._map.project(bounds.getNorthWest());
    var bottomRightPoint = this._map.project(bounds.getSouthEast());

    var topLeft = topLeftPoint.subtract(offset).divideBy(this.options.cellSize);
    var bottomRight = bottomRightPoint.subtract(offset).divideBy(this.options.cellSize);

    var offsetRows = Math.round((this.origin.x - offset.x) / this.options.cellSize);
    var offsetCols = Math.round((this.origin.y - offset.y) / this.options.cellSize);

    var minRow = L.esri.Util.roundAwayFromZero(topLeft.x)-offsetRows;
    var maxRow = L.esri.Util.roundAwayFromZero(bottomRight.x)-offsetRows;
    var minCol = L.esri.Util.roundAwayFromZero(topLeft.y)-offsetCols;
    var maxCol = L.esri.Util.roundAwayFromZero(bottomRight.y)-offsetCols;

    for (var row = minRow; row < maxRow; row++) {
      for (var col = minCol; col < maxCol; col++) {
        var cellId = "cell:"+row+":"+col;
        var duplicate = L.esri.Util.indexOf(this._previousCells, cellId) >= 0;

        if(!duplicate || !this.options.deduplicate){
          var cellBounds = this._cellExtent(row, col);
          var cellCenter = cellBounds.getCenter();
          var radius = cellCenter.distanceTo(cellBounds.getNorthWest());
          var distance = cellCenter.distanceTo(this.center);
          var cell = {
            row: row,
            col: col,
            id: cellId,
            center: cellCenter,
            bounds: cellBounds,
            distance:distance,
            radius: radius
          };
          cells.push(cell);
          this._previousCells.push(cellId);
        }
      }
    }

    cells.sort(function (a, b) {
      return a.distance - b.distance;
    });

    return cells;
  },
  _cellExtent: function(row, col){
    var swPoint = this._cellPoint(row, col);
    var nePoint = this._cellPoint(row+1, col+1);
    var sw = this._map.unproject(swPoint);
    var ne = this._map.unproject(nePoint);
    return L.latLngBounds(sw, ne);
  },
  _cellPoint:function(row, col){
    var x = this.origin.x + (row*this.options.cellSize);
    var y = this.origin.y + (col*this.options.cellSize);
    return [x, y];
  }
};

L.esri.Mixins.identifiableLayer = {
  identify:function(latLng, options, callback){
    var defaults = {
      sr: '4326',
      mapExtent: JSON.stringify(L.esri.Util.boundsToExtent(this._map.getBounds())),
      tolerance: 5,
      geometryType: 'esriGeometryPoint',
      imageDisplay: this._map._size.x + ',' + this._map._size.y + ',96',
      geometry: JSON.stringify({
        x: latLng.lng,
        y: latLng.lat,
        spatialReference: {
          wkid: 4326
        }
      })
    };

    if(this.options.layers) {
      defaults.layers = this.options.layers;
    }

    var params;

    if (typeof options === 'function' && typeof callback === 'undefined') {
      callback = options;
      params = defaults;
    } else if (typeof options === 'object') {
      if (options.layerDefs) {
        options.layerDefs = this.parseLayerDefs(options.layerDefs);
      }

      params = L.Util.extend(defaults, options);
    }

    L.esri.get(this.serviceUrl + '/identify', params, callback);
  },
  parseLayerDefs: function (layerDefs) {
    if (layerDefs instanceof Array) {
      //throw 'must be object or string';
      return '';
    }

    if (typeof layerDefs === 'object') {
      return JSON.stringify(layerDefs);
    }

    return layerDefs;
  }
};

L.esri.Mixins.metadata = {
  _getMetadata: function(){
   var requestOptions = {};

    if(this.options.token){
      requestOptions.token = this.options.token;
    }

    L.esri.get(this.url, requestOptions, function(response){
      // if there is a invalid token error...
      if(response.error && (response.error.code === 499 || response.error.code === 498)) {

        // if we have already asked for authentication
        if(!this._authenticating){

          // ask for authentication
          this._authenticating = true;

          // ask for authentication. developer should fire the retry() method with the new token
          this.fire('authenticationrequired', {
            retry: L.Util.bind(function(token){
              // set the new token
              this.options.token = token;

              // get metadata again
              this._getMetadata();

              // reload the image so it shows up with the new token
              this._update();
            }, this)
          });
        }
      } else {
        var extent = response.extent || response.initialExtent || response.fullExtent;
        var payload = {
          metadata: response
        };

        if(extent && this._map){
          if(this._map && (extent.spatialReference.wkid === 102100 || extent.spatialReference.wkid === 3857)) {
            payload.bounds = L.esri.Util.mercatorExtentToBounds(extent, this._map);
          } else if(extent.spatialReference.wkid === 4326) {
            payload.bounds = L.esri.Util.extentToBounds(extent);
          }
        }

        this.fire("metadata", payload);
      }

    }, this);
  }
};
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
/*
(c) 2013, Vladimir Agafonkin
RBush, a JavaScript library for high-performance 2D spatial indexing of points and rectangles.
https://github.com/mourner/rbush

Copyright (c) 2013 Vladimir Agafonkin

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

// Lightly modified for Esri Leaflet by Patrick Arlt to not conflict with the global rbush namespace.

(function (L) { 'use strict';

function rbush(maxEntries, format) {

    // jshint newcap: false, validthis: true
    if (!(this instanceof rbush)) { return new rbush(maxEntries, format); }

    // max entries in a node is 9 by default; min node fill is 40% for best performance
    this._maxEntries = Math.max(4, maxEntries || 9);
    this._minEntries = Math.max(2, Math.ceil(this._maxEntries * 0.4));

    if (format) {
        this._initFormat(format);
    }

    this.clear();
}

rbush.prototype = {

    all: function () {
        return this._all(this.data, []);
    },

    search: function (bbox) {

        var node = this.data,
            result = [];

        if (!this._intersects(bbox, node.bbox)) { return result; }

        var nodesToSearch = [],
            i, len, child, childBBox;

        while (node) {
            for (i = 0, len = node.children.length; i < len; i++) {
                child = node.children[i];
                childBBox = node.leaf ? this.toBBox(child) : child.bbox;

                if (this._intersects(bbox, childBBox)) {

                    if (node.leaf) {
                        result.push(child);

                    } else if (this._contains(bbox, childBBox)) {
                        this._all(child, result);

                    } else {
                        nodesToSearch.push(child);
                    }
                }
            }

            node = nodesToSearch.pop();
        }

        return result;
    },

    load: function (data) {
        if (!(data && data.length)) { return this; }

        if (data.length < this._minEntries) {
            for (var i = 0, len = data.length; i < len; i++) {
                this.insert(data[i]);
            }
            return this;
        }

        // recursively build the tree with the given data from stratch using OMT algorithm
        var node = this._build(data.slice(), 0);

        if (!this.data.children.length) {
            // save as is if tree is empty
            this.data = node;

        } else if (this.data.height === node.height) {
            // split root if trees have the same height
            this._splitRoot(this.data, node);

        } else {
            if (this.data.height < node.height) {
                // swap trees if inserted one is bigger
                var tmpNode = this.data;
                this.data = node;
                node = tmpNode;
            }

            // insert the small tree into the large tree at appropriate level
            this._insert(node, this.data.height - node.height - 1, true);
        }

        return this;
    },

    insert: function (item) {
        if (item) {
            this._insert(item, this.data.height - 1);
        }
        return this;
    },

    clear: function () {
        this.data = {
            children: [],
            leaf: true,
            bbox: this._empty(),
            height: 1
        };
        return this;
    },

    remove: function (item) {
        if (!item) { return this; }

        var node = this.data,
            bbox = this.toBBox(item),
            path = [],
            indexes = [],
            i, parent, index, goingUp;

        // depth-first iterative tree traversal
        while (node || path.length) {

            if (!node) { // go up
                node = path.pop();
                parent = path[path.length - 1];
                i = indexes.pop();
                goingUp = true;
            }

            if (node.leaf) { // check current node
                index = node.children.indexOf(item);

                if (index !== -1) {
                    // item found, remove the item and condense tree upwards
                    node.children.splice(index, 1);
                    path.push(node);
                    this._condense(path);
                    return this;
                }
            }

            if (!goingUp && !node.leaf && this._intersects(bbox, node.bbox)) { // go down
                path.push(node);
                indexes.push(i);
                i = 0;
                parent = node;
                node = node.children[0];

            } else if (parent) { // go right
                i++;
                node = parent.children[i];
                goingUp = false;

            } else { // nothing found
                node = null;
            }
        }

        return this;
    },

    toBBox: function (item) { return item; },

    compareMinX: function (a, b) { return a[0] - b[0]; },
    compareMinY: function (a, b) { return a[1] - b[1]; },

    toJSON: function () { return this.data; },

    fromJSON: function (data) {
        this.data = data;
        return this;
    },

    _all: function (node, result) {
        var nodesToSearch = [];
        while (node) {
            if (node.leaf) {
                result.push.apply(result, node.children);
            } else {
                nodesToSearch.push.apply(nodesToSearch, node.children);
            }
            node = nodesToSearch.pop();
        }
        return result;
    },

    _build: function (items, level, height) {

        var N = items.length,
            M = this._maxEntries,
            node;

        if (N <= M) {
            node = {
                children: items,
                leaf: true,
                height: 1
            };
            this._calcBBox(node);
            return node;
        }

        if (!level) {
            // target height of the bulk-loaded tree
            height = Math.ceil(Math.log(N) / Math.log(M));

            // target number of root entries to maximize storage utilization
            M = Math.ceil(N / Math.pow(M, height - 1));

            items.sort(this.compareMinX);
        }

        // TODO eliminate recursion?

        node = {
            children: [],
            height: height
        };

        var N1 = Math.ceil(N / M) * Math.ceil(Math.sqrt(M)),
            N2 = Math.ceil(N / M),
            compare = level % 2 === 1 ? this.compareMinX : this.compareMinY,
            i, j, slice, sliceLen, childNode;

        // split the items into M mostly square tiles
        for (i = 0; i < N; i += N1) {
            slice = items.slice(i, i + N1).sort(compare);

            for (j = 0, sliceLen = slice.length; j < sliceLen; j += N2) {
                // pack each entry recursively
                childNode = this._build(slice.slice(j, j + N2), level + 1, height - 1);
                node.children.push(childNode);
            }
        }

        this._calcBBox(node);

        return node;
    },

    _chooseSubtree: function (bbox, node, level, path) {

        var i, len, child, targetNode, area, enlargement, minArea, minEnlargement;

        while (true) {
            path.push(node);

            if (node.leaf || path.length - 1 === level) { break; }

            minArea = minEnlargement = Infinity;

            for (i = 0, len = node.children.length; i < len; i++) {
                child = node.children[i];
                area = this._area(child.bbox);
                enlargement = this._enlargedArea(bbox, child.bbox) - area;

                // choose entry with the least area enlargement
                if (enlargement < minEnlargement) {
                    minEnlargement = enlargement;
                    minArea = area < minArea ? area : minArea;
                    targetNode = child;

                } else if (enlargement === minEnlargement) {
                    // otherwise choose one with the smallest area
                    if (area < minArea) {
                        minArea = area;
                        targetNode = child;
                    }
                }
            }

            node = targetNode;
        }

        return node;
    },

    _insert: function (item, level, isNode, root) {

        var bbox = isNode ? item.bbox : this.toBBox(item),
            insertPath = [];

        // find the best node for accommodating the item, saving all nodes along the path too
        var node = this._chooseSubtree(bbox, root || this.data, level, insertPath),
            splitOccured;

        // put the item into the node
        node.children.push(item);
        this._extend(node.bbox, bbox);

        // split on node overflow; propagate upwards if necessary
        do {
            splitOccured = false;
            if (insertPath[level].children.length > this._maxEntries) {
                this._split(insertPath, level);
                splitOccured = true;
                level--;
            }
        } while (level >= 0 && splitOccured);

        // adjust bboxes along the insertion path
        this._adjustParentBBoxes(bbox, insertPath, level);
    },

    // split overflowed node into two
    _split: function (insertPath, level) {

        var node = insertPath[level],
            M = node.children.length,
            m = this._minEntries;

        this._chooseSplitAxis(node, m, M);

        var newNode = {
            children: node.children.splice(this._chooseSplitIndex(node, m, M)),
            height: node.height
        };

        if (node.leaf) {
            newNode.leaf = true;
        }

        this._calcBBox(node);
        this._calcBBox(newNode);

        if (level) {
            insertPath[level - 1].children.push(newNode);
        } else {
            this._splitRoot(node, newNode);
        }
    },

    _splitRoot: function (node, newNode) {
        // split root node
        this.data = {};
        this.data.children = [node, newNode];
        this.data.height = node.height + 1;
        this._calcBBox(this.data);
    },

    _chooseSplitIndex: function (node, m, M) {

        var i, bbox1, bbox2, overlap, area, minOverlap, minArea, index;

        minOverlap = minArea = Infinity;

        for (i = m; i <= M - m; i++) {
            bbox1 = this._distBBox(node, 0, i);
            bbox2 = this._distBBox(node, i, M);

            overlap = this._intersectionArea(bbox1, bbox2);
            area = this._area(bbox1) + this._area(bbox2);

            // choose distribution with minimum overlap
            if (overlap < minOverlap) {
                minOverlap = overlap;
                index = i;

                minArea = area < minArea ? area : minArea;

            } else if (overlap === minOverlap) {
                // otherwise choose distribution with minimum area
                if (area < minArea) {
                    minArea = area;
                    index = i;
                }
            }
        }

        return index;
    },

    // sorts node children by the best axis for split
    _chooseSplitAxis: function (node, m, M) {

        var compareMinX = node.leaf ? this.compareMinX : this._compareNodeMinX,
            compareMinY = node.leaf ? this.compareMinY : this._compareNodeMinY,
            xMargin = this._allDistMargin(node, m, M, compareMinX),
            yMargin = this._allDistMargin(node, m, M, compareMinY);

        // if total distributions margin value is minimal for x, sort by minX,
        // otherwise it's already sorted by minY

        if (xMargin < yMargin) {
            node.children.sort(compareMinX);
        }
    },

    // total margin of all possible split distributions where each node is at least m full
    _allDistMargin: function (node, m, M, compare) {

        node.children.sort(compare);

        var leftBBox = this._distBBox(node, 0, m),
            rightBBox = this._distBBox(node, M - m, M),
            margin = this._margin(leftBBox) + this._margin(rightBBox),
            i, child;

        for (i = m; i < M - m; i++) {
            child = node.children[i];
            this._extend(leftBBox, node.leaf ? this.toBBox(child) : child.bbox);
            margin += this._margin(leftBBox);
        }

        for (i = M - m - 1; i >= 0; i--) {
            child = node.children[i];
            this._extend(rightBBox, node.leaf ? this.toBBox(child) : child.bbox);
            margin += this._margin(rightBBox);
        }

        return margin;
    },

    // min bounding rectangle of node children from k to p-1
    _distBBox: function (node, k, p) {
        var bbox = this._empty();

        for (var i = k, child; i < p; i++) {
            child = node.children[i];
            this._extend(bbox, node.leaf ? this.toBBox(child) : child.bbox);
        }

        return bbox;
    },

    // calculate node's bbox from bboxes of its children
    _calcBBox: function (node) {
        node.bbox = this._empty();

        for (var i = 0, len = node.children.length, child; i < len; i++) {
            child = node.children[i];
            this._extend(node.bbox, node.leaf ? this.toBBox(child) : child.bbox);
        }
    },

    _adjustParentBBoxes: function (bbox, path, level) {
        // adjust bboxes along the given tree path
        for (var i = level; i >= 0; i--) {
            this._extend(path[i].bbox, bbox);
        }
    },

    _condense: function (path) {
        // go through the path, removing empty nodes and updating bboxes
        for (var i = path.length - 1, parent; i >= 0; i--) {
            if (path[i].children.length === 0) {
                if (i > 0) {
                    parent = path[i - 1].children;
                    parent.splice(parent.indexOf(path[i]), 1);
                } else {
                    this.clear();
                }
            } else {
                this._calcBBox(path[i]);
            }
        }
    },

    _contains: function(a, b) {
        return a[0] <= b[0] &&
               a[1] <= b[1] &&
               b[2] <= a[2] &&
               b[3] <= a[3];
    },

    _intersects: function (a, b) {
        return b[0] <= a[2] &&
               b[1] <= a[3] &&
               b[2] >= a[0] &&
               b[3] >= a[1];
    },

    _extend: function (a, b) {
        a[0] = Math.min(a[0], b[0]);
        a[1] = Math.min(a[1], b[1]);
        a[2] = Math.max(a[2], b[2]);
        a[3] = Math.max(a[3], b[3]);
        return a;
    },

    _area:   function (a) { return (a[2] - a[0]) * (a[3] - a[1]); },
    _margin: function (a) { return (a[2] - a[0]) + (a[3] - a[1]); },

    _enlargedArea: function (a, b) {
        return (Math.max(b[2], a[2]) - Math.min(b[0], a[0])) *
               (Math.max(b[3], a[3]) - Math.min(b[1], a[1]));
    },

    _intersectionArea: function (a, b) {
        var minX = Math.max(a[0], b[0]),
            minY = Math.max(a[1], b[1]),
            maxX = Math.min(a[2], b[2]),
            maxY = Math.min(a[3], b[3]);

        return Math.max(0, maxX - minX) *
               Math.max(0, maxY - minY);
    },

    _empty: function () { return [Infinity, Infinity, -Infinity, -Infinity]; },

    _compareNodeMinX: function (a, b) { return a.bbox[0] - b.bbox[0]; },
    _compareNodeMinY: function (a, b) { return a.bbox[1] - b.bbox[1]; },

    _initFormat: function (format) {
        // data format (minX, minY, maxX, maxY accessors)

        // uses eval-type function compilation instead of just accepting a toBBox function
        // because the algorithms are very sensitive to sorting functions performance,
        // so they should be dead simple and without inner calls

        // jshint evil: true

        var compareArr = ['return a', ' - b', ';'];

        this.compareMinX = new Function('a', 'b', compareArr.join(format[0]));
        this.compareMinY = new Function('a', 'b', compareArr.join(format[1]));

        this.toBBox = new Function('a', 'return [a' + format.join(', a') + '];');
    }
};

L.esri._rbush = rbush;

})(L);
(function(L){

  var tileProtocol = (window.location.protocol !== "https:") ? "http:" : "https:";
  var attributionStyles = "line-height:9px; text-overflow:ellipsis; white-space:nowrap;overflow:hidden; display:inline-block;";
  var logoStyles = "position:absolute; top:-38px; right:2px;";
  var attributionLogo = "<img src='https://serverapi.arcgisonline.com/jsapi/arcgis/3.5/js/esri/images/map/logo-med.png' alt='Powered by Esri' class='esri-attribution-logo' style='"+logoStyles+"'>";
  var formatTextAttributions = function formatTextAttributions(text){
    return "<span class='esri-attributions' style='"+attributionStyles+"'>" + text + "</span>";
  };

  L.esri.BasemapLayer = L.TileLayer.extend({
    statics: {
      TILES: {
        Streets: {
          urlTemplate: tileProtocol + "//{s}.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}",
          attributionUrl: "https://static.arcgis.com/attribution/World_Street_Map",
          options: {
            minZoom: 1,
            maxZoom: 19,
            subdomains: ["server", "services"],
            attribution: formatTextAttributions("Esri") + attributionLogo
          }
        },
        Topographic: {
          urlTemplate: tileProtocol + "//{s}.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}",
          attributionUrl: "https://static.arcgis.com/attribution/World_Topo_Map",
          options: {
            minZoom: 1,
            maxZoom: 19,
            subdomains: ["server", "services"],
            attribution: formatTextAttributions("Esri") + attributionLogo
          }
        },
        Oceans: {
          urlTemplate: tileProtocol + "//server.arcgisonline.com/ArcGIS/rest/services/Ocean_Basemap/MapServer/tile/{z}/{y}/{x}",
          attributionUrl: "https://static.arcgis.com/attribution/Ocean_Basemap",
          options: {
            minZoom: 1,
            maxZoom: 16,
            subdomains: ["server", "services"],
            attribution: formatTextAttributions("Esri") + attributionLogo
          }
        },
        NationalGeographic: {
          urlTemplate: "https://server.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}",
          options: {
            minZoom: 1,
            maxZoom: 16,
            subdomains: ["server", "services"],
            attribution: formatTextAttributions("Esri") + attributionLogo
          }
        },
        DarkGray: {
          urlTemplate: tileProtocol + "//tiles{s}.arcgis.com/tiles/P3ePLMYs2RVChkJx/arcgis/rest/services/World_Dark_Gray_Base_Beta/MapServer/tile/{z}/{y}/{x}",
          options: {
            minZoom: 1,
            maxZoom: 10,
            subdomains: [1, 2],
            attribution: formatTextAttributions("Esri, DeLorme, HERE") + attributionLogo
          }
        },
        DarkGrayLabels: {
          urlTemplate: tileProtocol + "//tiles{s}.arcgis.com/tiles/P3ePLMYs2RVChkJx/arcgis/rest/services/World_Dark_Gray_Reference_Beta/MapServer/tile/{z}/{y}/{x}",
          options: {
            minZoom: 1,
            maxZoom: 10,
            subdomains: [1, 2]
          }
        },
        Gray: {
          urlTemplate: tileProtocol + "//{s}.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}",
          options: {
            minZoom: 1,
            maxZoom: 16,
            subdomains: ["server", "services"],
            attribution: formatTextAttributions("Esri, NAVTEQ, DeLorme") + attributionLogo
          }
        },
        GrayLabels: {
          urlTemplate: tileProtocol + "//{s}.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Reference/MapServer/tile/{z}/{y}/{x}",
          options: {
            minZoom: 1,
            maxZoom: 16,
            subdomains: ["server", "services"]
          }
        },
        Imagery: {
          urlTemplate: tileProtocol + "//{s}.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
          options: {
            minZoom: 1,
            maxZoom: 19,
            subdomains: ["server", "services"],
            attribution: formatTextAttributions("Esri, DigitalGlobe, GeoEye, i-cubed, USDA, USGS, AEX, Getmapping, Aerogrid, IGN, IGP, swisstopo, and the GIS User Community") + attributionLogo
          }
        },
        ImageryLabels: {
          urlTemplate: tileProtocol + "//{s}.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}",
          options: {
            minZoom: 1,
            maxZoom: 19,
            subdomains: ["server", "services"]
          }
        },
        ImageryTransportation: {
          urlTemplate: tileProtocol + "//{s}.arcgisonline.com/ArcGIS/rest/services/Reference/World_Transportation/MapServer/tile/{z}/{y}/{x}",
          options: {
            minZoom: 1,
            maxZoom: 19,
            subdomains: ["server", "services"]
          }
        },
        ShadedRelief: {
          urlTemplate: tileProtocol + "//{s}.arcgisonline.com/ArcGIS/rest/services/World_Shaded_Relief/MapServer/tile/{z}/{y}/{x}",
          options: {
            minZoom: 1,
            maxZoom: 13,
            subdomains: ["server", "services"],
            attribution: formatTextAttributions("ESRI, NAVTEQ, DeLorme") + attributionLogo
          }
        },
        ShadedReliefLabels: {
          urlTemplate: tileProtocol + "//{s}.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places_Alternate/MapServer/tile/{z}/{y}/{x}",
          options: {
            minZoom: 1,
            maxZoom: 12,
            subdomains: ["server", "services"]
          }
        },
        Terrain: {
          urlTemplate: tileProtocol + "//{s}.arcgisonline.com/ArcGIS/rest/services/World_Terrain_Base/MapServer/tile/{z}/{y}/{x}",
          options: {
            minZoom: 1,
            maxZoom: 13,
            subdomains: ["server", "services"],
            attribution: formatTextAttributions("Esri, USGS, NOAA") + attributionLogo
          }
        },
        TerrainLabels: {
          urlTemplate: tileProtocol + "//{s}.arcgisonline.com/ArcGIS/rest/services/Reference/World_Reference_Overlay/MapServer/tile/{z}/{y}/{x}",
          options: {
            minZoom: 1,
            maxZoom: 13,
            subdomains: ["server", "services"]
          }
        }
      }
    },
    initialize: function(key, options){
      var config;
      // set the config variable with the appropriate config object
      if (typeof key === "object" && key.urlTemplate && key.options){
        config = key;
      } else if(typeof key === "string" && L.esri.BasemapLayer.TILES[key]){
        config = L.esri.BasemapLayer.TILES[key];
      } else {
        throw new Error("L.esri.BasemapLayer: Invalid parameter. Use one of 'Streets', 'Topographic', 'Oceans', 'NationalGeographic', 'Gray', 'GrayLabels', 'DarkGray', 'DarkGrayLabels', 'Imagery', 'ImageryLabels', 'ImageryTransportation', 'ShadedRelief' or 'ShadedReliefLabels'");
      }

      // merge passed options into the config options
      var mergedOptions = L.Util.extend(config.options, options);

      // call the initialize method on L.TileLayer to set everything up
      L.TileLayer.prototype.initialize.call(this, config.urlTemplate, L.Util.setOptions(this, mergedOptions));

      // if this basemap requires dynamic attribution set it up
      if(config.attributionUrl){
        var attributionUrl = config.attributionUrl;
        this._dynamicAttribution = true;
        this._getAttributionData(attributionUrl);
      }
    },
    _dynamicAttribution: false,
    bounds: null,
    zoom: null,
    onAdd: function(map){
      if(!map.attributionControl && console){
        console.warn("L.esri.BasemapLayer requires attribution. Please set attributionControl to true on your map");
        return;
      }
      L.TileLayer.prototype.onAdd.call(this, map);
      if(this._dynamicAttribution){
        this.on("load", this._handleTileUpdates, this);
        this._map.on("viewreset zoomend dragend", this._handleTileUpdates, this);
      }
      this._map.on("resize", this._resizeAttribution, this);
    },
    onRemove: function(map){
      if(this._dynamicAttribution){
        this.off("load", this._handleTileUpdates, this);
        this._map.off("viewreset zoomend dragend", this._handleTileUpdates, this);
      }
      this._map.off("resize", this._resizeAttribution, this);
      L.TileLayer.prototype.onRemove.call(this, map);
    },
    _handleTileUpdates: function(e){
      var newBounds;
      var newZoom;

      if(e.type === "load"){
        newBounds = this._map.getBounds();
        newZoom = this._map.getZoom();
      }

      if(e.type === "viewreset" || e.type === "dragend" || e.type ==="zoomend"){
        newBounds = e.target.getBounds();
        newZoom = e.target.getZoom();
      }

      if(this.attributionBoundingBoxes && newBounds && newZoom){
        if(!newBounds.equals(this.bounds) || newZoom !== this.zoom){
          this.bounds = newBounds;
          this.zoom = newZoom;
          this._updateMapAttribution();
        }
      }
    },
    _resizeAttribution: function(){
      var mapWidth = this._map.getSize().x;
      this._getAttributionLogo().style.display = (mapWidth < 600) ? "none":"block";
      this._getAttributionSpan().style.maxWidth =  (mapWidth* 0.75) + "px";
    },
    _getAttributionData: function(url){
      this.attributionBoundingBoxes = [];
      L.esri.RequestHandlers.JSONP(url, {}, this._processAttributionData, this);
    },
    _processAttributionData: function(attributionData){
      for (var c = 0; c < attributionData.contributors.length; c++) {
        var contributor = attributionData.contributors[c];
        for (var i = 0; i < contributor.coverageAreas.length; i++) {
          var coverageArea = contributor.coverageAreas[i];
          var southWest = new L.LatLng(coverageArea.bbox[0], coverageArea.bbox[1]);
          var northEast = new L.LatLng(coverageArea.bbox[2], coverageArea.bbox[3]);
          this.attributionBoundingBoxes.push({
            attribution: contributor.attribution,
            score: coverageArea.score,
            bounds: new L.LatLngBounds(southWest, northEast),
            minZoom: coverageArea.zoomMin,
            maxZoom: coverageArea.zoomMax
          });
        }
      }
      this.attributionBoundingBoxes.sort(function(a,b){
        if (a.score < b.score){ return -1; }
        if (a.score > b.score){ return 1; }
        return 0;
      });
      if(this.bounds){
        this._updateMapAttribution();
      }
    },
    _getAttributionSpan:function(){
      return this._map._container.querySelectorAll('.esri-attributions')[0];
    },
    _getAttributionLogo:function(){
      return this._map._container.querySelectorAll('.esri-attribution-logo')[0];
    },
    _updateMapAttribution: function(){
      var newAttributions = '';
      for (var i = 0; i < this.attributionBoundingBoxes.length; i++) {
        var attr = this.attributionBoundingBoxes[i];
        if(this.bounds.intersects(attr.bounds) && this.zoom >= attr.minZoom && this.zoom <= attr.maxZoom) {
          var attribution = this.attributionBoundingBoxes[i].attribution;
          if(newAttributions.indexOf(attribution) === -1){
            if(newAttributions.length > 0){
              newAttributions += ', ';
            }
            newAttributions += attribution;
          }
        }
      }
      this._getAttributionSpan().innerHTML = newAttributions;
      this._resizeAttribution();
    }
  });

  L.esri.basemapLayer = function(key, options){
    return new L.esri.BasemapLayer(key, options);
  };

})(L);
  /* globals Terraformer, L */
(function(L){

  // toggles the visibility of a layer. Used to
  // show or hide layers that move in or out of
  // the map bounds
  function setLayerVisibility(layer, visible){
    var style = (visible) ? "block" : "none";

    if(layer._icon){
      layer._icon.style.display = style;
    }

    if(layer._shadow){
      layer._shadow.style.display = style;
    }

    if(layer._layers){
      for(var layerid in layer._layers){
        if(layer._layers.hasOwnProperty(layerid)){
          layer._layers[layerid]._container.style.display = style;
        }
      }
    }
  }

  L.esri.FeatureLayer = L.GeoJSON.extend({
    includes: L.esri.Mixins.featureGrid,
    options: {
      cellSize: 512,
      debounce: 100,
      deduplicate: true,
      where: "1=1",
      fields: ["*"]
    },
    initialize: function(url, options){
      this.index = L.esri._rbush();
      this.url = L.esri.Util.cleanUrl(url);
      L.Util.setOptions(this, options);

      L.Util.setOptions(this, options);

      this._getMetadata();

      L.GeoJSON.prototype.initialize.call(this, [], options);
    },
    onAdd: function(map){
      this._updateHandler = L.esri.Util.debounce(this._update, this.options.debounce);
      L.LayerGroup.prototype.onAdd.call(this, map);
      map.on("zoomend resize moveend", this._updateHandler, this);
      this._initializeFeatureGrid(map);
    },
    onRemove: function(map){
      map.off("zoomend resize moveend", this._updateHandler, this);
      L.LayerGroup.prototype.onRemove.call(this, map);
      this._destroyFeatureGrid(map);
    },
    getLayerId: function(layer){
      return layer.feature.id;
    },
    getWhere: function(){
      return this.options.where;
    },
    setWhere: function(where){
      this.options.where = where;
      this.refresh();
      return this;
    },
    getFields: function(){
      return this.options.fields;
    },
    setFields: function(fields){
      this.options.fields = fields;
      this.refresh();
      return this;
    },
    refresh: function(){
      this.clearLayers();
      this._loaded = [];
      this._previousCells = [];
      this._requestFeatures(this._map.getBounds());
    },
    _update: function(e){
      var envelope = L.esri.Util.boundsToEnvelope(e.target.getBounds());
      var results = this.index.search(e.target.getBounds().toBBoxString().split(','));
      var ids = [];
      for (var i = 0; i < results.length; i++) {
        ids.push(results[i][4]);
      }
      this.eachLayer(L.Util.bind(function(layer){
        var id = layer.feature.id;
        setLayerVisibility(layer, L.esri.Util.indexOf(ids, id) >= 0);
      }, this));
    },
    _setObjectIdField: function(response){
      if(response.objectIdFieldName){
        this._objectIdField = response.objectIdFieldName;
      } else {
        for (var j = 0; j <= response.fields.length - 1; j++) {
          if(response.fields[j].type === "esriFieldTypeOID") {
            this._objectIdField = response.fields[j].name;
            break;
          }
        }
      }
    },
    _render: function(response){
      if(response.features && response.features.length && !response.error){
        if(!this._objectIdField){
          this._setObjectIdField(response);
        }
        var bounds = [];
        for (var i = response.features.length - 1; i >= 0; i--) {
          var feature = response.features[i];
          var id = feature.attributes[this._objectIdField];
          if(!this._layers[id]){
            var geojson = L.esri.Util.arcgisToGeojson(feature, {
              idAttribute: this._objectIdField
            });
            var bbox = L.esri.Util.geojsonBounds(geojson);
            bbox.push(geojson.id);
            bounds.push(bbox);
            this.addData(geojson);
          }
        }
        this.index.load(bounds);
      }
    }
  });

  L.esri.FeatureLayer.include(L.esri.Mixins.metadata);

  L.esri.featureLayer = function(url, options){
    return new L.esri.FeatureLayer(url, options);
  };

})(L);

/* globals L */

L.esri.TiledMapLayer = L.TileLayer.extend({
  includes: L.esri.Mixins.identifiableLayer,
  initialize: function(url, options){
    options = options || {};

    // set the urls
    this.url = L.esri.Util.cleanUrl(url);
    this.tileUrl = L.esri.Util.cleanUrl(url) + "tile/{z}/{y}/{x}";

    //if this is looking at the AGO tiles subdomain insert the subdomain placeholder
    if(this.tileUrl.match("://tiles.arcgis.com")){
      this.tileUrl = this.tileUrl.replace("://tiles.arcgis.com", "://tiles{s}.arcgis.com");
      options.subdomains = ["1", "2", "3", "4"];
    }

    L.Util.setOptions(this, options);

    this._getMetadata();

    // init layer by calling TileLayers initialize method
    L.TileLayer.prototype.initialize.call(this, this.tileUrl, options);
  }
});

L.esri.TiledMapLayer.include(L.esri.Mixins.metadata);

L.esri.tiledMapLayer = function(key, options){
  return new L.esri.TiledMapLayer(key, options);
};
/* globals L */

/*!
 * The MIT License (MIT)
 *
 * Copyright (c) 2013 Sanborn Map Company, Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

L.esri.DynamicMapLayer = L.Class.extend({
  includes: L.esri.Mixins.identifiableLayer,

  options: {
    opacity: 1,
    position: 'front'
  },

  _defaultLayerParams: {
    format: 'png24',
    transparent: true,
    f: 'image',
    bboxSR: 3875,
    imageSR: 3875,
    layers: '',
    layerDefs: ''
  },

  initialize: function (url, options) {
    this.url = L.esri.Util.cleanUrl(url);
    this._layerParams = L.Util.extend({}, this._defaultLayerParams);

    for (var opt in options) {
      if (options.hasOwnProperty(opt) && this._defaultLayerParams.hasOwnProperty(opt)) {
        this._layerParams[opt] = options[opt];
      }
    }

    this._parseLayers();
    this._parseLayerDefs();

    L.Util.setOptions(this, options);

    this._getMetadata();

    if(!this._layerParams.transparent) {
      this.options.opacity = 1;
    }
  },

  onAdd: function (map) {
    this._map = map;
    this._moveHandler = L.esri.Util.debounce(this._update, 150, this);

    map.on("moveend", this._moveHandler, this);

    if (map.options.crs && map.options.crs.code) {
      var sr = map.options.crs.code.split(":")[1];
      this._layerParams.bboxSR = sr;
      this._layerParams.imageSR = sr;
    }

    this._update();
  },

  onRemove: function (map) {
    if (this._currentImage) { this._map.removeLayer(this._currentImage); }
    map.off("moveend", this._moveHandler, this);
  },

  addTo: function (map) {
    map.addLayer(this);
    return this;
  },

  setOpacity: function(opacity){
    this.options.opacity = opacity;
    this._currentImage.setOpacity(opacity);
  },

  bringToFront: function(){
    this.options.position = 'front';
    this._currentImage.bringToFront();
    return this;
  },

  bringToBack: function(){
    this.options.position = 'back';
    this._currentImage.bringToBack();
    return this;
  },

  _parseLayers: function () {
    if (typeof this._layerParams.layers === 'undefined') {
      delete this._layerParams.layerOption;
      return;
    }

    var action = this._layerParams.layerOption || null,
        layers = this._layerParams.layers || null,
        verb = 'show',
        verbs = ['show', 'hide', 'include', 'exclude'];

    delete this._layerParams.layerOption;

    if (!action) {
      if (layers instanceof Array) {
        this._layerParams.layers = verb + ':' + layers.join(',');
      } else if (typeof layers === 'string') {
        var match = layers.match(':');

        if (match) {
          layers = layers.split(match[0]);
          if (Number(layers[1].split(',')[0])) {
            if (verbs.indexOf(layers[0]) !== -1) {
              verb = layers[0];
            }

            layers = layers[1];
          }
        }
        this._layerParams.layers = verb + ':' + layers;
      }
    } else {
      if (verbs.indexOf(action) !== -1) {
        verb = action;
      }

      this._layerParams.layers = verb + ':' + layers;
    }
  },

  _parseLayerDefs: function () {
    if (typeof this._layerParams.layerDefs === 'undefined') {
      return;
    }

    var layerDefs = this._layerParams.layerDefs;

    var defs = [];

    if (layerDefs instanceof Array) {
      var len = layerDefs.length;
      for (var i = 0; i < len; i++) {
        if (layerDefs[i]) {
          defs.push(i + ':' + layerDefs[i]);
        }
      }
    } else if (typeof layerDefs === 'object') {
      for (var layer in layerDefs) {
        if(layerDefs.hasOwnProperty(layer)){
          defs.push(layer + ':' + layerDefs[layer]);
        }
      }
    } else {
      delete this._layerParams.layerDefs;
      return;
    }
    this._layerParams.layerDefs = defs.join(';');
  },

  _getImageUrl: function () {
    var bounds = this._map.getBounds();
    var size = this._map.getSize();
    var ne = this._map.options.crs.project(bounds._northEast);
    var sw = this._map.options.crs.project(bounds._southWest);

    this._layerParams.bbox = [sw.x, sw.y, ne.x, ne.y].join(',');
    this._layerParams.size = size.x + ',' + size.y;

    if(this.options.token) {
      this._layerParams.token = this.options.token;
    }

    var url = this.url + 'export' + L.Util.getParamString(this._layerParams);

    return url;
  },

  _update: function (e) {
    if(this._animatingZoom){
      return;
    }

    if (this._map._panTransition && this._map._panTransition._inProgress) {
      return;
    }

    var zoom = this._map.getZoom();

    if (zoom > this.options.maxZoom || zoom < this.options.minZoom) {
      return;
    }

    var bounds = this._map.getBounds();
    bounds._southWest.wrap();
    bounds._northEast.wrap();
    var image = new L.ImageOverlay(this._getImageUrl(), bounds, {
      opacity: 0
    }).addTo(this._map);

    image.on('load', function(e){
      var newImage = e.target;
      var oldImage = this._currentImage;

      if(newImage._bounds.equals(bounds)){
        this._currentImage = newImage;

        if(this.options.position === "front"){
          this._currentImage.bringToFront();
        } else {
          this._currentImage.bringToBack();
        }

        this._currentImage.setOpacity(this.options.opacity);

        if(oldImage){
          this._map.removeLayer(oldImage);
        }
      } else {
        this._map.removeLayer(newImage);
      }
    }, this);


    this.fire('loading', {
      bounds: bounds
    });
  }
});

L.esri.DynamicMapLayer.include(L.Mixin.Events);
L.esri.DynamicMapLayer.include(L.esri.Mixins.metadata);

L.esri.dynamicMapLayer = function (url, options) {
  return new L.esri.DynamicMapLayer(url, options);
};
