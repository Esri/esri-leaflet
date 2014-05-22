/* globals L */

L.esri.DynamicMapLayer = L.Class.extend({

  includes: L.Mixin.Events,

  options: {
    opacity: 1,
    position: 'front',
    updateInterval: 150,
    layers: [],
    layerDefs: false,
    layerTime: false
  },

  _defaultLayerParams: {
    format: 'png24',
    transparent: true,
    f: 'image',
    bboxSR: 3875,
    imageSR: 3875
  },

  initialize: function (url, options) {
    this.url = L.esri.Util.cleanUrl(url);
    this._layerParams = L.Util.extend({}, this._defaultLayerParams);
    this._service = new L.esri.Services.MapService(this.url);

    L.Util.setOptions(this, options);

    if(this.options.layers.length) {
      this._layerParams.layers = 'show:' + this.options.layers.join(',');
    }

    if(this.options.layerDefs) {
      this.setLayerDefs(this.options.layerDefs);

    }

    if(this.options.layerTime) {
      this._layerParams.layerTimeOptions = JSON.stringify(this.options.layerTime);
    }
  },

  onAdd: function (map) {
    this._map = map;

    this._update = L.Util.limitExecByInterval(this._update, this.options.updateInterval, this);

    if (map.options.crs && map.options.crs.code) {
      var sr = map.options.crs.code.split(':')[1];
      this._layerParams.bboxSR = sr;
      this._layerParams.imageSR = sr;
    }

    // @TODO remove at Leaflet 0.8
    this._map.addEventListener(this.getEvents(), this);

    this._update();
  },

  onRemove: function () {
    if (this._currentImage) {
      this._map.removeLayer(this._currentImage);
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

  setOpacity: function(opacity){
    this.options.opacity = opacity;
    this._currentImage.setOpacity(opacity);
  },

  bringToFront: function(){
    this.options.position = 'front';
    this._currentImage.bringToFront();
    return this;
  },

  bringToBack: function(){
    this.options.position = 'back';
    this._currentImage.bringToBack();
    return this;
  },

  bindPopup: function(fn, options){
    this._popupIdentifyParams = (options) ? options.params : {};
    this._shouldRenderPopup = false;
    this._lastClick = false;
    this._popup = L.popup((options) ? options.popup : {});
    this._popupFunction = fn;
    this._map.on('click', this._getPopupData, this);
    this._map.on('dblclick', this._resetPopupState, this);
  },

  unbindPopup: function(){
    this._map.closePopup(this._popup);
    this._map.off('click', this._getPopupData, this);
    this._map.off('dblclick', this._resetPopupState, this);
    this._popup = false;
  },

  identify: function(){
    return this._service.identify();
  },

  getLayers: function(){

  },

  setLayers: function(){
    this.options;
  },

  getLayerDefs: function(){
    return this.options.layerDefs;
  },

  setLayerDefs: function(layerDefs){
    this.options.layerDefs = layerDefs;
    this._layerParams.layerDefs = JSON.stringify(this.options.layerDefs);
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

  _getPopupData: function(e){
    var callback = L.Util.bind(function(error, response) {
      setTimeout(L.Util.bind(function(){
        this._renderPopup(e.latlng, error, response);
      }, this), 300);
    }, this);

    var identifyRequest = this.identify()
        .at(e.latlng, this._map.getBounds(), 5)
        .size(this._map.getSize().x, this._map.getSize().y);

    if(this.options.layers){
      identifyRequest.layers('visible:' + this.options.layers.join(','));
    }

    identifyRequest.run(callback);

    // set the flags to show the popup
    this._shouldRenderPopup = true;
    this._lastClick = e.latlng;
  },

  _renderPopup: function(latlng, error, response){
    if(this._shouldRenderPopup && this._lastClick.equals(latlng)){
      //add the popup to the map where the mouse was clicked at
      var content = this._popupFunction(error, response);
      if (content) {
        this._popup.setLatLng(latlng).setContent(content).openOn(this._map);
      }
    }
  },

  _resetPopupState: function(e){
    this._shouldRenderPopup = false;
    this._lastClick = e.latlng;
  },

  _getImageUrl: function () {
    var bounds = this._map.getBounds();
    var size = this._map.getSize();
    var ne = this._map.options.crs.project(bounds._northEast);
    var sw = this._map.options.crs.project(bounds._southWest);

    this._layerParams.bbox = [sw.x, sw.y, ne.x, ne.y].join(',');
    this._layerParams.size = size.x + ',' + size.y;
    this._layerParams.dpi = 96;

    if(this.options.from && this.options.to){
      this._layerParams.time = this.options.from.valueOf() + ',' + this.options.to.valueOf();
    }

    if(this.options.token) {
      this._layerParams.token = this.options.token;
    }
    console.log(this._layerParams);
    var url = this.url + 'export' + L.Util.getParamString(this._layerParams);

    return url;
  },

  _update: function () {
    if(this._animatingZoom){
      return;
    }

    if (this._map._panTransition && this._map._panTransition._inProgress) {
      return;
    }

    var zoom = this._map.getZoom();

    if (zoom > this.options.maxZoom || zoom < this.options.minZoom) {
      return;
    }

    var bounds = this._map.getBounds();
    bounds._southWest.wrap();
    bounds._northEast.wrap();

    var image = new L.ImageOverlay(this._getImageUrl(), bounds, {
      opacity: 0
    }).addTo(this._map);

    this._loading = true;

    image.on('load', function(e){
      var newImage = e.target;
      var oldImage = this._currentImage;

      if(newImage._bounds.equals(bounds)){
        this._currentImage = newImage;

        if(this.options.position === 'front'){
          this._currentImage.bringToFront();
        } else {
          this._currentImage.bringToBack();
        }

        this._currentImage.setOpacity(this.options.opacity);

        if(oldImage){
          this._map.removeLayer(oldImage);
        }

        this.fire('load', {
          bounds: bounds
        });

        this._loading = false;

      } else {
        this._map.removeLayer(newImage);
      }
    }, this);

    if(!this._loading){
      this.fire('loading', {
        bounds: bounds
      });
    }
  }
});

L.esri.dynamicMapLayer = function (url, options) {
  return new L.esri.DynamicMapLayer(url, options);
};