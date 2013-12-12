L.esri.Mixins.featureGrid = {
  _activeRequests: 0,
  _initializeFeatureGrid: function(map){
    this._map = map;
    this._previousCells = [];
    this.center = this._map.getCenter();
    this.origin = this._map.project(this.center);

    this._moveHandler = L.esri.Util.debounce(function(e){
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
    map.off("zoomend resize move", this._moveHandler, this);
  },
  _requestFeatures: function(bounds){
    var cells = this._cellsWithin(bounds);

    if(cells) {
      this.fire("loading", {
        bounds: bounds
      });
    }

    for (var i = 0; i < cells.length; i++) {
      this._makeRequest(cells[i], cells, bounds);
    }
  },
  _makeRequest: function(cell, cells, bounds){
    this._activeRequests++;

    L.esri.get(this.url+"query", {
      geometryType: "esriGeometryEnvelope",
      geometry: JSON.stringify(L.esri.Util.boundsToExtent(cell.bounds)),
      outFields:"*",
      outSR: 4326,
      inSR: 4326
    }, function(response){

      //deincriment the request counter
      this._activeRequests--;

      // if there are no more active requests fire a load event for this view
      if(this._activeRequests <= 0){
        this.fire("load", {
          bounds: bounds
        });
      }

      // call the render method to render features
      this._render(response);
    }, this);
  },
  _cellsWithin: function(mapBounds){
    var size = this._map.getSize();
    var offset = this._map.project(this._map.getCenter());
    var padding = Math.min(this.options.cellSize/size.x, this.options.cellSize/size.y);
    var bounds = mapBounds.pad(0.1);
    var cells = [];

    var topLeftPoint = this._map.project(bounds.getNorthWest());
    var bottomRightPoint = this._map.project(bounds.getSouthEast());

    var topLeft = topLeftPoint.subtract(offset).divideBy(this.options.cellSize);
    var bottomRight = bottomRightPoint.subtract(offset).divideBy(this.options.cellSize);

    var offsetRows = Math.round((this.origin.x - offset.x) / this.options.cellSize);
    var offsetCols = Math.round((this.origin.y - offset.y) / this.options.cellSize);

    var minRow = L.esri.Util.roundAwayFromZero(topLeft.x)-offsetRows;
    var maxRow = L.esri.Util.roundAwayFromZero(bottomRight.x)-offsetRows;
    var minCol = L.esri.Util.roundAwayFromZero(topLeft.y)-offsetCols;
    var maxCol = L.esri.Util.roundAwayFromZero(bottomRight.y)-offsetCols;

    for (var row = minRow; row < maxRow; row++) {
      for (var col = minCol; col < maxCol; col++) {
        var cellId = "cell:"+row+":"+col;
        var duplicate = L.esri.Util.indexOf(this._previousCells, cellId) >= 0;

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
};
