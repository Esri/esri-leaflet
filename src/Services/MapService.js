EsriLeaflet.Services.MapService = EsriLeaflet.Services.Service.extend({

  identify: function () {
    return new EsriLeaflet.Tasks.identifyFeatures(this);
  },

  find: function () {
    return new EsriLeaflet.Tasks.Find(this);
  },

  query: function () {
    return new EsriLeaflet.Tasks.Query(this);
  }

});

EsriLeaflet.Services.mapService = function(params){
  return new EsriLeaflet.Services.MapService(params);
};