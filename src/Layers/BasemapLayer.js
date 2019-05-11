import { TileLayer, Util } from 'leaflet';
import { pointerEvents } from '../Support';
import {
  setEsriAttribution,
  _getAttributionData,
  _updateMapAttribution
} from '../Util';

var tileProtocol = (window.location.protocol !== 'https:') ? 'http:' : 'https:';

export var BasemapLayer = TileLayer.extend({
  statics: {
    TILES: {
      Streets: {
        urlTemplate: tileProtocol + '//{s}.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
        options: {
          minZoom: 1,
          maxZoom: 19,
          subdomains: ['server', 'services'],
          attribution: 'USGS, NOAA',
          attributionUrl: 'https://static.arcgis.com/attribution/World_Street_Map'
        }
      },
      Topographic: {
        urlTemplate: tileProtocol + '//{s}.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
        options: {
          minZoom: 1,
          maxZoom: 19,
          subdomains: ['server', 'services'],
          attribution: 'USGS, NOAA',
          attributionUrl: 'https://static.arcgis.com/attribution/World_Topo_Map'
        }
      },
      Oceans: {
        urlTemplate: tileProtocol + '//{s}.arcgisonline.com/arcgis/rest/services/Ocean/World_Ocean_Base/MapServer/tile/{z}/{y}/{x}',
        options: {
          minZoom: 1,
          maxZoom: 16,
          subdomains: ['server', 'services'],
          attribution: 'USGS, NOAA',
          attributionUrl: 'https://static.arcgis.com/attribution/Ocean_Basemap'
        }
      },
      OceansLabels: {
        urlTemplate: tileProtocol + '//{s}.arcgisonline.com/arcgis/rest/services/Ocean/World_Ocean_Reference/MapServer/tile/{z}/{y}/{x}',
        options: {
          minZoom: 1,
          maxZoom: 16,
          subdomains: ['server', 'services'],
          pane: (pointerEvents) ? 'esri-labels' : 'tilePane',
          attribution: ''
        }
      },
      NationalGeographic: {
        urlTemplate: tileProtocol + '//{s}.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}',
        options: {
          minZoom: 1,
          maxZoom: 16,
          subdomains: ['server', 'services'],
          attribution: 'National Geographic, DeLorme, HERE, UNEP-WCMC, USGS, NASA, ESA, METI, NRCAN, GEBCO, NOAA, increment P Corp.'
        }
      },
      DarkGray: {
        urlTemplate: tileProtocol + '//{s}.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}',
        options: {
          minZoom: 1,
          maxZoom: 16,
          subdomains: ['server', 'services'],
          attribution: 'HERE, DeLorme, MapmyIndia, &copy; OpenStreetMap contributors'
        }
      },
      DarkGrayLabels: {
        urlTemplate: tileProtocol + '//{s}.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}',
        options: {
          minZoom: 1,
          maxZoom: 16,
          subdomains: ['server', 'services'],
          pane: (pointerEvents) ? 'esri-labels' : 'tilePane',
          attribution: ''

        }
      },
      Gray: {
        urlTemplate: tileProtocol + '//{s}.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}',
        options: {
          minZoom: 1,
          maxZoom: 16,
          subdomains: ['server', 'services'],
          attribution: 'HERE, DeLorme, MapmyIndia, &copy; OpenStreetMap contributors'
        }
      },
      GrayLabels: {
        urlTemplate: tileProtocol + '//{s}.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Reference/MapServer/tile/{z}/{y}/{x}',
        options: {
          minZoom: 1,
          maxZoom: 16,
          subdomains: ['server', 'services'],
          pane: (pointerEvents) ? 'esri-labels' : 'tilePane',
          attribution: ''
        }
      },
      Imagery: {
        urlTemplate: tileProtocol + '//{s}.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        options: {
          minZoom: 1,
          maxZoom: 22,
          maxNativeZoom: 22,
          downsampled: false,
          subdomains: ['server', 'services'],
          attribution: 'DigitalGlobe, GeoEye, i-cubed, USDA, USGS, AEX, Getmapping, Aerogrid, IGN, IGP, swisstopo, and the GIS User Community',
          attributionUrl: 'https://static.arcgis.com/attribution/World_Imagery'
        }
      },
      ImageryLabels: {
        urlTemplate: tileProtocol + '//{s}.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}',
        options: {
          minZoom: 1,
          maxZoom: 19,
          subdomains: ['server', 'services'],
          pane: (pointerEvents) ? 'esri-labels' : 'tilePane',
          attribution: ''
        }
      },
      ImageryTransportation: {
        urlTemplate: tileProtocol + '//{s}.arcgisonline.com/ArcGIS/rest/services/Reference/World_Transportation/MapServer/tile/{z}/{y}/{x}',
        options: {
          minZoom: 1,
          maxZoom: 19,
          subdomains: ['server', 'services'],
          pane: (pointerEvents) ? 'esri-labels' : 'tilePane',
          attribution: ''
        }
      },
      ShadedRelief: {
        urlTemplate: tileProtocol + '//{s}.arcgisonline.com/ArcGIS/rest/services/World_Shaded_Relief/MapServer/tile/{z}/{y}/{x}',
        options: {
          minZoom: 1,
          maxZoom: 13,
          subdomains: ['server', 'services'],
          attribution: 'USGS'
        }
      },
      ShadedReliefLabels: {
        urlTemplate: tileProtocol + '//{s}.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places_Alternate/MapServer/tile/{z}/{y}/{x}',
        options: {
          minZoom: 1,
          maxZoom: 12,
          subdomains: ['server', 'services'],
          pane: (pointerEvents) ? 'esri-labels' : 'tilePane',
          attribution: ''
        }
      },
      Terrain: {
        urlTemplate: tileProtocol + '//{s}.arcgisonline.com/ArcGIS/rest/services/World_Terrain_Base/MapServer/tile/{z}/{y}/{x}',
        options: {
          minZoom: 1,
          maxZoom: 13,
          subdomains: ['server', 'services'],
          attribution: 'USGS, NOAA'
        }
      },
      TerrainLabels: {
        urlTemplate: tileProtocol + '//{s}.arcgisonline.com/ArcGIS/rest/services/Reference/World_Reference_Overlay/MapServer/tile/{z}/{y}/{x}',
        options: {
          minZoom: 1,
          maxZoom: 13,
          subdomains: ['server', 'services'],
          pane: (pointerEvents) ? 'esri-labels' : 'tilePane',
          attribution: ''
        }
      },
      USATopo: {
        urlTemplate: tileProtocol + '//{s}.arcgisonline.com/ArcGIS/rest/services/USA_Topo_Maps/MapServer/tile/{z}/{y}/{x}',
        options: {
          minZoom: 1,
          maxZoom: 15,
          subdomains: ['server', 'services'],
          attribution: 'USGS, National Geographic Society, i-cubed'
        }
      },
      ImageryClarity: {
        urlTemplate: tileProtocol + '//clarity.maptiles.arcgis.com/arcgis/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        options: {
          minZoom: 1,
          maxZoom: 19,
          attribution: 'Esri, DigitalGlobe, GeoEye, Earthstar Geographics, CNES/Airbus DS, USDA, USGS, AeroGRID, IGN, and the GIS User Community'
        }
      },
      Physical: {
        urlTemplate: tileProtocol + '//{s}.arcgisonline.com/arcgis/rest/services/World_Physical_Map/MapServer/tile/{z}/{y}/{x}',
        options: {
          minZoom: 1,
          maxZoom: 8,
          subdomains: ['server', 'services'],
          attribution: 'U.S. National Park Service'
        }
      },
      ImageryFirefly: {
        urlTemplate: tileProtocol + '//fly.maptiles.arcgis.com/arcgis/rest/services/World_Imagery_Firefly/MapServer/tile/{z}/{y}/{x}',
        options: {
          minZoom: 1,
          maxZoom: 19,
          attribution: 'Esri, DigitalGlobe, GeoEye, Earthstar Geographics, CNES/Airbus DS, USDA, USGS, AeroGRID, IGN, and the GIS User Community',
          attributionUrl: 'https://static.arcgis.com/attribution/World_Imagery'
        }
      }
    }
  },

  initialize: function (key, options) {
    var config;

    // set the config variable with the appropriate config object
    if (typeof key === 'object' && key.urlTemplate && key.options) {
      config = key;
    } else if (typeof key === 'string' && BasemapLayer.TILES[key]) {
      config = BasemapLayer.TILES[key];
    } else {
      throw new Error('L.esri.BasemapLayer: Invalid parameter. Use one of "Streets", "Topographic", "Oceans", "OceansLabels", "NationalGeographic", "Physical", "Gray", "GrayLabels", "DarkGray", "DarkGrayLabels", "Imagery", "ImageryLabels", "ImageryTransportation", "ImageryClarity", "ImageryFirefly", ShadedRelief", "ShadedReliefLabels", "Terrain", "TerrainLabels" or "USATopo"');
    }

    // merge passed options into the config options
    var tileOptions = Util.extend(config.options, options);

    Util.setOptions(this, tileOptions);

    if (this.options.token && config.urlTemplate.indexOf('token=') === -1) {
      config.urlTemplate += ('?token=' + this.options.token);
    }
    if (this.options.proxy) {
      config.urlTemplate = this.options.proxy + '?' + config.urlTemplate;
    }

    // call the initialize method on L.TileLayer to set everything up
    TileLayer.prototype.initialize.call(this, config.urlTemplate, tileOptions);
  },

  onAdd: function (map) {
    // include 'Powered by Esri' in map attribution
    setEsriAttribution(map);

    if (this.options.pane === 'esri-labels') {
      this._initPane();
    }
    // some basemaps can supply dynamic attribution
    if (this.options.attributionUrl) {
      _getAttributionData((this.options.proxy ? this.options.proxy + '?' : '') + this.options.attributionUrl, map);
    }

    map.on('moveend', _updateMapAttribution);

    // Esri World Imagery is cached all the way to zoom 22 in select regions
    if (this._url.indexOf('World_Imagery') !== -1) {
      map.on('zoomanim', _fetchTilemap, this);
    }

    TileLayer.prototype.onAdd.call(this, map);
  },

  onRemove: function (map) {
    map.off('moveend', _updateMapAttribution);
    TileLayer.prototype.onRemove.call(this, map);
  },

  _initPane: function () {
    if (!this._map.getPane(this.options.pane)) {
      var pane = this._map.createPane(this.options.pane);
      pane.style.pointerEvents = 'none';
      pane.style.zIndex = 500;
    }
  },

  getAttribution: function () {
    if (this.options.attribution) {
      var attribution = '<span class="esri-dynamic-attribution">' + this.options.attribution + '</span>';
    }
    return attribution;
  }
});

