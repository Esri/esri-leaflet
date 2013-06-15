/* globals Terraformer:true, L:true, Esri:true, console:true */

if(typeof L.esri === "undefined"){
  L.esri = {};
}

L.esri.Util = {
  extentToBounds: function(extent){
    var southWest = new L.LatLng(extent.xmin, extent.ymin);
    var northEast = new L.LatLng(extent.xmax, extent.ymin);
    return new L.LatLngBounds(southWest, northEast);
  },

  boundsToExtent: function(bounds) {
    return {
      "xmin": bounds.getSouthWest().lng,
      "ymin": bounds.getSouthWest().lat,
      "xmax": bounds.getNorthEast().lng,
      "ymax": bounds.getNorthEast().lat,
      "spatialReference": {
        "wkid" : 4326
      }
    };
  },
  boundsToEnvelope: function(bounds){
    var extent = L.esri.Util.boundsToExtent(bounds);
    return {
      x: extent.xmin,
      y: extent.ymin,
      w: Math.abs(extent.xmin - extent.ymax),
      h: Math.abs(extent.ymin - extent.ymax)
    };
  }
};

//FeatureLayer < GeoJSON < FeatureGroup < LayerGroup
L.esri.FeatureLayer = L.GeoJSON.extend({
  initialize: function(url, options){
    this.index = new Terraformer.RTree();
    this._serviceUrl = url;
    this._layerCache = {};
    this.client = new Esri.ArcGIS();
    this.service = new this.client.FeatureService({
      url: url
    });
    L.GeoJSON.prototype.initialize.call(this, [], options);
  },
  onAdd: function(map){
    L.LayerGroup.prototype.onAdd.call(this, map);
    this.updateFeatures(map);
  },
  onRemove: function(map){
    this.eachLayer(map.removeLayer, map);
    map.off("viewreset moveend", L.Util.bind(this.updateFeatures, this));
  },
  updateFeatures: function(map){
    var draw = L.Util.bind(function(){
      var newBounds = map.getBounds();
      var envelope = L.esri.Util.boundsToEnvelope(newBounds);

      this.index.search(envelope).then(L.Util.bind(function(results){
        this.eachLayer(L.Util.bind(function(layer){
          var id = layer.feature.id;
          if(results.indexOf(id) === -1){
            // remove layer
            this._layerCache[id] = this._layers[id];
            map.removeLayer(this._layers[id]);
          } else {
            // add layer to map
            if(this._layerCache[id]){
              this._layerCache[id].addTo(map);
            }
          }
        }, this));
      }, this));

      this.service.query({
        geometryType: "esriGeometryEnvelope",
        geometry: JSON.stringify(L.esri.Util.boundsToExtent(newBounds)),
        outSr: 4326
      }, L.Util.bind(function(error, response){
        var idKey = response.objectIdFieldName;
        for (var i = response.features.length - 1; i >= 0; i--) {
          var feature = response.features[i];
          var id = feature.attributes[idKey];
          if(!this._layers[id]){
            var geojson = Terraformer.ArcGIS.parse(feature);
            geojson.id = id;
            this.index.insert(geojson,id);
            this.addData(geojson);
          }
        }
      }, this));
    },this);

    var tryDraw = L.Util.bind(function(){
      clearTimeout(this._delay);
      this._delay = setTimeout(L.Util.bind(function(){
        draw();
      },this), 150);
    },this);

    map.on("viewreset moveend", tryDraw);

    draw();
  },
  getLayerId: function(layer){
    return layer.feature.id;
  }
});

L.esri.featureLayer = function(url, options){
  return new L.esri.FeatureLayer(url, options);
};