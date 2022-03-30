import { Path, Util, GeoJSON, latLng } from 'leaflet';
import { FeatureManager } from './FeatureManager';
import { warn } from '../../Util';

export var FeatureLayer = FeatureManager.extend({
  options: {
    cacheLayers: true
  },

  /**
   * Constructor
   */
  initialize: function (options) {
    if (options.apikey) {
      options.token = options.apikey;
    }
    FeatureManager.prototype.initialize.call(this, options);
    this._originalStyle = this.options.style;
    this._layers = {};
  },

  /**
   * Layer Interface
   */

  onRemove: function (map) {
    for (var i in this._layers) {
      map.removeLayer(this._layers[i]);
      // trigger the event when the entire featureLayer is removed from the map
      this.fire(
        'removefeature',
        {
          feature: this._layers[i].feature,
          permanent: false
        },
        true
      );
    }

    return FeatureManager.prototype.onRemove.call(this, map);
  },

  createNewLayer: function (geojson) {
    var layer = GeoJSON.geometryToLayer(geojson, this.options);
    // trap for GeoJSON without geometry
    if (layer) {
      layer.defaultOptions = layer.options;
    }
    return layer;
  },

  _updateLayer: function (layer, geojson) {
    // convert the geojson coordinates into a Leaflet LatLng array/nested arrays
    // pass it to setLatLngs to update layer geometries
    var latlngs = [];
    var coordsToLatLng = this.options.coordsToLatLng || GeoJSON.coordsToLatLng;

    // copy new attributes, if present
    if (geojson.properties) {
      layer.feature.properties = geojson.properties;
    }

    switch (geojson.geometry.type) {
      case 'Point':
        latlngs = GeoJSON.coordsToLatLng(geojson.geometry.coordinates);
        layer.setLatLng(latlngs);
        break;
      case 'LineString':
        latlngs = GeoJSON.coordsToLatLngs(
          geojson.geometry.coordinates,
          0,
          coordsToLatLng
        );
        layer.setLatLngs(latlngs);
        break;
      case 'MultiLineString':
        latlngs = GeoJSON.coordsToLatLngs(
          geojson.geometry.coordinates,
          1,
          coordsToLatLng
        );
        layer.setLatLngs(latlngs);
        break;
      case 'Polygon':
        latlngs = GeoJSON.coordsToLatLngs(
          geojson.geometry.coordinates,
          1,
          coordsToLatLng
        );
        layer.setLatLngs(latlngs);
        break;
      case 'MultiPolygon':
        latlngs = GeoJSON.coordsToLatLngs(
          geojson.geometry.coordinates,
          2,
          coordsToLatLng
        );
        layer.setLatLngs(latlngs);
        break;
    }

    // update symbol/style
    this.redraw(layer.feature.id);
  },

  /**
   * Feature Management Methods
   */

  createLayers: function (features) {
    for (var i = features.length - 1; i >= 0; i--) {
      var geojson = features[i];

      var layer = this._layers[geojson.id];
      var newLayer;

      if (
        this._visibleZoom() &&
        layer &&
        !this._map.hasLayer(layer) &&
        (!this.options.timeField || this._featureWithinTimeRange(geojson))
      ) {
        this._map.addLayer(layer);
        this.fire(
          'addfeature',
          {
            feature: layer.feature
          },
          true
        );
      }

      // update geometry if the layer already existed.
      if (layer && (layer.setLatLngs || layer.setLatLng)) {
        this._updateLayer(layer, geojson);
      }

      if (!layer) {
        newLayer = this.createNewLayer(geojson);

        if (!newLayer) {
          warn('invalid GeoJSON encountered');
        } else {
          newLayer.feature = geojson;

          // bubble events from individual layers to the feature layer
          newLayer.addEventParent(this);

          if (this.options.onEachFeature) {
            this.options.onEachFeature(newLayer.feature, newLayer);
          }

          // cache the layer
          this._layers[newLayer.feature.id] = newLayer;

          // style the layer
          this.setFeatureStyle(newLayer.feature.id, this.options.style);

          this.fire(
            'createfeature',
            {
              feature: newLayer.feature
            },
            true
          );

          // add the layer if the current zoom level is inside the range defined for the layer, it is within the current time bounds or our layer is not time enabled
          if (
            this._visibleZoom() &&
            (!this.options.timeField ||
              (this.options.timeField && this._featureWithinTimeRange(geojson)))
          ) {
            this._map.addLayer(newLayer);
          }
        }
      }
    }
  },

  addLayers: function (ids) {
    for (var i = ids.length - 1; i >= 0; i--) {
      var layer = this._layers[ids[i]];
      if (
        layer &&
        (!this.options.timeField || this._featureWithinTimeRange(layer.feature))
      ) {
        this._map.addLayer(layer);
        this.fire(
          'addfeature',
          {
            feature: layer.feature
          },
          true
        );
      }
    }
  },

  removeLayers: function (ids, permanent) {
    for (var i = ids.length - 1; i >= 0; i--) {
      var id = ids[i];
      var layer = this._layers[id];
      if (layer) {
        this.fire(
          'removefeature',
          {
            feature: layer.feature,
            permanent: permanent
          },
          true
        );
        this._map.removeLayer(layer);
      }
      if (layer && permanent) {
        delete this._layers[id];
      }
    }
  },

  cellEnter: function (bounds, coords) {
    if (this._visibleZoom() && !this._zooming && this._map) {
      Util.requestAnimFrame(
        Util.bind(function () {
          var cacheKey = this._cacheKey(coords);
          var cellKey = this._cellCoordsToKey(coords);
          var layers = this._cache[cacheKey];
          if (this._activeCells[cellKey] && layers) {
            this.addLayers(layers);
          }
        }, this)
      );
    }
  },

  cellLeave: function (bounds, coords) {
    if (!this._zooming) {
      Util.requestAnimFrame(
        Util.bind(function () {
          if (this._map) {
            var cacheKey = this._cacheKey(coords);
            var cellKey = this._cellCoordsToKey(coords);
            var layers = this._cache[cacheKey];
            var mapBounds = this._map.getBounds();
            if (!this._activeCells[cellKey] && layers) {
              var removable = true;

              for (var i = 0; i < layers.length; i++) {
                var layer = this._layers[layers[i]];
                if (
                  layer &&
                  layer.getBounds &&
                  mapBounds.intersects(layer.getBounds())
                ) {
                  removable = false;
                }
              }

              if (removable) {
                this.removeLayers(layers, !this.options.cacheLayers);
              }

              if (!this.options.cacheLayers && removable) {
                delete this._cache[cacheKey];
                delete this._cells[cellKey];
                delete this._activeCells[cellKey];
              }
            }
          }
        }, this)
      );
    }
  },

  /**
   * Styling Methods
   */

  resetStyle: function () {
    this.options.style = this._originalStyle;
    this.eachFeature(function (layer) {
      this.resetFeatureStyle(layer.feature.id);
    }, this);
    return this;
  },

  setStyle: function (style) {
    this.options.style = style;
    this.eachFeature(function (layer) {
      this.setFeatureStyle(layer.feature.id, style);
    }, this);
    return this;
  },

  resetFeatureStyle: function (id) {
    var layer = this._layers[id];
    var style = this._originalStyle || Path.prototype.options;
    if (layer) {
      Util.extend(layer.options, layer.defaultOptions);
      this.setFeatureStyle(id, style);
    }
    return this;
  },

  setFeatureStyle: function (id, style) {
    var layer = this._layers[id];
    if (typeof style === 'function') {
      style = style(layer.feature);
    }
    if (layer.setStyle) {
      layer.setStyle(style);
    }
    return this;
  },

  /**
   * Utility Methods
   */

  eachActiveFeature: function (fn, context) {
    // figure out (roughly) which layers are in view
    if (this._map) {
      var activeBounds = this._map.getBounds();
      for (var i in this._layers) {
        if (this._currentSnapshot.indexOf(this._layers[i].feature.id) !== -1) {
          // a simple point in poly test for point geometries
          if (
            typeof this._layers[i].getLatLng === 'function' &&
            activeBounds.contains(this._layers[i].getLatLng())
          ) {
            fn.call(context, this._layers[i]);
          } else if (
            typeof this._layers[i].getBounds === 'function' &&
            activeBounds.intersects(this._layers[i].getBounds())
          ) {
            // intersecting bounds check for polyline and polygon geometries
            fn.call(context, this._layers[i]);
          }
        }
      }
    }
    return this;
  },

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
      if (layer.bringToBack) {
        layer.bringToBack();
      }
    });
  },

  bringToFront: function () {
    this.eachFeature(function (layer) {
      if (layer.bringToFront) {
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

  _redraw: function (id) {
    var layer = this._layers[id];
    var geojson = layer.feature;

    // if this looks like a marker
    if (layer && layer.setIcon && this.options.pointToLayer) {
      // update custom symbology, if necessary
      if (this.options.pointToLayer) {
        var getIcon = this.options.pointToLayer(
          geojson,
          latLng(
            geojson.geometry.coordinates[1],
            geojson.geometry.coordinates[0]
          )
        );
        var updatedIcon = getIcon.options.icon;
        layer.setIcon(updatedIcon);
      }
    }

    // looks like a vector marker (circleMarker)
    if (layer && layer.setStyle && this.options.pointToLayer) {
      var getStyle = this.options.pointToLayer(
        geojson,
        latLng(geojson.geometry.coordinates[1], geojson.geometry.coordinates[0])
      );
      var updatedStyle = getStyle.options;
      this.setFeatureStyle(geojson.id, updatedStyle);
    }

    // looks like a path (polygon/polyline)
    if (layer && layer.setStyle && this.options.style) {
      this.resetStyle(geojson.id);
    }
  }
});

export function featureLayer (options) {
  return new FeatureLayer(options);
}

export default featureLayer;
