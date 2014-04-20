(function(L){

  var tileProtocol = (window.location.protocol !== "https:") ? "http:" : "https:";

  L.esri.BasemapLayer = L.TileLayer.extend({
    statics: {
      TILES: {
        Streets: {
          urlTemplate: tileProtocol + "//{s}.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}",
          attributionUrl: "https://static.arcgis.com/attribution/World_Street_Map",
          options: {
            minZoom: 1,
            maxZoom: 19,
            subdomains: ["server", "services"],
            attribution: "Esri"
          }
        },
        Topographic: {
          urlTemplate: tileProtocol + "//{s}.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}",
          attributionUrl: "https://static.arcgis.com/attribution/World_Topo_Map",
          options: {
            minZoom: 1,
            maxZoom: 19,
            subdomains: ["server", "services"],
            attribution: "Esri"
          }
        },
        Oceans: {
          urlTemplate: tileProtocol + "//{s}.arcgisonline.com/arcgis/rest/services/Ocean/World_Ocean_Base/MapServer/tile/{z}/{y}/{x}",
          attributionUrl: "https://static.arcgis.com/attribution/Ocean_Basemap",
          options: {
            minZoom: 1,
            maxZoom: 16,
            subdomains: ["server", "services"],
            attribution: "Esri"
          }
        },
        OceansLabels: {
          urlTemplate: tileProtocol + "//{s}.arcgisonline.com/arcgis/rest/services/Ocean/World_Ocean_Reference/MapServer/tile/{z}/{y}/{x}",
          options: {
            pane: "esri-label",
            minZoom: 1,
            maxZoom: 16,
            subdomains: ["server", "services"]
          }
        },
        NationalGeographic: {
          urlTemplate: tileProtocol + "//{s}.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}",
          options: {
            minZoom: 1,
            maxZoom: 16,
            subdomains: ["server", "services"],
            attribution: "Esri"
          }
        },
        DarkGray: {
          urlTemplate: tileProtocol + "//{s}.arcgis.com/tiles/P3ePLMYs2RVChkJx/arcgis/rest/services/World_Dark_Gray_Base_Beta/MapServer/tile/{z}/{y}/{x}",
          options: {
            minZoom: 1,
            maxZoom: 10,
            subdomains: ["server", "services"],
            attribution: "Esri, DeLorme, HERE"
          }
        },
        DarkGrayLabels: {
          urlTemplate: tileProtocol + "//{s}.arcgis.com/tiles/P3ePLMYs2RVChkJx/arcgis/rest/services/World_Dark_Gray_Reference_Beta/MapServer/tile/{z}/{y}/{x}",
          options: {
            pane: "esri-label",
            minZoom: 1,
            maxZoom: 10,
            subdomains: ["server", "services"],
          }
        },
        Gray: {
          urlTemplate: tileProtocol + "//{s}.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}",
          options: {
            minZoom: 1,
            maxZoom: 16,
            subdomains: ["server", "services"],
            attribution: "Esri, NAVTEQ, DeLorme"
          }
        },
        GrayLabels: {
          urlTemplate: tileProtocol + "//{s}.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Reference/MapServer/tile/{z}/{y}/{x}",
          options: {
            pane: "esri-label",
            minZoom: 1,
            maxZoom: 16,
            subdomains: ["server", "services"]
          }
        },
        Imagery: {
          urlTemplate: tileProtocol + "//{s}.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
          options: {
            minZoom: 1,
            maxZoom: 19,
            subdomains: ["server", "services"],
            attribution: "Esri, DigitalGlobe, GeoEye, i-cubed, USDA, USGS, AEX, Getmapping, Aerogrid, IGN, IGP, swisstopo, and the GIS User Community"
          }
        },
        ImageryLabels: {
          urlTemplate: tileProtocol + "//{s}.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}",
          options: {
            pane: "esri-label",
            minZoom: 1,
            maxZoom: 19,
            subdomains: ["server", "services"]
          }
        },
        ImageryTransportation: {
          urlTemplate: tileProtocol + "//{s}.arcgisonline.com/ArcGIS/rest/services/Reference/World_Transportation/MapServer/tile/{z}/{y}/{x}",
          pane: "esri-label",
          options: {
            minZoom: 1,
            maxZoom: 19,
            subdomains: ["server", "services"]
          }
        },
        ShadedRelief: {
          urlTemplate: tileProtocol + "//{s}.arcgisonline.com/ArcGIS/rest/services/World_Shaded_Relief/MapServer/tile/{z}/{y}/{x}",
          options: {
            minZoom: 1,
            maxZoom: 13,
            subdomains: ["server", "services"],
            attribution: "ESRI, NAVTEQ, DeLorme"
          }
        },
        ShadedReliefLabels: {
          urlTemplate: tileProtocol + "//{s}.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places_Alternate/MapServer/tile/{z}/{y}/{x}",
          pane: "esri-label",
          options: {
            minZoom: 1,
            maxZoom: 12,
            subdomains: ["server", "services"]
          }
        },
        Terrain: {
          urlTemplate: tileProtocol + "//{s}.arcgisonline.com/ArcGIS/rest/services/World_Terrain_Base/MapServer/tile/{z}/{y}/{x}",
          options: {
            minZoom: 1,
            maxZoom: 13,
            subdomains: ["server", "services"],
            attribution: "Esri, USGS, NOAA"
          }
        },
        TerrainLabels: {
          urlTemplate: tileProtocol + "//{s}.arcgisonline.com/ArcGIS/rest/services/Reference/World_Reference_Overlay/MapServer/tile/{z}/{y}/{x}",
          options: {
            pane: "esri-label",
            minZoom: 1,
            maxZoom: 13,
            subdomains: ["server", "services"]
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
        throw new Error("L.esri.BasemapLayer: Invalid parameter. Use one of 'Streets', 'Topographic', 'Oceans', 'OceansLabels', 'NationalGeographic', 'Gray', 'GrayLabels', 'DarkGray', 'DarkGrayLabels', 'Imagery', 'ImageryLabels', 'ImageryTransportation', 'ShadedRelief', 'ShadedReliefLabels', 'Terrain' or 'TerrainLabels'");
      }

      // merge passed options into the config options
      var mergedOptions = L.Util.extend(config.options, options);

      // call the initialize method on L.TileLayer to set everything up
      L.TileLayer.prototype.initialize.call(this, config.urlTemplate, L.Util.setOptions(this, mergedOptions));

      // if this basemap requires dynamic attribution set it up
      if(config.attributionUrl){
        var attributionUrl = config.attributionUrl;
        this._dynamicAttribution = true;
        this._getAttributionData(attributionUrl);
      }
    },
    _dynamicAttribution: false,
    bounds: null,
    zoom: null,
    _initPane: function(){
      if(!map.getPane(this.options.pane)){
        var pane = map.createPane(this.options.pane);
        pane.set
        pane.style.pointerEvents = "none";
        pane.style.zIndex = 5;
      }
    },
    onAdd: function(map){
      if(this.options.pane && L.esri.Support.pointerEvents){
        this._initPane();
      } else {
        this.option.pane = tilePane;
      }

      L.TileLayer.prototype.onAdd.call(this, map);

      if(this._dynamicAttribution && map.attributionControl){
        this.on("load", this._handleTileUpdates, this);
        this._map.on("viewreset zoomend dragend", this._handleTileUpdates, this);
      }
      if(map.attributionControl) {
        this._map.on("resize", this._resizeAttribution, this);
      }
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
    getAttribution:function(){
      return (this.options.attribution) ? "<span class='esri-attributions' style='line-height:9px; text-overflow:ellipsis; white-space:nowrap;overflow:hidden; display:inline-block;'>" + this.options.attribution + "</span>" : false;
    },
    _resizeAttribution: function(){
      var mapWidth = this._map.getSize().x;
      this._getAttributionSpan().style.maxWidth =  (mapWidth* 0.75) + "px";
    },
    _getAttributionData: function(url){
      this.attributionBoundingBoxes = [];
      L.esri.RequestHandlers.JSONP(url, {}, this._processAttributionData, this);
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