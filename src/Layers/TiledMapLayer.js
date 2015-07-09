EsriLeaflet.Layers.TiledMapLayer = L.TileLayer.extend({
  options: {
    zoomOffsetAllowance: 0.1,
    correctZoomLevels: true
  },

  statics: {
    MercatorZoomLevels: {
      '0':156543.03392799999,
      '1':78271.516963999893,
      '2':39135.758482000099,
      '3':19567.879240999901,
      '4':9783.9396204999593,
      '5':4891.9698102499797,
      '6':2445.9849051249898,
      '7':1222.9924525624899,
      '8':611.49622628138002,
      '9':305.74811314055802,
      '10':152.874056570411,
      '11':76.437028285073197,
      '12':38.218514142536598,
      '13':19.109257071268299,
      '14':9.5546285356341496,
      '15':4.7773142679493699,
      '16':2.38865713397468,
      '17':1.1943285668550501,
      '18':0.59716428355981699,
      '19':0.29858214164761698,
      '20':0.14929107082381,
      '21':0.07464553541191,
      '22':0.0373227677059525,
      '23':0.0186613838529763
    }
  },

  initialize: function(options){
    options.url = EsriLeaflet.Util.cleanUrl(options.url);
    options = L.Util.setOptions(this, options);

    // set the urls
    //this.url = L.esri.Util.cleanUrl(url);
    this.tileUrl = L.esri.Util.cleanUrl(options.url) + 'tile/{z}/{y}/{x}';
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

  getTileUrl: function (tilePoint) {
    return L.Util.template(this.tileUrl, L.extend({
      s: this._getSubdomain(tilePoint),
      z: this._lodMap[tilePoint.z] || tilePoint.z, // try lod map first, then just defualt to zoom level
      x: tilePoint.x,
      y: tilePoint.y
    }, this.options));
  },

  onAdd: function(map){
    if (!this._lodMap && this.options.correctZoomLevels) {
      this._lodMap = {}; // make sure we always have an lod map even if its empty
      this.metadata(function(error, metadata) {
        if(!error) {
          var sr = metadata.spatialReference.latestWkid || metadata.spatialReference.wkid;

          if (sr === 102100 || sr === 3857) {
            //create the zoom level data
            var arcgisLODs = metadata.tileInfo.lods;
            var correctResolutions = EsriLeaflet.Layers.TiledMapLayer.MercatorZoomLevels;

            for(var i = 0; i < arcgisLODs.length; i++) {
              var arcgisLOD = arcgisLODs[i];
              for(var ci in correctResolutions) {
                var correctRes = correctResolutions[ci];

                if(this._withinPercentage(arcgisLOD.resolution, correctRes, this.options.zoomOffsetAllowance)) {
                  this._lodMap[ci] = arcgisLOD.level;
                  break;
                }
              }
            }
          } else {
            EsriLeaflet.Util.warn('L.esri.TiledMapLayer is using a non-mercator spatial reference. Support may be available through Proj4Leaflet http://esri.github.io/esri-leaflet/examples/non-mercator-projection.html');
          }
        }

        L.TileLayer.prototype.onAdd.call(this, map);
      }, this);
    } else {
      L.TileLayer.prototype.onAdd.call(this, map);
    }
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
  },

  _withinPercentage: function (a, b, percentage) {
    var diff = Math.abs((a/b) - 1);
    return diff < percentage;
  }
});

L.esri.TiledMapLayer = L.esri.Layers.tiledMapLayer;

L.esri.Layers.tiledMapLayer = function(options){
  return new L.esri.Layers.TiledMapLayer(options);
};

L.esri.tiledMapLayer = function(options){
  return new L.esri.Layers.TiledMapLayer(options);
};
