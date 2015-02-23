EsriLeaflet.Tasks.IdentifyFeatures = EsriLeaflet.Tasks.Identify.extend({
  setters: {
    'layers': 'layers',
    'precision': 'geometryPrecision',
    'tolerance': 'tolerance',
    'returnGeometry': 'returnGeometry'
  },

  params: {
    sr: 4326,
    layers: 'all',
    tolerance: 3,
    returnGeometry: true
  },

  on: function(map){
    var extent = EsriLeaflet.Util.boundsToExtent(map.getBounds());
    var size = map.getSize();
    this.params.imageDisplay = [size.x, size.y, 96];
    this.params.mapExtent = [extent.xmin, extent.ymin, extent.xmax, extent.ymax];
    return this;
  },

  at: function(latlng){
    latlng = L.latLng(latlng);
    this.params.geometry = [latlng.lng, latlng.lat];
    this.params.geometryType = 'esriGeometryPoint';
    return this;
  },

  layerDef: function (id, where){
    this.params.layerDefs = (this.params.layerDefs) ? this.params.layerDefs + ';' : '';
    this.params.layerDefs += ([id, where]).join(':');
    return this;
  },

  simplify: function(map, factor){
    var mapWidth = Math.abs(map.getBounds().getWest() - map.getBounds().getEast());
    this.params.maxAllowableOffset = (mapWidth / map.getSize().y) * (1 - factor);
    return this;
  },

  run: function (callback, context){
    return this.request(function(error, response){
      var featureCollection = EsriLeaflet.Util.responseToFeatureCollection(response);
      var count = featureCollection.features.length;
      // tag each feature with the Id of its parent layer
      if(!error && count > 0){
        response.results = response.results.reverse();
        for (var i = 0; i < count; i++) {
          var feature = featureCollection.features[i];
          feature.layerId = response.results[i].layerId;
        }
      }
      callback.call(context, error, (response && featureCollection), response);
    }, context);
  }

});

EsriLeaflet.Tasks.identifyFeatures = function(params){
  return new EsriLeaflet.Tasks.IdentifyFeatures(params);
};