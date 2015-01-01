EsriLeaflet.Layers.TiledMapLayer = L.TileLayer.extend({
  initialize: function(url, options){
    options = options || {};
    options.url = EsriLeaflet.Util.cleanUrl(url);
    options = L.Util.setOptions(this, options);

    // set the urls
    //this.url = L.esri.Util.cleanUrl(url);
    this.tileUrl = L.esri.Util.cleanUrl(url) + 'tile/{z}/{y}/{x}';
    this._service = new L.esri.Services.MapService(options);
    this._service.on('authenticationrequired requeststart requestend requesterror requestsuccess', this._propagateEvent, this);

    //if this is looking at the AGO tiles subdomain insert the subdomain placeholder
    if(this.tileUrl.match('://tiles.arcgisonline.com')){
      this.tileUrl = this.tileUrl.replace('://tiles.arcgisonline.com', '://tiles{s}.arcgisonline.com');
      options.subdomains = ['1', '2', '3', '4'];
    }

    if(this.options.token) {
      this.tileUrl += ('?token=' + this.options.token);
    }

    // init layer by calling TileLayers initialize method
    L.TileLayer.prototype.initialize.call(this, this.tileUrl, options);
  },

  metadata: function(callback, context){
    this._service.metadata(callback, context);
    return this;
  },

  identify: function(){
    return this._service.identify();
  },

  authenticate: function(token){
    var tokenQs = '?token=' + token;
    this.tileUrl = (this.options.token) ? this.tileUrl.replace(/\?token=(.+)/g, tokenQs) : this.tileUrl + tokenQs;
    this.options.token = token;
    this._service.authenticate(token);
    return this;
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

L.esri.TiledMapLayer = L.esri.Layers.tiledMapLayer;

L.esri.Layers.tiledMapLayer = function(url, options){
  return new L.esri.Layers.TiledMapLayer(url, options);
};

L.esri.tiledMapLayer = function(url, options){
  return new L.esri.Layers.TiledMapLayer(url, options);
};