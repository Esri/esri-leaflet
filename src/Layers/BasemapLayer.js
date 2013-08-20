L.esri.BasemapLayer = L.TileLayer.extend({
  statics: {
    TILES: {
      Streets: {
        urlTemplate: "http://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}/",
        attributionUrl: "http://static.arcgis.com/attribution/World_Street_Map/",
        options: {
          minZoom: 1,
          maxZoom: 19,
          attribution: "<span class='esri-attributions' style='"+L.esri.AttributionStyles+"'>Esri</span><img src='https://serverapi.arcgisonline.com/jsapi/arcgis/3.5/js/esri/images/map/logo-med.png' alt='Powered by Esri' class='esri-attribution-logo' style='"+L.esri.LogoStyles+"'>"
        }
      },
      Topographic: {
        urlTemplate: "http://services.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}/",
        attributionUrl: "http://static.arcgis.com/attribution/World_Topo_Map/",
        options: {
          minZoom: 1,
          maxZoom: 19,
          attribution: "<span class='esri-attributions' style='"+L.esri.AttributionStyles+"'>Esri</span><img src='https://serverapi.arcgisonline.com/jsapi/arcgis/3.5/js/esri/images/map/logo-med.png' alt='Powered by Esri' class='esri-attribution-logo' style='"+L.esri.LogoStyles+"'>"
        }
      },
      Oceans: {
        urlTemplate: "http://server.arcgisonline.com/ArcGIS/rest/services/Ocean_Basemap/MapServer/tile/{z}/{y}/{x}/",
        attributionUrl: "http://static.arcgis.com/attribution/Ocean_Basemap/",
        options: {
          minZoom: 1,
          maxZoom: 16,
          attribution: "<span class='esri-attributions' style='"+L.esri.AttributionStyles+"'>Esri</span><img src='https://serverapi.arcgisonline.com/jsapi/arcgis/3.5/js/esri/images/map/logo-med.png' alt='Powered by Esri' class='esri-attribution-logo' style='"+L.esri.LogoStyles+"'>"
        }
      },
      NationalGeographic: {
        urlTemplate: "http://server.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}/",
        options: {
          minZoom: 1,
          maxZoom: 16,
          attribution: "<span class='esri-attributions' style='"+L.esri.AttributionStyles+"'>Esri</span><img src='https://serverapi.arcgisonline.com/jsapi/arcgis/3.5/js/esri/images/map/logo-med.png' alt='Powered by Esri' class='esri-attribution-logo' style='"+L.esri.LogoStyles+"'>"
        }
      },
      Gray: {
        urlTemplate: "http://services.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}/",
        options: {
          minZoom: 1,
          maxZoom: 16,
          attribution: "<span class='esri-attributions' style='"+L.esri.AttributionStyles+"'>Copyright: &copy;2013 Esri, DeLorme, NAVTEQ</span><img src='https://serverapi.arcgisonline.com/jsapi/arcgis/3.5/js/esri/images/map/logo-med.png' alt='Powered by Esri' class='esri-attribution-logo' style='"+L.esri.LogoStyles+"'>"
        }
      },
      GrayLabels: {
        urlTemplate: "http://services.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Reference/MapServer/tile/{z}/{y}/{x}/",
        options: {
          minZoom: 1,
          maxZoom: 16
        }
      },
      Imagery: {
        urlTemplate: "http://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}/",
        options: {
          minZoom: 1,
          maxZoom: 19,
          attribution: "<span class='esri-attributions' style='"+L.esri.AttributionStyles+"'>Esri, DigitalGlobe, GeoEye, i-cubed, USDA, USGS, AEX, Getmapping, Aerogrid, IGN, IGP, swisstopo, and the GIS User Community</span><img src='https://serverapi.arcgisonline.com/jsapi/arcgis/3.5/js/esri/images/map/logo-med.png' alt='Powered by Esri' class='esri-attribution-logo' style='"+L.esri.LogoStyles+"'>"
        }
      },
      ImageryLabels: {
        urlTemplate: "http://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}/",
        options: {
          minZoom: 1,
          maxZoom: 19
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
      throw new Error("L.esri.BasemapLayer: Invalid parameter. Use one of 'Streets', 'Topographic', 'Oceans', 'NationalGeographic', 'Gray', 'GrayLabels', 'Imagery' or 'ImageryLabels'");
    }

    // merge passed options into the config options
    var mergedOptions = L.Util.extend(config.options, options);

    // clean up our input url
    var url = L.esri.Util.cleanUrl(config.urlTemplate);

    // call the initialize method on L.TileLayer to set everything up
    L.TileLayer.prototype.initialize.call(this, url, L.Util.setOptions(this, mergedOptions));

    // if this basemap requires dynamic attribution set it up
    if(config.attributionUrl){
      var attributionUrl =L.esri.Util.cleanUrl(config.attributionUrl);
      this.dynamicAttribution = true;
      this.getAttributionData(attributionUrl);
    }
  },
  dynamicAttribution: false,
  bounds: null,
  zoom: null,
  handleTileUpdates: function(e){
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
        this.updateMapAttribution();
      }
    }
  },
  onAdd: function(map){
    L.TileLayer.prototype.onAdd.call(this, map);
    if(this.dynamicAttribution){
      this.on("load", this.handleTileUpdates, this);
      this._map.on("viewreset zoomend dragend", this.handleTileUpdates, this);
    }
    this._map.on("resize", this.resizeAttribution, this);
  },
  resizeAttribution: function(){
    var mapWidth = this._map.getSize().x;
    this.getAttributionLogo().style.display = (mapWidth < 600) ? "none":"block";
    this.getAttributionSpan().style.maxWidth =  (mapWidth* 0.75) + "px";
  },
  onRemove: function(map){
    if(this.dynamicAttribution){
      this.off("load", this.handleTileUpdates, this);
      this._map.off("viewreset zoomend dragend", this.handleTileUpdates, this);
    }
    this._map.off("resize", this.resizeAttribution, this);
    L.TileLayer.prototype.onRemove.call(this, map);
  },
  getAttributionData: function(url){
    this.attributionBoundingBoxes = [];
    L.esri.get(url, {}, this.processAttributionData, this);
  },
  processAttributionData: function(attributionData){
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
      this.updateMapAttribution();
    }
  },
  getAttributionSpan:function(){
    return this._map._container.querySelectorAll('.esri-attributions')[0];
  },
  getAttributionLogo:function(){
    return this._map._container.querySelectorAll('.esri-attribution-logo')[0];
  },
  updateMapAttribution: function(){
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
    this.getAttributionSpan().innerHTML = newAttributions;
    this.resizeAttribution();
  }
});

L.esri.basemapLayer = function(key, options){
  return new L.esri.BasemapLayer(key, options);
};
