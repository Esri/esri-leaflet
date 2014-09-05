L.esri.Tasks.Find = L.esri.Tasks.Task.extend({
  path: 'find',

  params: {
    sr: 4326,
    contains: true,
    returnGeometry: true,
    returnZ: true,
    returnM: false
  },

  text: function (text) {
    this.params.searchText = text;
    return this;
  },

  contains: function (contains) {
    this.params.contains = contains;
    return this;
  },

  fields: function (fields) {
    this.params.searchFields = (this.params.searchFields) ? this.params.searchFields + ',' : '';
    if (L.Util.isArray(fields)) {
      this.params.searchFields += fields.join(',');
    } else {
      this.params.searchFields += fields;
    }
    return this;
  },

  spatialReference: function (spatialReference) {
    this.params.sr = spatialReference;
    return this;
  },

  layerDefs: function (id, where) {
    this.params.layerDefs = (this.params.layerDefs) ? this.params.layerDefs + ';' : '';
    this.params.layerDefs += ([id, where]).join(':');
    return this;
  },

  layers: function (layers) {
    if (L.Util.isArray(layers)) {
      this.params.layers = layers.join(',');
    } else {
      this.params.layers = layers;
    }
    return this;
  },

  returnGeometry: function (returnGeometry) {
    this.params.returnGeometry = returnGeometry;
    return this;
  },

  maxAllowableOffset: function (num) {
    this.params.maxAllowableOffset = num;
    return this;
  },

  precision: function (num) {
    this.params.geometryPrecision = num;
    return this;
  },

  dynamicLayers: function (dynamicLayers) {
    this.params.dynamicLayers = dynamicLayers;
    return this;
  },

  returnZ: function (returnZ) {
    this.params.returnZ = returnZ;
    return this;
  },

  returnM: function (returnM) {
    this.params.returnM = returnM;
    return this;
  },

  gdbVersion: function (string) {
    this.params.gdbVersion = string;
    return this;
  },

  simplify: function(map, factor){
    var mapWidth = Math.abs(map.getBounds().getWest() - map.getBounds().getEast());
    this.params.maxAllowableOffset = (mapWidth / map.getSize().y) * factor;
    return this;
  },

  run: function (callback, context) {
    return this.request(function(error, response){
      callback.call(context, error, (response && L.esri.Util.responseToFeatureCollection(response)), response);
    }, context);
  }
});

L.esri.Tasks.find = function (url, params) {
  return new L.esri.Tasks.Find(url, params);
};