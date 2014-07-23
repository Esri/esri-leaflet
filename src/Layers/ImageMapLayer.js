/* globals L */
L.esri.Layers.ImageMapLayer = L.esri.Layers.RasterLayer.extend({

  options: {
    updateInterval: 150,
    format: 'jpgpng'
  },

  initialize: function (url, options) {
    this.url = L.esri.Util.cleanUrl(url);
    this._service = new L.esri.Services.ImageService(this.url, options);
    this._service.on('authenticationrequired requeststart requestend requesterror requestsuccess', this._propagateEvent, this);
    L.Util.setOptions(this, options);
  },

  setPixelType: function (pixelType) {
    this.options.pixelType = pixelType;
    return this;
  },

  getPixelType: function () {
    return this.options.pixelType;
  },

  setBandIds: function (bandIds) {
    if (L.Util.isArray(bandIds)) {
      this.options.bandIds = bandIds.join(',');
    } else {
      this.options.bandIds = bandIds;
    }
    return this;
  },

  getBandIds: function () {
    return this.options.bandIds;
  },

  _buildExportParams: function () {
    var bounds = this._map.getBounds();
    var size = this._map.getSize();
    var ne = this._map.options.crs.project(bounds._northEast);
    var sw = this._map.options.crs.project(bounds._southWest);

    var params = {
      bbox: [sw.x, sw.y, ne.x, ne.y].join(','),
      size: size.x + ',' + size.y,
      format: this.options.format,
      bboxSR: this.options.bboxSR,
      imageSR: this.options.imageSR
    };

    if (this.options.from && this.options.to) {
      params.time = this.options.from.valueOf() + ',' + this.options.to.valueOf();
    }

    if (this.options.pixelType) {
      params.pixelType = this.options.pixelType;
    }

    if (this.options.noDataInterpretation) {
      params.noDataInterpretation = this.options.noDataInterpretation;
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

    if (this._service.options.token) {
      params.token = this._service.options.token;
    }

    return params;
  },

  _requestExport: function (params, bounds) {
    if (this.options.f === 'json') {
      this._service.get('exportImage', params, function(error, response){
        this._renderImage(response.href, bounds);
      }, this);
    } else {
      params.f = 'image';
      this._renderImage(this.url + 'exportImage' + L.Util.getParamString(params), bounds);
    }
  }
});

L.esri.ImageMapLayer = L.esri.Layers.ImageMapLayer;

L.esri.Layers.imageMapLayer = function (key, options) {
  return new L.esri.Layers.ImageMapLayer(key, options);
};

L.esri.imageMapLayer = function (key, options) {
  return new L.esri.Layers.ImageMapLayer(key, options);
};