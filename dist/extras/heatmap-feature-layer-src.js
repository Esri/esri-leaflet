/*! Esri-Leaflet - v0.0.1-beta.4 - 2014-05-26
*   Copyright (c) 2014 Environmental Systems Research Institute, Inc.
*   Apache License*/
L.esri.Layers.HeatMapFeatureLayer = L.esri.Layers.FeatureManager.extend({

  /**
   * Constructor
   */

  initialize: function (url, options) {
    L.esri.FeatureManager.prototype.initialize.call(this, url, options);

    options = L.setOptions(this, options);

    this._cache = {};
    this._active = {};

    this.heat = new L.heatLayer([], options);
  },

  /**
   * Layer Interface
   */

  onAdd: function(map){
    L.esri.FeatureManager.prototype.onAdd.call(this, map);
    this._map.addLayer(this.heat);
  },

  onRemove: function(map){
    L.esri.FeatureManager.prototype.onRemove.call(this, map);
    this._map.removeLayer(this.heat);
  },

  /**
   * Feature Managment Methods
   */

  createLayers: function(features){
    for (var i = features.length - 1; i >= 0; i--) {
      var geojson = features[i];
      var id = geojson.id;
      var latlng = new L.LatLng(geojson.geometry.coordinates[1], geojson.geometry.coordinates[0]);
      this._cache[id] = latlng;

      // add the layer if it is within the time bounds or our layer is not time enabled
      if(!this._active[id] && (!this._timeEnabled || (this._timeEnabled && this._featureWithinTimeRange(geojson)))){
        this._active[id] = latlng;
        this.heat._latlngs.push(latlng);
      }
    }

    this.heat.redraw();
  },

  addLayers: function(ids){
    for (var i = ids.length - 1; i >= 0; i--) {
      var id = ids[i];
      if(!this._active[id]){
        var latlng = this._cache[id];
        this.heat._latlngs.push(latlng);
        this._active[id] = latlng;
      }
    }
    this.heat.redraw();
  },

  removeLayers: function(ids){
    var newLatLngs = [];
    for (var i = ids.length - 1; i >= 0; i--) {
      var id = ids[i];
      if(this._active[id]){
        delete this._active[id];
      }
    }

    for (var latlng in this._active){
      newLatLngs.push(this._active[latlng]);
    }

    this.heat.setLatLngs(newLatLngs);
  }

});

L.esri.HeatMapFeatureLayer = L.esri.Layers.HeatMapFeatureLayer;

L.esri.Layers.heatMapFeatureLayer = function(key, options){
  return new L.esri.Layers.HeatMapFeatureLayer(key, options);
};

L.esri.heatMapFeatureLayer = function(key, options){
  return new L.esri.Layers.heatMapFeatureLayer(key, options);
};