import { ImageOverlay, CRS, DomUtil, Util, Layer, popup, latLng, bounds } from 'leaflet';
import { cors } from '../Support';
import { setEsriAttribution, removeEsriAttribution } from '../Util';

var Overlay = ImageOverlay.extend({
  onAdd: function (map) {
    this._topLeft = map.getPixelBounds().min;
    ImageOverlay.prototype.onAdd.call(this, map);
  },
  _reset: function () {
    if (this._map.options.crs === CRS.EPSG3857) {
      ImageOverlay.prototype._reset.call(this);
    } else {
      DomUtil.setPosition(this._image, this._topLeft.subtract(this._map.getPixelOrigin()));
    }
  }
});

export var RasterLayer = Layer.extend({
  options: {
    opacity: 1,
    position: 'front',
    f: 'image',
    useCors: cors,
    attribution: null,
    interactive: false,
    alt: ''
  },

  onAdd: function (map) {
    // include 'Powered by Esri' in map attribution
    setEsriAttribution(map);

    if (this.options.zIndex) {
      this.options.position = null;
    }

    this._update = Util.throttle(this._update, this.options.updateInterval, this);

    map.on('moveend', this._update, this);

    // if we had an image loaded and it matches the
    // current bounds show the image otherwise remove it
    if (this._currentImage && this._currentImage._bounds.equals(this._map.getBounds())) {
      map.addLayer(this._currentImage);
    } else if (this._currentImage) {
      this._map.removeLayer(this._currentImage);
      this._currentImage = null;
    }

    this._update();

    if (this._popup) {
      this._map.on('click', this._getPopupData, this);
      this._map.on('dblclick', this._resetPopupState, this);
    }

    // add copyright text listed in service metadata
    this.metadata(function (err, metadata) {
      if (!err && !this.options.attribution && map.attributionControl && metadata.copyrightText) {
        this.options.attribution = metadata.copyrightText;
        map.attributionControl.addAttribution(this.getAttribution());
      }
    }, this);
  },

  onRemove: function (map) {
    removeEsriAttribution(map);

    if (this._currentImage) {
      this._map.removeLayer(this._currentImage);
    }

    if (this._popup) {
      this._map.off('click', this._getPopupData, this);
      this._map.off('dblclick', this._resetPopupState, this);
    }

    this._map.off('moveend', this._update, this);
  },

  bindPopup: function (fn, popupOptions) {
    this._shouldRenderPopup = false;
    this._lastClick = false;
    this._popup = popup(popupOptions);
    this._popupFunction = fn;
    if (this._map) {
      this._map.on('click', this._getPopupData, this);
      this._map.on('dblclick', this._resetPopupState, this);
    }
    return this;
  },

  unbindPopup: function () {
    if (this._map) {
      this._map.closePopup(this._popup);
      this._map.off('click', this._getPopupData, this);
      this._map.off('dblclick', this._resetPopupState, this);
    }
    this._popup = false;
    return this;
  },

  bringToFront: function () {
    this.options.position = 'front';
    if (this._currentImage) {
      this._currentImage.bringToFront();
      this._setAutoZIndex(Math.max);
    }
    return this;
  },

  bringToBack: function () {
    this.options.position = 'back';
    if (this._currentImage) {
      this._currentImage.bringToBack();
      this._setAutoZIndex(Math.min);
    }
    return this;
  },

  setZIndex: function (value) {
    this.options.zIndex = value;
    if (this._currentImage) {
      this._currentImage.setZIndex(value);
    }
    return this;
  },

  _setAutoZIndex: function (compare) {
    // go through all other layers of the same pane, set zIndex to max + 1 (front) or min - 1 (back)
    if (!this._currentImage) {
      return;
    }
    var layers = this._currentImage.getPane().children;
    var edgeZIndex = -compare(-Infinity, Infinity); // -Infinity for max, Infinity for min
    for (var i = 0, len = layers.length, zIndex; i < len; i++) {
      zIndex = layers[i].style.zIndex;
      if (layers[i] !== this._currentImage._image && zIndex) {
        edgeZIndex = compare(edgeZIndex, +zIndex);
      }
    }

    if (isFinite(edgeZIndex)) {
      this.options.zIndex = edgeZIndex + compare(-1, 1);
      this.setZIndex(this.options.zIndex);
    }
  },

  getAttribution: function () {
    return this.options.attribution;
  },

  getOpacity: function () {
    return this.options.opacity;
  },

  setOpacity: function (opacity) {
    this.options.opacity = opacity;
    if (this._currentImage) {
      this._currentImage.setOpacity(opacity);
    }
    return this;
  },

  getTimeRange: function () {
    return [this.options.from, this.options.to];
  },

  setTimeRange: function (from, to) {
    this.options.from = from;
    this.options.to = to;
    this._update();
    return this;
  },

  metadata: function (callback, context) {
    this.service.metadata(callback, context);
    return this;
  },

  authenticate: function (token) {
    this.service.authenticate(token);
    return this;
  },

  redraw: function () {
    this._update();
  },

  _renderImage: function (url, bounds, contentType) {
    if (this._map) {
      // if no output directory has been specified for a service, MIME data will be returned
      if (contentType) {
        url = 'data:' + contentType + ';base64,' + url;
      }

      // if server returns an inappropriate response, abort.
      if (!url) return;

      // create a new image overlay and add it to the map
      // to start loading the image
      // opacity is 0 while the image is loading
      var image = new Overlay(url, bounds, {
        opacity: 0,
        crossOrigin: this.options.withCredentials ? 'use-credentials' : this.options.useCors,
        alt: this.options.alt,
        pane: this.options.pane || this.getPane(),
        interactive: this.options.interactive
      }).addTo(this._map);

      var onOverlayError = function () {
        this._map.removeLayer(image);
        this.fire('error');
        image.off('load', onOverlayLoad, this);
      };

      var onOverlayLoad = function (e) {
        image.off('error', onOverlayError, this);
        if (this._map) {
          var newImage = e.target;
          var oldImage = this._currentImage;

          // if the bounds of this image matches the bounds that
          // _renderImage was called with and we have a map with the same bounds
          // hide the old image if there is one and set the opacity
          // of the new image otherwise remove the new image
          if (newImage._bounds.equals(bounds) && newImage._bounds.equals(this._map.getBounds())) {
            this._currentImage = newImage;

            if (this.options.position === 'front') {
              this.bringToFront();
            } else if (this.options.position === 'back') {
              this.bringToBack();
            }

            if (this.options.zIndex) {
              this.setZIndex(this.options.zIndex);
            }

            if (this._map && this._currentImage._map) {
              this._currentImage.setOpacity(this.options.opacity);
            } else {
              this._currentImage._map.removeLayer(this._currentImage);
            }

            if (oldImage && this._map) {
              this._map.removeLayer(oldImage);
            }

            if (oldImage && oldImage._map) {
              oldImage._map.removeLayer(oldImage);
            }
          } else {
            this._map.removeLayer(newImage);
          }
        }

        this.fire('load', {
          bounds: bounds
        });
      };

      // If loading the image fails
      image.once('error', onOverlayError, this);

      // once the image loads
      image.once('load', onOverlayLoad, this);
    }
  },

  _update: function () {
    if (!this._map) {
      return;
    }

    var zoom = this._map.getZoom();
    var bounds = this._map.getBounds();

    if (this._animatingZoom) {
      return;
    }

    if (this._map._panTransition && this._map._panTransition._inProgress) {
      return;
    }

    if (zoom > this.options.maxZoom || zoom < this.options.minZoom) {
      if (this._currentImage) {
        this._currentImage._map.removeLayer(this._currentImage);
        this._currentImage = null;
      }
      return;
    }

    var params = this._buildExportParams();
    Util.extend(params, this.options.requestParams);

    if (params) {
      this._requestExport(params, bounds);

      this.fire('loading', {
        bounds: bounds
      });
    } else if (this._currentImage) {
      this._currentImage._map.removeLayer(this._currentImage);
      this._currentImage = null;
    }
  },

  _renderPopup: function (latlng, error, results, response) {
    latlng = latLng(latlng);
    if (this._shouldRenderPopup && this._lastClick.equals(latlng)) {
      // add the popup to the map where the mouse was clicked at
      var content = this._popupFunction(error, results, response);
      if (content) {
        this._popup.setLatLng(latlng).setContent(content).openOn(this._map);
      }
    }
  },

  _resetPopupState: function (e) {
    this._shouldRenderPopup = false;
    this._lastClick = e.latlng;
  },

  _calculateBbox: function () {
    var pixelBounds = this._map.getPixelBounds();

    var sw = this._map.unproject(pixelBounds.getBottomLeft());
    var ne = this._map.unproject(pixelBounds.getTopRight());

    var neProjected = this._map.options.crs.project(ne);
    var swProjected = this._map.options.crs.project(sw);

    // this ensures ne/sw are switched in polar maps where north/top bottom/south is inverted
    var boundsProjected = bounds(neProjected, swProjected);

    return [boundsProjected.getBottomLeft().x, boundsProjected.getBottomLeft().y, boundsProjected.getTopRight().x, boundsProjected.getTopRight().y].join(',');
  },

  _calculateImageSize: function () {
    // ensure that we don't ask ArcGIS Server for a taller image than we have actual map displaying within the div
    var bounds = this._map.getPixelBounds();
    var size = this._map.getSize();

    var sw = this._map.unproject(bounds.getBottomLeft());
    var ne = this._map.unproject(bounds.getTopRight());

    var top = this._map.latLngToLayerPoint(ne).y;
    var bottom = this._map.latLngToLayerPoint(sw).y;

    if (top > 0 || bottom < size.y) {
      size.y = bottom - top;
    }

    return size.x + ',' + size.y;
  }
});
