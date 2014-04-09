L.esri.ClusteredFeatureLayer = L.esri.FeatureManager.extend({

  /**
   * Constructor
   */

  initialize: function (url, options) {
    L.esri.FeatureManager.prototype.initialize.call(this, url, options);

    this.index = L.esri._rbush();

    options = L.setOptions(this, options);

    this._layers = {};

    this._cluster = new L.MarkerClusterGroup(options);
    this._cluster.addEventParent(this);
  },

  /**
   * Layer Interface
   */

  onAdd: function(){
    L.esri.FeatureManager.prototype.onAdd.call(this);
    this._map.addLayer(this._cluster);
  },

  onRemove: function(){
    L.esri.FeatureManager.prototype.onRemove.call(this);
        this._map.removeLayer(this._cluster);
  },

  /**
   * Feature Managment Methods
   */

  createLayers: function(features){
    var markers = [];

    for (var i = features.length - 1; i >= 0; i--) {
      var geojson = features[i];
      var layer = this._layers[geojson.id];
      if(!layer){
        var newLayer = L.GeoJSON.geometryToLayer(geojson, this.options);
        newLayer.feature = L.GeoJSON.asFeature(geojson);
        this._layers[geojson.id] = newLayer;

        // add the layer if it is within the time bounds or our layer is not time enabled
        if(!this._timeEnabled || (this._timeEnabled && this._featureWithinTimeRange(geojson)) ){
          markers.push(newLayer);
        }
      }
    }

    if(markers.length){
      this._cluster.addLayers(markers);
    }
  },

  addLayers: function(ids){
    var layersToAdd = [];
    for (var i = ids.length - 1; i >= 0; i--) {
      var layer = this_layers[ids[i]];
      layersToAdd.push(layer);
    }
    this._cluster.addLayers(layersToRemove);
  },

  removeLayers: function(ids){
    var layersToRemove = [];
    for (var i = ids.length - 1; i >= 0; i--) {
      var layer = this_layers[ids[i]];
      layersToRemove.push(layer);
    }
    this._cluster.removeLayers(layersToRemove);
  }

});