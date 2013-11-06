/*! Esri-Leaflet - v0.0.1 - 2013-09-17
*   Copyright (c) 2013 Environmental Systems Research Institute, Inc.
*   Apache License*/
/* globals Terraformer, L */
(function(L, Terraformer){
  L.esri.ClusteredFeatureLayer = L.Class.extend({
    includes: L.esri.Mixins.featureGrid,
    options: {
      cellSize: 512,
      debounce: 100,
      deduplicate: true,
      createMarker: function (geojson, latlng) {
        return new L.marker(latlng);
      },
      onEachMarker: undefined
    },
    initialize: function(url, options){
      L.Util.setOptions(this, options);
      this.url = L.esri.Util.cleanUrl(url);

      L.esri.get(this.url, {}, function(response){
        this.fire("metadata", { metadata: response });
      }, this);

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
    _render: function(response){
      if(response.objectIdFieldName && response.features.length && !response.error){
        var idKey = response.objectIdFieldName;
        for (var i = response.features.length - 1; i >= 0; i--) {
          var feature = response.features[i];
          var id = feature.attributes[idKey];
          if(L.esri.Util.indexOf(this._loaded, id) < 0){
            var geojson = Terraformer.ArcGIS.parse(feature);
            geojson.id = id;
            var marker = this.options.createMarker(geojson, [geojson.geometry.coordinates[1], geojson.geometry.coordinates[0]]);

            if(this.options.onEachMarker){
              this.options.onEachMarker(geojson, marker);
            }

            this.cluster.addLayer(marker);
            this._loaded.push(id);

            this.fire("render", {
              feature: marker,
              geojson: geojson
            });
          }
        }
      }
    }
  });

  L.esri.ClusteredFeatureLayer.include(L.Mixin.Events);

  L.esri.clusteredFeatureLayer = function(url, options){
    return new L.esri.ClusteredFeatureLayer(url, options);
  };
})(L, Terraformer);