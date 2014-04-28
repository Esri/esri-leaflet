/* globals L */

L.esri.DynamicMapLayer = L.Layer.extend({
  includes: L.esri.Mixins.identifiableLayer,

  options: {
    opacity: 1,
    position: 'front',
    updateInterval: 150,
    layers: [],
    layerDefs: false
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

    L.Util.setOptions(this, options);

    if(this.options.layers.length) {
      this._layerParams.layers = 'show:' + this.options.layers.join(',');
    }

    if(this.options.layerDefs) {
      this._layerParams.layerDefs = JSON.stringify(this.options.layerDefs);
    }
  },

  onAdd: function (map) {
    this._update = L.Util.throttle(this._update, this.options.updateInterval, this);

    if (map.options.crs && map.options.crs.code) {
      var sr = map.options.crs.code.split(':')[1];
      this._layerParams.bboxSR = sr;
      this._layerParams.imageSR = sr;
    }

    this._update();
  },

  onRemove: function () {
    if (this._currentImage) {
      this._map.removeLayer(this._currentImage);
    }
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

  _getPopupData: function(e){
    this.identify(e.latlng, this._popupIdentifyParams, L.Util.bind(function(data) {
      setTimeout(L.Util.bind(function(){
        this._renderPopup(e.latlng, data);
      }, this), 300);
    }, this));

    // set the flags to show the popup
    this._shouldRenderPopup = true;
    this._lastClick = e.latlng;
  },

  _renderPopup: function(latlng, data){
    if(this._shouldRenderPopup && this._lastClick.equals(latlng)){
      //add the popup to the map where the mouse was clicked at
      this._popup.setLatLng(latlng).setContent(this._popupFunction(data)).openOn(this._map);
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

    if(this.options.token) {
      this._layerParams.token = this.options.token;
    }

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