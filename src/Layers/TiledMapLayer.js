/* globals L */

L.esri.TiledMapLayer = L.TileLayer.extend({
  includes: L.esri.Mixins.identifiableLayer,
  initialize: function(url, options){
    options = options || {};

    //add a trailing slash to the url if the user omitted it
    if(url[url.length-1] !== "/"){
      url += "/";
    }

    // set the urls
    this.serviceUrl = url;
    this.tileUrl = url+"tile/{z}/{y}/{x}";

    //if this is looking at the AGO tiles subdomain insert the subdomain placeholder
    if(this.tileUrl.match("://tiles.arcgis.com")){
      this.tileUrl = this.tileUrl.replace("://tiles.arcgis.com", "://tiles{s}.arcgis.com");
      options.subdomains = ["1", "2", "3", "4"];
    }

    // init layer by calling TileLayers initialize method
    L.TileLayer.prototype.initialize.call(this, this.tileUrl, options);
  }
});

L.esri.tiledMapLayer = function(key, options){
  return new L.esri.TiledMapLayer(key, options);
};