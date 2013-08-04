/* globals Terraformer, L */
(function(L){

  // make it so that passed `function` never gets called
  // twice within `delay` milliseconds. Used to throttle
  // `move` events on the layer.
  // http://remysharp.com/2010/07/21/throttling-function-calls/
  function debounce(fn, delay, context) {
    var timer = null;
    return function() {
      var context = this||context, args = arguments;
      clearTimeout(timer);
      timer = setTimeout(function () {
        fn.apply(context, args);
      }, delay);
    };
  }

  // round a number away from zero used to snap
  // row/columns away from the origin of the grid
  function roundAwayFromZero(num){
    return (num > 0) ? Math.ceil(num) : Math.floor(num);
  }

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
    options: {
      cellSize: 512,
      debounce: 100,
      deduplicate: true
    },
    initialize: function(url, options){
      this.index = new Terraformer.RTree();
      this.url = L.esri.Util.cleanUrl(url);
      L.Util.setOptions(this, options);
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
          }
        }
      }
    },

    _initializeFeatureGrid: function(map){
      this._map = map;
      this._previousCells = [];
      this.center = this._map.getCenter();
      this.origin = this._map.project(this.center);

      this._moveHandler = debounce(function(e){
        if(e.type === "zoomend"){
          this.origin = this._map.project(this.center);
          this._previousCells = [];
        }
        this._requestFeatures(e.target.getBounds());
      }, this.options.debounce, this);

      map.on("zoomend resize move", this._moveHandler, this);

      this._requestFeatures(map.getBounds());
    },
    _destroyFeatureGrid: function(map){
      map.on("zoomend resize move", this._moveHandler, this);
    },
    _requestFeatures: function(bounds){
      var cells = this._cellsWithin(bounds);
      for (var i = 0; i < cells.length; i++) {
        var cell = cells[i];
        L.esri.get(this.url+"query", {
          geometryType: "esriGeometryEnvelope",
          geometry: JSON.stringify(L.esri.Util.boundsToExtent(cell.bounds)),
          outFields:"*",
          outSr: 4326
        }, this._render, this);
      }
    },
    _cellsWithin: function(mapBounds){
      var size = this._map.getSize();
      var offset = this._map.project(this._map.getCenter());
      var bounds = mapBounds.pad(Math.min(this.options.cellSize/size.x, this.options.cellSize/size.y));
      var cells = [];

      var topLeftPoint = this._map.project(bounds.getNorthWest());
      var bottomRightPoint = this._map.project(bounds.getSouthEast());

      var topLeft = topLeftPoint.subtract(offset).divideBy(this.options.cellSize);
      var bottomRight = bottomRightPoint.subtract(offset).divideBy(this.options.cellSize);

      var offsetRows = Math.round((this.origin.x - offset.x) / this.options.cellSize);
      var offsetCols = Math.round((this.origin.y - offset.y) / this.options.cellSize);

      var minRow = roundAwayFromZero(topLeft.x)-offsetRows;
      var maxRow = roundAwayFromZero(bottomRight.x)-offsetRows;
      var minCol = roundAwayFromZero(topLeft.y)-offsetCols;
      var maxCol = roundAwayFromZero(bottomRight.y)-offsetCols;

      for (var row = minRow; row < maxRow; row++) {
        for (var col = minCol; col < maxCol; col++) {
          var cellId = "cell:"+row+":"+col;
          var duplicate = this._previousCells.indexOf(cellId) >= 0;

          if(!duplicate || !this.options.deduplicate){
            var cellBounds = this._cellExtent(row, col);
            var cellCenter = cellBounds.getCenter();
            var radius = cellCenter.distanceTo(cellBounds.getNorthWest());
            var distance = cellCenter.distanceTo(this.center);
            var cell = {
              row: row,
              col: col,
              id: cellId,
              center: cellCenter,
              bounds: cellBounds,
              distance:distance,
              radius: radius
            };
            cells.push(cell);
            this._previousCells.push(cellId);
          }
        }
      }

      cells.sort(function (a, b) {
        return a.distance - b.distance;
      });

      return cells;
    },
    _cellExtent: function(row, col){
      var swPoint = this._cellPoint(row, col);
      var nePoint = this._cellPoint(row+1, col+1);
      var sw = this._map.unproject(swPoint);
      var ne = this._map.unproject(nePoint);
      return L.latLngBounds(sw, ne);
    },
    _cellPoint:function(row, col){
      var x = this.origin.x + (row*this.options.cellSize);
      var y = this.origin.y + (col*this.options.cellSize);
      return [x, y];
    }
  });

  L.esri.featureLayer = function(url, options){
    return new L.esri.FeatureLayer(url, options);
  };

})(L);