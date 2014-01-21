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
      this.index = new Terraformer.RTree();
      this.url = L.esri.Util.cleanUrl(url);
      L.Util.setOptions(this, options);

      var requestOptions = {};

      if(this.options.token){
        requestOptions.token = this.options.token;
      }

      if(this.options.where){
        requestOptions.where = this.options.where;
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
      var envelope = L.esri.Util.boundsToEnvelope(e.target.getBounds());
      this.index.search(envelope, L.Util.bind(function(error,results){
        this.eachLayer(L.Util.bind(function(layer){
          var id = layer.feature.id;
          setLayerVisibility(layer, L.esri.Util.indexOf(results, id) >= 0);
        }, this));
      }, this));
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
        for (var i = response.features.length - 1; i >= 0; i--) {
          var feature = response.features[i];
          var idFieldName = this._objectIdField;
          var id = feature.attributes[idFieldName];
          if(!this._layers[id]){
            var geojson = Terraformer.ArcGIS.parse(feature);
            geojson.id = id;
            this.index.insert(geojson, geojson.id);
            this.addData(geojson);
          }
        }
      }
    }
  });

  L.esri.featureLayer = function(url, options){
    return new L.esri.FeatureLayer(url, options);
  };

})(L);
