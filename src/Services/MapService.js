L.esri.Services.MapService = L.esri.Service.extend({

  identify: function () {
    return new L.esri.Services.Identify(this);
  },

  query: function(){
    return new L.esri.Services.Query(this);
  }

});

L.esri.Services.mapService = function(url, params){
  return new L.esri.Services.MapService(url, params);
};