/* globals L */

L.esri.Layers.TiledMapLayer = L.TileLayer.extend({
  initialize: function(url, options){
    options = L.Util.setOptions(this, options);

    // set the urls
    this.url = L.esri.Util.cleanUrl(url);
    this.tileUrl = L.esri.Util.cleanUrl(url) + 'tile/{z}/{y}/{x}';
    this._service = new L.esri.Services.MapService(this.url, options);

    //if this is looking at the AGO tiles subdomain insert the subdomain placeholder
    this.tileUrl.match('://services[0-9]?.arcgis.com');
    if(this.tileUrl.match('://tiles.arcgis.com')){
      this.tileUrl = this.tileUrl.replace('://tiles.arcgis.com', '://tiles{s}.arcgis.com');
      options.subdomains = ['1', '2', '3', '4'];
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

  query: function(){
    return this._service.query();
  },

  authenticate: function(token){
    this._service.authenticate(token);
    return this;
  }
});

L.esri.TiledMapLayer = L.esri.Layers.tiledMapLayer;

L.esri.Layers.tiledMapLayer = function(key, options){
  return new L.esri.Layers.TiledMapLayer(key, options);
};

L.esri.tiledMapLayer = function(key, options){
  return new L.esri.Layers.TiledMapLayer(key, options);
};