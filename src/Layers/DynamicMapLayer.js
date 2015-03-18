EsriLeaflet.Layers.DynamicMapLayer = EsriLeaflet.Layers.RasterLayer.extend({

  options: {
    updateInterval: 150,
    layers: false,
    layerDefs: false,
    timeOptions: false,
    format: 'png24',
    transparent: true
  },

  initialize: function (url, options) {
    options = options || {};
    options.url = EsriLeaflet.Util.cleanUrl(url);
    this._service = new EsriLeaflet.Services.MapService(options);
    this._service.on('authenticationrequired requeststart requestend requesterror requestsuccess', this._propagateEvent, this);
    if (options.proxy){
      options.f = 'json';
    }
    L.Util.setOptions(this, options);
  },

  getLayers: function(){
    return this.options.layers;
  },

  setLayers: function(layers){
    this.options.layers = layers;
    this._update();
    return this;
  },

  getLayerDefs: function(){
    return this.options.layerDefs;
  },

  setLayerDefs: function(layerDefs){
    this.options.layerDefs = layerDefs;
    this._update();
    return this;
  },

  getTimeOptions: function(){
    return this.options.timeOptions;
  },

  setTimeOptions: function(timeOptions){
    this.options.timeOptions = timeOptions;
    this._update();
    return this;
  },

  query: function(){
    return this._service.query();
  },

  identify: function(){
    return this._service.identify();
  },

  find: function(){
    return this._service.find();
  },

  _getPopupData: function(e){
    var callback = L.Util.bind(function(error, featureCollection, response) {
      setTimeout(L.Util.bind(function(){
        this._renderPopup(e.latlng, error, featureCollection, response);
      }, this), 300);
    }, this);

    var identifyRequest = this.identify().on(this._map).at(e.latlng);

    if(this.options.layers){
      identifyRequest.layers('visible:' + this.options.layers.join(','));
    } else {
      identifyRequest.layers('visible');
    }

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

    //ensure that we don't ask ArcGIS Server for a taller image than we have actual map displaying
    var top = this._map.latLngToLayerPoint(bounds._northEast);
    var bottom = this._map.latLngToLayerPoint(bounds._southWest);

    if (top.y > 0 || bottom.y < size.y){
      size.y = bottom.y - top.y;
    }

    var params = {
      bbox: [sw.x, sw.y, ne.x, ne.y].join(','),
      size: size.x + ',' + size.y,
      dpi: 96,
      format: this.options.format,
      transparent: this.options.transparent,
      bboxSR: this.options.bboxSR,
      imageSR: this.options.imageSR
    };

    if(this.options.layers){
      params.layers = 'show:' + this.options.layers.join(',');
    }

    if(this.options.layerDefs){
      params.layerDefs = JSON.stringify(this.options.layerDefs);
    }

    if(this.options.timeOptions){
      params.timeOptions = JSON.stringify(this.options.timeOptions);
    }

    if(this.options.from && this.options.to){
      params.time = this.options.from.valueOf() + ',' + this.options.to.valueOf();
    }

    if(this._service.options.token) {
      params.token = this._service.options.token;
    }

    return params;
  },

  _requestExport: function (params, bounds) {
    if(this.options.f === 'json'){
      this._service.get('export', params, function(error, response){
        this._renderImage(response.href, bounds);
      }, this);
    } else {
      params.f = 'image';
      this._renderImage(this.options.url + 'export' + L.Util.getParamString(params), bounds);
    }
  }
});

EsriLeaflet.DynamicMapLayer = EsriLeaflet.Layers.DynamicMapLayer;

EsriLeaflet.Layers.dynamicMapLayer = function(url, options){
  return new EsriLeaflet.Layers.DynamicMapLayer(url, options);
};

EsriLeaflet.dynamicMapLayer = function(url, options){
  return new EsriLeaflet.Layers.DynamicMapLayer(url, options);
};