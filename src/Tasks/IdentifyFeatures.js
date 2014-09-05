L.esri.Tasks.IdentifyFeatures = L.esri.Tasks.Identify.extend({
  params: {
    sr: 4326,
    layers: 'all',
    tolerance: 3,
    returnGeometry: true
  },

  on: function(map){
    var extent = L.esri.Util.boundsToExtent(map.getBounds());
    var size = map.getSize();
    this.params.imageDisplay = [size.x, size.y, 96].join(',');
    this.params.mapExtent=([extent.xmin, extent.ymin, extent.xmax, extent.ymax]).join(',');
    return this;
  },

  at: function(latlng){
    this.params.geometry = ([latlng.lng, latlng.lat]).join(',');
    this.params.geometryType = 'esriGeometryPoint';
    return this;
  },

  layerDef: function (id, where){
    this.params.layerDefs = (this.params.layerDefs) ? this.params.layerDefs + ';' : '';
    this.params.layerDefs += ([id, where]).join(':');
    return this;
  },

  layers: function (string){
    this.params.layers = string;
    return this;
  },

  precision: function(num){
    this.params.geometryPrecision = num;
    return this;
  },

  simplify: function(map, factor){
    var mapWidth = Math.abs(map.getBounds().getWest() - map.getBounds().getEast());
    this.params.maxAllowableOffset = (mapWidth / map.getSize().y) * (1 - factor);
    return this;
  },

  tolerance: function(tolerance){
    this.params.tolerance = tolerance;
    return this;
  },

  run: function (callback, context){
    return this.request(function(error, response){
      callback.call(context, error, (response && L.esri.Util.responseToFeatureCollection(response)), response);
    }, context);
  }

});

L.esri.Tasks.identifyFeatures = function(url, params){
  return new L.esri.Tasks.IdentifyFeatures(url, params);
};