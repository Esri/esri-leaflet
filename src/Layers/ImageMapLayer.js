import { Util } from "leaflet";
import { RasterLayer } from "./RasterLayer.js";
import { getUrlParams } from "../Util.js";
import imageService from "../Services/ImageService.js";

export const ImageMapLayer = RasterLayer.extend({
  options: {
    updateInterval: 150,
    format: "jpgpng",
    transparent: true,
    f: "image",
  },

  query() {
    return this.service.query();
  },

  identify() {
    return this.service.identify();
  },

  initialize(options) {
    options = getUrlParams(options);
    this.service = imageService(options);
    this.service.addEventParent(this);

    Util.setOptions(this, options);
  },

  setPixelType(pixelType) {
    this.options.pixelType = pixelType;
    this._update();
    return this;
  },

  getPixelType() {
    return this.options.pixelType;
  },

  setBandIds(bandIds) {
    if (Util.isArray(bandIds)) {
      this.options.bandIds = bandIds.join(",");
    } else {
      this.options.bandIds = bandIds.toString();
    }
    this._update();
    return this;
  },

  getBandIds() {
    return this.options.bandIds;
  },

  setNoData(noData, noDataInterpretation) {
    if (Util.isArray(noData)) {
      this.options.noData = noData.join(",");
    } else {
      this.options.noData = noData.toString();
    }
    if (noDataInterpretation) {
      this.options.noDataInterpretation = noDataInterpretation;
    }
    this._update();
    return this;
  },

  getNoData() {
    return this.options.noData;
  },

  getNoDataInterpretation() {
    return this.options.noDataInterpretation;
  },

  setRenderingRule(renderingRule) {
    this.options.renderingRule = renderingRule;
    this._update();
  },

  getRenderingRule() {
    return this.options.renderingRule;
  },

  setMosaicRule(mosaicRule) {
    this.options.mosaicRule = mosaicRule;
    this._update();
  },

  getMosaicRule() {
    return this.options.mosaicRule;
  },

  _getPopupData(e) {
    const callback = Util.bind(function (error, results, response) {
      if (error) {
        return;
      } // we really can't do anything here but authenticate or requesterror will fire
      setTimeout(
        Util.bind(function () {
          this._renderPopup(e.latlng, error, results, response);
        }, this),
        300,
      );
    }, this);

    const identifyRequest = this.identify().at(e.latlng);

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

  _buildExportParams() {
    const sr = parseInt(this._map.options.crs.code.split(":")[1], 10);

    const params = {
      bbox: this._calculateBbox(),
      size: this._calculateImageSize(),
      format: this.options.format,
      transparent: this.options.transparent,
      bboxSR: sr,
      imageSR: sr,
    };

    if (this.options.from && this.options.to) {
      params.time = `${this.options.from.valueOf()},${this.options.to.valueOf()}`;
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

  _requestExport(params, bounds) {
    if (this.options.f === "json") {
      this.service.request(
        "exportImage",
        params,
        function (error, response) {
          if (error) {
            return;
          } // we really can't do anything here but authenticate or requesterror will fire
          if (this.options.token) {
            response.href += `?token=${this.options.token}`;
          }
          if (this.options.proxy) {
            response.href = `${this.options.proxy}?${response.href}`;
          }
          this._renderImage(response.href, bounds);
        },
        this,
      );
    } else {
      params.f = "image";
      let fullUrl = `${this.options.url}exportImage${Util.getParamString(params)}`;
      if (this.options.proxy) {
        fullUrl = `${this.options.proxy}?${fullUrl}`;
      }
      this._renderImage(fullUrl, bounds);
    }
  },
});

export function imageMapLayer(url, options) {
  return new ImageMapLayer(url, options);
}

export default imageMapLayer;
