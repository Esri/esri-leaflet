/* globals L */

L.esri.Layers.ImageMapLayer = L.Class.extend({

  includes: L.Mixin.Events,

  options: {
    opacity: 1,
    position: 'front',
    updateInterval: 150,
    format: 'jpgpng',
    f: 'image'
  },

  initialize: function (url, options) {
    this.url = L.esri.Util.cleanUrl(url);
    this._service = new L.esri.Services.ImageService(this.url, options);
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
    return {
      moveend: this._update
    };
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

  getOpacity: function(){
    return this.options.opacity;
  },

  setOpacity: function(opacity){
    this.options.opacity = opacity;
    this._currentImage.setOpacity(opacity);
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

  _buildExportImageParams: function () {
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

    if(this.options.from && this.options.to){
      params.time = this.options.from.valueOf() + ',' + this.options.to.valueOf();
    }

    if(this.options.pixelType){
      params.pixelType = this.options.pixelType;
    }

    if(this.options.noDataInterpretation){
      params.noDataInterpretation = this.options.noDataInterpretation;
    }

    if(this.options.interpolation){
      params.interpolation = this.options.interpolation;
    }

    if(this.options.compressionQuality){
      params.compressionQuality = this.options.compressionQuality;
    }

    if(this.options.bandIds){
      params.bandIds = this.options.bandIds;
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
    var params = this._buildExportImageParams();

    if(this.options.f === 'json'){
      this._service.get('exportImage', params, function(error, response){
        this._renderImage(response.href, bounds);
      }, this);
    } else {
      params.f = 'image';
      this._renderImage(this.url + 'exportImage' + L.Util.getParamString(params), bounds);
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

L.esri.ImageMapLayer = L.esri.Layers.ImageMapLayer;

L.esri.Layers.imageMapLayer = function(key, options){
  return new L.esri.Layers.ImageMapLayer(key, options);
};

L.esri.imageMapLayer = function(key, options){
  return new L.esri.Layers.ImageMapLayer(key, options);
};