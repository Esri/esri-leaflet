L.esri.Tasks.Find = L.Class.extend({
	initialize: function (endpoint) {
    if (endpoint.url && endpoint.get) {
      this._service = endpoint;
      this.url = endpoint.url;
    } else {
      this.url = L.esri.Util.cleanUrl(endpoint);
    }

    this._params = {
      contains: true,
      returnGeometry: true,
      returnZ: true,
      returnM: false
    };
  },

  searchText: function (searchText) {
    this._params.searchText = searchText;
    return this;
  },

  searchFields: function (searchFields) {
    this._params.searchFields = (this._params.searchFields) ? this._params.searchFields + ',' : '';
    this._params.searchFields += searchFields.join(',');
    return this;
  },

  dynamicLayers: function (dynamicLayers) {
    this._params.dynamicLayers = dynamicLayers;
    return this;
  },

  contains: function (bool) {
    this._params.contains = bool;
    return this;
  },

  returnGeometry: function (bool) {
    this._params.returnGeometry = bool;
    return this;
  },

  returnZ: function (bool) {
    this._params.returnZ = bool;
    return this;
  },

  returnM: function (bool) {
    this._params.returnM = bool;
    return this;
  },

  token: function (token) {
    this._params.token = token;
    return this;
  },

  layerDef: function (id, where) {
    this._params.layerDefs = (this._params.layerDefs) ? this._params.layerDefs + ';' : '';
    this._params.layerDefs += ([id, where]).join(':');
    return this;
  },

  layers: function (string) {
    this._params.layers = string;
    return this;
  },

  run: function (callback, context) {
    this._request(function(error, response){
      callback.call(context, error, (response && L.esri.Util.responseToFeatureCollection(response)), response);
    }, context);
  },

  _request: function (callback, context) {
    if(this._service){
      this._service.get('find', this._params, callback, context);
    } else {
      L.esri.get(this.url + 'find', this._params, callback, context);
    }
  }
});

L.esri.Tasks.find = function (url, params) {
  return new L.esri.Tasks.Find(url, params);
};