function _fetchTilemap (evt) {
  var map = evt.target;
  if (!map) { return; }

  var oldZoom = map.getZoom();
  var newZoom = evt.zoom;
  var newCenter = map.wrapLatLng(evt.center);

  if (newZoom > oldZoom && newZoom > 13 && !this.options.downsampled) {
    // convert wrapped lat/long into tile coordinates and use them to generate the tilemap url
    var tilePoint = map.project(newCenter, newZoom).divideBy(256).floor();

    // use new coords to determine the tilemap url
    var tileUrl = Util.template(this._url, Util.extend({
      s: this._getSubdomain(tilePoint),
      x: tilePoint.x,
      y: tilePoint.y,
      z: newZoom
    }, this.options));

    // 8x8 grids are cached
    var tilemapUrl = tileUrl.replace(/tile/, 'tilemap') + '/8/8';

    // an array of booleans in the response indicate missing tiles
    L.esri.request(tilemapUrl, {}, function (err, response) {
      if (!err) {
        for (var i = 0; i < response.data.length; i++) {
          if (!response.data[i]) {
            // if necessary, resample a lower zoom
            this.options.maxNativeZoom = newZoom - 1;
            this.options.downsampled = true;
            break;
          }
          // if no tiles are missing, reset the original maxZoom
          this.options.maxNativeZoom = 22;
        }
      }
    }, this);
  } else if (newZoom < 13) {
    // if the user moves to a new region, time for a fresh test
    this.options.downsampled = false;
  }
}

export function basemapLayer (key, options) {
  return new BasemapLayer(key, options);
}

export default basemapLayer;
