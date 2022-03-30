import { Util } from 'leaflet';
import { RasterLayer } from './RasterLayer';
import { getUrlParams } from '../Util';
import mapService from '../Services/MapService';

export var DynamicMapLayer = RasterLayer.extend({

  options: {
    updateInterval: 150,
    layers: false,
    layerDefs: false,
    timeOptions: false,
    format: 'png32',
    transparent: true,
    f: 'json'
  },

  initialize: function (options) {
    options = getUrlParams(options);
    this.service = mapService(options);
    this.service.addEventParent(this);

    Util.setOptions(this, options);
  },

  getDynamicLayers: function () {
    return this.options.dynamicLayers;
  },

  setDynamicLayers: function (dynamicLayers) {
    this.options.dynamicLayers = dynamicLayers;
    this._update();
    return this;
  },

  getLayers: function () {
    return this.options.layers;
  },

  setLayers: function (layers) {
    this.options.layers = layers;
    this._update();
    return this;
  },

  getLayerDefs: function () {
    return this.options.layerDefs;
  },

  setLayerDefs: function (layerDefs) {
    this.options.layerDefs = layerDefs;
    this._update();
    return this;
  },

  getTimeOptions: function () {
    return this.options.timeOptions;
  },

  setTimeOptions: function (timeOptions) {
    this.options.timeOptions = timeOptions;
    this._update();
    return this;
  },

  query: function () {
    return this.service.query();
  },

  identify: function () {
    return this.service.identify();
  },

  find: function () {
    return this.service.find();
  },

  _getPopupData: function (e) {
    var callback = Util.bind(function (error, featureCollection, response) {
      if (error) { return; } // we really can't do anything here but authenticate or requesterror will fire
      setTimeout(Util.bind(function () {
        this._renderPopup(e.latlng, error, featureCollection, response);
      }, this), 300);
    }, this);

    var identifyRequest;
    if (this.options.popup) {
      identifyRequest = this.options.popup.on(this._map).at(e.latlng);
    } else {
      identifyRequest = this.identify().on(this._map).at(e.latlng);
    }

    // remove extraneous vertices from response features if it has not already been done
    if (!identifyRequest.params.maxAllowableOffset) {
      identifyRequest.simplify(this._map, 0.5);
    }

    if (!(this.options.popup && this.options.popup.params && this.options.popup.params.layers)) {
      if (this.options.layers) {
        identifyRequest.layers('visible:' + this.options.layers.join(','));
      } else {
        identifyRequest.layers('visible');
      }
    }

    // if present, pass layer ids and sql filters through to the identify task
    if (this.options.layerDefs && typeof this.options.layerDefs !== 'string' && !identifyRequest.params.layerDefs) {
      for (var id in this.options.layerDefs) {
        if (Object.prototype.hasOwnProperty.call(this.options.layerDefs, id)) {
          identifyRequest.layerDef(id, this.options.layerDefs[id]);
        }
      }
    }

    identifyRequest.run(callback);

    // set the flags to show the popup
    this._shouldRenderPopup = true;
    this._lastClick = e.latlng;
  },

  _buildExportParams: function () {
    var sr = parseInt(this._map.options.crs.code.split(':')[1], 10);

    var params = {
      bbox: this._calculateBbox(),
      size: this._calculateImageSize(),
      dpi: 96,
      format: this.options.format,
      transparent: this.options.transparent,
      bboxSR: sr,
      imageSR: sr
    };

    if (this.options.dynamicLayers) {
      params.dynamicLayers = this.options.dynamicLayers;
    }

    if (this.options.layers) {
      if (this.options.layers.length === 0) {
        return;
      } else {
        params.layers = 'show:' + this.options.layers.join(',');
      }
    }

    if (this.options.layerDefs) {
      params.layerDefs = typeof this.options.layerDefs === 'string' ? this.options.layerDefs : JSON.stringify(this.options.layerDefs);
    }

    if (this.options.timeOptions) {
      params.timeOptions = JSON.stringify(this.options.timeOptions);
    }

    if (this.options.from && this.options.to) {
      params.time = this.options.from.valueOf() + ',' + this.options.to.valueOf();
    }

    if (this.service.options.token) {
      params.token = this.service.options.token;
    }

    if (this.options.proxy) {
      params.proxy = this.options.proxy;
    }

    // use a timestamp to bust server cache
    if (this.options.disableCache) {
      params._ts = Date.now();
    }

    return params;
  },

  _requestExport: function (params, bounds) {
    if (this.options.f === 'json') {
      this.service.request('export', params, function (error, response) {
        if (error) { return; } // we really can't do anything here but authenticate or requesterror will fire

        if (this.options.token && response.href) {
          response.href += ('?token=' + this.options.token);
        }
        if (this.options.proxy && response.href) {
          response.href = this.options.proxy + '?' + response.href;
        }
        if (response.href) {
          this._renderImage(response.href, bounds);
        } else {
          this._renderImage(response.imageData, bounds, response.contentType);
        }
      }, this);
    } else {
      params.f = 'image';
      var fullUrl = this.options.url + 'export' + Util.getParamString(params);
      if (this.options.proxy) {
        fullUrl = this.options.proxy + '?' + fullUrl;
      }
      this._renderImage(fullUrl, bounds);
    }
  }
});

export function dynamicMapLayer (url, options) {
  return new DynamicMapLayer(url, options);
}

export default dynamicMapLayer;
