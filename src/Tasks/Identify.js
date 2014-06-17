L.esri.Tasks.Identify = L.Class.extend({

  initialize: function(endpoint){
    if(endpoint.url && endpoint.get){
      this._service = endpoint;
      this.url = endpoint.url;
    } else {
      this.url = L.esri.Util.cleanUrl(endpoint);
    }

    this._params = {
      sr: 4326,
      layers: 'all',
      tolerance: 3
    };
  },

  on: function(map){
    var extent = L.esri.Util.boundsToExtent(map.getBounds());
    var size = map.getSize();
    this._params.imageDisplay = [size.x, size.y, 96].join(',');
    this._params.mapExtent=([extent.xmin, extent.ymin, extent.xmax, extent.ymax]).join(',');
    return this;
  },

  at: function(latlng){
    this._params.geometry = ([latlng.lng, latlng.lat]).join(',');
    this._params.geometryType = 'esriGeometryPoint';
    return this;
  },

  layerDef: function (id, where){
    this._params.layerDefs = (this._params.layerDefs) ? this._params.layerDefs + ';' : '';
    this._params.layerDefs += ([id, where]).join(':');
    return this;
  },

  between: function(start, end){
    this._params.time = ([start.valueOf(), end.valueOf()]).join(',');
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

  token: function(token){
    this._params.token = token;
    return this;
  },

  tolerance: function(tolerance){
    this._params.tolerance = tolerance;
    return this;
  },

  run: function (callback, context){
    this._request(function(error, response){
      callback.call(context, error, (response && L.esri.Util.responseToFeatureCollection(response)), response);
    }, context);
  },

  _request: function(callback, context){
    if(this._service){
      this._service.get('identify', this._params, callback, context);
    } else {
      L.esri.get(this.url + 'identify', this._params, callback, context);
    }
  }

});

L.esri.Tasks.identify = function(url, params){
  return new L.esri.Tasks.Identify(url, params);
};