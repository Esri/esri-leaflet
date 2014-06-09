/*! Esri-Leaflet - v0.0.1-beta.4 - 2014-05-26
*   Copyright (c) 2014 Environmental Systems Research Institute, Inc.
*   Apache License*/
L.esri = {
  VERSION: '0.0.1-beta.5',
  Layers: {},
  Services: {},
  Tasks: {},
  Util: {},
  Support: {
    CORS: !!(window.XMLHttpRequest && 'withCredentials' in new XMLHttpRequest()),
    pointerEvents: document.documentElement.style.pointerEvents === ''
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
    var uaT = (b2[0] - b1[0]) * (a1[1] - b1[1]) - (b2[1] - b1[1]) * (a1[0] - b1[0]);
    var ubT = (a2[0] - a1[0]) * (a1[1] - b1[1]) - (a2[1] - a1[1]) * (a1[0] - b1[0]);
    var uB  = (b2[1] - b1[1]) * (a2[0] - a1[0]) - (b2[0] - b1[0]) * (a2[1] - a1[1]);

    if ( uB !== 0 ) {
      var ua = uaT / uB;
      var ub = ubT / uB;

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
        type: 'Polygon',
        coordinates: outerRings[0]
      };
    } else {
      return {
        type: 'MultiPolygon',
        coordinates: outerRings
      };
    }
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

  // convert an extent (ArcGIS) to LatLngBounds (Leaflet)
  L.esri.Util.extentToBounds = function(extent){
    var sw = new L.LatLng(extent.ymin, extent.xmin);
    var ne = new L.LatLng(extent.ymax, extent.xmax);
    return new L.LatLngBounds(sw, ne);
  };

  // convert an LatLngBounds (Leaflet) to extent (ArcGIS)
  L.esri.Util.boundsToExtent = function(bounds) {
    return {
      'xmin': bounds.getSouthWest().lng,
      'ymin': bounds.getSouthWest().lat,
      'xmax': bounds.getNorthEast().lng,
      'ymax': bounds.getNorthEast().lat,
      'spatialReference': {
        'wkid' : 4326
      }
    };
  };

  L.esri.Util.arcgisToGeojson = function (arcgis, idAttribute){
    var geojson = {};

    if(arcgis.x && arcgis.y){
      geojson.type = 'Point';
      geojson.coordinates = [arcgis.x, arcgis.y];
    }

    if(arcgis.points){
      geojson.type = 'MultiPoint';
      geojson.coordinates = arcgis.points.slice(0);
    }

    if(arcgis.paths) {
      if(arcgis.paths.length === 1){
        geojson.type = 'LineString';
        geojson.coordinates = arcgis.paths[0].slice(0);
      } else {
        geojson.type = 'MultiLineString';
        geojson.coordinates = arcgis.paths.slice(0);
      }
    }

    if(arcgis.rings) {
      geojson = convertRingsToGeoJSON(arcgis.rings.slice(0));
    }

    if(arcgis.geometry || arcgis.attributes) {
      geojson.type = 'Feature';
      geojson.geometry = (arcgis.geometry) ? L.esri.Util.arcgisToGeojson(arcgis.geometry) : null;
      geojson.properties = (arcgis.attributes) ? clone(arcgis.attributes) : null;
      if(arcgis.attributes) {
        geojson.id =  arcgis.attributes[idAttribute] || arcgis.attributes.OBJECTID || arcgis.attributes.FID;
      }
    }

    return geojson;
  };

  // GeoJSON -> ArcGIS
  L.esri.Util.geojsonToArcGIS = function(geojson, idAttribute){
    idAttribute = idAttribute || 'OBJECTID';
    var spatialReference = { wkid: 4326 };
    var result = {};
    var i;

    switch(geojson.type){
    case 'Point':
      result.x = geojson.coordinates[0];
      result.y = geojson.coordinates[1];
      result.spatialReference = spatialReference;
      break;
    case 'MultiPoint':
      result.points = geojson.coordinates.slice(0);
      result.spatialReference = spatialReference;
      break;
    case 'LineString':
      result.paths = [geojson.coordinates.slice(0)];
      result.spatialReference = spatialReference;
      break;
    case 'MultiLineString':
      result.paths = geojson.coordinates.slice(0);
      result.spatialReference = spatialReference;
      break;
    case 'Polygon':
      result.rings = orientRings(geojson.coordinates.slice(0));
      result.spatialReference = spatialReference;
      break;
    case 'MultiPolygon':
      result.rings = flattenMultiPolygonRings(geojson.coordinates.slice(0));
      result.spatialReference = spatialReference;
      break;
    case 'Feature':
      if(geojson.geometry) {
        result.geometry = L.esri.Util.geojsonToArcGIS(geojson.geometry, idAttribute);
      }
      result.attributes = (geojson.properties) ? L.esri.Util.clone(geojson.properties) : {};
      result.attributes[idAttribute] = geojson.id;
      break;
    case 'FeatureCollection':
      result = [];
      for (i = 0; i < geojson.features.length; i++){
        result.push(L.esri.Util.geojsonToArcGIS(geojson.features[i], idAttribute));
      }
      break;
    case 'GeometryCollection':
      result = [];
      for (i = 0; i < geojson.geometries.length; i++){
        result.push(L.esri.Util.geojsonToArcGIS(geojson.geometries[i], idAttribute));
      }
      break;
    }

    return result;
  };

  L.esri.Util.featureSetToFeatureCollection = function(featureSet){
    var objectIdField;

    if(featureSet.objectIdFieldName){
      objectIdField = featureSet.objectIdFieldName;
    } else {
      if(featureSet.fields){
        for (var j = 0; j <= featureSet.fields.length - 1; j++) {
          if(featureSet.fields[j].type === 'esriFieldTypeOID') {
            objectIdField = featureSet.fields[j].name;
            break;
          }
        }
      }
    }

    var featureCollection = {
      type: 'FeatureCollection',
      features: []
    };

    if(featureSet.features.length){
      for (var i = featureSet.features.length - 1; i >= 0; i--) {
        featureCollection.features.push(L.esri.Util.arcgisToGeojson(featureSet.features[i], objectIdField));
      }
    }

    return featureCollection;
  };

    // trim whitespace and add a tailing slash is needed to a url
  L.esri.Util.cleanUrl = function(url){
    url.replace(/^\s\s*/, '').replace(/\s\s*$/, '');

    //add a trailing slash to the url if the user omitted it
    if(url[url.length-1] !== '/'){
      url += '/';
    }

    return url;
  };

})(L);
(function(L){

  function serialize(params){
    var qs='';

    for(var param in params){
      if(params.hasOwnProperty(param)){
        var key = param;
        var value = params[param];
        qs+=encodeURIComponent(key);
        qs+='=';
        qs+=encodeURIComponent(value);
        qs+='&';
      }
    }

    return qs.substring(0, qs.length - 1);
  }

  function createRequest(callback, context){
   var httpRequest = new XMLHttpRequest();

    httpRequest.onreadystatechange = function(){
      var response;
      var error;

      if (httpRequest.readyState === 4) {
        try {
          response = JSON.parse(httpRequest.responseText);
        } catch(e) {
          response = null;
          error = {
            error: 'Could not parse response as JSON.',
            code: 500
          };
        }

        if (!error && response.error) {
          error = response.error;
          response = null;
        }

        callback.call(context, error, response);
      }
    };

    return httpRequest;
  }

  // AJAX handlers for CORS (modern browsers) or JSONP (older browsers)
  L.esri.Request = {
    post: {
      XMLHTTP: function (url, params, callback, context) {
        params.f = 'json';

        var httpRequest = createRequest(callback, context);

        httpRequest.open('POST', url);
        httpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        httpRequest.send(serialize(params));
      }
    },

    get: {
      CORS: function (url, params, callback, context) {
        params.f = 'json';

        var httpRequest = createRequest(callback, context);

        httpRequest.open('GET', url + '?' + serialize(params), true);
        httpRequest.send(null);
      },
      JSONP: function(url, params, callback, context){
        L.esri._callback = L.esri._callback || {};

        var callbackId = 'c'+(Math.random() * 1e9).toString(36).replace('.', '_');

        params.f = 'json';
        params.callback = 'L.esri._callback.'+callbackId;

        var script = L.DomUtil.create('script', null, document.body);
        script.type = 'text/javascript';
        script.src = url + '?' +  serialize(params);
        script.id = callbackId;

        L.esri._callback[callbackId] = function(response){
          var error;
          var responseType = Object.prototype.toString.call(response);

          if(!(responseType === '[object Object]' || responseType === '[object Array]')){
            error = {
              code: 500,
              error: 'Expected array or object as JSONP response'
            };
            response = null;
          }

          if (!error && response.error) {
            error = response.error;
            response = null;
          }

          callback.call(context, error, response);

          document.body.removeChild(script);
          delete L.esri._callback[callbackId];
        };
      }
    }
  };

  // Choose the correct AJAX handler depending on CORS support
  L.esri.get = (L.esri.Support.CORS) ? L.esri.Request.get.CORS : L.esri.Request.get.JSONP;

  // Always use XMLHttpRequest for posts
  L.esri.post = L.esri.RequestHandlers.post.XMLHTTP;

})(L);
L.esri.Services.MapService = L.esri.Service.extend({

  identify: function () {
    return new L.esri.Services.Identify(this);
  },

  query: function(){
    return new L.esri.Services.Query(this);
  }

});

