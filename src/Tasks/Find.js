L.esri.Tasks.Find = L.Class.extend({

  initialize: function (endpoint) {
    if (endpoint.url && endpoint.get) {
      this._service = endpoint;
      this.url = endpoint.url;
    } else {
      this.url = L.esri.Util.cleanUrl(endpoint);
    }

    this._params = {
      sr: 4326,
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

  contains: function (contains) {
    this._params.contains = contains;
    return this;
  },

  searchFields: function (searchFields) {
    this._params.searchFields = (this._params.searchFields) ? this._params.searchFields + ',' : '';
    if (L.Util.isArray(searchFields)) {
      this._params.searchFields += searchFields.join(',');
    } else {
      this._params.searchFields += searchFields;
    }
    return this;
  },

  spatialReference: function (spatialReference) {
    this._params.sr = spatialReference;
    return this;
  },

  layerDefs: function (id, where) {
    this._params.layerDefs = (this._params.layerDefs) ? this._params.layerDefs + ';' : '';
    this._params.layerDefs += ([id, where]).join(':');
    return this;
  },

  layers: function (layers) {
    if (L.Util.isArray(layers)) {
      this._params.layers = layers.join(',');
    } else {
      this._params.layers = layers;
    }
    return this;
  },

  geometry: function (returnGeometry) {
    this._params.returnGeometry = returnGeometry;
    return this;
  },

  maxAllowableOffset: function (num) {
    this._params.maxAllowableOffset = num;
    return this;
  },

  precision: function (num) {
    this._params.geometryPrecision = num;
    return this;
  },

  dynamicLayers: function (dynamicLayers) {
    this._params.dynamicLayers = dynamicLayers;
    return this;
  },

  returnZ: function (returnZ) {
    this._params.returnZ = returnZ;
    return this;
  },

  returnM: function (returnM) {
    this._params.returnM = returnM;
    return this;
  },

  gdbVersion: function (string) {
    this._params.gdbVersion = string;
    return this;
  },

  token: function (token) {
    this._params.token = token;
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