import { CRS, DomEvent, TileLayer, Util } from 'leaflet';
import { warn, getUrlParams, setEsriAttribution, removeEsriAttribution } from '../Util';
import mapService from '../Services/MapService';

export var TiledMapLayer = TileLayer.extend({
  options: {
    zoomOffsetAllowance: 0.1,
    errorTileUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEABAMAAACuXLVVAAAAA1BMVEUzNDVszlHHAAAAAXRSTlMAQObYZgAAAAlwSFlzAAAAAAAAAAAB6mUWpAAAADZJREFUeJztwQEBAAAAgiD/r25IQAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA7waBAAABw08RwAAAAABJRU5ErkJggg=='
  },

  statics: {
    MercatorZoomLevels: {
      0: 156543.03392799999,
      1: 78271.516963999893,
      2: 39135.758482000099,
      3: 19567.879240999901,
      4: 9783.9396204999593,
      5: 4891.9698102499797,
      6: 2445.9849051249898,
      7: 1222.9924525624899,
      8: 611.49622628138002,
      9: 305.74811314055802,
      10: 152.874056570411,
      11: 76.437028285073197,
      12: 38.218514142536598,
      13: 19.109257071268299,
      14: 9.5546285356341496,
      15: 4.7773142679493699,
      16: 2.38865713397468,
      17: 1.1943285668550501,
      18: 0.59716428355981699,
      19: 0.29858214164761698,
      20: 0.14929107082381,
      21: 0.07464553541191,
      22: 0.0373227677059525,
      23: 0.0186613838529763
    }
  },

  initialize: function (options) {
    options = Util.setOptions(this, options);

    // set the urls
    options = getUrlParams(options);
    this.tileUrl = (options.proxy ? options.proxy + '?' : '') + options.url + 'tile/{z}/{y}/{x}' + (options.requestParams && Object.keys(options.requestParams).length > 0 ? Util.getParamString(options.requestParams) : '');
    // Remove subdomain in url
    // https://github.com/Esri/esri-leaflet/issues/991
    if (options.url.indexOf('{s}') !== -1 && options.subdomains) {
      options.url = options.url.replace('{s}', options.subdomains[0]);
    }
    this.service = mapService(options);
    this.service.addEventParent(this);

    var arcgisonline = new RegExp(/tiles.arcgis(online)?\.com/g);
    if (arcgisonline.test(options.url)) {
      this.tileUrl = this.tileUrl.replace('://tiles', '://tiles{s}');
      options.subdomains = ['1', '2', '3', '4'];
    }

    if (this.options.token) {
      this.tileUrl += ('?token=' + this.options.token);
    }

    // init layer by calling TileLayers initialize method
    TileLayer.prototype.initialize.call(this, this.tileUrl, options);
  },

  getTileUrl: function (tilePoint) {
    var zoom = this._getZoomForUrl();

    return Util.template(this.tileUrl, Util.extend({
      s: this._getSubdomain(tilePoint),
      x: tilePoint.x,
      y: tilePoint.y,
      // try lod map first, then just default to zoom level
      z: (this._lodMap && this._lodMap[zoom]) ? this._lodMap[zoom] : zoom
    }, this.options));
  },

  createTile: function (coords, done) {
    var tile = document.createElement('img');

    DomEvent.on(tile, 'load', Util.bind(this._tileOnLoad, this, done, tile));
    DomEvent.on(tile, 'error', Util.bind(this._tileOnError, this, done, tile));

    if (this.options.crossOrigin) {
      tile.crossOrigin = '';
    }

    /*
     Alt tag is set to empty string to keep screen readers from reading URL and for compliance reasons
     http://www.w3.org/TR/WCAG20-TECHS/H67
    */
    tile.alt = '';

    // if there is no lod map or an lod map with a proper zoom load the tile
    // otherwise wait for the lod map to become available
    if (!this._lodMap || (this._lodMap && this._lodMap[this._getZoomForUrl()])) {
      tile.src = this.getTileUrl(coords);
    } else {
      this.once('lodmap', function () {
        tile.src = this.getTileUrl(coords);
      }, this);
    }

    return tile;
  },

  onAdd: function (map) {
    // include 'Powered by Esri' in map attribution
    setEsriAttribution(map);

    if (!this._lodMap) {
      this.metadata(function (error, metadata) {
        if (!error && metadata.spatialReference) {
          var sr = metadata.spatialReference.latestWkid || metadata.spatialReference.wkid;
          // display the copyright text from the service using leaflet's attribution control
          if (!this.options.attribution && map.attributionControl && metadata.copyrightText) {
            this.options.attribution = metadata.copyrightText;
            map.attributionControl.addAttribution(this.getAttribution());
          }

          // if the service tiles were published in web mercator using conventional LODs but missing levels, we can try and remap them
          if (map.options.crs === CRS.EPSG3857 && (sr === 102100 || sr === 3857)) {
            this._lodMap = {};
            // create the zoom level data
            var arcgisLODs = metadata.tileInfo.lods;
            var correctResolutions = TiledMapLayer.MercatorZoomLevels;

            for (var i = 0; i < arcgisLODs.length; i++) {
              var arcgisLOD = arcgisLODs[i];
              for (var ci in correctResolutions) {
                var correctRes = correctResolutions[ci];

                if (this._withinPercentage(arcgisLOD.resolution, correctRes, this.options.zoomOffsetAllowance)) {
                  this._lodMap[ci] = arcgisLOD.level;
                  break;
                }
              }
            }

            this.fire('lodmap');
          } else if (map.options.crs && map.options.crs.code && (map.options.crs.code.indexOf(sr) > -1)) {
            // if the projection is WGS84, or the developer is using Proj4 to define a custom CRS, no action is required
          } else {
            // if the service was cached in a custom projection and an appropriate LOD hasn't been defined in the map, guide the developer to our Proj4 sample
            warn('L.esri.TiledMapLayer is using a non-mercator spatial reference. Support may be available through Proj4Leaflet https://developers.arcgis.com/esri-leaflet/samples/non-mercator-projection/');
          }
        }
      }, this);
    }

    TileLayer.prototype.onAdd.call(this, map);
  },

  onRemove: function (map) {
    removeEsriAttribution(map);

    TileLayer.prototype.onRemove.call(this, map);
  },

  metadata: function (callback, context) {
    this.service.metadata(callback, context);
    return this;
  },

  identify: function () {
    return this.service.identify();
  },

  find: function () {
    return this.service.find();
  },

  query: function () {
    return this.service.query();
  },

  authenticate: function (token) {
    var tokenQs = '?token=' + token;
    this.tileUrl = (this.options.token) ? this.tileUrl.replace(/\?token=(.+)/g, tokenQs) : this.tileUrl + tokenQs;
    this.options.token = token;
    this.service.authenticate(token);
    return this;
  },

  _withinPercentage: function (a, b, percentage) {
    var diff = Math.abs((a / b) - 1);
    return diff < percentage;
  }
});

export function tiledMapLayer (url, options) {
  return new TiledMapLayer(url, options);
}

export default tiledMapLayer;
