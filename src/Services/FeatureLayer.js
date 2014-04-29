L.esri.Services.FeatureLayer = L.esri.Service.extend({

  query: function(){
    return new L.esri.Services.Query(this);
  },

  addFeature: function(feature, callback, context) {
    feature = L.esri.Util.geojsonToArcGIS(feature);
    this.post(this.url + 'addFeatures', JSON.stringify(feature), callback, context);
  },

  updateFeature: function(feature, callback, context) {
    feature = L.esri.Util.geojsonToArcGIS(feature);
    this.post(this.url + 'updateFeatures', JSON.stringify(feature), callback, context);
  },

  deleteFeature: function(id, callback, context) {
    this.post(this.url + 'deleteFeatures', {
      objectIds: id
    }, callback, context);
  }

});

L.esri.Services.featureLayer = function(url, options) {
  return new L.esri.Services.FeatureLayer(url, options);
};