/* globals L */

L.esri.TiledMapLayer = L.TileLayer.extend({
  includes: L.esri.Mixins.identifiableLayer,
  initialize: function(url, options){
    options = options || {};

    // set the urls
    this.url = L.esri.Util.cleanUrl(url);
    this.tileUrl = L.esri.Util.cleanUrl(url) + "tile/{z}/{y}/{x}";

    //if this is looking at the AGO tiles subdomain insert the subdomain placeholder
    if(this.tileUrl.match("://tiles.arcgis.com")){
      this.tileUrl = this.tileUrl.replace("://tiles.arcgis.com", "://tiles{s}.arcgis.com");
      options.subdomains = ["1", "2", "3", "4"];
    }

    L.Util.setOptions(this, options);

    this._getMetadata();

    // init layer by calling TileLayers initialize method
    L.TileLayer.prototype.initialize.call(this, this.tileUrl, options);
  }
});

L.esri.TiledMapLayer.include(L.esri.Mixins.metadata);

L.esri.tiledMapLayer = function(key, options){
  return new L.esri.TiledMapLayer(key, options);
};