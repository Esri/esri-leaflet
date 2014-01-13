  /* globals Terraformer, L */
(function(L){

  // toggles the visibility of a layer. Used to
  // show or hide layers that move in or out of
  // the map bounds
  function setLayerVisibility(layer, visible){
    var style = (visible) ? "block" : "none";

    if(layer._icon){
      layer._icon.style.display = style;
    }

    if(layer._shadow){
      layer._shadow.style.display = style;
    }

    if(layer._layers){
      for(var layerid in layer._layers){
        if(layer._layers.hasOwnProperty(layerid)){
          layer._layers[layerid]._container.style.display = style;
        }
      }
    }
  }

  L.esri.FeatureLayer = L.GeoJSON.extend({
    includes: L.esri.Mixins.featureGrid,
    options: {
      cellSize: 512,
      debounce: 100,
      deduplicate: true
    },
    initialize: function(url, options){
      this.index = L.esri._rbush();
      this.url = L.esri.Util.cleanUrl(url);
      L.Util.setOptions(this, options);

      var requestOptions = {};

      if(this.options.token){
        requestOptions.token = this.options.token;
      }

      L.esri.get(this.url, requestOptions, function(response){
        this.fire("metadata", { metadata: response });
      }, this);

      L.GeoJSON.prototype.initialize.call(this, [], options);
    },
    onAdd: function(map){
      L.LayerGroup.prototype.onAdd.call(this, map);
      map.on("zoomend resize moveend", this._update, this);
      this._initializeFeatureGrid(map);
    },
    onRemove: function(map){
      map.off("zoomend resize moveend", this._update, this);
      L.LayerGroup.prototype.onRemove.call(this, map);
      this._destroyFeatureGrid(map);
    },
    getLayerId: function(layer){
      return layer.feature.id;
    },
    _update: function(e){
      console.time("update");
      var envelope = L.esri.Util.boundsToEnvelope(e.target.getBounds());
      var results = this.index.search(e.target.getBounds().toBBoxString().split(','));
      var ids = [];
      for (var i = 0; i < results.length; i++) {
        ids.push(results[i][4]);
      };
      this.eachLayer(L.Util.bind(function(layer){
        var id = layer.feature.id;
        setLayerVisibility(layer, L.esri.Util.indexOf(ids, id) >= 0);
      }, this));
      console.timeEnd("update");
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
        console.time("loadFeatures");
        var bounds = [];
        for (var i = response.features.length - 1; i >= 0; i--) {
          var feature = response.features[i];
          var id = feature.attributes[this._objectIdField];
          if(!this._layers[id]){
            var geojson = L.esri.Util.arcgisToGeojson(feature, {
              idAttribute: this._objectIdField
            });
            var bbox = L.esri.Util.geojsonBounds(geojson);
            bbox.push(geojson.id);
            bounds.push(bbox);
            this.addData(geojson);
          }
        }
        this.index.load(bounds);
        console.timeEnd("loadFeatures");
      }
    }
  });

  L.esri.featureLayer = function(url, options){
    return new L.esri.FeatureLayer(url, options);
  };

})(L);
