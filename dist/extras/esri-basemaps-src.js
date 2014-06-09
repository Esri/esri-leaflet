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
(function(L){

  var tileProtocol = (window.location.protocol !== 'https:') ? 'http:' : 'https:';

  L.esri.Layers.BasemapLayer = L.TileLayer.extend({
    statics: {
      TILES: {
        Streets: {
          urlTemplate: tileProtocol + '//{s}.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
          attributionUrl: 'https://static.arcgis.com/attribution/World_Street_Map',
          options: {
            minZoom: 1,
            maxZoom: 19,
            hideLogo: false,
            subdomains: ['server', 'services'],
            attribution: 'Esri'
          }
        },
        Topographic: {
          urlTemplate: tileProtocol + '//{s}.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
          attributionUrl: 'https://static.arcgis.com/attribution/World_Topo_Map',
          options: {
            minZoom: 1,
            maxZoom: 19,
            hideLogo: false,
            subdomains: ['server', 'services'],
            attribution: 'Esri'
          }
        },
        Oceans: {
          urlTemplate: tileProtocol + '//{s}.arcgisonline.com/arcgis/rest/services/Ocean/World_Ocean_Base/MapServer/tile/{z}/{y}/{x}',
          attributionUrl: 'https://static.arcgis.com/attribution/Ocean_Basemap',
          options: {
            minZoom: 1,
            maxZoom: 16,
            hideLogo: false,
            subdomains: ['server', 'services'],
            attribution: 'Esri'
          }
        },
        OceansLabels: {
          urlTemplate: tileProtocol + '//{s}.arcgisonline.com/arcgis/rest/services/Ocean/World_Ocean_Reference/MapServer/tile/{z}/{y}/{x}',
          options: {
            //pane: 'esri-label',
            minZoom: 1,
            maxZoom: 16,
            hideLogo: false,
            subdomains: ['server', 'services']
          }
        },
        NationalGeographic: {
          urlTemplate: tileProtocol + '//{s}.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}',
          options: {
            minZoom: 1,
            maxZoom: 16,
            hideLogo: false,
            subdomains: ['server', 'services'],
            attribution: 'Esri'
          }
        },
        DarkGray: {
          urlTemplate: tileProtocol + '//{s}.arcgis.com/tiles/P3ePLMYs2RVChkJx/arcgis/rest/services/World_Dark_Gray_Base_Beta/MapServer/tile/{z}/{y}/{x}',
          options: {
            minZoom: 1,
            maxZoom: 10,
            hideLogo: false,
            subdomains: ['server', 'services'],
            attribution: 'Esri, DeLorme, HERE'
          }
        },
        DarkGrayLabels: {
          urlTemplate: tileProtocol + '//{s}.arcgis.com/tiles/P3ePLMYs2RVChkJx/arcgis/rest/services/World_Dark_Gray_Reference_Beta/MapServer/tile/{z}/{y}/{x}',
          options: {
            //pane: 'esri-label',
            minZoom: 1,
            maxZoom: 10,
            hideLogo: false,
            subdomains: ['server', 'services']
          }
        },
        Gray: {
          urlTemplate: tileProtocol + '//{s}.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}',
          options: {
            minZoom: 1,
            maxZoom: 16,
            hideLogo: false,
            subdomains: ['server', 'services'],
            attribution: 'Esri, NAVTEQ, DeLorme'
          }
        },
        GrayLabels: {
          urlTemplate: tileProtocol + '//{s}.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Reference/MapServer/tile/{z}/{y}/{x}',
          options: {
            //pane: 'esri-label',
            minZoom: 1,
            maxZoom: 16,
            hideLogo: false,
            subdomains: ['server', 'services']
          }
        },
        Imagery: {
          urlTemplate: tileProtocol + '//{s}.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
          options: {
            minZoom: 1,
            maxZoom: 19,
            hideLogo: false,
            subdomains: ['server', 'services'],
            attribution: 'Esri, DigitalGlobe, GeoEye, i-cubed, USDA, USGS, AEX, Getmapping, Aerogrid, IGN, IGP, swisstopo, and the GIS User Community'
          }
        },
        ImageryLabels: {
          urlTemplate: tileProtocol + '//{s}.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}',
          options: {
            //pane: 'esri-label',
            minZoom: 1,
            maxZoom: 19,
            hideLogo: false,
            subdomains: ['server', 'services']
          }
        },
        ImageryTransportation: {
          urlTemplate: tileProtocol + '//{s}.arcgisonline.com/ArcGIS/rest/services/Reference/World_Transportation/MapServer/tile/{z}/{y}/{x}',
          //pane: 'esri-label',
          options: {
            minZoom: 1,
            maxZoom: 19,
            hideLogo: false,
            subdomains: ['server', 'services']
          }
        },
        ShadedRelief: {
          urlTemplate: tileProtocol + '//{s}.arcgisonline.com/ArcGIS/rest/services/World_Shaded_Relief/MapServer/tile/{z}/{y}/{x}',
          options: {
            minZoom: 1,
            maxZoom: 13,
            hideLogo: false,
            subdomains: ['server', 'services'],
            attribution: 'ESRI, NAVTEQ, DeLorme'
          }
        },
        ShadedReliefLabels: {
          urlTemplate: tileProtocol + '//{s}.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places_Alternate/MapServer/tile/{z}/{y}/{x}',
//          pane: 'esri-label',
          options: {
            minZoom: 1,
            maxZoom: 12,
            hideLogo: false,
            subdomains: ['server', 'services']
          }
        },
        Terrain: {
          urlTemplate: tileProtocol + '//{s}.arcgisonline.com/ArcGIS/rest/services/World_Terrain_Base/MapServer/tile/{z}/{y}/{x}',
          options: {
            minZoom: 1,
            maxZoom: 13,
            hideLogo: false,
            subdomains: ['server', 'services'],
            attribution: 'Esri, USGS, NOAA'
          }
        },
        TerrainLabels: {
          urlTemplate: tileProtocol + '//{s}.arcgisonline.com/ArcGIS/rest/services/Reference/World_Reference_Overlay/MapServer/tile/{z}/{y}/{x}',
          options: {
            //pane: 'esri-label',
            minZoom: 1,
            maxZoom: 13,
            hideLogo: false,
            subdomains: ['server', 'services']
          }
        }
      }
    },
    initialize: function(key, options){
      var config;

      // set the config variable with the appropriate config object
      if (typeof key === 'object' && key.urlTemplate && key.options){
        config = key;
      } else if(typeof key === 'string' && L.esri.BasemapLayer.TILES[key]){
        config = L.esri.BasemapLayer.TILES[key];
      } else {
        throw new Error('L.esri.BasemapLayer: Invalid parameter. Use one of "Streets", "Topographic", "Oceans", "OceansLabels", "NationalGeographic", "Gray", "GrayLabels", "DarkGray", "DarkGrayLabels", "Imagery", "ImageryLabels", "ImageryTransportation", "ShadedRelief", "ShadedReliefLabels", "Terrain" or "TerrainLabels"');
      }

      // merge passed options into the config options
      var tileOptions = L.Util.extend(config.options, options);

      // call the initialize method on L.TileLayer to set everything up
      L.TileLayer.prototype.initialize.call(this, config.urlTemplate, L.Util.setOptions(this, tileOptions));

      // if this basemap requires dynamic attribution set it up
      if(config.attributionUrl){
        this._getAttributionData(config.attributionUrl);
      }
    },
    onAdd: function(map){
      // if(this.options.pane && L.esri.Support.pointerEvents){
      //   this._initPane();
      // }

      L.TileLayer.prototype.onAdd.call(this, map);

      map.on('moveend', this._updateMapAttribution, this);
    },
    onRemove: function(map){
      L.TileLayer.prototype.onRemove.call(this, map);

      map.off('moveend', this._updateMapAttribution, this);
    },
    getAttribution:function(){
      var logo = (this.options.hideLogo) ?  '' : '<a href="https://developers.arcgis.com"><img src="http://js.arcgis.com/3.9/js/esri/images/map/logo-med.png" style="position:absolute; top:-38px; right:2px;"></a>';
      var attribution = '<span class="esri-attributions" style="line-height:14px; vertical-align: -3px; text-overflow:ellipsis; white-space:nowrap; overflow:hidden; display:inline-block;">' + this.options.attribution + '</span>' + logo;
      return (this.options.attribution) ?  attribution : false;
    },
    // _initPane: function(){
    //   if(!this._map.getPane(this.options.pane)){
    //     var pane = this._map.createPane(this.options.pane);
    //     pane.style.pointerEvents = 'none';
    //     pane.style.zIndex = 5;
    //   }
    // },
    _getAttributionData: function(url){
      L.esri.RequestHandlers.get.JSONP(url, {}, function(error, attributions){
        this._attributions = [];
        for (var c = 0; c < attributions.contributors.length; c++) {
          var contributor = attributions.contributors[c];
          for (var i = 0; i < contributor.coverageAreas.length; i++) {
            var coverageArea = contributor.coverageAreas[i];
            var southWest = new L.LatLng(coverageArea.bbox[0], coverageArea.bbox[1]);
            var northEast = new L.LatLng(coverageArea.bbox[2], coverageArea.bbox[3]);
            this._attributions.push({
              attribution: contributor.attribution,
              score: coverageArea.score,
              bounds: new L.LatLngBounds(southWest, northEast),
              minZoom: coverageArea.zoomMin,
              maxZoom: coverageArea.zoomMax
            });
          }
        }

        this._attributions.sort(function(a, b){
          return b.score - a.score;
        });

        this._updateMapAttribution();
      }, this);
    },
    _updateMapAttribution: function(){
      if(this._map && this._map.attributionControl && this._attributions){
        var newAttributions = '';
        var bounds = this._map.getBounds();
        var zoom = this._map.getZoom();

        for (var i = 0; i < this._attributions.length; i++) {
          var attribution = this._attributions[i];
          var text = attribution.attribution;
          if(!newAttributions.match(text) && bounds.intersects(attribution.bounds) && zoom >= attribution.minZoom && zoom <= attribution.maxZoom) {
            newAttributions += (', ' + text);
          }
        }

        var attributionElement = this._map.attributionControl._container.querySelector('.esri-attributions');
        attributionElement.innerHTML = newAttributions.substr(2);
        attributionElement.style.maxWidth =  (this._map.getSize().x * 0.65) + 'px';
      }
    }
  });

  L.esri.BasemapLayer = L.esri.Layers.BasemapLayer;

  L.esri.Layers.basemapLayer = function(key, options){
    return new L.esri.Layers.BasemapLayer(key, options);
  };

  L.esri.basemapLayer = function(key, options){
    return new L.esri.Layers.BasemapLayer(key, options);
  };

})(L);