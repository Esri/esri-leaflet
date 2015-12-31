EsriLeaflet.Layers.FeatureLayer = EsriLeaflet.Layers.FeatureManager.extend({

  statics: {
    EVENTS: 'click dblclick mouseover mouseout mousemove contextmenu popupopen popupclose'
  },

  options: {
    cacheLayers: true
  },

  /**
   * Constructor
   */

  initialize: function (options) {
    EsriLeaflet.Layers.FeatureManager.prototype.initialize.call(this, options);

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
    this._removed = false;

    return EsriLeaflet.Layers.FeatureManager.prototype.onAdd.call(this, map);
  },

  onRemove: function(map){
    this._removed = true;
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

  _updateLayer: function(layer, geojson){
    // convert the geojson coordinates into a Leaflet LatLng array/nested arrays
    // pass it to setLatLngs to update layer geometries
    var latlngs = [];
    var coordsToLatLng = this.options.coordsToLatLng || L.GeoJSON.coordsToLatLng;

    // copy new attributes, if present
    if (geojson.properties) {
      layer.feature.properties = geojson.properties;
    }

    switch(geojson.geometry.type){
      case 'Point':
        latlngs = L.GeoJSON.coordsToLatLng(geojson.geometry.coordinates);
        layer.setLatLng(latlngs);
        break;
      case 'LineString':
        latlngs = L.GeoJSON.coordsToLatLngs(geojson.geometry.coordinates, 0, coordsToLatLng);
        layer.setLatLngs(latlngs);
        break;
      case 'MultiLineString':
        latlngs = L.GeoJSON.coordsToLatLngs(geojson.geometry.coordinates, 1, coordsToLatLng);
        layer.setLatLngs(latlngs);
        break;
      case 'Polygon':
        latlngs = L.GeoJSON.coordsToLatLngs(geojson.geometry.coordinates, 1, coordsToLatLng);
        layer.setLatLngs(latlngs);
        break;
      case 'MultiPolygon':
        latlngs = L.GeoJSON.coordsToLatLngs(geojson.geometry.coordinates, 2, coordsToLatLng);
        layer.setLatLngs(latlngs);
        break;
    }
  },

  /**
   * Feature Management Methods
   */

  createLayers: function(features){
    for (var i = features.length - 1; i >= 0; i--) {

      var geojson = features[i];

      var layer = this._layers[geojson.id];
      var newLayer;

      if(layer && !this._map.hasLayer(layer)){
        this._map.addLayer(layer);
      }

      // update geomerty if neccessary
      if (layer && (layer.setLatLngs || layer.setLatLng)) {
        this._updateLayer(layer, geojson);
      }


      if(!layer){
        newLayer =  this.createNewLayer(geojson);
        newLayer.feature = geojson;

        if (this.options.style) {
          newLayer._originalStyle = this.options.style;
        }

        // circleMarker check
        else if (newLayer.setStyle) {
          newLayer._originalStyle = newLayer.options;
        }

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
        var cacheKey = this._cacheKey(coords);
        var cellKey = this._cellCoordsToKey(coords);
        var layers = this._cache[cacheKey];
        var mapBounds = this._map.getBounds();
        if(!this._activeCells[cellKey] && layers){
          var removable = true;

          for (var i = 0; i < layers.length; i++) {
            var layer = this._layers[layers[i]];
            if(layer && layer.getBounds && mapBounds.intersects(layer.getBounds())){
              removable = false;
            }
          }

          if(removable){
            this.removeLayers(layers, !this.options.cacheLayers);
          }

          if(!this.options.cacheLayers && removable){
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
      this.setFeatureStyle(layer.feature.id, layer._originalStyle);
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

    if (!style && !layer.defaultOptions) {
      style = L.Path.prototype.options;
      style.fill = true; //not set by default
    }

    if (layer && layer.setStyle) {
      layer.setStyle(style);
    }

    return this;
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

  bringToBack: function () {
    this.eachFeature(function (layer) {
      if(layer.bringToBack) {
        layer.bringToBack();
      }
    });
  },

  bringToFront: function () {
    this.eachFeature(function (layer) {
      if(layer.bringToFront) {
        layer.bringToFront();
      }
    });
  },

  redraw: function (id) {
    if (id) {
      this._redraw(id);
    }
    return this;
  },

  _redraw: function(id) {
    var layer = this._layers[id];
    var geojson = layer.feature;

    // if this looks like a marker
    if (layer && layer.setIcon && this.options.pointToLayer) {
      // update custom symbology, if necessary
      if (this.options.pointToLayer){
        var getIcon = this.options.pointToLayer(geojson, L.latLng(geojson.geometry.coordinates[1], geojson.geometry.coordinates[0]));
        var updatedIcon = getIcon.options.icon;
        layer.setIcon(updatedIcon);
      }
    }

    // looks like a vector marker (circleMarker)
    if (layer && layer.setStyle && this.options.pointToLayer) {
      var getStyle = this.options.pointToLayer(geojson, L.latLng(geojson.geometry.coordinates[1], geojson.geometry.coordinates[0]));
      var updatedStyle = getStyle.options;
      this.setFeatureStyle(geojson.id, updatedStyle);
    }

    // looks like a path (polygon/polyline)
    if(layer && layer.setStyle && this.options.style) {
      this.resetStyle(geojson.id);
    }
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

EsriLeaflet.Layers.featureLayer = function(options){
  return new EsriLeaflet.Layers.FeatureLayer(options);
};

EsriLeaflet.featureLayer = function(options){
  return new EsriLeaflet.Layers.FeatureLayer(options);
};