L.esri.Services.mapService = function(url, params){
  return new L.esri.Services.MapService(url, params);
};
L.esri.Tasks.Identify = L.Class.extend({

  initialize: function(service, options){
    if(service.url && service.get){
      this._service = service;
      this.url = service.url;
    } else {
      this.url = service + 'query';
    }

    this._params = {
      sr: 4326,
      layers: 'all'
    };

    for(var key in options){
      if(options.hasOwnProperty(key) && options.key){
        this[key].apply(this, options[key]);
      }
    }
  },

  at: function(latlng, bounds, tolerance){
    var  extent = L.esri.Util.boundsToExtent(bounds);
    this._params.geometry = ([latlng.lng,latlng.lat]).join(',');
    this._params.geometryType = 'esriGeometryPoint';
    this._params.tolerance = tolerance || 3;
    this._params.mapExtent=([extent.xmin, extent.xmax, extent.ymin, extent.ymax]).join(',');
    return this;
  },

  within: function (bounds){
    var extent = L.esri.Util.boundsToExtent(bounds);
    this._params.geometry = JSON.stringify(extent);
    this._params.geometryType = 'esriGeometryEnvelope';
    this._params.spatialRel = 'esriSpatialRelIntersects';
    this._params.mapExtent=([extent.xmin, extent.xmax, extent.ymin, extent.ymax]).join(',');
    return this;
  },

  layerDef: function (id, where){
    this._params.layerDefs = (this._params.layerDefs) ? this._params.layerDefs + ';' : '';
    this._params.layerDefs += ([id, where]).join(':');
    return this;
  },

  between: function(start, end){
    this._params.time = ([start, end]).join();
    return this;
  },

  layers: function (string){
    this._params.layers = string;
    return this;
  },

  precision: function(num){
    this._params.geometryPrecision = num;
    return this;
  },

  simplify: function(map, factor){
    var mapWidth = Math.abs(map.getBounds().getWest() - map.getBounds().getEast());
    this._params.maxAllowableOffset = (mapWidth / map.getSize().y) * (1 - factor);
    return this;
  },

  size: function(x, y, detectRetina){
    var multiplier = (detectRetina && L.Browser.retina) ? 2 : 1;
    this._params.imageDisplay = (x * multiplier) + ',' + (y * multiplier) + ',' + (96 * multiplier);
    return this;
  },

  run: function (callback, context){
    this._request(function(error, response){
      callback.call(context, error, response);
    }, context);
  },

  _request: function(callback, context){
    if(this._service){
      this._service.get('identify', this._params, callback, context);
    } else {
      L.esri.get(this.url, this._params, callback, context);
    }
  }

});

