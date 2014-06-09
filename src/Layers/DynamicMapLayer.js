/* globals L */

L.esri.Layers.DynamicMapLayer = L.Class.extend({

  includes: L.Mixin.Events,

  options: {
    opacity: 1,
    position: 'front',
    updateInterval: 150,
    layers: false,
    layerDefs: false,
    timeOptions: false,
    format: 'png24',
    transparent: true,
    f: 'image'
  },

  initialize: function (url, options) {
    this.url = L.esri.Util.cleanUrl(url);
    this._service = new L.esri.Services.MapService(this.url, options);
    this._service.on('authenticationrequired requeststart requestend requesterror requestsuccess', this._propagateEvent, this);
    L.Util.setOptions(this, options);
  },

  onAdd: function (map) {
    this._map = map;

    this._update = L.Util.limitExecByInterval(this._update, this.options.updateInterval, this);

    if (map.options.crs && map.options.crs.code) {
      var sr = map.options.crs.code.split(':')[1];
      this.options.bboxSR = sr;
      this.options.imageSR = sr;
    }

    if(this._popup){
      this._map.on('click', this._getPopupData, this);
      this._map.on('dblclick', this._resetPopupState, this);
    }

    // @TODO remove at Leaflet 0.8
    this._map.addEventListener(this.getEvents(), this);

    this._update();
  },

  onRemove: function () {
    if (this._currentImage) {
      this._map.removeLayer(this._currentImage);
    }

    if(this._popup){
      this._map.off('click', this._getPopupData, this);
      this._map.off('dblclick', this._resetPopupState, this);
    }

    // @TODO remove at Leaflet 0.8
    this._map.removeEventListener(this.getEvents(), this);
  },

  addTo: function(map){
    map.addLayer(this);
    return this;
  },

  removeFrom: function(map){
    map.removeLayer(this);
    return this;
  },

  getEvents: function(){
    var events = {
      moveend: this._update
    };

    return events;
  },

  bringToFront: function(){
    this.options.position = 'front';
    if(this._currentImage){
      this._currentImage.bringToFront();
    }
    return this;
  },

  bringToBack: function(){
    this.options.position = 'back';
    if(this._currentImage){
      this._currentImage.bringToBack();
    }
    return this;
  },

  bindPopup: function(fn, popupOptions){
    this._shouldRenderPopup = false;
    this._lastClick = false;
    this._popup = L.popup(popupOptions);
    this._popupFunction = fn;
    if(this._map){
      this._map.on('click', this._getPopupData, this);
      this._map.on('dblclick', this._resetPopupState, this);
    }
    return this;
  },

  unbindPopup: function(){
    if(this._map){
      this._map.closePopup(this._popup);
      this._map.off('click', this._getPopupData, this);
      this._map.off('dblclick', this._resetPopupState, this);
    }
    this._popup = false;
    return this;
  },

  getOpacity: function(){
    return this.options.opacity;
  },

  setOpacity: function(opacity){
    this.options.opacity = opacity;
    this._currentImage.setOpacity(opacity);
    return this;
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

  getTimeRange: function(){
    return [this.options.from, this.options.to];
  },

  setTimeRange: function(from, to){
    this.options.from = from;
    this.options.to = to;
    this._update();
    return this;
  },

  metadata: function(callback, context){
    this._service.metadata(callback, context);
    return this;
  },

  identify: function(){
    return this._service.identify();
  },

  authenticate: function(token){
    this._service.authenticate(token);
    return this;
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
    }

    identifyRequest.run(callback);

    // set the flags to show the popup
    this._shouldRenderPopup = true;
    this._lastClick = e.latlng;
  },

  _renderPopup: function(latlng, error, featureCollection, response){
    if(this._shouldRenderPopup && this._lastClick.equals(latlng)){
      //add the popup to the map where the mouse was clicked at
      var content = this._popupFunction(error, featureCollection, response);
      if (content) {
        this._popup.setLatLng(latlng).setContent(content).openOn(this._map);
      }
    }
  },

  _resetPopupState: function(e){
    this._shouldRenderPopup = false;
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

  _renderImage: function(url, bounds){
    var image = new L.ImageOverlay(url, bounds, {
      opacity: 0
    }).addTo(this._map);

    image.once('load', function(e){
      var newImage = e.target;
      var oldImage = this._currentImage;

      if(newImage._bounds.equals(bounds)){
        this._currentImage = newImage;

        if(this.options.position === 'front'){
          this.bringToFront();
        } else {
          this.bringToBack();
        }

        this._currentImage.setOpacity(this.options.opacity);

        if(oldImage){
          this._map.removeLayer(oldImage);
        }
      } else {
        this._map.removeLayer(newImage);
      }

      this.fire('load', {
        bounds: bounds
      });

    }, this);

    this.fire('loading', {
      bounds: bounds
    });
  },

  _update: function () {
    if(!this._map){
      return;
    }

    var zoom = this._map.getZoom();
    var bounds = this._map.getBounds();

    if(this._animatingZoom){
      return;
    }

    if (this._map._panTransition && this._map._panTransition._inProgress) {
      return;
    }

    if (zoom > this.options.maxZoom || zoom < this.options.minZoom) {
      return;
    }
    var params = this._buildExportParams();

    if(this.options.f === 'json'){
      this._service.get('export', params, function(error, response){
        this._renderImage(response.href, bounds);
      }, this);
    } else {
      params.f = 'image';
      this._renderImage(this.url + 'export' + L.Util.getParamString(params), bounds);
    }
  },

  // from https://github.com/Leaflet/Leaflet/blob/v0.7.2/src/layer/FeatureGroup.js
  // @TODO remove at Leaflet 0.8
  _propagateEvent: function (e) {
    e = L.extend({
      layer: e.target,
      target: this
    }, e);
    this.fire(e.type, e);
  }
});

L.esri.DynamicMapLayer = L.esri.Layers.DynamicMapLayer;

L.esri.Layers.dynamicMapLayer = function(key, options){
  return new L.esri.Layers.DynamicMapLayer(key, options);
};

L.esri.dynamicMapLayer = function(key, options){
  return new L.esri.Layers.DynamicMapLayer(key, options);
};