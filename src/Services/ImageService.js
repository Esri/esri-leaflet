EsriLeaflet.Services.ImageService = EsriLeaflet.Services.Service.extend({

  query: function () {
    return new EsriLeaflet.Tasks.Query(this);
  },

  identify: function() {
    return new EsriLeaflet.Tasks.IdentifyImage(this);
  }
});

EsriLeaflet.Services.imageService = function(params){
  return new EsriLeaflet.Services.ImageService(params);
};