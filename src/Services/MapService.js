L.esri.Services.MapService = L.esri.Services.Service.extend({

  identify: function () {
    return new L.esri.Tasks.Identify(this);
  },

  query: function(){
    return new L.esri.Tasks.Query(this);
  }

});

L.esri.Services.mapService = function(url, params){
  return new L.esri.Services.MapService(url, params);
};