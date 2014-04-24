L.esri.ClusteredFeatureLayer = L.esri.FeatureManager.extend({

  /**
   * Constructor
   */

  initialize: function (url, options) {
    L.esri.FeatureManager.prototype.initialize.call(this, url, options);

    this.index = L.esri._rbush();

    options = L.setOptions(this, options);

    this._layers = {};

    this.cluster = new L.MarkerClusterGroup(options);
    this.cluster.addEventParent(this);
  },

  /**
   * Layer Interface
   */

  onAdd: function(){
    L.esri.FeatureManager.prototype.onAdd.call(this);
    this._map.addLayer(this.cluster);
  },

  onRemove: function(){
    L.esri.FeatureManager.prototype.onRemove.call(this);
        this._map.removeLayer(this.cluster);
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

        // style the layer
        newLayer.defaultOptions = newLayer.options;
        this.resetStyle(newLayer);

        // bubble events from layers to this
        newLayer.addEventParent(this);

        // bind a popup if we have one
        if(this._popup){
          newLayer.bindPopup(this._popup(newLayer.feature, newLayer));
        }

        // cache the layer
        this._layers[newLayer.feature.id] = newLayer;

        // add the layer if it is within the time bounds or our layer is not time enabled
        if(!this._timeEnabled || (this._timeEnabled && this._featureWithinTimeRange(geojson)) ){
          markers.push(newLayer);
        }
      }
    }

    if(markers.length){
      this.cluster.addLayers(markers);
    }
  },

  addLayers: function(ids){
    var layersToAdd = [];
    for (var i = ids.length - 1; i >= 0; i--) {
      var layer = this._layers[ids[i]];
      layersToAdd.push(layer);
    }
    this.cluster.addLayers(layersToAdd);
  },

  removeLayers: function(ids){
    var layersToRemove = [];
    for (var i = ids.length - 1; i >= 0; i--) {
      var layer = this._layers[ids[i]];
      layersToRemove.push(layer);
    }
    this.cluster.removeLayers(layersToRemove);
  },

  /**
   * Styling Methods
   */

  resetStyle: function (layer) {
    // reset any custom styles
    layer.options = layer.defaultOptions;
    this._setLayerStyle(layer, this.options.style);
  },

  setStyle: function (style) {
    this.eachLayer(function (layer) {
      this._setLayerStyle(layer, style);
    }, this);
  },

  _setLayerStyle: function (layer, style) {
    if (typeof style === 'function') {
      style = style(layer.feature);
    }
    if (layer.setStyle) {
      layer.setStyle(style);
    }
  },

  /**
   * Popup Methods
   */

  bindPopup: function (fn, options) {
    this._popup = fn;
    for (i in this._layers) {
      var layer = this._layers[i];
      var popupContent = this._popup(layer.feature, layer);
      layer.bindPopup(popupContent, options);
    }
  },

  unbindPopup: function () {
    this._popup =  false;
    for (i in this._layers) {
      this._layers[i].unbindPopup();
    }
  },

  /**
   * Utility Methods
   */

  eachFeature: function (fn) {
    for (var i in this._layers) {
      method.call(context, this._layers[i]);
    }
    return this;
  },

  getFeature: function (id) {
    return this._layers[id];
  }

});