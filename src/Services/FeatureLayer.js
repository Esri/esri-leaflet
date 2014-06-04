L.esri.Services.FeatureLayer = L.esri.Services.Service.extend({

  options: {
    idAttribute: 'OBJECTID'
  },

  query: function(){
    return new L.esri.Tasks.Query(this);
  },

  addFeature: function(feature, callback, context) {
    delete feature.id;

    feature = L.esri.Util.geojsonToArcGIS(feature);

    return this.post('addFeatures', {
      features: [feature]
    }, function(error, response){
      callback(error || response.addResults[0].error, response.addResults[0]);
    }, context);
  },

  updateFeature: function(feature, callback, context) {
    feature = L.esri.Util.geojsonToArcGIS(feature, this.options.idAttribute);
    this.post('updateFeatures', {
      features: [feature]
    }, function(error, response){
      callback(error || response.updateResults[0].error, response.updateResults[0]);
    }, context);
  },

  deleteFeature: function(id, callback, context) {
    this.post('deleteFeatures', {
      objectIds: id
    }, function(error, response){
      callback(error || response.deleteResults[0].error, response.deleteResults[0]);
    }, context);
  }

});

L.esri.Services.featureLayer = function(url, options) {
  return new L.esri.Services.FeatureLayer(url, options);
};