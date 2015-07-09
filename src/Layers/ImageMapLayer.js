EsriLeaflet.Layers.ImageMapLayer = EsriLeaflet.Layers.RasterLayer.extend({

  options: {
    updateInterval: 150,
    format: 'jpgpng',
    transparent: true,
    f: 'json'
  },

  query: function(){
    return this._service.query();
  },

  identify: function(){
    return this._service.identify();
  },

  initialize: function (options) {
    options.url = EsriLeaflet.Util.cleanUrl(options.url);
    this._service = new EsriLeaflet.Services.ImageService(options);
    this._service.on('authenticationrequired requeststart requestend requesterror requestsuccess', this._propagateEvent, this);
    L.Util.setOptions(this, options);
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
    if (L.Util.isArray(bandIds)) {
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
    if (L.Util.isArray(noData)) {
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

  setRenderingRule: function(renderingRule) {
    this.options.renderingRule = renderingRule;
    this._update();
  },

  getRenderingRule: function() {
    return this.options.renderingRule;
  },

  setMosaicRule: function(mosaicRule) {
    this.options.mosaicRule = mosaicRule;
    this._update();
  },

  getMosaicRule: function() {
    return this.options.mosaicRule;
  },

  _getPopupData: function(e){
    var callback = L.Util.bind(function(error, results, response) {
      if(error) { return; } // we really can't do anything here but authenticate or requesterror will fire
      setTimeout(L.Util.bind(function(){
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
    var bounds = this._map.getBounds();
    var size = this._map.getSize();
    var ne = this._map.options.crs.project(bounds._northEast);
    var sw = this._map.options.crs.project(bounds._southWest);

    var params = {
      bbox: [sw.x, sw.y, ne.x, ne.y].join(','),
      size: size.x + ',' + size.y,
      format: this.options.format,
      transparent: this.options.transparent,
      bboxSR: this.options.bboxSR,
      imageSR: this.options.imageSR
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

    if (this.options.noData) {
      params.noData = this.options.noData;
    }

    if (this.options.noDataInterpretation) {
      params.noDataInterpretation = this.options.noDataInterpretation;
    }

    if (this._service.options.token) {
      params.token = this._service.options.token;
    }

    if(this.options.renderingRule) {
      params.renderingRule = JSON.stringify(this.options.renderingRule);
    }

    if(this.options.mosaicRule) {
      params.mosaicRule = JSON.stringify(this.options.mosaicRule);
    }

    return params;
  },

  _requestExport: function (params, bounds) {
    if (this.options.f === 'json') {
      this._service.request('exportImage', params, function(error, response){
        if(error) { return; } // we really can't do anything here but authenticate or requesterror will fire
        this._renderImage(response.href, bounds);
      }, this);
    } else {
      params.f = 'image';
      this._renderImage(this.options.url + 'exportImage' + L.Util.getParamString(params), bounds);
    }
  }
});

EsriLeaflet.ImageMapLayer = EsriLeaflet.Layers.ImageMapLayer;

EsriLeaflet.Layers.imageMapLayer = function (options) {
  return new EsriLeaflet.Layers.ImageMapLayer(options);
};

EsriLeaflet.imageMapLayer = function (options) {
  return new EsriLeaflet.Layers.ImageMapLayer(options);
};
