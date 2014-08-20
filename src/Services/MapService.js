L.esri.Services.MapService = L.esri.Services.Service.extend({

  identify: function () {
    return new L.esri.Tasks.identifyFeatures(this);
  },

  find: function () {
    return new L.esri.Tasks.Find(this);
  },

  query: function () {
    return new L.esri.Tasks.Query(this);
  }

});

L.esri.Services.mapService = function(url, params){
  return new L.esri.Services.MapService(url, params);
};