L.esri.Services.identify = function(url, params){
  return new L.esri.Services.Identify(url, params);
};
L.esri.Tasks.Query = L.Class.extend({

  initialize: function(service, options){

    if(service.url && service.get){
      this._service = service;
      this.url = service.url;
    } else {
      this.url = service;
    }

    this._params = {
      where: '1=1',
      outSr: 4326,
      outFields: '*'
    };

    for(var key in options){
      if(options.hasOwnProperty(key) && options.key){
        this[key].apply(this, options[key]);
      }
    }
  },

  within: function(bounds){
    this._params.geometry = JSON.stringify(L.esri.Util.boundsToExtent(bounds));
    this._params.geometryType = 'esriGeometryEnvelope';
    this._params.spatialRel = 'esriSpatialRelIntersects';
    return this;
  },

  intersects: function(polyline){
    this._params.geometry = JSON.stringify(L.esri.Util.geojsonToArcGIS(polyline.toGeoJSON()));
    this._params.geometryType = 'esriGeometryPolyline';
    this._params.spatialRel = 'esriSpatialRelIntersects';
    return this;
  },

  around: function(latlng, radius){
    this._params.geometry = ([latlng.lng,latlng.lat]).join(',');
    this._params.geometryType = 'esriGeometryPoint';
    this._params.spatialRel = 'esriSpatialRelIntersects';
    this._params.units = 'esriSRUnit_Meter';
    this._params.distance = radius;
    this._params.inSr = 4326;
    return this;
  },

  layerDef: function(id, where){
    this._params.layerDefs = (this._params.layerDefs) ? this._params.layerDefs + ';' : '';
    this._params.layerDefs += ([id, where]).join(':');
    return this;
  },

  where: function(string){
    this._params.where = string;
    return this;
  },

  offset: function(num){
    this._params.offset = num;
    return this;
  },

  limit: function(num){
    this._params.limit = num;
    return this;
  },

  between: function(start, end){
    this._params.time = ([start.valueOf(), end.valueOf()]).join();
    return this;
  },

  fields: function(array){
    this._params.outFields = array.join(',');
    return this;
  },

  precision: function(num){
    this._params.geometryPrecision = num;
    return this;
  },

  simplify: function(map, factor){
    var mapWidth = Math.abs(map.getBounds().getWest() - map.getBounds().getEast());
    this._params.maxAllowableOffset = (mapWidth / map.getSize().y) * factor;
    return this;
  },

  orderBy: function(fieldName, order){
    this._params.orderByFields = (this._params.orderByFields) ? this._params.orderByFields + ',' : '';
    this._params.orderByFields += ([fieldName, (order || 'ASC')]).join(',');
    return this;
  },

  featureIds: function(array){
    this._params.objectIds = array.join(',');
    return this;
  },

  token: function(token){
    this._params.token = token;
    return this;
  },

  run: function(callback, context){
    //@TODO chaining
    this._request(function(error, response){
      response = (error) ? null : L.esri.Util.featureSetToFeatureCollection(response);
      callback.call(context, error, response);
    }, context);
  },

  count: function(callback, context){
    //@TODO chaining
    this._params.returnCountOnly = true;
    this._request(function(error, response){
      callback(error, response.count);
    }, context);
    return this;
  },

  ids: function(callback, context){
    //@TODO chaining
    this._params.returnIdsOnly = true;
    this._request(function(error, response){
      callback(error, response.objectIds);
    }, context);
    return this;
  },

  bounds: function(callback, context){
    //@TODO chaining
    this._params.returnExtentOnly = true;
    this._params.returnCountOnly = true;
    this._request(callback, context);
    return this;
  },

  _request: function(callback, context){
    if(this._service){
      this._service.get('query', this._params, callback, context);
    } else {
      L.esri.get(this.url, this._params, callback, context);
    }
  }

});

L.esri.Services.query = function(url, params){
  return new L.esri.Services.Query(url, params);
};