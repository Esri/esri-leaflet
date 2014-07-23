L.esri.Tasks.Query = L.Class.extend({

  initialize: function(endpoint){

    if(endpoint.url && endpoint.get){
      this._service = endpoint;
      this.url = endpoint.url;
    } else {
      this.url = L.esri.Util.cleanUrl(endpoint);
    }

    this._originalUrl = this.url;
    this._urlPrefix = '';

    this._params = {
      returnGeometry: true,
      where: '1=1',
      outSr: 4326,
      outFields: '*'
    };
  },

  within: function(bounds){
    this._params.geometry = L.esri.Util.boundsToExtent(bounds);
    this._params.geometryType = 'esriGeometryEnvelope';
    this._params.spatialRel = 'esriSpatialRelIntersects';
    this._params.inSr = 4326;
    return this;
  },

  // only valid for Feature Services running on ArcGIS Server 10.3 or ArcGIS Online
  nearby: function(latlng, radius){
    this._params.geometry = ([latlng.lng,latlng.lat]).join(',');
    this._params.geometryType = 'esriGeometryPoint';
    this._params.spatialRel = 'esriSpatialRelIntersects';
    this._params.units = 'esriSRUnit_Meter';
    this._params.distance = radius;
    this._params.inSr = 4326;
    return this;
  },

  where: function(string){
    this._params.where = string.replace(/"/g, '\'');
    return this;
  },

  offset: function(offset){
    this._params.offset = offset;
    return this;
  },

  limit: function(limit){
    this._params.limit = limit;
    return this;
  },

  between: function(start, end){
    this._params.time = ([start.valueOf(), end.valueOf()]).join();
    return this;
  },

  fields: function (fields) {
    if (L.Util.isArray(fields)) {
      this._params.outFields = fields.join(',');
    } else {
      this._params.outFields = fields;
    }
    return this;
  },

  precision: function(num){
    this._params.geometryPrecision = num;
    return this;
  },

  returnGeometry: function (returnGeometry) {
    this._params.returnGeometry = returnGeometry;
    return this;
  },

  simplify: function(map, factor){
    var mapWidth = Math.abs(map.getBounds().getWest() - map.getBounds().getEast());
    this._params.maxAllowableOffset = (mapWidth / map.getSize().y) * factor;
    return this;
  },

  orderBy: function(fieldName, order){
    order = order || 'ASC';
    this._params.orderByFields = (this._params.orderByFields) ? this._params.orderByFields + ',' : '';
    this._params.orderByFields += ([fieldName, order]).join(' ');
    return this;
  },

  featureIds: function(ids){
    this._params.objectIds = ids.join(',');
    return this;
  },

  token: function(token){
    this._params.token = token;
    return this;
  },

  run: function(callback, context){
    this._cleanParams();
    this._request(function(error, response){
      callback.call(context, error, (response && L.esri.Util.responseToFeatureCollection(response)), response);
    }, context);
    return this;
  },

  count: function(callback, context){
    this._cleanParams();
    this._params.returnCountOnly = true;
    this._request(function(error, response){
      callback.call(this, error, (response && response.count), response);
    }, context);
    return this;
  },

  ids: function(callback, context){
    this._cleanParams();
    this._params.returnIdsOnly = true;
    this._request(function(error, response){
      callback.call(this, error, (response && response.objectIds), response);
    }, context);
    return this;
  },

  // only valid for Feature Services running on ArcGIS Server 10.3 or ArcGIS Online
  bounds: function(callback, context){
    this._cleanParams();
    this._params.returnExtentOnly = true;
    this._request(function(error, response){
      callback.call(context, error, (response && response.extent && L.esri.Util.extentToBounds(response.extent)), response);
    }, context);
    return this;
  },

  // only valid for image services
  pixelSize: function(point){
    point = L.point(point);
    this._params.pixelSize = ([point.x,point.y]).join(',');
    return this;
  },

  // only valid for map services
  layer: function(layer){
    this._urlPrefix = layer + '/';
    return this;
  },

  _cleanParams: function(){
    delete this._params.returnIdsOnly;
    delete this._params.returnExtentOnly;
    delete this._params.returnCountOnly;
  },

  _request: function(callback, context){
    if(this._service){
      this._service.get(this._urlPrefix +'query', this._params, callback, context);
    } else {
      L.esri.get(this.url + this._urlPrefix + 'query', this._params, callback, context);
    }
  }

});

L.esri.Tasks.query = function(url, params){
  return new L.esri.Tasks.Query(url, params);
};