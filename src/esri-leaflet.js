/* globals Terraformer:true, L:true, Esri:true, console:true */

L.esri = {
  _callbacks: {},
  get: function(url, params, callback){
    var callbackId = "callback_" + (Math.random() * 1e9).toString(36);

    params.f="json";
    params.callback="L.esri._callbacks['"+callbackId+"']";

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

    qs = qs.substring(0, qs.length - 1);

    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url + qs;
    script.id = callbackId;

    L.esri._callbacks[callbackId] = function(response){
      callback(response);
      document.body.removeChild(script);
      delete L.esri._callbacks[callbackId];
    };

    document.body.appendChild(script);

  }
};

L.esri.Util = {
  extentToBounds: function(extent){
    var southWest = new L.LatLng(extent.xmin, extent.ymin);
    var northEast = new L.LatLng(extent.xmax, extent.ymin);
    return new L.LatLngBounds(southWest, northEast);
  },

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
    identify:function(latLng, callback){
      L.esri.get(this.serviceUrl+"/identify", {
        sr: "4265",
        mapExtent: JSON.stringify(L.esri.Util.boundsToExtent(this._map.getBounds())),
        tolerance:3,
        geometryType:"esriGeometryPoint",
        imageDisplay:"800,600,96",
        geometry:JSON.stringify({
          "x":latLng.lng,
          "y":latLng.lat,
          "spatialReference":{
            "wkid":4265
          }
        })
      }, callback);
    }
  }
};