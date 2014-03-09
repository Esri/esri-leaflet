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

    L.esri.get(this.url + '/identify', params, callback);
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