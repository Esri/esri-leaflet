(function(EsriLeaflet){

  var tileProtocol = (window.location.protocol !== 'https:') ? 'http:' : 'https:';

  EsriLeaflet.Layers.BasemapLayer = L.TileLayer.extend({
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
            //pane: 'esri-label',
            minZoom: 1,
            maxZoom: 16,
            subdomains: ['server', 'services']
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
            attribution: 'Esri'
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
            attribution: 'Esri, DeLorme, HERE'
          }
        },
        DarkGrayLabels: {
          urlTemplate: tileProtocol + '//{s}.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}',
          options: {
            hideLogo: true,
            logoPosition: 'bottomright',
            //pane: 'esri-label',
            minZoom: 1,
            maxZoom: 16,
            subdomains: ['server', 'services']
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
            attribution: 'Esri, NAVTEQ, DeLorme'
          }
        },
        GrayLabels: {
          urlTemplate: tileProtocol + '//{s}.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Reference/MapServer/tile/{z}/{y}/{x}',
          options: {
            hideLogo: true,
            logoPosition: 'bottomright',
            //pane: 'esri-label',
            minZoom: 1,
            maxZoom: 16,
            subdomains: ['server', 'services']
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
            //pane: 'esri-label',
            minZoom: 1,
            maxZoom: 19,
            subdomains: ['server', 'services']
          }
        },
        ImageryTransportation: {
          urlTemplate: tileProtocol + '//{s}.arcgisonline.com/ArcGIS/rest/services/Reference/World_Transportation/MapServer/tile/{z}/{y}/{x}',
          //pane: 'esri-label',
          options: {
            hideLogo: true,
            logoPosition: 'bottomright',
            minZoom: 1,
            maxZoom: 19,
            subdomains: ['server', 'services']
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
            attribution: 'Esri, NAVTEQ, DeLorme'
          }
        },
        ShadedReliefLabels: {
          urlTemplate: tileProtocol + '//{s}.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places_Alternate/MapServer/tile/{z}/{y}/{x}',
          options: {
            hideLogo: true,
            logoPosition: 'bottomright',
            //pane: 'esri-label',
            minZoom: 1,
            maxZoom: 12,
            subdomains: ['server', 'services']
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
            //pane: 'esri-label',
            minZoom: 1,
            maxZoom: 13,
            subdomains: ['server', 'services']
          }
        }
      }
    },
    initialize: function(key, options){
      var config;

      // set the config variable with the appropriate config object
      if (typeof key === 'object' && key.urlTemplate && key.options){
        config = key;
      } else if(typeof key === 'string' && EsriLeaflet.BasemapLayer.TILES[key]){
        config = EsriLeaflet.BasemapLayer.TILES[key];
      } else {
        throw new Error('L.esri.BasemapLayer: Invalid parameter. Use one of "Streets", "Topographic", "Oceans", "OceansLabels", "NationalGeographic", "Gray", "GrayLabels", "DarkGray", "DarkGrayLabels", "Imagery", "ImageryLabels", "ImageryTransportation", "ShadedRelief", "ShadedReliefLabels", "Terrain" or "TerrainLabels"');
      }

      // merge passed options into the config options
      var tileOptions = L.Util.extend(config.options, options);

      // call the initialize method on L.TileLayer to set everything up
      L.TileLayer.prototype.initialize.call(this, config.urlTemplate, L.Util.setOptions(this, tileOptions));

      // if this basemap requires dynamic attribution set it up
      if(config.attributionUrl){
        this._getAttributionData(config.attributionUrl);
      }
      this._logo = new EsriLeaflet.Controls.Logo({
        position: this.options.logoPosition
      });
    },
    onAdd: function(map){
      if(!this.options.hideLogo && !map._hasEsriLogo){
        this._logo.addTo(map);
        map._hasEsriLogo = true;
      }

      // if(this.options.pane && EsriLeaflet.Support.pointerEvents){
      //   this._initPane();
      // }

      L.TileLayer.prototype.onAdd.call(this, map);

      map.on('moveend', this._updateMapAttribution, this);
    },
    onRemove: function(map){
      // check to make sure the logo hasn't already been removed
      if(!map._hasEsriLogo && this._logo && this._logo._container){
        map.removeControl(this._logo);
        map._hasEsriLogo = false;
      }

      L.TileLayer.prototype.onRemove.call(this, map);

      map.off('moveend', this._updateMapAttribution, this);
    },
    getAttribution:function(){
      var attribution = '<span class="esri-attributions" style="line-height:14px; vertical-align: -3px; text-overflow:ellipsis; white-space:nowrap; overflow:hidden; display:inline-block;">' + this.options.attribution + '</span>'/* + logo*/;
      return attribution;
    },
    // _initPane: function(){
    //   if(!this._map.getPane(this.options.pane)){
    //     var pane = this._map.createPane(this.options.pane);
    //     pane.style.pointerEvents = 'none';
    //     pane.style.zIndex = 5;
    //   }
    // },
    _getAttributionData: function(url){
      L.esri.Request.get.JSONP(url, {}, L.Util.bind(function(error, attributions){
        this._attributions = [];

        for (var c = 0; c < attributions.contributors.length; c++) {
          var contributor = attributions.contributors[c];
          for (var i = 0; i < contributor.coverageAreas.length; i++) {
            var coverageArea = contributor.coverageAreas[i];
            var southWest = new L.LatLng(coverageArea.bbox[0], coverageArea.bbox[1]);
            var northEast = new L.LatLng(coverageArea.bbox[2], coverageArea.bbox[3]);
            this._attributions.push({
              attribution: contributor.attribution,
              score: coverageArea.score,
              bounds: new L.LatLngBounds(southWest, northEast),
              minZoom: coverageArea.zoomMin,
              maxZoom: coverageArea.zoomMax
            });
          }
        }

        this._attributions.sort(function(a, b){
          return b.score - a.score;
        });

        this._updateMapAttribution();
      }, this));
    },
    _updateMapAttribution: function(){
      if(this._map && this._map.attributionControl && this._attributions){
        var newAttributions = '';
        var bounds = this._map.getBounds();
        var zoom = this._map.getZoom();

        for (var i = 0; i < this._attributions.length; i++) {
          var attribution = this._attributions[i];
          var text = attribution.attribution;
          if(!newAttributions.match(text) && bounds.intersects(attribution.bounds) && zoom >= attribution.minZoom && zoom <= attribution.maxZoom) {
            newAttributions += (', ' + text);
          }
        }
        newAttributions = newAttributions.substr(2);
        var attributionElement = this._map.attributionControl._container.querySelector('.esri-attributions');
        attributionElement.innerHTML = newAttributions;
        attributionElement.style.maxWidth =  (this._map.getSize().x * 0.65) + 'px';
        this.fire('attributionupdated', {
          attribution: newAttributions
        });
      }
    }
  });

  EsriLeaflet.BasemapLayer = EsriLeaflet.Layers.BasemapLayer;

  EsriLeaflet.Layers.basemapLayer = function(key, options){
    return new EsriLeaflet.Layers.BasemapLayer(key, options);
  };

  EsriLeaflet.basemapLayer = function(key, options){
    return new EsriLeaflet.Layers.BasemapLayer(key, options);
  };

})(EsriLeaflet);