L.esri = {
  TILES: {
    Streets: {
      urlTemplate: "http://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}",
      attributionUrl: "http://static.arcgis.com/attribution/World_Street_Map?f=json",
      options: {
        minZoom: 1,
        maxZoom: 19,
        attribution: "<span id='esri-attributions'>Esri</span><img src='http://serverapi.arcgisonline.com/jsapi/arcgis/3.4/js/esri/images/map/logo-med.png' alt='Powered by Esri' class='esri-attribution-logo'>"
      }
    },
    Topographic: {
      urlTemplate: "http://services.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}",
      attributionUrl: "http://static.arcgis.com/attribution/World_Topo_Map?f=json",
      options: {
        minZoom: 1,
        maxZoom: 19,
        attribution: "<span id='esri-attributions'>Esri</span><img src='http://serverapi.arcgisonline.com/jsapi/arcgis/3.4/js/esri/images/map/logo-med.png' alt='Powered by Esri' class='esri-attribution-logo'>"
      }
    },
    Oceans: {
      urlTemplate: "http://server.arcgisonline.com/ArcGIS/rest/services/Ocean_Basemap/MapServer/tile/{z}/{y}/{x}",
      attributionUrl: "http://static.arcgis.com/attribution/Ocean_Basemap?f=json",
      options: {
        minZoom: 1,
        maxZoom: 19,
        attribution: "<span id='esri-attributions'>Esri</span><img src='http://serverapi.arcgisonline.com/jsapi/arcgis/3.4/js/esri/images/map/logo-med.png' alt='Powered by Esri' class='esri-attribution-logo'>"
      }
    },
    NationalGeographic: {
      urlTemplate: "http://server.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}",
      options: {
        minZoom: 1,
        maxZoom: 19,
        attribution: "<span id='esri-attributions'>Esri</span><img src='http://serverapi.arcgisonline.com/jsapi/arcgis/3.4/js/esri/images/map/logo-med.png' alt='Powered by Esri' class='esri-attribution-logo'>"
      }
    },
    Gray: {
      urlTemplate: "http://services.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}",
      options: {
        minZoom: 1,
        maxZoom: 19,
        attribution: "<span id='esri-attributions'>Copyright: &copy;2013 Esri, DeLorme, NAVTEQ</span><img src='http://serverapi.arcgisonline.com/jsapi/arcgis/3.4/js/esri/images/map/logo-med.png' alt='Powered by Esri' class='esri-attribution-logo'>"
      }
    },
    GrayLabels: {
      urlTemplate: "http://services.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Reference/MapServer/tile/{z}/{y}/{x}",
      options: {
        minZoom: 1,
        maxZoom: 19
      }
    },
    Imagery: {
      urlTemplate: "http://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      options: {
        minZoom: 1,
        maxZoom: 19,
        attribution: "<span id='esri-attributions'>Esri, DigitalGlobe, GeoEye, i-cubed, USDA, USGS, AEX, Getmapping, Aerogrid, IGN, IGP, swisstopo, and the GIS User Community</span><img src='http://serverapi.arcgisonline.com/jsapi/arcgis/3.4/js/esri/images/map/logo-med.png' alt='Powered by Esri' class='esri-attribution-logo'>"
      }
    },
    ImageryLabels: {
      urlTemplate: "http://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}",
      options: {
        minZoom: 1,
        maxZoom: 19
      }
    }
  }
};

L.esri.TileLayer = L.TileLayer.extend({
  initialize: function(key, options){
    var config;

    // set the config variable with the appropriate config object
    if (typeof key === "object" && key.urlTemplate && key.options){
      config = key;
    } else if(typeof key === "string" && L.esri.TILES[key]){
      config = L.esri.TILES[key];
    } else {
      throw new Error("L.esri.TileLayer: Invalid parameter. Use one of 'Streets', 'Topographic', 'Oceans', 'NationalGeographic', 'Gray', 'GrayLabels', 'Imagery' or 'ImageryLabels'");
    }

    // merge passed options into the config options
    var mergedOptions = L.Util.extend(config.options, options);

    // call the initialize method on L.TileLayer to set everything up
    L.TileLayer.prototype.initialize.call(this, config.urlTemplate, L.Util.setOptions(this, mergedOptions));

    // if this basemap requires dynamic attribution set it up
    if(config.attributionUrl){
      this.dynamicAttribution = true;
      this.getAttributionData(config.attributionUrl);
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
      this.on("load", this.handleTileUpdates);
      this._map.on("viewreset zoomend dragend", this.handleTileUpdates);
    }
  },
  onRemove: function(){
    L.TileLayer.prototype.onRemove.call(this);
    if(this.dynamicAttribution){
      this.off("load", this.handleTileUpdates);
      this._map.off("viewreset zoomend dragend", this.handleTileUpdates);
    }
  },
  getAttributionData: function(url){
    this.attributionBoundingBoxes = [];
    var httpRequest;
    if (window.XMLHttpRequest) {
      httpRequest = new XMLHttpRequest();
    } else if (window.ActiveXObject) {
      httpRequest = new ActiveXObject("Microsoft.XMLHTTP");
    }
    httpRequest.onreadystatechange = L.bind(this.processAttributionData, this);
    httpRequest.open('GET', url, true);
    httpRequest.send(null);
  },
  processAttributionData: function(foo){
    if (foo.target.readyState === 4 && foo.target.status === 200) {
      var attributionData = JSON.parse(foo.target.responseText);
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
    }
  },
  updateMapAttribution: function(){
    var newAttributions = [];
    for (var i = 0; i < this.attributionBoundingBoxes.length; i++) {
      var attr = this.attributionBoundingBoxes[i];
      if(this.bounds.intersects(attr.bounds) && this.zoom >= attr.minZoom && this.zoom <= attr.maxZoom) {
      //if(this.bounds.intersects(attr.bounds)) {
        var attribution = this.attributionBoundingBoxes[i].attribution;
        if(newAttributions.indexOf(attribution) === -1){
          newAttributions.push(attribution);
        }
      }
    }
    L.DomUtil.get("esri-attributions").innerHTML = newAttributions.join(", ");
  }
});

L.esri.tileLayer = function(key, options){
  return new L.esri.TileLayer(key, options);
};

L.esri.FeatureLayer = L.FeatureGroup.extend({
  initialize: function(key, options){
    L.FeatureGroup.prototype.initialize.call(this, []);
  }
});

L.esri.featureLayer = function(url, options){
  return new L.esri.FeatureLayer(url, options);
};