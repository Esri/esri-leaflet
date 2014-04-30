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
      response = (error) ? null : L.esri.Util.featureSetToFeatureCollection(response);
      callback.call(context, error, response);
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