L.esri.Services.ImageService = L.esri.Services.Service.extend({
  // @TODO: Add identify in the future
});

L.esri.Services.imageService = function(url, params){
  return new L.esri.Services.ImageService(url, params);
};