L.esri.Services.FeatureServer = L.esri.Service.extend({

  query: function(){
    return new L.esri.Services.Query(this);
  }

});

L.esri.Services.featureService = function(url, options) {
  return new L.esri.Services.FeatureService(url, options);
};