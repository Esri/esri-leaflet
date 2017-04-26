EsriLeaflet.Layers.RasterLayer =  L.Class.extend({
  includes: L.Mixin.Events,

  options: {
    opacity: 1,
    position: 'front',
    f: 'image'
  },

  onAdd: function (map) {
    this._map = map;

    this._update = L.Util.limitExecByInterval(this._update, this.options.updateInterval, this);

    if (map.options.crs && map.options.crs.code) {
      var sr = map.options.crs.code.split(':')[1];
      this.options.bboxSR = sr;
      this.options.imageSR = sr;
    }

    map.on('moveend', this._update, this);

    // if we had an image loaded and it matches the
    // current bounds show the image otherwise remove it
    if(this._currentImage && this._currentImage._bounds.equals(this._map.getBounds())){
      map.addLayer(this._currentImage);
    } else if(this._currentImage) {
      this._map.removeLayer(this._currentImage);
      this._currentImage = null;
    }

    this._update();

    if(this._popup){
      this._map.on('click', this._getPopupData, this);
      this._map.on('dblclick', this._resetPopupState, this);
    }
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

  onRemove: function (map) {
    if (this._currentImage) {
      this._map.removeLayer(this._currentImage);
    }

    if(this._popup){
      this._map.off('click', this._getPopupData, this);
      this._map.off('dblclick', this._resetPopupState, this);
    }

    this._map.off('moveend', this._update, this);
    this._map = null;
  },

  addTo: function(map){
    map.addLayer(this);
    return this;
  },

  removeFrom: function(map){
    map.removeLayer(this);
    return this;
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

  getAttribution: function () {
    return this.options.attribution;
  },

  getOpacity: function(){
    return this.options.opacity;
  },

  setOpacity: function(opacity){
    this.options.opacity = opacity;
    if (this._currentImage) {
      this._currentImage.setOpacity(opacity);
    }
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

  authenticate: function(token){
    this._service.authenticate(token);
    return this;
  },

  _renderImage: function(url, bounds){
    if(this._map){
      // create a new image overlay and add it to the map
      // to start loading the image
      // opacity is 0 while the image is loading
      var image = new L.ImageOverlay(url, bounds, {
        opacity: 0
      }).addTo(this._map);

      // once the image loads
      image.once('load', function(e){
        var newImage = e.target;
        var oldImage = this._currentImage;

        // if the bounds of this image matches the bounds that
        // _renderImage was called with and we have a map with the same bounds
        // hide the old image if there is one and set the opacity
        // of the new image otherwise remove the new image
        if(newImage._bounds.equals(bounds) && newImage._bounds.equals(this._map.getBounds())){
          this._currentImage = newImage;

          if(this.options.position === 'front'){
            this.bringToFront();
          } else {
            this.bringToBack();
          }

          if(this._map && this._currentImage._map){
            this._currentImage.setOpacity(this.options.opacity);
          } else {
            this._currentImage._map.removeLayer(this._currentImage);
          }

          if(oldImage && this._map) {
            this._map.removeLayer(oldImage);
          }

          if(oldImage && oldImage._map){
            oldImage._map.removeLayer(oldImage);
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
    }
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
      if (this._currentImage) {
        this._currentImage._map.removeLayer(this._currentImage);
      }
      return;
    }
    var params = this._buildExportParams();

    this._requestExport(params, bounds);
  },

  // TODO: refactor these into raster layer
  _renderPopup: function(latlng, error, results, response){
    latlng = L.latLng(latlng);
    if(this._shouldRenderPopup && this._lastClick.equals(latlng)){
      //add the popup to the map where the mouse was clicked at
      var content = this._popupFunction(error, results, response);
      if (content) {
        this._popup.setLatLng(latlng).setContent(content).openOn(this._map);
      }
    }
  },

  _resetPopupState: function(e){
    this._shouldRenderPopup = false;
    this._lastClick = e.latlng;
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
