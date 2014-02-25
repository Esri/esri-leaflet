/*! Esri-Leaflet - v0.0.1-beta.4 - 2014-02-24
*   Copyright (c) 2014 Environmental Systems Research Institute, Inc.
*   Apache License*/
/* globals L */
(function(L, Terraformer){
  L.esri.ClusteredFeatureLayer = L.Class.extend({
    includes: L.esri.Mixins.featureGrid,
    options: {
      cellSize: 512,
      debounce: 100,
      deduplicate: true,
      where: "1=1",
      fields: ["*"],
      createMarker: function (geojson, latlng) {
        return new L.marker(latlng);
      },
      onEachMarker: undefined
    },
    initialize: function(url, options){
      this.url = L.esri.Util.cleanUrl(url);

      L.Util.setOptions(this, options);

      this._getMetadata();

      this._loaded = [];
      this.cluster = this.options.cluster || new L.MarkerClusterGroup();
    },
    onAdd: function(map){
      this.cluster.addTo(map);
      this._initializeFeatureGrid(map);
    },
    onRemove: function(map){
      map.removeLayer(this.cluster);
      this._destroyFeatureGrid(map);
    },
    addTo: function (map) {
      map.addLayer(this);
      return this;
    },
    getWhere: function(){
      return this.options.where;
    },
    setWhere: function(where){
      this.options.where = where;
      this.refresh();
      return this;
    },
    getFields: function(){
      return this.options.fields;
    },
    setFields: function(fields){
      this.options.fields = fields;
      this.refresh();
      return this;
    },
    refresh: function(){
      this.cluster.clearLayers();
      this._loaded = [];
      this._previousCells = [];
      this._requestFeatures(this._map.getBounds());
    },
    _setObjectIdField: function(response){
      if(response.objectIdFieldName){
        this._objectIdField = response.objectIdFieldName;
      } else {
        for (var j = 0; j <= response.fields.length - 1; j++) {
          if(response.fields[j].type === "esriFieldTypeOID") {
            this._objectIdField = response.fields[j].name;
            break;
          }
        }
      }
    },
    _render: function(response){
      if(response.features && response.features.length && !response.error){
        if(!this._objectIdField){
          this._setObjectIdField(response);
        }
        var markers = [];
        for (var i = response.features.length - 1; i >= 0; i--) {
          var feature = response.features[i];
          var id = feature.attributes[this._objectIdField];
          if(L.esri.Util.indexOf(this._loaded, id) < 0){
            var geojson = L.esri.Util.arcgisToGeojson(feature);
            geojson.id = id;
            var marker = this.options.createMarker(geojson, [geojson.geometry.coordinates[1], geojson.geometry.coordinates[0]]);

            if(this.options.onEachMarker){
              this.options.onEachMarker(geojson, marker);
            }

            markers.push(marker);
            this._loaded.push(id);
          }
        }
        this.cluster.addLayers(markers);
      }
    }
  });

  L.esri.ClusteredFeatureLayer.include(L.Mixin.Events);
  L.esri.ClusteredFeatureLayer.include(L.esri.Mixins.metadata);

  L.esri.clusteredFeatureLayer = function(url, options){
    return new L.esri.ClusteredFeatureLayer(url, options);
  };
})(L);