L.esri.FeatureLayer = L.esri.FeatureManager.extend({

  /**
   * Constructor
   */

  initialize: function (url, options) {
    L.esri.FeatureManager.prototype.initialize.call(this, url, options);

    //this.index = L.esri._rbush();

    options = L.setOptions(this, options);

    this._layers = {};
  },

  /**
   * Feature Managment Methods
   */

  createLayers: function(features){
    var bounds = [];
    for (var i = features.length - 1; i >= 0; i--) {
      var geojson = features[i];
      var layer = this._layers[geojson.id];
      var newLayer;

      if(layer && !this._map.hasLayer(layer)){
        this._map.addLayer(layer);
      }

      if (layer && layer.setLatLngs) {
        newLayer = L.GeoJSON.geometryToLayer(geojson, this.options);
        layer.setLatLngs(newLayer.getLatLngs());
      }

      if(!layer){
        newLayer = L.GeoJSON.geometryToLayer(geojson, this.options);
        newLayer.feature = L.GeoJSON.asFeature(geojson);

        // get bounds and add bbox
        // var bbox = L.esri.Util.geojsonBounds(newLayer.feature);
        // bbox.push(newLayer.feature.id);
        // bounds.push(bbox);

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
          this._map.addLayer(newLayer);
        }
      }
    }

    // load the indexes
    //this.index.load(bounds);
  },

  cellEnter: function(bounds, coords){
    console.log('cellEnter');
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
    console.log('cellLeave');
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
        layer.addTo(this._map);
      }
    }
  },

  removeLayers: function(ids){
    for (var i = ids.length - 1; i >= 0; i--) {
      var layer = this._layers[ids[i]];
      if(layer){
        layer.removeFrom(this._map);
      }
    }
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
    for (var i in this._layers) {
      var layer = this._layers[i];
      var popupContent = this._popup(layer.feature, layer);
      layer.bindPopup(popupContent, options);
    }
  },

  unbindPopup: function () {
    this._popup =  false;
    for (var i in this._layers) {
      this._layers[i].unbindPopup();
    }
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
  },

  /**
   * Filtering Methods
   */

  _featuresWithinBounds: function(bounds){
    var results = this.index.search(bounds.toBBoxString().split(','));
    var ids = [];
    var layers = [];
    var i;

    for (i = results.length - 1; i >= 0; i--) {
      ids.push(results[i][4]);
    }

    for (i = ids.length - 1; i >= 0; i--) {
      layers.push(this._layers[ids[i]]);
    }

    return layers;
  }

});

L.esri.featureLayer = function (options) {
  return new L.esri.FeatureLayer(options);
};