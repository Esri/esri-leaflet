import { Path, Util, GeoJSON, latLng } from "leaflet";
import { FeatureManager } from "./FeatureManager.js";
import { warn } from "../../Util.js";

export const FeatureLayer = FeatureManager.extend({
  options: {
    cacheLayers: true,
  },

  /**
   * Constructor
   */
  initialize(options) {
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

  onRemove(map) {
    for (const i in this._layers) {
      map.removeLayer(this._layers[i]);
      // trigger the event when the entire featureLayer is removed from the map
      this.fire(
        "removefeature",
        {
          feature: this._layers[i].feature,
          permanent: false,
        },
        true,
      );
    }

    return FeatureManager.prototype.onRemove.call(this, map);
  },

  createNewLayer(geojson) {
    const layer = GeoJSON.geometryToLayer(geojson, this.options);
    // trap for GeoJSON without geometry
    if (layer) {
      layer.defaultOptions = layer.options;
    }
    return layer;
  },

  _updateLayer(layer, geojson) {
    // convert the geojson coordinates into a Leaflet LatLng array/nested arrays
    // pass it to setLatLngs to update layer geometries
    let latlngs = [];
    const coordsToLatLng =
      this.options.coordsToLatLng || GeoJSON.coordsToLatLng;

    // copy new attributes, if present
    if (geojson.properties) {
      layer.feature.properties = geojson.properties;
    }

    switch (geojson.geometry.type) {
      case "Point":
        latlngs = GeoJSON.coordsToLatLng(geojson.geometry.coordinates);
        layer.setLatLng(latlngs);
        break;
      case "LineString":
        latlngs = GeoJSON.coordsToLatLngs(
          geojson.geometry.coordinates,
          0,
          coordsToLatLng,
        );
        layer.setLatLngs(latlngs);
        break;
      case "MultiLineString":
        latlngs = GeoJSON.coordsToLatLngs(
          geojson.geometry.coordinates,
          1,
          coordsToLatLng,
        );
        layer.setLatLngs(latlngs);
        break;
      case "Polygon":
        latlngs = GeoJSON.coordsToLatLngs(
          geojson.geometry.coordinates,
          1,
          coordsToLatLng,
        );
        layer.setLatLngs(latlngs);
        break;
      case "MultiPolygon":
        latlngs = GeoJSON.coordsToLatLngs(
          geojson.geometry.coordinates,
          2,
          coordsToLatLng,
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

  createLayers(features) {
    for (let i = features.length - 1; i >= 0; i--) {
      const geojson = features[i];

      const layer = this._layers[geojson.id];
      let newLayer;

      if (
        this._visibleZoom() &&
        layer &&
        !this._map.hasLayer(layer) &&
        (!this.options.timeField || this._featureWithinTimeRange(geojson))
      ) {
        this._map.addLayer(layer);
        this.fire(
          "addfeature",
          {
            feature: layer.feature,
          },
          true,
        );
      }

      // update geometry if the layer already existed.
      if (layer && (layer.setLatLngs || layer.setLatLng)) {
        this._updateLayer(layer, geojson);
      }

      if (!layer) {
        newLayer = this.createNewLayer(geojson);

        if (!newLayer) {
          warn("invalid GeoJSON encountered");
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
            "createfeature",
            {
              feature: newLayer.feature,
            },
            true,
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

  addLayers(ids) {
    for (let i = ids.length - 1; i >= 0; i--) {
      const layer = this._layers[ids[i]];
      if (
        layer &&
        (!this.options.timeField || this._featureWithinTimeRange(layer.feature))
      ) {
        this._map.addLayer(layer);
        this.fire(
          "addfeature",
          {
            feature: layer.feature,
          },
          true,
        );
      }
    }
  },

  removeLayers(ids, permanent) {
    for (let i = ids.length - 1; i >= 0; i--) {
      const id = ids[i];
      const layer = this._layers[id];
      if (layer) {
        this.fire(
          "removefeature",
          {
            feature: layer.feature,
            permanent,
          },
          true,
        );
        this._map.removeLayer(layer);
      }
      if (layer && permanent) {
        delete this._layers[id];
      }
    }
  },

  cellEnter(bounds, coords) {
    if (this._visibleZoom() && !this._zooming && this._map) {
      Util.requestAnimFrame(
        Util.bind(function () {
          const cacheKey = this._cacheKey(coords);
          const cellKey = this._cellCoordsToKey(coords);
          const layers = this._cache[cacheKey];
          if (this._activeCells[cellKey] && layers) {
            this.addLayers(layers);
          }
        }, this),
      );
    }
  },

  cellLeave(bounds, coords) {
    if (!this._zooming) {
      Util.requestAnimFrame(
        Util.bind(function () {
          if (this._map) {
            const cacheKey = this._cacheKey(coords);
            const cellKey = this._cellCoordsToKey(coords);
            const layers = this._cache[cacheKey];
            const mapBounds = this._map.getBounds();
            if (!this._activeCells[cellKey] && layers) {
              let removable = true;

              for (let i = 0; i < layers.length; i++) {
                const layer = this._layers[layers[i]];
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
        }, this),
      );
    }
  },

  /**
   * Styling Methods
   */

  resetStyle() {
    this.options.style = this._originalStyle;
    this.eachFeature(function (layer) {
      this.resetFeatureStyle(layer.feature.id);
    }, this);
    return this;
  },

  setStyle(style) {
    this.options.style = style;
    this.eachFeature(function (layer) {
      this.setFeatureStyle(layer.feature.id, style);
    }, this);
    return this;
  },

  resetFeatureStyle(id) {
    const layer = this._layers[id];
    const style = this._originalStyle || Path.prototype.options;
    if (layer) {
      Util.extend(layer.options, layer.defaultOptions);
      this.setFeatureStyle(id, style);
    }
    return this;
  },

  setFeatureStyle(id, style) {
    const layer = this._layers[id];
    if (typeof style === "function") {
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

  eachActiveFeature(fn, context) {
    // figure out (roughly) which layers are in view
    if (this._map) {
      const activeBounds = this._map.getBounds();
      for (const i in this._layers) {
        if (this._currentSnapshot.indexOf(this._layers[i].feature.id) !== -1) {
          // a simple point in poly test for point geometries
          if (
            typeof this._layers[i].getLatLng === "function" &&
            activeBounds.contains(this._layers[i].getLatLng())
          ) {
            fn.call(context, this._layers[i]);
          } else if (
            typeof this._layers[i].getBounds === "function" &&
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

  eachFeature(fn, context) {
    for (const i in this._layers) {
      fn.call(context, this._layers[i]);
    }
    return this;
  },

  getFeature(id) {
    return this._layers[id];
  },

  bringToBack() {
    this.eachFeature((layer) => {
      if (layer.bringToBack) {
        layer.bringToBack();
      }
    });
  },

  bringToFront() {
    this.eachFeature((layer) => {
      if (layer.bringToFront) {
        layer.bringToFront();
      }
    });
  },

  redraw(id) {
    if (id) {
      this._redraw(id);
    }
    return this;
  },

  _redraw(id) {
    const layer = this._layers[id];
    const geojson = layer.feature;

    // if this looks like a marker
    if (layer && layer.setIcon && this.options.pointToLayer) {
      // update custom symbology, if necessary
      if (this.options.pointToLayer) {
        const getIcon = this.options.pointToLayer(
          geojson,
          latLng(
            geojson.geometry.coordinates[1],
            geojson.geometry.coordinates[0],
          ),
        );
        const updatedIcon = getIcon.options.icon;
        layer.setIcon(updatedIcon);
      }
    }

    // looks like a vector marker (circleMarker)
    if (layer && layer.setStyle && this.options.pointToLayer) {
      const getStyle = this.options.pointToLayer(
        geojson,
        latLng(
          geojson.geometry.coordinates[1],
          geojson.geometry.coordinates[0],
        ),
      );
      const updatedStyle = getStyle.options;
      this.setFeatureStyle(geojson.id, updatedStyle);
    }

    // looks like a path (polygon/polyline)
    if (layer && layer.setStyle && this.options.style) {
      this.resetFeatureStyle(geojson.id);
    }
  },

  // This is the same as the Layer.openPopup method except it excludes the `FeatureGroup`
  // logic to work around https://github.com/Leaflet/Leaflet/issues/8761
  openPopup(latlng) {
    if (this._popup) {
      if (this._popup._prepareOpen(latlng || this._latlng)) {
        // open the popup on the map
        this._popup.openOn(this._map);
      }
    }
    return this;
  },

  // This is the same as the `Layer.openTooltip` method except it excludes the `FeatureGroup`
  // logic to work around https://github.com/Leaflet/Leaflet/issues/8761
  openTooltip(latlng) {
    if (this._tooltip) {
      if (this._tooltip._prepareOpen(latlng)) {
        // open the tooltip on the map
        this._tooltip.openOn(this._map);

        if (this.getElement) {
          this._setAriaDescribedByOnLayer(this);
        } else if (this.eachLayer) {
          this.eachLayer(this._setAriaDescribedByOnLayer, this);
        }
      }
    }
    return this;
  },
});

export function featureLayer(options) {
  return new FeatureLayer(options);
}

export default featureLayer;
