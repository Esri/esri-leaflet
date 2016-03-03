import L from 'leaflet';
import logo from '../Controls/Logo';
import { jsonp } from '../Request';
import { pointerEvents } from '../Support';

var tileProtocol = (window.location.protocol !== 'https:') ? 'http:' : 'https:';

export var BasemapLayer = L.TileLayer.extend({
  statics: {
    TILES: {
      Streets: {
        urlTemplate: tileProtocol + '//{s}.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
        attributionUrl: 'https://static.arcgis.com/attribution/World_Street_Map',
        options: {
          hideLogo: false,
          logoPosition: 'bottomright',
          minZoom: 1,
          maxZoom: 19,
          subdomains: ['server', 'services'],
          attribution: 'Esri'
        }
      },
      Topographic: {
        urlTemplate: tileProtocol + '//{s}.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
        attributionUrl: 'https://static.arcgis.com/attribution/World_Topo_Map',
        options: {
          hideLogo: false,
          logoPosition: 'bottomright',
          minZoom: 1,
          maxZoom: 19,
          subdomains: ['server', 'services'],
          attribution: 'Esri'
        }
      },
      Oceans: {
        urlTemplate: tileProtocol + '//{s}.arcgisonline.com/arcgis/rest/services/Ocean/World_Ocean_Base/MapServer/tile/{z}/{y}/{x}',
        attributionUrl: 'https://static.arcgis.com/attribution/Ocean_Basemap',
        options: {
          hideLogo: false,
          logoPosition: 'bottomright',
          minZoom: 1,
          maxZoom: 16,
          subdomains: ['server', 'services'],
          attribution: 'Esri'
        }
      },
      OceansLabels: {
        urlTemplate: tileProtocol + '//{s}.arcgisonline.com/arcgis/rest/services/Ocean/World_Ocean_Reference/MapServer/tile/{z}/{y}/{x}',
        options: {
          hideLogo: true,
          logoPosition: 'bottomright',
          minZoom: 1,
          maxZoom: 16,
          subdomains: ['server', 'services'],
          pane: (pointerEvents) ? 'esri-labels' : 'tilePane'
        }
      },
      NationalGeographic: {
        urlTemplate: tileProtocol + '//{s}.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}',
        options: {
          hideLogo: false,
          logoPosition: 'bottomright',
          minZoom: 1,
          maxZoom: 16,
          subdomains: ['server', 'services'],
          attribution: 'National Geographic, Esri, DeLorme, HERE, UNEP-WCMC, USGS, NASA, ESA, METI, NRCAN, GEBCO, NOAA, increment P Corp.'
        }
      },
      DarkGray: {
        urlTemplate: tileProtocol + '//{s}.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}',
        options: {
          hideLogo: false,
          logoPosition: 'bottomright',
          minZoom: 1,
          maxZoom: 16,
          subdomains: ['server', 'services'],
          attribution: 'Esri, HERE, DeLorme, MapmyIndia, © OpenStreetMap contributors'
        }
      },
      DarkGrayLabels: {
        urlTemplate: tileProtocol + '//{s}.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}',
        options: {
          hideLogo: true,
          logoPosition: 'bottomright',
          minZoom: 1,
          maxZoom: 16,
          subdomains: ['server', 'services'],
          pane: (pointerEvents) ? 'esri-labels' : 'tilePane'

        }
      },
      Gray: {
        urlTemplate: tileProtocol + '//{s}.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}',
        options: {
          hideLogo: false,
          logoPosition: 'bottomright',
          minZoom: 1,
          maxZoom: 16,
          subdomains: ['server', 'services'],
          attribution: 'Esri, HERE, DeLorme, MapmyIndia, © OpenStreetMap contributors'
        }
      },
      GrayLabels: {
        urlTemplate: tileProtocol + '//{s}.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Reference/MapServer/tile/{z}/{y}/{x}',
        options: {
          hideLogo: true,
          logoPosition: 'bottomright',
          minZoom: 1,
          maxZoom: 16,
          subdomains: ['server', 'services'],
          pane: (pointerEvents) ? 'esri-labels' : 'tilePane'
        }
      },
      Imagery: {
        urlTemplate: tileProtocol + '//{s}.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        options: {
          hideLogo: false,
          logoPosition: 'bottomright',
          minZoom: 1,
          maxZoom: 19,
          subdomains: ['server', 'services'],
          attribution: 'Esri, DigitalGlobe, GeoEye, i-cubed, USDA, USGS, AEX, Getmapping, Aerogrid, IGN, IGP, swisstopo, and the GIS User Community'
        }
      },
      ImageryLabels: {
        urlTemplate: tileProtocol + '//{s}.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}',
        options: {
          hideLogo: true,
          logoPosition: 'bottomright',
          minZoom: 1,
          maxZoom: 19,
          subdomains: ['server', 'services'],
          pane: (pointerEvents) ? 'esri-labels' : 'tilePane'
        }
      },
      ImageryTransportation: {
        urlTemplate: tileProtocol + '//{s}.arcgisonline.com/ArcGIS/rest/services/Reference/World_Transportation/MapServer/tile/{z}/{y}/{x}',
        options: {
          hideLogo: true,
          logoPosition: 'bottomright',
          minZoom: 1,
          maxZoom: 19,
          subdomains: ['server', 'services'],
          pane: (pointerEvents) ? 'esri-labels' : 'tilePane'
        }
      },
      ShadedRelief: {
        urlTemplate: tileProtocol + '//{s}.arcgisonline.com/ArcGIS/rest/services/World_Shaded_Relief/MapServer/tile/{z}/{y}/{x}',
        options: {
          hideLogo: false,
          logoPosition: 'bottomright',
          minZoom: 1,
          maxZoom: 13,
          subdomains: ['server', 'services'],
          attribution: 'Esri, USGS'
        }
      },
      ShadedReliefLabels: {
        urlTemplate: tileProtocol + '//{s}.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places_Alternate/MapServer/tile/{z}/{y}/{x}',
        options: {
          hideLogo: true,
          logoPosition: 'bottomright',
          minZoom: 1,
          maxZoom: 12,
          subdomains: ['server', 'services'],
          pane: (pointerEvents) ? 'esri-labels' : 'tilePane'
        }
      },
      Terrain: {
        urlTemplate: tileProtocol + '//{s}.arcgisonline.com/ArcGIS/rest/services/World_Terrain_Base/MapServer/tile/{z}/{y}/{x}',
        options: {
          hideLogo: false,
          logoPosition: 'bottomright',
          minZoom: 1,
          maxZoom: 13,
          subdomains: ['server', 'services'],
          attribution: 'Esri, USGS, NOAA'
        }
      },
      TerrainLabels: {
        urlTemplate: tileProtocol + '//{s}.arcgisonline.com/ArcGIS/rest/services/Reference/World_Reference_Overlay/MapServer/tile/{z}/{y}/{x}',
        options: {
          hideLogo: true,
          logoPosition: 'bottomright',
          minZoom: 1,
          maxZoom: 13,
          subdomains: ['server', 'services'],
          pane: (pointerEvents) ? 'esri-labels' : 'tilePane'
        }
      },
      USATopo: {
        urlTemplate: tileProtocol + '//{s}.arcgisonline.com/ArcGIS/rest/services/USA_Topo_Maps/MapServer/tile/{z}/{y}/{x}',
        options: {
          hideLogo: false,
          logoPosition: 'bottomright',
          minZoom: 1,
          maxZoom: 15,
          subdomains: ['server', 'services'],
          attribution: 'National Geographic Society, i-cubed'
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
      throw new Error('L.esri.BasemapLayer: Invalid parameter. Use one of "Streets", "Topographic", "Oceans", "OceansLabels", "NationalGeographic", "Gray", "GrayLabels", "DarkGray", "DarkGrayLabels", "Imagery", "ImageryLabels", "ImageryTransportation", "ShadedRelief", "ShadedReliefLabels", "Terrain" or "TerrainLabels"');
    }

    // merge passed options into the config options
    var tileOptions = L.Util.extend(config.options, options);

    L.Util.setOptions(this, tileOptions);

    // call the initialize method on L.TileLayer to set everything up
    L.TileLayer.prototype.initialize.call(this, config.urlTemplate, tileOptions);

    // if this basemap requires dynamic attribution set it up
    if (config.attributionUrl) {
      this._getAttributionData(config.attributionUrl);
    }

    this._logo = logo({
      position: this.options.logoPosition
    });
  },

  onAdd: function (map) {
    if (!this.options.hideLogo && !map._hasEsriLogo) {
      this._logo.addTo(map);
      map._hasEsriLogo = true;
    }

    if (this.options.pane === 'esri-labels') {
      this._initPane();
    }

    map.on('moveend', this._updateMapAttribution, this);

    L.TileLayer.prototype.onAdd.call(this, map);
  },

  onRemove: function (map) {
    // check to make sure the logo hasn't already been removed
    if (this._logo && this._logo._container) {
      map.removeControl(this._logo);
      map._hasEsriLogo = false;
    }

    map.off('moveend', this._updateMapAttribution, this);

    L.TileLayer.prototype.onRemove.call(this, map);
  },

  getAttribution: function () {
    if (this.options.attribution) {
      var attribution = '<span class="esri-attributions" style="line-height:14px; vertical-align: -3px; text-overflow:ellipsis; white-space:nowrap; overflow:hidden; display:inline-block;">' + this.options.attribution + '</span>';
    }
    return attribution;
  },

  _initPane: function () {
    if (!this._map.getPane(this.options.pane)) {
      var pane = this._map.createPane(this.options.pane);
      pane.style.pointerEvents = 'none';
      pane.style.zIndex = 500;
    }
  },

  _getAttributionData: function (url) {
    jsonp(url, {}, L.Util.bind(function (error, attributions) {
      if (error) { return; }
      this._attributions = [];

      for (var c = 0; c < attributions.contributors.length; c++) {
        var contributor = attributions.contributors[c];
        for (var i = 0; i < contributor.coverageAreas.length; i++) {
          var coverageArea = contributor.coverageAreas[i];
          var southWest = L.latLng(coverageArea.bbox[0], coverageArea.bbox[1]);
          var northEast = L.latLng(coverageArea.bbox[2], coverageArea.bbox[3]);
          this._attributions.push({
            attribution: contributor.attribution,
            score: coverageArea.score,
            bounds: L.latLngBounds(southWest, northEast),
            minZoom: coverageArea.zoomMin,
            maxZoom: coverageArea.zoomMax
          });
        }
      }

      this._attributions.sort(function (a, b) {
        return b.score - a.score;
      });

      this._updateMapAttribution();
    }, this));
  },

  _updateMapAttribution: function () {
    if (this._map && this._map.attributionControl && this._attributions) {
      var newAttributions = '';
      var bounds = this._map.getBounds();
      var zoom = this._map.getZoom();

      for (var i = 0; i < this._attributions.length; i++) {
        var attribution = this._attributions[i];
        var text = attribution.attribution;
        if (!newAttributions.match(text) && bounds.intersects(attribution.bounds) && zoom >= attribution.minZoom && zoom <= attribution.maxZoom) {
          newAttributions += (', ' + text);
        }
      }
      newAttributions = newAttributions.substr(2);
      var attributionElement = this._map.attributionControl._container.querySelector('.esri-attributions');

      attributionElement.innerHTML = newAttributions;
      attributionElement.style.maxWidth = (this._map.getSize().x * 0.65) + 'px';

      this.fire('attributionupdated', {
        attribution: newAttributions
      });
    }
  }
});

export function basemapLayer (key, options) {
  return new BasemapLayer(key, options);
}

export default basemapLayer;
