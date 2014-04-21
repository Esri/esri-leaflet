/* globals L */

L.esri = {
  _callback: {}
};

// Namespace for various support variables we need to track
L.esri.Support = {
  CORS: !!(window.XMLHttpRequest && 'withCredentials' in new XMLHttpRequest()),
  pointerEvents: document.documentElement.style.pointerEvents === ''
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