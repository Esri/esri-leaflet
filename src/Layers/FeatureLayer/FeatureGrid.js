import {
  LatLngBounds,
  latLngBounds,
  Layer,
  Browser,
  Util,
  Point,
  Bounds
} from 'leaflet';

export var FeatureGrid = Layer.extend({
  // @section
  // @aka GridLayer options
  options: {
    // @option cellSize: Number|Point = 256
    // Width and height of cells in the grid. Use a number if width and height are equal, or `L.point(width, height)` otherwise.
    cellSize: 512,

    // @option updateWhenIdle: Boolean = (depends)
    // Load new cells only when panning ends.
    // `true` by default on mobile browsers, in order to avoid too many requests and keep smooth navigation.
    // `false` otherwise in order to display new cells _during_ panning, since it is easy to pan outside the
    // [`keepBuffer`](#gridlayer-keepbuffer) option in desktop browsers.
    updateWhenIdle: Browser.mobile,

    // @option updateInterval: Number = 150
    // Cells will not update more than once every `updateInterval` milliseconds when panning.
    updateInterval: 150,

    // @option noWrap: Boolean = false
    // Whether the layer is wrapped around the antimeridian. If `true`, the
    // GridLayer will only be displayed once at low zoom levels. Has no
    // effect when the [map CRS](#map-crs) doesn't wrap around. Can be used
    // in combination with [`bounds`](#gridlayer-bounds) to prevent requesting
    // cells outside the CRS limits.
    noWrap: false,

    // @option keepBuffer: Number = 1.5
    // When panning the map, keep this many rows and columns of cells before unloading them.
    keepBuffer: 1.5
  },

  initialize: function (options) {
    Util.setOptions(this, options);
  },

  onAdd: function (map) {
    this._cells = {};
    this._activeCells = {};
    this._resetView();
    this._update();
  },

  onRemove: function (map) {
    this._removeAllCells();
    this._cellZoom = undefined;
  },

  // @method isLoading: Boolean
  // Returns `true` if any cell in the grid layer has not finished loading.
  isLoading: function () {
    return this._loading;
  },

  // @method redraw: this
  // Causes the layer to clear all the cells and request them again.
  redraw: function () {
    if (this._map) {
      this._removeAllCells();
      this._update();
    }
    return this;
  },

  getEvents: function () {
    var events = {
      viewprereset: this._invalidateAll,
      viewreset: this._resetView,
      zoom: this._resetView,
      moveend: this._onMoveEnd
    };

    if (!this.options.updateWhenIdle) {
      // update cells on move, but not more often than once per given interval
      if (!this._onMove) {
        this._onMove = Util.throttle(
          this._onMoveEnd,
          this.options.updateInterval,
          this
        );
      }

      events.move = this._onMove;
    }

    return events;
  },

  // @section Extension methods
  // Layers extending `GridLayer` shall reimplement the following method.
  // @method createCell(coords: Object, done?: Function): HTMLElement
  // Called only internally, must be overridden by classes extending `GridLayer`.
  // Returns the `HTMLElement` corresponding to the given `coords`. If the `done` callback
  // is specified, it must be called when the cell has finished loading and drawing.
  createCell: function () {
    return document.createElement('div');
  },

  removeCell: function () {

  },

  reuseCell: function () {

  },

  cellLeave: function () {

  },

  cellEnter: function () {

  },
  // @section
  // @method getCellSize: Point
  // Normalizes the [cellSize option](#gridlayer-cellsize) into a point. Used by the `createCell()` method.
  getCellSize: function () {
    var s = this.options.cellSize;
    return s instanceof Point ? s : new Point(s, s);
  },

  _pruneCells: function () {
    if (!this._map) {
      return;
    }

    var key, cell;

    for (key in this._cells) {
      cell = this._cells[key];
      cell.retain = cell.current;
    }

    for (key in this._cells) {
      cell = this._cells[key];
      if (cell.current && !cell.active) {
        var coords = cell.coords;
        if (!this._retainParent(coords.x, coords.y, coords.z, coords.z - 5)) {
          this._retainChildren(coords.x, coords.y, coords.z, coords.z + 2);
        }
      }
    }

    for (key in this._cells) {
      if (!this._cells[key].retain) {
        this._removeCell(key);
      }
    }
  },

  _removeAllCells: function () {
    for (var key in this._cells) {
      this._removeCell(key);
    }
  },

  _invalidateAll: function () {
    this._removeAllCells();

    this._cellZoom = undefined;
  },

  _retainParent: function (x, y, z, minZoom) {
    var x2 = Math.floor(x / 2);
    var y2 = Math.floor(y / 2);
    var z2 = z - 1;
    var coords2 = new Point(+x2, +y2);
    coords2.z = +z2;

    var key = this._cellCoordsToKey(coords2);
    var cell = this._cells[key];

    if (cell && cell.active) {
      cell.retain = true;
      return true;
    } else if (cell && cell.loaded) {
      cell.retain = true;
    }

    if (z2 > minZoom) {
      return this._retainParent(x2, y2, z2, minZoom);
    }

    return false;
  },

  _retainChildren: function (x, y, z, maxZoom) {
    for (var i = 2 * x; i < 2 * x + 2; i++) {
      for (var j = 2 * y; j < 2 * y + 2; j++) {
        var coords = new Point(i, j);
        coords.z = z + 1;

        var key = this._cellCoordsToKey(coords);
        var cell = this._cells[key];

        if (cell && cell.active) {
          cell.retain = true;
          continue;
        } else if (cell && cell.loaded) {
          cell.retain = true;
        }

        if (z + 1 < maxZoom) {
          this._retainChildren(i, j, z + 1, maxZoom);
        }
      }
    }
  },

  _resetView: function (e) {
    var animating = e && (e.pinch || e.flyTo);

    if (animating) {
      return;
    }

    this._setView(
      this._map.getCenter(),
      this._map.getZoom(),
      animating,
      animating
    );
  },

  _setView: function (center, zoom, noPrune, noUpdate) {
    var cellZoom = Math.round(zoom);

    if (!noUpdate) {
      this._cellZoom = cellZoom;

      if (this._abortLoading) {
        this._abortLoading();
      }

      this._resetGrid();

      if (cellZoom !== undefined) {
        this._update(center);
      }

      if (!noPrune) {
        this._pruneCells();
      }

      // Flag to prevent _updateOpacity from pruning cells during
      // a zoom anim or a pinch gesture
      this._noPrune = !!noPrune;
    }
  },

  _resetGrid: function () {
    var map = this._map;
    var crs = map.options.crs;
    var cellSize = (this._cellSize = this.getCellSize());
    var cellZoom = this._cellZoom;

    var bounds = this._map.getPixelWorldBounds(this._cellZoom);
    if (bounds) {
      this._globalCellRange = this._pxBoundsToCellRange(bounds);
    }

    this._wrapX = crs.wrapLng &&
      !this.options.noWrap && [
      Math.floor(map.project([0, crs.wrapLng[0]], cellZoom).x / cellSize.x),
      Math.ceil(map.project([0, crs.wrapLng[1]], cellZoom).x / cellSize.y)
    ];
    this._wrapY = crs.wrapLat &&
      !this.options.noWrap && [
      Math.floor(map.project([crs.wrapLat[0], 0], cellZoom).y / cellSize.x),
      Math.ceil(map.project([crs.wrapLat[1], 0], cellZoom).y / cellSize.y)
    ];
  },

  _onMoveEnd: function (e) {
    var animating = e && (e.pinch || e.flyTo);

    if (animating || !this._map || this._map._animatingZoom) {
      return;
    }

    this._update();
  },

  _getCelldPixelBounds: function (center) {
    var map = this._map;
    var mapZoom = map._animatingZoom
      ? Math.max(map._animateToZoom, map.getZoom())
      : map.getZoom();
    var scale = map.getZoomScale(mapZoom, this._cellZoom);
    var pixelCenter = map.project(center, this._cellZoom).floor();
    var halfSize = map.getSize().divideBy(scale * 2);

    return new Bounds(
      pixelCenter.subtract(halfSize),
      pixelCenter.add(halfSize)
    );
  },

  // Private method to load cells in the grid's active zoom level according to map bounds
  _update: function (center) {
    var map = this._map;
    if (!map) {
      return;
    }
    var zoom = Math.round(map.getZoom());

    if (center === undefined) {
      center = map.getCenter();
    }

    var pixelBounds = this._getCelldPixelBounds(center);
    var cellRange = this._pxBoundsToCellRange(pixelBounds);
    var cellCenter = cellRange.getCenter();
    var queue = [];
    var margin = this.options.keepBuffer;
    var noPruneRange = new Bounds(
      cellRange.getBottomLeft().subtract([margin, -margin]),
      cellRange.getTopRight().add([margin, -margin])
    );

    // Sanity check: panic if the cell range contains Infinity somewhere.
    if (
      !(
        isFinite(cellRange.min.x) &&
        isFinite(cellRange.min.y) &&
        isFinite(cellRange.max.x) &&
        isFinite(cellRange.max.y)
      )
    ) {
      throw new Error('Attempted to load an infinite number of cells');
    }

    for (var key in this._cells) {
      var c = this._cells[key].coords;
      if (
        c.z !== this._cellZoom ||
        !noPruneRange.contains(new Point(c.x, c.y))
      ) {
        this._cells[key].current = false;
      }
    }

    // _update just loads more cells. If the cell zoom level differs too much
    // from the map's, let _setView reset levels and prune old cells.
    if (Math.abs(zoom - this._cellZoom) > 1) {
      this._setView(center, zoom);
      return;
    }

    // create a queue of coordinates to load cells from
    for (var j = cellRange.min.y; j <= cellRange.max.y; j++) {
      for (var i = cellRange.min.x; i <= cellRange.max.x; i++) {
        var coords = new Point(i, j);
        coords.z = this._cellZoom;

        if (!this._isValidCell(coords)) {
          continue;
        }

        var cell = this._cells[this._cellCoordsToKey(coords)];
        if (cell) {
          cell.current = true;
        } else {
          queue.push(coords);
        }
      }
    }

    // sort cell queue to load cells in order of their distance to center
    queue.sort(function (a, b) {
      return a.distanceTo(cellCenter) - b.distanceTo(cellCenter);
    });

    if (queue.length !== 0) {
      // if it's the first batch of cells to load
      if (!this._loading) {
        this._loading = true;
      }

      for (i = 0; i < queue.length; i++) {
        var _key = this._cellCoordsToKey(queue[i]);
        var _coords = this._keyToCellCoords(_key);
        if (this._activeCells[_coords]) {
          this._reuseCell(queue[i]);
        } else {
          this._createCell(queue[i]);
        }
      }
    }
  },

  _isValidCell: function (coords) {
    var crs = this._map.options.crs;

    if (!crs.infinite) {
      // don't load cell if it's out of bounds and not wrapped
      var bounds = this._globalCellRange;
      if (
        (!crs.wrapLng &&
          (coords.x < bounds.min.x || coords.x > bounds.max.x)) ||
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
    return latLngBounds(this.options.bounds).overlaps(cellBounds);
  },

  _keyToBounds: function (key) {
    return this._cellCoordsToBounds(this._keyToCellCoords(key));
  },

  _cellCoordsToNwSe: function (coords) {
    var map = this._map;
    var cellSize = this.getCellSize();
    var nwPoint = coords.scaleBy(cellSize);
    var sePoint = nwPoint.add(cellSize);
    var nw = map.unproject(nwPoint, coords.z);
    var se = map.unproject(sePoint, coords.z);

    return [nw, se];
  },

  // converts cell coordinates to its geographical bounds
  _cellCoordsToBounds: function (coords) {
    var bp = this._cellCoordsToNwSe(coords);
    var bounds = new LatLngBounds(bp[0], bp[1]);

    if (!this.options.noWrap) {
      bounds = this._map.wrapLatLngBounds(bounds);
    }
    return bounds;
  },
  // converts cell coordinates to key for the cell cache
  _cellCoordsToKey: function (coords) {
    return coords.x + ':' + coords.y + ':' + coords.z;
  },

  // converts cell cache key to coordinates
  _keyToCellCoords: function (key) {
    var k = key.split(':');
    var coords = new Point(+k[0], +k[1]);

    coords.z = +k[2];
    return coords;
  },

  _removeCell: function (key) {
    var cell = this._cells[key];

    if (!cell) {
      return;
    }

    var coords = this._keyToCellCoords(key);
    var wrappedCoords = this._wrapCoords(coords);
    var cellBounds = this._cellCoordsToBounds(this._wrapCoords(coords));

    cell.current = false;

    delete this._cells[key];
    this._activeCells[key] = cell;

    this.cellLeave(cellBounds, wrappedCoords, key);

    this.fire('cellleave', {
      key: key,
      coords: wrappedCoords,
      bounds: cellBounds
    });
  },

  _reuseCell: function (coords) {
    var key = this._cellCoordsToKey(coords);

    // save cell in cache
    this._cells[key] = this._activeCells[key];
    this._cells[key].current = true;

    var wrappedCoords = this._wrapCoords(coords);
    var cellBounds = this._cellCoordsToBounds(this._wrapCoords(coords));

    this.cellEnter(cellBounds, wrappedCoords, key);

    this.fire('cellenter', {
      key: key,
      coords: wrappedCoords,
      bounds: cellBounds
    });
  },

  _createCell: function (coords) {
    var key = this._cellCoordsToKey(coords);

    var wrappedCoords = this._wrapCoords(coords);
    var cellBounds = this._cellCoordsToBounds(this._wrapCoords(coords));

    this.createCell(cellBounds, wrappedCoords, key);

    this.fire('cellcreate', {
      key: key,
      coords: wrappedCoords,
      bounds: cellBounds
    });

    // save cell in cache
    this._cells[key] = {
      coords: coords,
      current: true
    };

    Util.requestAnimFrame(this._pruneCells, this);
  },

  _cellReady: function (coords, err, cell) {
    var key = this._cellCoordsToKey(coords);

    cell = this._cells[key];

    if (!cell) {
      return;
    }

    cell.loaded = +new Date();

    cell.active = true;
  },

  _getCellPos: function (coords) {
    return coords.scaleBy(this.getCellSize());
  },

  _wrapCoords: function (coords) {
    var newCoords = new Point(
      this._wrapX ? Util.wrapNum(coords.x, this._wrapX) : coords.x,
      this._wrapY ? Util.wrapNum(coords.y, this._wrapY) : coords.y
    );
    newCoords.z = coords.z;
    return newCoords;
  },

  _pxBoundsToCellRange: function (bounds) {
    var cellSize = this.getCellSize();
    return new Bounds(
      bounds.min.unscaleBy(cellSize).floor(),
      bounds.max.unscaleBy(cellSize).ceil().subtract([1, 1])
    );
  }
});
