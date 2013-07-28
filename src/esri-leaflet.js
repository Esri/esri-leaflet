/* globals L */

L.esri = {
  AttributionStyles:"line-height:9px; text-overflow:ellipsis; white-space:nowrap;overflow:hidden; display:inline-block;",
  LogoStyles:"position:absolute; top:-38px; right:2px;",
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
  // from : http://stackoverflow.com/questions/3000649/trim-spaces-from-start-and-end-of-string
  trim: function(str) {
    return str.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
  },
  cleanUrl: function(url){
    url = L.esri.Util.trim(url);

    //add a trailing slash to the url if the user omitted it
    if(url[url.length-1] !== "/"){
      url += "/";
    }

    // if the user passed a insecure resource to an insecure page rewrite it to https
    if(url.match(/^http:/) && window.location.protocol.match(/^https:/)){
      url.replace("http:", "https:");
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
    var southWest = new L.LatLng(extent.xmin, extent.ymin);
    var northEast = new L.LatLng(extent.xmax, extent.ymin);
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
      w: Math.abs(extent.xmin - extent.ymax),
      h: Math.abs(extent.ymin - extent.ymax)
    };
  }
};

L.esri.Mixins = {
  identifiableLayer: {
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
  }
};
