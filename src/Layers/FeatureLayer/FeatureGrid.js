import L from 'leaflet';

export var FeatureGrid = L.Layer.extend({

  options: {
    cellSize: 512,
    updateInterval: 150
  },

  initialize: function (options) {
    options = L.setOptions(this, options);
    this._zooming = false;
  },

  onAdd: function (map) {
    this._map = map;
    this._update = L.Util.throttle(this._update, this.options.updateInterval, this);
    this._reset();
    this._update();
  },

  onRemove: function () {
    this._map.removeEventListener(this.getEvents(), this);
    this._removeCells();
  },

  getEvents: function () {
    var events = {
      moveend: this._update,
      zoomstart: this._zoomstart,
      zoomend: this._reset
    };

    return events;
  },

  addTo: function (map) {
    map.addLayer(this);
    return this;
  },

  removeFrom: function (map, reason) {
    map.removeLayer(this);
    if(reason == "temporary"){
      this._map = map;
      map.addEventListener(this.getEvents(), this);
    }
    return this;
  },

  _zoomstart: function () {
    this._zooming = true;
  },

  _reset: function () {
    this._removeCells();

    this._cells = {};
    this._activeCells = {};
    this._cellsToLoad = 0;
    this._cellsTotal = 0;
    this._cellNumBounds = this._getCellNumBounds();
    
    if(Object.keys(this._layers).length>0){
      this._resetWrap();
    } 
    this._zooming = false;
    this._checkZoomLevels();
  },

  _checkZoomLevels: function() {
    var zoom = this._map.getZoom();

    if (zoom > this.options.maxZoom || zoom < this.options.minZoom) {
      if(Object.keys(this._layers).length>0) {
        this.removeFrom(this._map, "temporary");
      }
    }
    else{
      if(Object.keys(this._layers).length>0) {
        this._map = map;
        map.addLayer(this);
      }
    }
  },

  _resetWrap: function () {
    var map = this._map;
    var crs = map.options.crs;

    if (crs.infinite) { return; }

    var cellSize = this._getCellSize();

    if (crs.wrapLng) {
      this._wrapLng = [
        Math.floor(map.project([0, crs.wrapLng[0]]).x / cellSize),
        Math.ceil(map.project([0, crs.wrapLng[1]]).x / cellSize)
      ];
    }

    if (crs.wrapLat) {
      this._wrapLat = [
        Math.floor(map.project([crs.wrapLat[0], 0]).y / cellSize),
        Math.ceil(map.project([crs.wrapLat[1], 0]).y / cellSize)
      ];
    }
  },

  _getCellSize: function () {
    return this.options.cellSize;
  },

  _update: function () {
    if (!this._map) { return; }

    var bounds = this._map.getPixelBounds();
    var zoom = this._map.getZoom();
    var cellSize = this._getCellSize();

    if (zoom > this.options.maxZoom ||
        zoom < this.options.minZoom) { return; }

    // cell coordinates range for the current view
    var cellBounds = L.bounds(
      bounds.min.divideBy(cellSize).floor(),
      bounds.max.divideBy(cellSize).floor());

    this._removeOtherCells(cellBounds);
    this._addCells(cellBounds);
  },

  _addCells: function (bounds) {
    var queue = [];
    var center = bounds.getCenter();
    var zoom = this._map.getZoom();

    var j, i, coords;
    // create a queue of coordinates to load cells from
    for (j = bounds.min.y; j <= bounds.max.y; j++) {
      for (i = bounds.min.x; i <= bounds.max.x; i++) {
        coords = L.point(i, j);
        coords.z = zoom;

        if (this._isValidCell(coords)) {
          queue.push(coords);
        }
      }
    }

    var cellsToLoad = queue.length;

    if (cellsToLoad === 0) { return; }

    this._cellsToLoad += cellsToLoad;
    this._cellsTotal += cellsToLoad;

    // sort cell queue to load cells in order of their distance to center
    queue.sort(function (a, b) {
      return a.distanceTo(center) - b.distanceTo(center);
    });

    for (i = 0; i < cellsToLoad; i++) {
      this._addCell(queue[i]);
    }
  },

  _isValidCell: function (coords) {
    var crs = this._map.options.crs;

    if (!crs.infinite) {
      // don't load cell if it's out of bounds and not wrapped
      var bounds = this._cellNumBounds;
      if (
        (!crs.wrapLng && (coords.x < bounds.min.x || coords.x > bounds.max.x)) ||
        (!crs.wrapLat && (coords.y < bounds.min.y || coords.y > bounds.max.y))
      ) {
        return false;
      }
    }

    if (!this.options.bounds) {
      return true;
    }

    // don't load cell if it doesn't intersect the bounds in options
    var cellBounds = this._cellCoordsToBounds(coords);
    return L.latLngBounds(this.options.bounds).intersects(cellBounds);
  },

  // converts cell coordinates to its geographical bounds
  _cellCoordsToBounds: function (coords) {
    var map = this._map;
    var cellSize = this.options.cellSize;
    var nwPoint = coords.multiplyBy(cellSize);
    var sePoint = nwPoint.add([cellSize, cellSize]);
    var nw = map.wrapLatLng(map.unproject(nwPoint, coords.z));
    var se = map.wrapLatLng(map.unproject(sePoint, coords.z));

    return L.latLngBounds(nw, se);
  },

  // converts cell coordinates to key for the cell cache
  _cellCoordsToKey: function (coords) {
    return coords.x + ':' + coords.y;
  },

  // converts cell cache key to coordiantes
  _keyToCellCoords: function (key) {
    var kArr = key.split(':');
    var x = parseInt(kArr[0], 10);
    var y = parseInt(kArr[1], 10);

    return L.point(x, y);
  },

  // remove any present cells that are off the specified bounds
  _removeOtherCells: function (bounds) {
    for (var key in this._cells) {
      if (!bounds.contains(this._keyToCellCoords(key))) {
        this._removeCell(key);
      }
    }
  },

  _removeCell: function (key) {
    var cell = this._activeCells[key];

    if (cell) {
      delete this._activeCells[key];

      if (this.cellLeave) {
        this.cellLeave(cell.bounds, cell.coords);
      }

      this.fire('cellleave', {
        bounds: cell.bounds,
        coords: cell.coords
      });
    }
  },

  _removeCells: function () {
    for (var key in this._cells) {
      var bounds = this._cells[key].bounds;
      var coords = this._cells[key].coords;

      if (this.cellLeave) {
        this.cellLeave(bounds, coords);
      }

      this.fire('cellleave', {
        bounds: bounds,
        coords: coords
      });
    }
  },

  _addCell: function (coords) {
    // wrap cell coords if necessary (depending on CRS)
    this._wrapCoords(coords);

    // generate the cell key
    var key = this._cellCoordsToKey(coords);

    // get the cell from the cache
    var cell = this._cells[key];
    // if this cell should be shown as isnt active yet (enter)

    if (cell && !this._activeCells[key]) {
      if (this.cellEnter) {
        this.cellEnter(cell.bounds, coords);
      }

      this.fire('cellenter', {
        bounds: cell.bounds,
        coords: coords
      });

      this._activeCells[key] = cell;
    }

    // if we dont have this cell in the cache yet (create)
    if (!cell) {
      cell = {
        coords: coords,
        bounds: this._cellCoordsToBounds(coords)
      };

      this._cells[key] = cell;
      this._activeCells[key] = cell;

      if (this.createCell) {
        this.createCell(cell.bounds, coords);
      }

      this.fire('cellcreate', {
        bounds: cell.bounds,
        coords: coords
      });
    }
  },

  _wrapCoords: function (coords) {
    coords.x = this._wrapLng ? L.Util.wrapNum(coords.x, this._wrapLng) : coords.x;
    coords.y = this._wrapLat ? L.Util.wrapNum(coords.y, this._wrapLat) : coords.y;
  },

  // get the global cell coordinates range for the current zoom
  _getCellNumBounds: function () {
    var bounds = this._map.getPixelWorldBounds();
    var size = this._getCellSize();

    return bounds ? L.bounds(
        bounds.min.divideBy(size).floor(),
        bounds.max.divideBy(size).ceil().subtract([1, 1])) : null;
  }
});
