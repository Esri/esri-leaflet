(function(L){

  var tileProtocol = (window.location.protocol !== "https:") ? "http:" : "https:";
  var attributionStyles = "line-height:9px; text-overflow:ellipsis; white-space:nowrap;overflow:hidden; display:inline-block;";
  var logoStyles = "position:absolute; top:-38px; right:2px;";
  var attributionLogo = "<img src='https://serverapi.arcgisonline.com/jsapi/arcgis/3.5/js/esri/images/map/logo-med.png' alt='Powered by Esri' class='esri-attribution-logo' style='"+logoStyles+"'>";
  var formatTextAttributions = function formatTextAttributions(text){
    return "<span class='esri-attributions' style='"+attributionStyles+"'>" + text + "</span>";
  };

  L.esri.BasemapLayer = L.TileLayer.extend({
    statics: {
      TILES: {
        Streets: {
          urlTemplate: tileProtocol + "//{s}.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}/",
          attributionUrl: "https://static.arcgis.com/attribution/World_Street_Map?f=json",
          options: {
            minZoom: 1,
            maxZoom: 19,
            subdomains: ["server", "services"],
            attribution: formatTextAttributions("Esri") + attributionLogo
          }
        },
        Topographic: {
          urlTemplate: tileProtocol + "//{s}.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}/",
          attributionUrl: "https://static.arcgis.com/attribution/World_Topo_Map?f=json",
          options: {
            minZoom: 1,
            maxZoom: 19,
            subdomains: ["server", "services"],
            attribution: formatTextAttributions("Esri") + attributionLogo
          }
        },
        Oceans: {
          urlTemplate: "https://server.arcgisonline.com/ArcGIS/rest/services/Ocean_Basemap/MapServer/tile/{z}/{y}/{x}/",
          attributionUrl: "https://static.arcgis.com/attribution/Ocean_Basemap?f=json",
          options: {
            minZoom: 1,
            maxZoom: 16,
            subdomains: ["server", "services"],
            attribution: formatTextAttributions("Esri") + attributionLogo
          }
        },
        NationalGeographic: {
          urlTemplate: "https://server.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}/",
          options: {
            minZoom: 1,
            maxZoom: 16,
            subdomains: ["server", "services"],
            attribution: formatTextAttributions("Esri") + attributionLogo
          }
        },
        Gray: {
          urlTemplate: tileProtocol + "//{s}.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}/",
          options: {
            minZoom: 1,
            maxZoom: 16,
            subdomains: ["server", "services"],
            attribution: formatTextAttributions("Esri, NAVTEQ, DeLorme") + attributionLogo
          }
        },
        GrayLabels: {
          urlTemplate: tileProtocol + "//{s}.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Reference/MapServer/tile/{z}/{y}/{x}/",
          options: {
            minZoom: 1,
            maxZoom: 16,
            subdomains: ["server", "services"]
          }
        },
        Imagery: {
          urlTemplate: tileProtocol + "//{s}.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}/",
          options: {
            minZoom: 1,
            maxZoom: 19,
            subdomains: ["server", "services"],
            attribution: formatTextAttributions("Esri, DigitalGlobe, GeoEye, i-cubed, USDA, USGS, AEX, Getmapping, Aerogrid, IGN, IGP, swisstopo, and the GIS User Community") + attributionLogo
          }
        },
        ImageryLabels: {
          urlTemplate: tileProtocol + "//{s}.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}/",
          options: {
            minZoom: 1,
            maxZoom: 19,
            subdomains: ["server", "services"]
          }
        },
        ImageryTransportation: {
          urlTemplate: tileProtocol + "//{s}.arcgisonline.com/ArcGIS/rest/services/Reference/World_Transportation/MapServer/tile/{z}/{y}/{x}/",
          options: {
            minZoom: 1,
            maxZoom: 19,
            subdomains: ["server", "services"]
          }
        },
        ImageryAlternateLabels: {
          urlTemplate: tileProtocol + "//{s}.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places_Alternate/MapServer/tile/{z}/{y}/{x}/",
          options: {
            minZoom: 1,
            maxZoom: 12,
            subdomains: ["server", "services"]
          }
        },
        ShadedRelief: {
          urlTemplate: tileProtocol + "//{s}.arcgisonline.com/ArcGIS/rest/services/World_Shaded_Relief/MapServer/tile/{z}/{y}/{x}/",
          options: {
            minZoom: 1,
            maxZoom: 13,
            subdomains: ["server", "services"],
            attribution: formatTextAttributions("ESRI, NAVTEQ, DeLorme") + attributionLogo
          }
        }

      }
    },
    initialize: function(key, options){
      var config;
      // set the config variable with the appropriate config object
      if (typeof key === "object" && key.urlTemplate && key.options){
        config = key;
      } else if(typeof key === "string" && L.esri.BasemapLayer.TILES[key]){
        config = L.esri.BasemapLayer.TILES[key];
      } else {
        throw new Error("L.esri.BasemapLayer: Invalid parameter. Use one of 'Streets', 'Topographic', 'Oceans', 'NationalGeographic', 'Gray', 'GrayLabels', 'Imagery', 'ImageryLabels', 'ImageryTransportation', 'ImageryAlternateLabels' or 'ShadedRelief'");
      }

      // merge passed options into the config options
      var mergedOptions = L.Util.extend(config.options, options);

      // clean up our input url
      var url = L.esri.Util.cleanUrl(config.urlTemplate);

      // call the initialize method on L.TileLayer to set everything up
      L.TileLayer.prototype.initialize.call(this, url, L.Util.setOptions(this, mergedOptions));

      // if this basemap requires dynamic attribution set it up
      if(config.attributionUrl){
        var attributionUrl = L.esri.Util.cleanUrl(config.attributionUrl);
        this._dynamicAttribution = true;
        this._getAttributionData(attributionUrl);
      }
    },
    _dynamicAttribution: false,
    bounds: null,
    zoom: null,
    onAdd: function(map){
      L.TileLayer.prototype.onAdd.call(this, map);
      if(this._dynamicAttribution){
        this.on("load", this._handleTileUpdates, this);
        this._map.on("viewreset zoomend dragend", this._handleTileUpdates, this);
      }
      this._map.on("resize", this._resizeAttribution, this);
    },
    onRemove: function(map){
      if(this._dynamicAttribution){
        this.off("load", this._handleTileUpdates, this);
        this._map.off("viewreset zoomend dragend", this._handleTileUpdates, this);
      }
      this._map.off("resize", this._resizeAttribution, this);
      L.TileLayer.prototype.onRemove.call(this, map);
    },
    _handleTileUpdates: function(e){
      var newBounds;
      var newZoom;

      if(e.type === "load"){
        newBounds = this._map.getBounds();
        newZoom = this._map.getZoom();
      }

      if(e.type === "viewreset" || e.type === "dragend" || e.type ==="zoomend"){
        newBounds = e.target.getBounds();
        newZoom = e.target.getZoom();
      }

      if(this.attributionBoundingBoxes && newBounds && newZoom){
        if(!newBounds.equals(this.bounds) || newZoom !== this.zoom){
          this.bounds = newBounds;
          this.zoom = newZoom;
          this._updateMapAttribution();
        }
      }
    },
    _resizeAttribution: function(){
      var mapWidth = this._map.getSize().x;
      this._getAttributionLogo().style.display = (mapWidth < 600) ? "none":"block";
      this._getAttributionSpan().style.maxWidth =  (mapWidth* 0.75) + "px";
    },
    _getAttributionData: function(url){
      this.attributionBoundingBoxes = [];
      L.esri.get(url, {}, this._processAttributionData, this);
    },
    _processAttributionData: function(attributionData){
      for (var c = 0; c < attributionData.contributors.length; c++) {
        var contributor = attributionData.contributors[c];
        for (var i = 0; i < contributor.coverageAreas.length; i++) {
          var coverageArea = contributor.coverageAreas[i];
          var southWest = new L.LatLng(coverageArea.bbox[0], coverageArea.bbox[1]);
          var northEast = new L.LatLng(coverageArea.bbox[2], coverageArea.bbox[3]);
          this.attributionBoundingBoxes.push({
            attribution: contributor.attribution,
            score: coverageArea.score,
            bounds: new L.LatLngBounds(southWest, northEast),
            minZoom: coverageArea.zoomMin,
            maxZoom: coverageArea.zoomMax
          });
        }
      }
      this.attributionBoundingBoxes.sort(function(a,b){
        if (a.score < b.score){ return -1; }
        if (a.score > b.score){ return 1; }
        return 0;
      });
      if(this.bounds){
        this._updateMapAttribution();
      }
    },
    _getAttributionSpan:function(){
      return this._map._container.querySelectorAll('.esri-attributions')[0];
    },
    _getAttributionLogo:function(){
      return this._map._container.querySelectorAll('.esri-attribution-logo')[0];
    },
    _updateMapAttribution: function(){
      var newAttributions = '';
      for (var i = 0; i < this.attributionBoundingBoxes.length; i++) {
        var attr = this.attributionBoundingBoxes[i];
        if(this.bounds.intersects(attr.bounds) && this.zoom >= attr.minZoom && this.zoom <= attr.maxZoom) {
          var attribution = this.attributionBoundingBoxes[i].attribution;
          if(newAttributions.indexOf(attribution) === -1){
            if(newAttributions.length > 0){
              newAttributions += ', ';
            }
            newAttributions += attribution;
          }
        }
      }
      this._getAttributionSpan().innerHTML = newAttributions;
      this._resizeAttribution();
    }
  });

  L.esri.basemapLayer = function(key, options){
    return new L.esri.BasemapLayer(key, options);
  };

})(L);