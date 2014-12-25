EsriLeaflet.Services.FeatureLayer = EsriLeaflet.Services.Service.extend({

  options: {
    idAttribute: 'OBJECTID'
  },

  query: function(){
    return new EsriLeaflet.Tasks.Query(this);
  },

  addFeature: function(feature, callback, context) {
    delete feature.id;

    feature = EsriLeaflet.Util.geojsonToArcGIS(feature);

    return this.post('addFeatures', {
      features: [feature]
    }, function(error, response){
      var result = (response && response.addResults) ? response.addResults[0] : undefined;
      if(callback){
        callback.call(this, error || response.addResults[0].error, result);
      }
    }, context);
  },

  updateFeature: function(feature, callback, context) {
    feature = EsriLeaflet.Util.geojsonToArcGIS(feature, this.options.idAttribute);

    return this.post('updateFeatures', {
      features: [feature]
    }, function(error, response){
      var result = (response && response.updateResults) ? response.updateResults[0] : undefined;
      if(callback){
        callback.call(context, error || response.updateResults[0].error, result);
      }
    }, context);
  },

  deleteFeature: function(id, callback, context) {
    return this.post('deleteFeatures', {
      objectIds: id
    }, function(error, response){
      var result = (response && response.deleteResults) ? response.deleteResults[0] : undefined;
      if(callback){
        callback.call(context, error || response.deleteResults[0].error, result);
      }
    }, context);
  }

});

EsriLeaflet.Services.featureLayer = function(options) {
  return new EsriLeaflet.Services.FeatureLayer(options);
};