import { Util } from 'leaflet';
import { RasterLayer } from './RasterLayer';
import { getUrlParams } from '../Util';
import imageService from '../Services/ImageService';

export var ImageMapLayer = RasterLayer.extend({

  options: {
    updateInterval: 150,
    format: 'jpgpng',
    transparent: true,
    f: 'image'
  },

  query: function () {
    return this.service.query();
  },

  identify: function () {
    return this.service.identify();
  },

  initialize: function (options) {
    options = getUrlParams(options);
    this.service = imageService(options);
    this.service.addEventParent(this);

    Util.setOptions(this, options);
  },

  setPixelType: function (pixelType) {
    this.options.pixelType = pixelType;
    this._update();
    return this;
  },

  getPixelType: function () {
    return this.options.pixelType;
  },

  setBandIds: function (bandIds) {
    if (Util.isArray(bandIds)) {
      this.options.bandIds = bandIds.join(',');
    } else {
      this.options.bandIds = bandIds.toString();
    }
    this._update();
    return this;
  },

  getBandIds: function () {
    return this.options.bandIds;
  },

  setNoData: function (noData, noDataInterpretation) {
    if (Util.isArray(noData)) {
      this.options.noData = noData.join(',');
    } else {
      this.options.noData = noData.toString();
    }
    if (noDataInterpretation) {
      this.options.noDataInterpretation = noDataInterpretation;
    }
    this._update();
    return this;
  },

  getNoData: function () {
    return this.options.noData;
  },

  getNoDataInterpretation: function () {
    return this.options.noDataInterpretation;
  },

  setRenderingRule: function (renderingRule) {
    this.options.renderingRule = renderingRule;
    this._update();
  },

  getRenderingRule: function () {
    return this.options.renderingRule;
  },

  setMosaicRule: function (mosaicRule) {
    this.options.mosaicRule = mosaicRule;
    this._update();
  },

  getMosaicRule: function () {
    return this.options.mosaicRule;
  },

  _getPopupData: function (e) {
    var callback = Util.bind(function (error, results, response) {
      if (error) { return; } // we really can't do anything here but authenticate or requesterror will fire
      setTimeout(Util.bind(function () {
        this._renderPopup(e.latlng, error, results, response);
      }, this), 300);
    }, this);

    var identifyRequest = this.identify().at(e.latlng);

    // set mosaic rule for identify task if it is set for layer
    if (this.options.mosaicRule) {
      identifyRequest.setMosaicRule(this.options.mosaicRule);
      // @TODO: force return catalog items too?
    }

    // @TODO: set rendering rule? Not sure,
    // sometimes you want raw pixel values
    // if (this.options.renderingRule) {
    //   identifyRequest.setRenderingRule(this.options.renderingRule);
    // }

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
      format: this.options.format,
      transparent: this.options.transparent,
      bboxSR: sr,
      imageSR: sr
    };

    if (this.options.from && this.options.to) {
      params.time = this.options.from.valueOf() + ',' + this.options.to.valueOf();
    }

    if (this.options.pixelType) {
      params.pixelType = this.options.pixelType;
    }

    if (this.options.interpolation) {
      params.interpolation = this.options.interpolation;
    }

    if (this.options.compressionQuality) {
      params.compressionQuality = this.options.compressionQuality;
    }

    if (this.options.bandIds) {
      params.bandIds = this.options.bandIds;
    }

    // 0 is falsy *and* a valid input parameter
    if (this.options.noData === 0 || this.options.noData) {
      params.noData = this.options.noData;
    }

    if (this.options.noDataInterpretation) {
      params.noDataInterpretation = this.options.noDataInterpretation;
    }

    if (this.service.options.token) {
      params.token = this.service.options.token;
    }

    if (this.options.renderingRule) {
      params.renderingRule = JSON.stringify(this.options.renderingRule);
    }

    if (this.options.mosaicRule) {
      params.mosaicRule = JSON.stringify(this.options.mosaicRule);
    }

    return params;
  },

  _requestExport: function (params, bounds) {
    if (this.options.f === 'json') {
      this.service.request('exportImage', params, function (error, response) {
        if (error) { return; } // we really can't do anything here but authenticate or requesterror will fire
        if (this.options.token) {
          response.href += ('?token=' + this.options.token);
        }
        if (this.options.proxy) {
          response.href = this.options.proxy + '?' + response.href;
        }
        this._renderImage(response.href, bounds);
      }, this);
    } else {
      params.f = 'image';
      var fullUrl = this.options.url + 'exportImage' + Util.getParamString(params);
      if (this.options.proxy) {
        fullUrl = this.options.proxy + '?' + fullUrl;
      }
      this._renderImage(fullUrl, bounds);
    }
  }
});

export function imageMapLayer (url, options) {
  return new ImageMapLayer(url, options);
}

export default imageMapLayer;
