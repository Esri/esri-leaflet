/* globals L */
(function(L, Terraformer){
  L.esri.HeatMapFeatureLayer = L.Class.extend({
    includes: L.esri.Mixins.featureGrid,
    options: {
      cellSize: 512,
      debounce: 100,
      deduplicate: true
    },
    initialize: function(url, options){
      this.url = L.esri.Util.cleanUrl(url);
      L.Util.setOptions(this, options);

      var requestOptions = {};

      if(this.options.token){
        requestOptions.token = this.options.token;
      }

      L.esri.get(this.url, requestOptions, function(response){
        this.fire("metadata", { metadata: response });
      }, this);

      this._loaded = [];
      this.heat = new L.heatLayer([], this.options);
    },
    onAdd: function(map){
      this.heat.addTo(map);
      this._initializeFeatureGrid(map);
    },
    onRemove: function(map){
      map.removeLayer(this.heat);
      this._destroyFeatureGrid(map);
    },
    addTo: function (map) {
      map.addLayer(this);
      return this;
    },
    _render: function(response){
      if(response.features && response.features.length && !response.error){
        var idKey = response.objectIdFieldName;
        var latlngs = [];
        if(!idKey){
          for (var j = 0; j <= response.fields.length - 1; j++) {
            if(response.fields[j].type === "esriFieldTypeOID") {
              idKey = response.fields[j].name;
              break;
            }
          }
        }

        for (var i = response.features.length - 1; i >= 0; i--) {
          var feature = response.features[i];
          var id = feature.attributes[idKey];
          if(L.esri.Util.indexOf(this._loaded, id) < 0){
            latlngs.push(L.latLng([feature.geometry.y, feature.geometry.x]));
            this._loaded.push(id);
          }
        }

        this.heat._latlngs = this.heat._latlngs.concat(latlngs);
        this.heat.redraw();

      }
    }
  });

  L.esri.HeatMapFeatureLayer.include(L.Mixin.Events);

  L.esri.heatMapFeatureLayer = function(url, options){
    return new L.esri.HeatMapFeatureLayer(url, options);
  };
})(L);