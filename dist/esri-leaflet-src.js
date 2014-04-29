/*! Esri-Leaflet - v0.0.1-beta.4 - 2014-04-29
*   Copyright (c) 2014 Environmental Systems Research Institute, Inc.
*   Apache License*/
L.esri = {
  VERSION: '0.0.1-beta.5',
  Layers: {},
  Services: {},
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

  // make it so that passed `function` never gets called
  // twice within `delay` milliseconds. Used to throttle
  // `move` events on layers.
  // http://remysharp.com/2010/07/21/throttling-function-calls/
  L.esri.Util.debounce = function (fn, delay, context) {
    var timer = null;
    return function() {
      var context = this||context, args = arguments;
      clearTimeout(timer);
      timer = setTimeout(function () {
        fn.apply(context, args);
      }, delay);
    };
  };

  // round a number away from zero used to snap
  // row/columns away from the origin of the grid
  L.esri.Util.roundAwayFromZero = function (num){
    return (num > 0) ? Math.ceil(num) : Math.floor(num);
  };

  // trim whitespace on strings
  // used to clean urls
  L.esri.Util.trim = function(str) {
    return str.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
  };

  // trim whitespace and add a tailing slash is needed to a url
  L.esri.Util.cleanUrl = function(url){
    url = L.esri.Util.trim(url);

    //add a trailing slash to the url if the user omitted it
    if(url[url.length-1] !== '/'){
      url += '/';
    }

    return url;
  };

  // quick and dirty param serialization
  L.esri.Util.serialize = function(params){
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
  };

  // index of polyfill, needed for IE 8
  L.esri.Util.indexOf = function(arr, obj, start){
    start = start || 0;
    if(arr.indexOf){
      return arr.indexOf(obj, start);
    }
    for (var i = start, j = arr.length; i < j; i++) {
      if (arr[i] === obj) { return i; }
    }
    return -1;
  };

  // convert an extent (ArcGIS) to LatLngBounds (Leaflet)
  L.esri.Util.extentToBounds = function(extent){
    var sw = new L.LatLng(extent.ymin, extent.xmin);
    var ne = new L.LatLng(extent.ymax, extent.xmax);
    return new L.LatLngBounds(sw, ne);
  };

  L.esri.Util.mercatorExtentToBounds = function(extent, map){
    var sw = map.unproject(L.point([extent.ymin, extent.xmin]));
    var ne = map.unproject(L.point([extent.ymax, extent.xmax]));
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

  // convert a LatLngBounds (Leaflet) to a Envelope (Terraformer.Rtree)
  L.esri.Util.boundsToEnvelope = function(bounds){
    var extent = L.esri.Util.boundsToExtent(bounds);
    return {
      x: extent.xmin,
      y: extent.ymin,
      w: Math.abs(extent.xmin - extent.xmax),
      h: Math.abs(extent.ymin - extent.ymax)
    };
  };

  L.esri.Util.arcgisToGeojson = function (arcgis, options){
    var geojson = {};

    options = options || {};
    options.idAttribute = options.idAttribute || undefined;

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
        geojson.id =  arcgis.attributes[options.idAttribute] || arcgis.attributes.OBJECTID || arcgis.attributes.FID;
      }
    }

    return geojson;
  };

  // GeoJSON -> ArcGIS
  L.esri.Util.geojsonToArcGIS = function(geojson, options){
    var idAttribute = (options && options.idAttribute) ? options.idAttribute : 'OBJECTID';
    var spatialReference = (options && options.sr) ? { wkid: options.sr } : { wkid: 4326 };
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
        result.geometry = L.esri.Util.geojsonToArcGIS(geojson.geometry, options);
      }
      result.attributes = (geojson.properties) ? L.esri.Util.clone(geojson.properties) : {};
      result.attributes[idAttribute] = geojson.id;
      break;
    case 'FeatureCollection':
      result = [];
      for (i = 0; i < geojson.features.length; i++){
        result.push(L.esri.Util.geojsonToArcGIS(geojson.features[i], options));
      }
      break;
    case 'GeometryCollection':
      result = [];
      for (i = 0; i < geojson.geometries.length; i++){
        result.push(L.esri.Util.geojsonToArcGIS(geojson.geometries[i], options));
      }
      break;
    }

    return result;
  };

  L.esri.Util.geojsonBounds = function(geojson) {
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
          throw new Error('Unknown type: ' + geojson.type);
      }
    }

    return null;
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
        featureCollection.features.push(L.esri.Util.arcgisToGeojson(featureSet.features[i], {
          idAttribute: objectIdField
        }));
      }
    }

    return featureCollection;
  };

})(L);
(function(L){

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
  L.esri.RequestHandlers = {
    post: function (url, params, callback, context) {
      params.f = 'json';

      var httpRequest = createRequest(callback, context);

      httpRequest.open('POST', url);
      httpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
      httpRequest.send(L.esri.Util.serialize(params));
    },
    get: {
      CORS: function (url, params, callback, context) {
        params.f = 'json';

        var httpRequest = createRequest(callback, context);

        httpRequest.open('GET', url + '?' + L.esri.Util.serialize(params), true);
        httpRequest.send(null);
      },
      JSONP: function(url, params, callback, context){
        L.esri._callback = L.esri._callback || {};

        var callbackId = 'c'+(Math.random() * 1e9).toString(36).replace('.', '_');

        params.f='json';
        params.callback='L.esri._callback.'+callbackId;

        var script = L.DomUtil.create('script', null, document.body);
        script.type = 'text/javascript';
        script.src = url + '?' +  L.esri.Util.serialize(params);
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
  L.esri.get = (L.esri.Support.CORS) ? L.esri.RequestHandlers.get.CORS : L.esri.RequestHandlers.get.JSONP;

  // Always use XMLHttpRequest for posts
  L.esri.post = L.esri.RequestHandlers.post;

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
L.esri.Services.FeatureLayer = L.esri.Service.extend({

  query: function(){
    return new L.esri.Services.Query(this);
  },

  addFeature: function(feature, callback, context) {
    feature = L.esri.Util.geojsonToArcGIS(feature);
    this.post(this.url + 'addFeatures', JSON.stringify(feature), callback, context);
  },

  updateFeature: function(feature, callback, context) {
    feature = L.esri.Util.geojsonToArcGIS(feature);
    this.post(this.url + 'updateFeatures', JSON.stringify(feature), callback, context);
  },

  deleteFeature: function(id, callback, context) {
    this.post(this.url + 'deleteFeatures', {
      objectIds: id
    }, callback, context);
  }

});

L.esri.Services.featureLayer = function(url, options) {
  return new L.esri.Services.FeatureLayer(url, options);
};
L.esri.Services.FeatureServer = L.esri.Service.extend({

  query: function(){
    return new L.esri.Services.Query(this);
  }

});

L.esri.Services.featureService = function(url, options) {
  return new L.esri.Services.FeatureService(url, options);
};
L.esri.Services.Identify = L.Class.extend({

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
    this._params.tolerance = tolerance || 5;
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
      var featureCollection = L.esri.Util.featureSetToFeatureCollection(response);
      callback.call(context, error, featureCollection);
    }, context);
  },

  _request: function(callback, context){
    if(this._service){
      this._service.get('query', this._params, callback, context);
    } else {
      L.esri.get(this.url, this._params, callback, context);
    }
  }

});

L.esri.Services.identify = function(url, params){
  return new L.esri.Services.Identify(url, params);
};
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
L.esri.Services.Query = L.Class.extend({

  initialize: function(service, options){

    if(service.url && service.get){
      this._service = service;
      this.url = service.url;
    } else {
      this.url = service;
    }

    this._params = {
      outSr: 4326
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
    this._request(function(error, response){
      var featureCollection = L.esri.Util.featureSetToFeatureCollection(response);
      callback.call(context, error, featureCollection);
    }, context);
  },

  count: function(callback, context){
    this._params.returnCountOnly = true;
    this._request(callback, context);
  },

  ids: function(callback, context){
    this._params.returnIdsOnly = true;
    this._request(callback, context);
  },

  bounds: function(callback, context){
    this._params.returnExtentOnly = true;
    this._request(callback, context);
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
// @TODO proxy support
L.esri.Service = L.Evented.extend({

  options: {
    proxy: false
  },

  initialize: function (url, options) {
    this.url = L.esri.Util.cleanUrl(url);
    this._requestQueue = [];
    this._authenticating = false;
    options =  L.Util.setOptions(this, options);
  },

  get: function (path, params, callback, context) {
    this.request('get', path, params, callback, context);
  },

  post: function (path, params, callback, context) {
    this.request('post', path, params, callback, context);
  },

  metadata: function (callback, context) {
    this.request('get', '', {}, callback, context);
  },

  request: function(method, path, params, callback, context){
    var wrappedCallback = this._createServiceCallback('post', path, params, callback, context);

    if (this.options.token) {
      params.token = this.options.token;
    }

    if (this._authenticating) {
      this._requestQueue.push(method, path, params, callback, context);
    } else {
      L.esri[method](this.url + path, params, wrappedCallback);
    }
  },

  _createServiceCallback: function(method, path, params, callback, context){
    var request = [method, path, params, callback, context];

    function authenticate (token) {
      this._authenticating = false;
      this.options.token = token;
      this._runQueue();
    }

    return L.Util.bind(function(error, response){
      if (error && (error.code === 499 || error.code === 498)) {
        this._authenticating = true;

        this._requestQueue.push(request);

        this.fire('authenticationrequired', {
          authenticate: authenticate
        });
      } else {
        if(context){
          callback.call(context, error, response);
        } else {
          callback(error, response);
        }
      }
    }, this);
  },

  _runQueue: function(){
    for (var i = this._requestQueue.length - 1; i >= 0; i--) {
      var request = this._requestQueue[i];
      var method = request.shift();
      this[method].apply(this, request);
    }
    this._requestQueue = [];
  }

});

L.esri.service = function(url, params){
  return new L.esri.services(url, params);
};