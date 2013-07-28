/* globals Terraformer, L */

L.esri.FeatureLayer = L.GeoJSON.extend({
  options: {
    cellSize: 512
  },
  initialize: function(url, options){
    // create a new index to store existing points
    this.index = new Terraformer.RTree();

    //add a trailing slash to the url if the user omitted it
    if(url[url.length-1] !== "/"){
      url += "/";
    }
    this.url = url;
    L.Util.setOptions(this, options);
    L.GeoJSON.prototype.initialize.call(this, [], options);
  },
  onAdd: function(map){
    L.LayerGroup.prototype.onAdd.call(this, map);
    this._map = map;
    this._setupGrid(map.getBounds());

    map.on("move", this._updateVisibleFeatures, this);
    map.on("move", this._moveHandler, this);
    map.on("zoomend", this._zoomHandler, this);
    map.on("resize", this._resizeHandler, this);
  },
  onRemove: function(map){
    L.LayerGroup.prototype.onRemove.call(this, map);
    map.off("viewreset moveend", this._updateVisibleFeatures, this);
    map.off("moveend", this._moveHandler, this);
    map.off("zoomend", this._zoomHandler, this);
    map.off("resize", this._resizeHandler, this);
  },
  getLayerId: function(layer){
    return layer.feature.id;
  },
  _toggleLayerVisibility: function(layer, visible){
    var style = (visible) ? "block" : "none";
    // icon
    if(layer._icon){
      layer._icon.style.display = style;
    }

    // shadow
    if(layer._shadow){
      layer._shadow.style.display = style;
    }

    // misc layers
    if(layer._layers){
      for(var layerid in layer._layers){
        if(layer._layers.hasOwnProperty(layerid)){
          layer._layers[layerid]._container.style.display = style;
        }
      }
    }
  },
  _updateVisibleFeatures: function(e){
    var envelope = L.esri.Util.boundsToEnvelope(e.target.getBounds());
    this.index.search(envelope).then(L.Util.bind(function(results){
      this.eachLayer(L.Util.bind(function(layer){
        var id = layer.feature.id;
        this._toggleLayerVisibility(layer, L.esri.Util.indexOf(results, id) >= 0);
      }, this));
    }, this));
  },

  _processFeatures: function(response){
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
  _requestFeaturesInCells: function(bounds){
    var cells = this._cellsInBounds(bounds);
    for (var i = 0; i < cells.length; i++) {
      var cell = cells[i];
      if(L.esri.Util.indexOf(this._loadedCells, cell.id) === -1){
        L.esri.get(this.url+"query", {
          geometryType: "esriGeometryEnvelope",
          geometry: JSON.stringify(L.esri.Util.boundsToExtent(cell.bounds)),
          outFields:"*",
          outSr: 4326
        }, this._processFeatures, this);
        this._loadedCells.push(cell.id);
      }
    }
  },
  _moveHandler: function(e){
    this._requestFeaturesInCells(e.target.getBounds());
  },
  _zoomHandler: function(e){
    this._setupGrid(e.target.getBounds());
  },
  _resizeHandler: function(e) {
    this._setupSize();
  },
  _setupSize: function(){
    this._rows = Math.ceil(this._map.getSize().x / this._cellSize);
    this._cols = Math.ceil(this._map.getSize().y / this._cellSize);
  },
  _setupGrid: function(bounds){
    this._origin = this._map.project(bounds.getNorthWest());
    this._cellSize = this.options.cellSize;
    this._setupSize();
    this._loadedCells = [];
    this._requestFeaturesInCells(bounds);
  },
  _cellPoint:function(row, col){
    var x = this._origin.x + (row*this._cellSize);
    var y = this._origin.y + (col*this._cellSize);
    return new L.Point(x, y);
  },
  _cellExtent: function(row, col){
    var swPoint = this._cellPoint(row, col);
    var nePoint = this._cellPoint(row-1, col-1);
    var sw = this._map.unproject(swPoint);
    var ne = this._map.unproject(nePoint);
    return new L.LatLngBounds(ne, sw);
  },
  _cellsInBounds: function(bounds){
    var offset = this._map.project(bounds.getNorthWest());
    var center = bounds.getCenter();
    var offsetX = this._origin.x - offset.x;
    var offsetY = this._origin.y - offset.y;
    var offsetRows = Math.round(offsetX / this._cellSize);
    var offsetCols = Math.round(offsetY / this._cellSize);
    var cells = [];
    for (var i = 0; i <= this._rows; i++) {
      for (var j = 0; j <= this._cols; j++) {
        var row = i-offsetRows;
        var col = j-offsetCols;
        var cellBounds = this._cellExtent(row, col);
        var cellId = row+":"+col;
        cells.push({
          id: cellId,
          bounds: cellBounds,
          distance:cellBounds.getCenter().distanceTo(center)
        });
      }
    }

    cells.sort(function (a, b) {
      return a.distance - b.distance;
    });

    return cells;
  }
});

L.esri.featureLayer = function(url, options){
  return new L.esri.FeatureLayer(url, options);
};