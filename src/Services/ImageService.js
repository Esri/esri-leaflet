L.esri.Services.ImageService = L.esri.Services.Service.extend({

  query: function () {
    return new L.esri.Tasks.Query(this);
  },

  identify: function() {
    return new L.esri.Tasks.ImageServiceIdentify(this);
  }
});

L.esri.Services.imageService = function(url, params){
  return new L.esri.Services.ImageService(url, params);
};