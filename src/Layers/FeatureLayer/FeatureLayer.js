EsriLeaflet.Layers.FeatureLayer = EsriLeaflet.Layers.FeatureManager.extend({

  statics: {
    EVENTS: 'click dblclick mouseover mouseout mousemove contextmenu popupopen popupclose'
  },

  /**
   * Constructor
   */

  initialize: function (url, options) {
    EsriLeaflet.Layers.FeatureManager.prototype.initialize.call(this, url, options);

    options = L.setOptions(this, options);

    this._layers = {};
    this._leafletIds = {};
    this._key = 'c'+(Math.random() * 1e9).toString(36).replace('.', '_');
  },

  /**
   * Layer Interface
   */

  onAdd: function(map){
    map.on('zoomstart zoomend', function(e){
      this._zooming = (e.type === 'zoomstart');
    }, this);
    return EsriLeaflet.Layers.FeatureManager.prototype.onAdd.call(this, map);
  },

  onRemove: function(map){
    for (var i in this._layers) {
      map.removeLayer(this._layers[i]);
    }

    return EsriLeaflet.Layers.FeatureManager.prototype.onRemove.call(this, map);
  },

  createNewLayer: function(geojson){
    // @TODO Leaflet 0.8
    //newLayer = L.GeoJSON.geometryToLayer(geojson, this.options);
    return L.GeoJSON.geometryToLayer(geojson, this.options.pointToLayer, L.GeoJSON.coordsToLatLng, this.options);
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

        var updateGeo = this.createNewLayer(geojson);
        layer.setLatLngs(updateGeo.getLatLngs());
      }

      if(!layer){
        // @TODO Leaflet 0.8
        //newLayer = L.GeoJSON.geometryToLayer(geojson, this.options);

        newLayer =  this.createNewLayer(geojson);
        newLayer.feature = geojson;
        newLayer.defaultOptions = newLayer.options;
        newLayer._leaflet_id = this._key + '_' + geojson.id;

        this._leafletIds[newLayer._leaflet_id] = geojson.id;

        // bubble events from layers to this
        // @TODO Leaflet 0.8
        // newLayer.addEventParent(this);

        newLayer.on(EsriLeaflet.Layers.FeatureLayer.EVENTS, this._propagateEvent, this);

        // bind a popup if we have one
        if(this._popup && newLayer.bindPopup){
          newLayer.bindPopup(this._popup(newLayer.feature, newLayer), this._popupOptions);
        }

        if(this.options.onEachFeature){
          this.options.onEachFeature(newLayer.feature, newLayer);
        }

        // cache the layer
        this._layers[newLayer.feature.id] = newLayer;

        // style the layer
        this.resetStyle(newLayer.feature.id);

        this.fire('createfeature', {
          feature: newLayer.feature
        });

        // add the layer if it is within the time bounds or our layer is not time enabled
        if(!this.options.timeField || (this.options.timeField && this._featureWithinTimeRange(geojson)) ){
          this._map.addLayer(newLayer);
        }
      }
    }
  },

  addLayers: function(ids){
    for (var i = ids.length - 1; i >= 0; i--) {
      var layer = this._layers[ids[i]];
      if(layer){
        this.fire('addfeature', {
          feature: layer.feature
        });
        this._map.addLayer(layer);
      }
    }
  },

  removeLayers: function(ids, permanent){
    for (var i = ids.length - 1; i >= 0; i--) {
      var id = ids[i];
      var layer = this._layers[id];
      if(layer){
        this.fire('removefeature', {
          feature: layer.feature,
          permanent: permanent
        });
        this._map.removeLayer(layer);
      }
      if(layer && permanent){
        delete this._layers[id];
      }
    }
  },

  cellEnter: function(bounds, coords){
    if(!this._zooming){
      EsriLeaflet.Util.requestAnimationFrame(L.Util.bind(function(){
        var cacheKey = this._cacheKey(coords);
        var cellKey = this._cellCoordsToKey(coords);
        var layers = this._cache[cacheKey];
        if(this._activeCells[cellKey] && layers){
          this.addLayers(layers);
        }
      }, this));
    }
  },

  cellLeave: function(bounds, coords){
    if(!this._zooming){
      EsriLeaflet.Util.requestAnimationFrame(L.Util.bind(function(){
        var i;
        var cacheKey = this._cacheKey(coords);
        var cellKey = this._cellCoordsToKey(coords);
        var layers = this._cache[cacheKey];
        var mapBounds = this._map.getBounds();
        if(!this._activeCells[cellKey] && layers){
          for (i = layers.length - 1; i >= 0; i--) {
            var layer = this.getFeature(layers[i]);
            if(layer){
              var hasLayer = this._map.hasLayer(layer);
              var hadBounds = layer.getBounds;
              if (hadBounds) {
                var boundsInMap = mapBounds.intersects(layer.getBounds());
                if(hasLayer && (!hadBounds || !(hadBounds && boundsInMap))){
                  this._map.removeLayer(layer);
                }
              }
            }
          }

          if(!this.options.cacheLayers){
            for (i = layers.length - 1; i >= 0; i--) {
              delete this._layers[layers[i]];
            }
            delete this._cache[cacheKey];
            delete this._cells[cellKey];
            delete this._activeCells[cellKey];
          }
        }
      }, this));
    }
  },

  /**
   * Styling Methods
   */

  resetStyle: function (id) {
    var layer = this._layers[id];

    if(layer){
      layer.options = layer.defaultOptions;
      this.setFeatureStyle(layer.feature.id, this.options.style);
    }

    return this;
  },

  setStyle: function (style) {
    this.options.style = style;
    this.eachFeature(function (layer) {
      this.setFeatureStyle(layer.feature.id, style);
    }, this);
    return this;
  },

  setFeatureStyle: function (id, style) {
    var layer = this._layers[id];

    if (typeof style === 'function') {
      style = style(layer.feature);
    }

    /*trap inability to access default style options from MultiLine/MultiPolygon
    please revisit at Leaflet 1.0*/
    else if (!style && !layer.defaultOptions) {
      var dummyPath = new L.Path();
      style = L.Path.prototype.options;
      style.fill = true; //not set by default
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
    this._popupOptions = options;
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
      var layer = this._layers[i];
      if (layer.unbindPopup) {
        layer.unbindPopup();
      } else if (layer.getLayers) {
        var groupLayers = layer.getLayers();
        for (var j in groupLayers) {
          var gLayer = groupLayers[j];
          gLayer.unbindPopup();
        }
      }
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
  },

  // from https://github.com/Leaflet/Leaflet/blob/v0.7.2/src/layer/FeatureGroup.js
  // @TODO remove at Leaflet 0.8
  _propagateEvent: function (e) {
    e.layer = this._layers[this._leafletIds[e.target._leaflet_id]];
    e.target = this;
    this.fire(e.type, e);
  }
});

EsriLeaflet.FeatureLayer = EsriLeaflet.Layers.FeatureLayer;

EsriLeaflet.Layers.featureLayer = function(url, options){
  return new EsriLeaflet.Layers.FeatureLayer(url, options);
};

EsriLeaflet.featureLayer = function(url, options){
  return new EsriLeaflet.Layers.FeatureLayer(url, options);
};