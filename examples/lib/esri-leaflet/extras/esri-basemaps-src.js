/*! Esri-Leaflet - v0.0.1 - 2013-09-17
*   Copyright (c) 2013 Environmental Systems Research Institute, Inc.
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

    httpRequest.open('GET', url + L.esri.Util.serialize(params), true);
    httpRequest.send(null);
  },
  JSONP: function(url, params, callback, context){
    var callbackId = "c"+(Math.random() * 1e9).toString(36).replace(".", "_");

    params.f="json";
    params.callback="L.esri._callback."+callbackId;

    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url + L.esri.Util.serialize(params);
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

    document.body.appendChild(script);
  }
};

// Choose the correct AJAX handler depending on CORS support
L.esri.get = (L.esri.Support.CORS) ? L.esri.RequestHandlers.CORS : L.esri.RequestHandlers.JSONP;

// General utility namespace
L.esri.Util = {
  // make it so that passed `function` never gets called
  // twice within `delay` milliseconds. Used to throttle
  // `move` events on the layer.
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
  trim: function(str) {
    return str.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
  },
  cleanUrl: function(url){
    url = L.esri.Util.trim(url);

    //add a trailing slash to the url if the user omitted it
    if(url[url.length-1] !== "/"){
      url += "/";
    }

    return url;
  },
  // quick and dirty serialization
  serialize: function(params){
    var qs="?";

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
    var southWest = new L.LatLng(extent.ymin, extent.xmin);
    var northEast = new L.LatLng(extent.ymax, extent.xmax);
    return new L.LatLngBounds(southWest, northEast);
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
  }
};

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

    if(cells) {
      this.fire("loading", { bounds: bounds });
    }

    for (var i = 0; i < cells.length; i++) {
      this._makeRequest(cells[i], cells, bounds);
    }
  },
  _makeRequest: function(cell, cells, bounds){
    this._activeRequests++;

    L.esri.get(this.url+"query", {
      geometryType: "esriGeometryEnvelope",
      geometry: JSON.stringify(L.esri.Util.boundsToExtent(cell.bounds)),
      outFields:"*",
      outSr: 4326
    }, function(response){

      //deincriment the request counter
      this._activeRequests--;

      // if there are no more active requests fire a load event for this view
      if(this._activeRequests <= 0){
        this.fire("load", {
          bounds: bounds,
          cells: cells
        });
      }

      // call the render method to render features
      this._render(response);
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
      sr: '4265',
      mapExtent: JSON.stringify(L.esri.Util.boundsToExtent(this._map.getBounds())),
      tolerance: 3,
      geometryType: 'esriGeometryPoint',
      imageDisplay: '800,600,96',
      geometry: JSON.stringify({
        x: latLng.lng,
        y: latLng.lat,
        spatialReference: {
          wkid: 4265
        }
      })
    };

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

    L.esri.get(this._url + '/identify', params, callback);
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
          urlTemplate: tileProtocol + "//{s}.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}/",
          attributionUrl: "https://static.arcgis.com/attribution/World_Street_Map?f=json",
          options: {
            minZoom: 1,
            maxZoom: 19,
            subdomains: ["server", "services"],
            attribution: formatTextAttributions("Esri") + attributionLogo
          }
        },
        Topographic: {
          urlTemplate: tileProtocol + "//{s}.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}/",
          attributionUrl: "https://static.arcgis.com/attribution/World_Topo_Map?f=json",
          options: {
            minZoom: 1,
            maxZoom: 19,
            subdomains: ["server", "services"],
            attribution: formatTextAttributions("Esri") + attributionLogo
          }
        },
        Oceans: {
          urlTemplate: "https://server.arcgisonline.com/ArcGIS/rest/services/Ocean_Basemap/MapServer/tile/{z}/{y}/{x}/",
          attributionUrl: "https://static.arcgis.com/attribution/Ocean_Basemap?f=json",
          options: {
            minZoom: 1,
            maxZoom: 16,
            subdomains: ["server", "services"],
            attribution: formatTextAttributions("Esri") + attributionLogo
          }
        },
        NationalGeographic: {
          urlTemplate: "https://server.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}/",
          options: {
            minZoom: 1,
            maxZoom: 16,
            subdomains: ["server", "services"],
            attribution: formatTextAttributions("Esri") + attributionLogo
          }
        },
        Gray: {
          urlTemplate: tileProtocol + "//{s}.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}/",
          options: {
            minZoom: 1,
            maxZoom: 16,
            subdomains: ["server", "services"],
            attribution: formatTextAttributions("Esri, NAVTEQ, DeLorme") + attributionLogo
          }
        },
        GrayLabels: {
          urlTemplate: tileProtocol + "//{s}.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Reference/MapServer/tile/{z}/{y}/{x}/",
          options: {
            minZoom: 1,
            maxZoom: 16,
            subdomains: ["server", "services"]
          }
        },
        Imagery: {
          urlTemplate: tileProtocol + "//{s}.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}/",
          options: {
            minZoom: 1,
            maxZoom: 19,
            subdomains: ["server", "services"],
            attribution: formatTextAttributions("Esri, DigitalGlobe, GeoEye, i-cubed, USDA, USGS, AEX, Getmapping, Aerogrid, IGN, IGP, swisstopo, and the GIS User Community") + attributionLogo
          }
        },
        ImageryLabels: {
          urlTemplate: tileProtocol + "//{s}.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}/",
          options: {
            minZoom: 1,
            maxZoom: 19,
            subdomains: ["server", "services"]
          }
        },
        ImageryTransportation: {
          urlTemplate: tileProtocol + "//{s}.arcgisonline.com/ArcGIS/rest/services/Reference/World_Transportation/MapServer/tile/{z}/{y}/{x}/",
          options: {
            minZoom: 1,
            maxZoom: 19,
            subdomains: ["server", "services"]
          }
        },
        ImageryAlternateLabels: {
          urlTemplate: tileProtocol + "//{s}.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places_Alternate/MapServer/tile/{z}/{y}/{x}/",
          options: {
            minZoom: 1,
            maxZoom: 12,
            subdomains: ["server", "services"]
          }
        },
        ShadedRelief: {
          urlTemplate: tileProtocol + "//{s}.arcgisonline.com/ArcGIS/rest/services/World_Shaded_Relief/MapServer/tile/{z}/{y}/{x}/",
          options: {
            minZoom: 1,
            maxZoom: 13,
            subdomains: ["server", "services"],
            attribution: formatTextAttributions("ESRI, NAVTEQ, DeLorme") + attributionLogo
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
        throw new Error("L.esri.BasemapLayer: Invalid parameter. Use one of 'Streets', 'Topographic', 'Oceans', 'NationalGeographic', 'Gray', 'GrayLabels', 'Imagery', 'ImageryLabels', 'ImageryTransportation', 'ImageryAlternateLabels' or 'ShadedRelief'");
      }

      // merge passed options into the config options
      var mergedOptions = L.Util.extend(config.options, options);

      // clean up our input url
      var url = L.esri.Util.cleanUrl(config.urlTemplate);

      // call the initialize method on L.TileLayer to set everything up
      L.TileLayer.prototype.initialize.call(this, url, L.Util.setOptions(this, mergedOptions));

      // if this basemap requires dynamic attribution set it up
      if(config.attributionUrl){
        var attributionUrl = L.esri.Util.cleanUrl(config.attributionUrl);
        this._dynamicAttribution = true;
        this._getAttributionData(attributionUrl);
      }
    },
    _dynamicAttribution: false,
    bounds: null,
    zoom: null,
    onAdd: function(map){
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
      L.esri.get(url, {}, this._processAttributionData, this);
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