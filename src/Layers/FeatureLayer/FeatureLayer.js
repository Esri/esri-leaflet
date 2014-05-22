L.esri.FeatureLayer = L.esri.FeatureManager.extend({

  statics: {
    EVENTS: 'click dblclick mouseover mouseout mousemove contextmenu popupopen popupclose'
  },

  /**
   * Constructor
   */

  initialize: function (url, options) {
    L.esri.FeatureManager.prototype.initialize.call(this, url, options);

    options = L.setOptions(this, options);

    this._layers = {};
  },

  /**
   * Layer Interface
   */

  onAdd: function(map){
    return L.esri.FeatureManager.prototype.onAdd.call(this, map);
  },

  onRemove: function(map){

    for (var i in this._layers) {
      map.removeLayer(this._layers[i]);
    }

    return L.esri.FeatureManager.prototype.onRemove.call(this, map);
  },

  /**
   * Feature Managment Methods
   */

  createLayers: function(features){
    for (var i = features.length - 1; i >= 0; i--) {
      var geojson = features[i];
      var layer = this._layers[geojson.id];
      var newLayer;

      if(layer && !this._map.hasLayer(layer)){
        this._map.addLayer(layer);
      }

      if (layer && layer.setLatLngs) {
        // @TODO Leaflet 0.8
        //newLayer = L.GeoJSON.geometryToLayer(geojson, this.options);

        newLayer = L.GeoJSON.geometryToLayer(geojson, this.options.pointToLayer, L.GeoJSON.coordsToLatLng, this.options);
        layer.setLatLngs(newLayer.getLatLngs());
      }

      if(!layer){
        // @TODO Leaflet 0.8
        //newLayer = L.GeoJSON.geometryToLayer(geojson, this.options);

        newLayer = L.GeoJSON.geometryToLayer(geojson, this.options.pointToLayer, L.GeoJSON.coordsToLatLng, this.options);
        newLayer.feature = L.GeoJSON.asFeature(geojson);
        newLayer.defaultOptions = newLayer.options;

        // cache the layer
        this._layers[newLayer.feature.id] = newLayer;

        // style the layer
        this.resetStyle(newLayer.feature.id);

        // bubble events from layers to this
        // @TODO Leaflet 0.8
        // newLayer.addEventParent(this);

        if (newLayer.on) {
          newLayer.on(L.esri.FeatureLayer.EVENTS, this._propagateEvent, this);
        }

        // bind a popup if we have one
        if(this._popup && newLayer.bindPopup){
          newLayer.bindPopup(this._popup(newLayer.feature, newLayer));
        }



        // add the layer if it is within the time bounds or our layer is not time enabled
        if(!this._timeEnabled || (this._timeEnabled && this._featureWithinTimeRange(geojson)) ){
          this._map.addLayer(newLayer);
        }
      }
    }
  },

  cellEnter: function(bounds, coords){
    var key = this._cellCoordsToKey(coords);
    var layers = this._cache[key];
    if(layers){
      for (var i = layers.length - 1; i >= 0; i--) {
        var layer = layers[i];
        if(!this._map.hasLayer(layer)){
          this._map.addLayer(layer);
        }
      }
    }
  },

  cellLeave: function(bounds, coords){
    var key = this._cellCoordsToKey(coords);
    var layers = this._cache[key];
    if(layers){
      for (var i = layers.length - 1; i >= 0; i--) {
        var layer = layers[i];
        if(this._map.hasLayer(layer)){
          this._map.removeLayer(layer);
        }
      }
    }
  },

  addLayers: function(ids){
    for (var i = ids.length - 1; i >= 0; i--) {
      var layer = this._layers[ids[i]];
      if(layer){
        this._map.addLayer(layer);
      }
    }
  },

  removeLayers: function(ids){
    for (var i = ids.length - 1; i >= 0; i--) {
      var layer = this._layers[ids[i]];
      if(layer){
        this._map.removeLayer(layer);
      }
    }
  },

  /**
   * Styling Methods
   */

  resetStyle: function (id) {
    var layer = this._layers[id];

    // reset any custom styles
    layer.options = layer.defaultOptions;
    this._setLayerStyle(layer, this.options.style);
    return this;
  },

  setStyle: function (style) {
    this.eachLayer(function (layer) {
      this._setLayerStyle(layer, style);
    }, this);
    return this;
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
    for (var i in this._layers) {
      var layer = this._layers[i];
      var popupContent = this._popup(layer.feature, layer);
      layer.bindPopup(popupContent, options);
    }
    return this;
  },

  unbindPopup: function () {
    this._popup =  false;
    for (var i in this._layers) {
      this._layers[i].unbindPopup();
    }
    return this;
  },

  /**
   * Utility Methods
   */

  eachFeature: function (fn, context) {
    for (var i in this._layers) {
      fn.call(context, this._layers[i]);
    }
    return this;
  },

  getFeature: function (id) {
    return this._layers[id];
  }

});

L.esri.featureLayer = function (options) {
  return new L.esri.FeatureLayer(options);
};