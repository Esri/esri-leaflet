import {
  ImageOverlay,
  CRS,
  DomUtil,
  Util,
  Layer,
  popup,
  latLng,
  bounds,
} from "leaflet";
import { cors } from "../Support.js";
import { setEsriAttribution, removeEsriAttribution } from "../Util.js";

const Overlay = ImageOverlay.extend({
  onAdd(map) {
    this._topLeft = map.getPixelBounds().min;
    ImageOverlay.prototype.onAdd.call(this, map);
  },
  _reset() {
    if (this._map.options.crs === CRS.EPSG3857) {
      ImageOverlay.prototype._reset.call(this);
    } else {
      DomUtil.setPosition(
        this._image,
        this._topLeft.subtract(this._map.getPixelOrigin()),
      );
    }
  },
});

export const RasterLayer = Layer.extend({
  options: {
    opacity: 1,
    position: "front",
    f: "image",
    useCors: cors,
    attribution: null,
    interactive: false,
    alt: "",
  },

  onAdd(map) {
    // include 'Powered by Esri' in map attribution
    setEsriAttribution(map);

    if (this.options.zIndex) {
      this.options.position = null;
    }

    this._update = Util.throttle(
      this._update,
      this.options.updateInterval,
      this,
    );

    map.on("moveend", this._update, this);

    // if we had an image loaded and it matches the
    // current bounds show the image otherwise remove it
    if (
      this._currentImage &&
      this._currentImage._bounds.equals(this._map.getBounds())
    ) {
      map.addLayer(this._currentImage);
    } else if (this._currentImage) {
      this._map.removeLayer(this._currentImage);
      this._currentImage = null;
    }

    this._update();

    if (this._popup) {
      this._map.on("click", this._getPopupData, this);
      this._map.on("dblclick", this._resetPopupState, this);
    }

    // add copyright text listed in service metadata
    this.metadata(function (err, metadata) {
      if (
        !err &&
        !this.options.attribution &&
        map.attributionControl &&
        metadata.copyrightText
      ) {
        this.options.attribution = metadata.copyrightText;
        map.attributionControl.addAttribution(this.getAttribution());
      }
    }, this);
  },

  onRemove(map) {
    removeEsriAttribution(map);

    if (this._currentImage) {
      this._map.removeLayer(this._currentImage);
    }

    if (this._popup) {
      this._map.off("click", this._getPopupData, this);
      this._map.off("dblclick", this._resetPopupState, this);
    }

    this._map.off("moveend", this._update, this);
  },

  bindPopup(fn, popupOptions) {
    this._shouldRenderPopup = false;
    this._lastClick = false;
    this._popup = popup(popupOptions);
    this._popupFunction = fn;
    if (this._map) {
      this._map.on("click", this._getPopupData, this);
      this._map.on("dblclick", this._resetPopupState, this);
    }
    return this;
  },

  unbindPopup() {
    if (this._map) {
      this._map.closePopup(this._popup);
      this._map.off("click", this._getPopupData, this);
      this._map.off("dblclick", this._resetPopupState, this);
    }
    this._popup = false;
    return this;
  },

  bringToFront() {
    this.options.position = "front";
    if (this._currentImage) {
      this._currentImage.bringToFront();
      this._setAutoZIndex(Math.max);
    }
    return this;
  },

  bringToBack() {
    this.options.position = "back";
    if (this._currentImage) {
      this._currentImage.bringToBack();
      this._setAutoZIndex(Math.min);
    }
    return this;
  },

  setZIndex(value) {
    this.options.zIndex = value;
    if (this._currentImage) {
      this._currentImage.setZIndex(value);
    }
    return this;
  },

  _setAutoZIndex(compare) {
    // go through all other layers of the same pane, set zIndex to max + 1 (front) or min - 1 (back)
    if (!this._currentImage) {
      return;
    }
    const layers = this._currentImage.getPane().children;
    let edgeZIndex = -compare(-Infinity, Infinity); // -Infinity for max, Infinity for min
    for (let i = 0, len = layers.length, zIndex; i < len; i++) {
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

  getAttribution() {
    return this.options.attribution;
  },

  getOpacity() {
    return this.options.opacity;
  },

  setOpacity(opacity) {
    this.options.opacity = opacity;
    if (this._currentImage) {
      this._currentImage.setOpacity(opacity);
    }
    return this;
  },

  getTimeRange() {
    return [this.options.from, this.options.to];
  },

  setTimeRange(from, to) {
    this.options.from = from;
    this.options.to = to;
    this._update();
    return this;
  },

  metadata(callback, context) {
    this.service.metadata(callback, context);
    return this;
  },

  authenticate(token) {
    this.service.authenticate(token);
    return this;
  },

  redraw() {
    this._update();
  },

  _renderImage(url, bounds, contentType) {
    if (this._map) {
      // if no output directory has been specified for a service, MIME data will be returned
      if (contentType) {
        url = `data:${contentType};base64,${url}`;
      }

      // if server returns an inappropriate response, abort.
      if (!url) {
        return;
      }

      // create a new image overlay and add it to the map
      // to start loading the image
      // opacity is 0 while the image is loading
      const image = new Overlay(url, bounds, {
        opacity: 0,
        crossOrigin: this.options.withCredentials
          ? "use-credentials"
          : this.options.useCors,
        alt: this.options.alt,
        pane: this.options.pane || this.getPane(),
        interactive: this.options.interactive,
      }).addTo(this._map);

      // eslint-disable-next-line prefer-const
      let onOverlayLoad;

      const onOverlayError = function () {
        this._map.removeLayer(image);
        this.fire("error");
        image.off("load", onOverlayLoad, this);
      };

      onOverlayLoad = function (e) {
        image.off("error", onOverlayError, this);
        if (this._map) {
          const newImage = e.target;
          const oldImage = this._currentImage;

          // if the bounds of this image matches the bounds that
          // _renderImage was called with and we have a map with the same bounds
          // hide the old image if there is one and set the opacity
          // of the new image otherwise remove the new image
          if (
            newImage._bounds.equals(bounds) &&
            newImage._bounds.equals(this._map.getBounds())
          ) {
            this._currentImage = newImage;

            if (this.options.position === "front") {
              this.bringToFront();
            } else if (this.options.position === "back") {
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

        this.fire("load", {
          bounds,
        });
      };

      // If loading the image fails
      image.once("error", onOverlayError, this);

      // once the image loads
      image.once("load", onOverlayLoad, this);
    }
  },

  _update() {
    if (!this._map) {
      return;
    }

    const zoom = this._map.getZoom();
    const bounds = this._map.getBounds();

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

    const params = this._buildExportParams();
    Util.extend(params, this.options.requestParams);

    if (params) {
      this._requestExport(params, bounds);

      this.fire("loading", {
        bounds,
      });
    } else if (this._currentImage) {
      this._currentImage._map.removeLayer(this._currentImage);
      this._currentImage = null;
    }
  },

  _renderPopup(latlng, error, results, response) {
    latlng = latLng(latlng);
    if (this._shouldRenderPopup && this._lastClick.equals(latlng)) {
      // add the popup to the map where the mouse was clicked at
      const content = this._popupFunction(error, results, response);
      if (content) {
        this._popup.setLatLng(latlng).setContent(content).openOn(this._map);
      }
    }
  },

  _resetPopupState(e) {
    this._shouldRenderPopup = false;
    this._lastClick = e.latlng;
  },

  _calculateBbox() {
    const pixelBounds = this._map.getPixelBounds();

    const sw = this._map.unproject(pixelBounds.getBottomLeft());
    const ne = this._map.unproject(pixelBounds.getTopRight());

    const neProjected = this._map.options.crs.project(ne);
    const swProjected = this._map.options.crs.project(sw);

    // this ensures ne/sw are switched in polar maps where north/top bottom/south is inverted
    const boundsProjected = bounds(neProjected, swProjected);

    return [
      boundsProjected.getBottomLeft().x,
      boundsProjected.getBottomLeft().y,
      boundsProjected.getTopRight().x,
      boundsProjected.getTopRight().y,
    ].join(",");
  },

  _calculateImageSize() {
    // ensure that we don't ask ArcGIS Server for a taller image than we have actual map displaying within the div
    const bounds = this._map.getPixelBounds();
    const size = this._map.getSize();

    const sw = this._map.unproject(bounds.getBottomLeft());
    const ne = this._map.unproject(bounds.getTopRight());

    const top = this._map.latLngToLayerPoint(ne).y;
    const bottom = this._map.latLngToLayerPoint(sw).y;

    if (top > 0 || bottom < size.y) {
      size.y = bottom - top;
    }

    return `${size.x},${size.y}`;
  },
});
