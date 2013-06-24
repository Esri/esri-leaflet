/* globals L:true, ActiveXObject:true, Terraformer */

L.esri.BasemapLayer = L.TileLayer.extend({
  statics: {
    TILES: {
      Streets: {
        urlTemplate: "http://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}",
        attributionUrl: "http://static.arcgis.com/attribution/World_Street_Map?f=json",
        options: {
          minZoom: 1,
          maxZoom: 19,
          attribution: "<span class='esri-attributions'>Esri</span><img src='http://serverapi.arcgisonline.com/jsapi/arcgis/3.4/js/esri/images/map/logo-med.png' alt='Powered by Esri' class='esri-attribution-logo'>"
        }
      },
      Topographic: {
        urlTemplate: "http://services.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}",
        attributionUrl: "http://static.arcgis.com/attribution/World_Topo_Map?f=json",
        options: {
          minZoom: 1,
          maxZoom: 19,
          attribution: "<span class='esri-attributions'>Esri</span><img src='http://serverapi.arcgisonline.com/jsapi/arcgis/3.4/js/esri/images/map/logo-med.png' alt='Powered by Esri' class='esri-attribution-logo'>"
        }
      },
      Oceans: {
        urlTemplate: "http://server.arcgisonline.com/ArcGIS/rest/services/Ocean_Basemap/MapServer/tile/{z}/{y}/{x}",
        attributionUrl: "http://static.arcgis.com/attribution/Ocean_Basemap?f=json",
        options: {
          minZoom: 1,
          maxZoom: 19,
          attribution: "<span class='esri-attributions'>Esri</span><img src='http://serverapi.arcgisonline.com/jsapi/arcgis/3.4/js/esri/images/map/logo-med.png' alt='Powered by Esri' class='esri-attribution-logo'>"
        }
      },
      NationalGeographic: {
        urlTemplate: "http://server.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}",
        options: {
          minZoom: 1,
          maxZoom: 19,
          attribution: "<span class='esri-attributions'>Esri</span><img src='http://serverapi.arcgisonline.com/jsapi/arcgis/3.4/js/esri/images/map/logo-med.png' alt='Powered by Esri' class='esri-attribution-logo'>"
        }
      },
      Gray: {
        urlTemplate: "http://services.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}",
        options: {
          minZoom: 1,
          maxZoom: 19,
          attribution: "<span class='esri-attributions'>Copyright: &copy;2013 Esri, DeLorme, NAVTEQ</span><img src='http://serverapi.arcgisonline.com/jsapi/arcgis/3.4/js/esri/images/map/logo-med.png' alt='Powered by Esri' class='esri-attribution-logo'>"
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
          attribution: "<span class='esri-attributions'>Esri, DigitalGlobe, GeoEye, i-cubed, USDA, USGS, AEX, Getmapping, Aerogrid, IGN, IGP, swisstopo, and the GIS User Community</span><img src='http://serverapi.arcgisonline.com/jsapi/arcgis/3.4/js/esri/images/map/logo-med.png' alt='Powered by Esri' class='esri-attribution-logo'>"
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
  },
  initialize: function(key, options){
    var config;

    // set the config variable with the appropriate config object
    if (typeof key === "object" && key.urlTemplate && key.options){
      config = key;
    } else if(typeof key === "string" && L.esri.BasemapLayer.TILES[key]){
      config = L.esri.BasemapLayer.TILES[key];
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
      this._map.on("resize", this.resizeAttribution);
    }
  },
  resizeAttribution: function(){
    this.attributionSpan.style.maxWidth = (this._map.getSize().x * 0.75) - 65 + "px";
  },
  onRemove: function(map){
    if(this.dynamicAttribution){
      this.off("load", this.handleTileUpdates);
      this._map.off("viewreset zoomend dragend", this.handleTileUpdates);
      this._map.off("resize", this.resizeAttribution);
    }
    L.TileLayer.prototype.onRemove.call(this, map);
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
  processAttributionData: function(httpRequest){
    if (httpRequest.target.readyState === 4 && httpRequest.target.status === 200) {
      this.attributionIndex = new Terraformer.RTree();
      var attributionData = JSON.parse(httpRequest.target.responseText);

      for (var c = 0; c < attributionData.contributors.length; c++) {
        var contributor = attributionData.contributors[c];
        for (var i = 0; i < contributor.coverageAreas.length; i++) {
          var coverageArea = contributor.coverageAreas[i];
          var southWest = new L.LatLng(coverageArea.bbox[0], coverageArea.bbox[1]);
          var northEast = new L.LatLng(coverageArea.bbox[2], coverageArea.bbox[3]);
          var bounds = new L.LatLngBounds(southWest, northEast);
          var envelope = L.esri.Util.boundsToEnvelope(bounds);
          this.attributionIndex.insert(envelope, {
            attribution: contributor.attribution,
            score: coverageArea.score,
            minZoom: coverageArea.zoomMin,
            maxZoom: coverageArea.zoomMax
          });
        }
      }

      if(this.bounds){
        this.updateMapAttribution();
      }
    }
  },
  updateMapAttribution: function(){
    var newAttributions = [];
    var searchEnvelope = L.esri.Util.boundsToEnvelope(this.bounds);
    if(this.attributionIndex){
      this.attributionIndex.search(searchEnvelope).then(L.Util.bind(function(results){
        results.sort(function(a,b){
          if (a.score < b.score){ return -1; }
          if (a.score > b.score){ return 1; }
          return 0;
        });

        for (var i = results.length - 1; i >= 0; i--) {
          var result = results[i];
          if(this.zoom >= result.minZoom && this.zoom <= result.maxZoom){
            if(newAttributions.indexOf(result.attribution) === -1){
              newAttributions.push(result.attribution);
            }
          }
        }

        this.attributionSpan = this._map._container.getElementsByClassName("esri-attributions")[0];
        this.attributionSpan.innerHTML = newAttributions.join(", ");
        this.resizeAttribution();
      }, this));
    }
  }
});

L.esri.basemapLayer = function(key, options){
  return new L.esri.BasemapLayer(key, options);
};