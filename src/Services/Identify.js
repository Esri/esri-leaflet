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