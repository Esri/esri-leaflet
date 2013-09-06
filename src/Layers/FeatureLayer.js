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

      L.esri.get(this.url, {}, function(response){
        this.fire("metadata", { metadata: response });
      }, this);

      L.GeoJSON.prototype.initialize.call(this, [], options);
    },
    onAdd: function(map){
      L.LayerGroup.prototype.onAdd.call(this, map);
      map.on("zoomend resize move", this._update, this);
      this._initializeFeatureGrid(map);
    },
    onRemove: function(map){
      map.off("zoomend resize move", this._update, this);
      L.LayerGroup.prototype.onRemove.call(this, map);
      this._destroyFeatureGrid(map);
    },
    getLayerId: function(layer){
      return layer.feature.id;
    },
    _update: function(e){
      var envelope = L.esri.Util.boundsToEnvelope(e.target.getBounds());
      this.index.search(envelope).then(L.Util.bind(function(results){
        this.eachLayer(L.Util.bind(function(layer){
          var id = layer.feature.id;
          setLayerVisibility(layer, L.esri.Util.indexOf(results, id) >= 0);
        }, this));
      }, this));
    },
    _render: function(response){
      if(response.objectIdFieldName && response.features.length && !response.error){
        var idKey = response.objectIdFieldName;
        for (var i = response.features.length - 1; i >= 0; i--) {
          var feature = response.features[i];
          var id = feature.attributes[idKey];
          if(!this._layers[id]){
            var geojson = Terraformer.ArcGIS.parse(feature);
            geojson.id = id;
            this.index.insert(geojson,id);
            this.addData(geojson);
            var layer = this._layers[id];
            this.fire("render", {
              feature: layer,
              geojson: geojson
            });
          }
        }
      }
    }
  });

  L.esri.featureLayer = function(url, options){
    return new L.esri.FeatureLayer(url, options);
  };

})(L);