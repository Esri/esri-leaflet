if(typeof L.esri === "undefined"){
  L.esri = {};
}

L.esri.FeatureLayer = L.GeoJSON.extend({
  initialize: function(key, options){
    L.GeoJSON.prototype.initialize.call(this, []);
  }
});

L.esri.featureLayer = function(url, options){
  return new L.esri.FeatureLayer(url, options);
};