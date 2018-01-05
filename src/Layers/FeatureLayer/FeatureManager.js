import { Util } from 'leaflet';
import featureLayerService from '../../Services/FeatureLayerService';
import { getUrlParams, warn, setEsriAttribution } from '../../Util';
import VirtualGrid from 'leaflet-virtual-grid';
import BinarySearchIndex from 'tiny-binary-search';

export var FeatureManager = VirtualGrid.extend({
  /**
   * Options
   */

  options: {
    attribution: null,
    where: '1=1',
    fields: ['*'],
    from: false,
    to: false,
    timeField: false,
    timeFilterMode: 'server',
    simplifyFactor: 0,
    precision: 6
  },

  /**
   * Constructor
   */

  initialize: function (options) {
    VirtualGrid.prototype.initialize.call(this, options);

    options = getUrlParams(options);
    options = Util.setOptions(this, options);

    this.service = featureLayerService(options);
    this.service.addEventParent(this);

    // use case insensitive regex to look for common fieldnames used for indexing
    if (this.options.fields[0] !== '*') {
      var oidCheck = false;
      for (var i = 0; i < this.options.fields.length; i++) {
        if (this.options.fields[i].match(/^(OBJECTID|FID|OID|ID)$/i)) {
          oidCheck = true;
        }
      }
      if (oidCheck === false) {
        warn('no known esriFieldTypeOID field detected in fields Array.  Please add an attribute field containing unique IDs to ensure the layer can be drawn correctly.');
      }
    }

    if (this.options.timeField.start && this.options.timeField.end) {
      this._startTimeIndex = new BinarySearchIndex();
      this._endTimeIndex = new BinarySearchIndex();
    } else if (this.options.timeField) {
      this._timeIndex = new BinarySearchIndex();
    }

    this._cache = {};
    this._currentSnapshot = []; // cache of what layers should be active
    this._activeRequests = 0;
  },

  /**
   * Layer Interface
   */

  onAdd: function (map) {
    // include 'Powered by Esri' in map attribution
    setEsriAttribution(map);

    this.service.metadata(function (err, metadata) {
      if (!err) {
        var supportedFormats = metadata.supportedQueryFormats;

        // Check if someone has requested that we don't use geoJSON, even if it's available
        var forceJsonFormat = false;
        if (this.service.options.isModern === false) {
          forceJsonFormat = true;
        }

        // Unless we've been told otherwise, check to see whether service can emit GeoJSON natively
        if (!forceJsonFormat && supportedFormats && supportedFormats.indexOf('geoJSON') !== -1) {
          this.service.options.isModern = true;
        }

        // add copyright text listed in service metadata
        if (!this.options.attribution && map.attributionControl && metadata.copyrightText) {
          this.options.attribution = metadata.copyrightText;
          map.attributionControl.addAttribution(this.getAttribution());
        }
      }
    }, this);

    map.on('zoomend', this._handleZoomChange, this);

    return VirtualGrid.prototype.onAdd.call(this, map);
  },

  onRemove: function (map) {
    map.off('zoomend', this._handleZoomChange, this);

    return VirtualGrid.prototype.onRemove.call(this, map);
  },

  getAttribution: function () {
    return this.options.attribution;
  },

  /**
   * Feature Management
   */

  createCell: function (bounds, coords) {
    // dont fetch features outside the scale range defined for the layer
    if (this._visibleZoom()) {
      this._requestFeatures(bounds, coords);
    }
  },

  _requestFeatures: function (bounds, coords, callback) {
    this._activeRequests++;

    // our first active request fires loading
    if (this._activeRequests === 1) {
      this.fire('loading', {
        bounds: bounds
      }, true);
    }

    return this._buildQuery(bounds).run(function (error, featureCollection, response) {
      if (response && response.exceededTransferLimit) {
        this.fire('drawlimitexceeded');
      }

      // no error, features
      if (!error && featureCollection && featureCollection.features.length) {
        // schedule adding features until the next animation frame
        Util.requestAnimFrame(Util.bind(function () {
          this._addFeatures(featureCollection.features, coords);
          this._postProcessFeatures(bounds);
        }, this));
      }

      // no error, no features
      if (!error && featureCollection && !featureCollection.features.length) {
        this._postProcessFeatures(bounds);
      }

      if (error) {
        this._postProcessFeatures(bounds);
      }

      if (callback) {
        callback.call(this, error, featureCollection);
      }
    }, this);
  },

  _postProcessFeatures: function (bounds) {
    // deincrement the request counter now that we have processed features
    this._activeRequests--;

    // if there are no more active requests fire a load event for this view
    if (this._activeRequests <= 0) {
      this.fire('load', {
        bounds: bounds
      });
    }
  },

  _cacheKey: function (coords) {
    return coords.z + ':' + coords.x + ':' + coords.y;
  },

  _addFeatures: function (features, coords) {
    var key = this._cacheKey(coords);
    this._cache[key] = this._cache[key] || [];

    for (var i = features.length - 1; i >= 0; i--) {
      var id = features[i].id;

      if (this._currentSnapshot.indexOf(id) === -1) {
        this._currentSnapshot.push(id);
      }
      if (this._cache[key].indexOf(id) === -1) {
        this._cache[key].push(id);
      }
    }

    if (this.options.timeField) {
      this._buildTimeIndexes(features);
    }

    this.createLayers(features);
  },

  _buildQuery: function (bounds) {
    var query = this.service.query()
      .intersects(bounds)
      .where(this.options.where)
      .fields(this.options.fields)
      .precision(this.options.precision);

    if (this.options.requestParams) {
      L.extend(query.params, this.options.requestParams);
    }

    if (this.options.simplifyFactor) {
      query.simplify(this._map, this.options.simplifyFactor);
    }

    if (this.options.timeFilterMode === 'server' && this.options.from && this.options.to) {
      query.between(this.options.from, this.options.to);
    }

    return query;
  },

  /**
   * Where Methods
   */

  setWhere: function (where, callback, context) {
    this.options.where = (where && where.length) ? where : '1=1';

    var oldSnapshot = [];
    var newSnapshot = [];
    var pendingRequests = 0;
    var requestError = null;
    var requestCallback = Util.bind(function (error, featureCollection) {
      if (error) {
        requestError = error;
      }

      if (featureCollection) {
        for (var i = featureCollection.features.length - 1; i >= 0; i--) {
          newSnapshot.push(featureCollection.features[i].id);
        }
      }

      pendingRequests--;

      if (pendingRequests <= 0 && this._visibleZoom()) {
        this._currentSnapshot = newSnapshot;
        // schedule adding features for the next animation frame
        Util.requestAnimFrame(Util.bind(function () {
          this.removeLayers(oldSnapshot);
          this.addLayers(newSnapshot);
          if (callback) {
            callback.call(context, requestError);
          }
        }, this));
      }
    }, this);

    for (var i = this._currentSnapshot.length - 1; i >= 0; i--) {
      oldSnapshot.push(this._currentSnapshot[i]);
    }

    for (var key in this._activeCells) {
      pendingRequests++;
      var coords = this._keyToCellCoords(key);
      var bounds = this._cellCoordsToBounds(coords);
      this._requestFeatures(bounds, key, requestCallback);
    }

    return this;
  },

  getWhere: function () {
    return this.options.where;
  },

  /**
   * Time Range Methods
   */

  getTimeRange: function () {
    return [this.options.from, this.options.to];
  },

  setTimeRange: function (from, to, callback, context) {
    var oldFrom = this.options.from;
    var oldTo = this.options.to;
    var pendingRequests = 0;
    var requestError = null;
    var requestCallback = Util.bind(function (error) {
      if (error) {
        requestError = error;
      }
      this._filterExistingFeatures(oldFrom, oldTo, from, to);

      pendingRequests--;

      if (callback && pendingRequests <= 0) {
        callback.call(context, requestError);
      }
    }, this);

    this.options.from = from;
    this.options.to = to;

    this._filterExistingFeatures(oldFrom, oldTo, from, to);

    if (this.options.timeFilterMode === 'server') {
      for (var key in this._activeCells) {
        pendingRequests++;
        var coords = this._keyToCellCoords(key);
        var bounds = this._cellCoordsToBounds(coords);
        this._requestFeatures(bounds, key, requestCallback);
      }
    }

    return this;
  },

  refresh: function () {
    for (var key in this._activeCells) {
      var coords = this._keyToCellCoords(key);
      var bounds = this._cellCoordsToBounds(coords);
      this._requestFeatures(bounds, key);
    }

    if (this.redraw) {
      this.once('load', function () {
        this.eachFeature(function (layer) {
          this._redraw(layer.feature.id);
        }, this);
      }, this);
    }
  },

  _filterExistingFeatures: function (oldFrom, oldTo, newFrom, newTo) {
    var layersToRemove = (oldFrom && oldTo) ? this._getFeaturesInTimeRange(oldFrom, oldTo) : this._currentSnapshot;
    var layersToAdd = this._getFeaturesInTimeRange(newFrom, newTo);

    if (layersToAdd.indexOf) {
      for (var i = 0; i < layersToAdd.length; i++) {
        var shouldRemoveLayer = layersToRemove.indexOf(layersToAdd[i]);
        if (shouldRemoveLayer >= 0) {
          layersToRemove.splice(shouldRemoveLayer, 1);
        }
      }
    }

    // schedule adding features until the next animation frame
    Util.requestAnimFrame(Util.bind(function () {
      this.removeLayers(layersToRemove);
      this.addLayers(layersToAdd);
    }, this));
  },

  _getFeaturesInTimeRange: function (start, end) {
    var ids = [];
    var search;

    if (this.options.timeField.start && this.options.timeField.end) {
      var startTimes = this._startTimeIndex.between(start, end);
      var endTimes = this._endTimeIndex.between(start, end);
      search = startTimes.concat(endTimes);
    } else {
      search = this._timeIndex.between(start, end);
    }

    for (var i = search.length - 1; i >= 0; i--) {
      ids.push(search[i].id);
    }

    return ids;
  },

  _buildTimeIndexes: function (geojson) {
    var i;
    var feature;
    if (this.options.timeField.start && this.options.timeField.end) {
      var startTimeEntries = [];
      var endTimeEntries = [];
      for (i = geojson.length - 1; i >= 0; i--) {
        feature = geojson[i];
        startTimeEntries.push({
          id: feature.id,
          value: new Date(feature.properties[this.options.timeField.start])
        });
        endTimeEntries.push({
          id: feature.id,
          value: new Date(feature.properties[this.options.timeField.end])
        });
      }
      this._startTimeIndex.bulkAdd(startTimeEntries);
      this._endTimeIndex.bulkAdd(endTimeEntries);
    } else {
      var timeEntries = [];
      for (i = geojson.length - 1; i >= 0; i--) {
        feature = geojson[i];
        timeEntries.push({
          id: feature.id,
          value: new Date(feature.properties[this.options.timeField])
        });
      }

      this._timeIndex.bulkAdd(timeEntries);
    }
  },

  _featureWithinTimeRange: function (feature) {
    if (!this.options.from || !this.options.to) {
      return true;
    }

    var from = +this.options.from.valueOf();
    var to = +this.options.to.valueOf();

    if (typeof this.options.timeField === 'string') {
      var date = +feature.properties[this.options.timeField];
      return (date >= from) && (date <= to);
    }

    if (this.options.timeField.start && this.options.timeField.end) {
      var startDate = +feature.properties[this.options.timeField.start];
      var endDate = +feature.properties[this.options.timeField.end];
      return ((startDate >= from) && (startDate <= to)) || ((endDate >= from) && (endDate <= to));
    }
  },

  _visibleZoom: function () {
    // check to see whether the current zoom level of the map is within the optional limit defined for the FeatureLayer
    if (!this._map) {
      return false;
    }
    var zoom = this._map.getZoom();
    if (zoom > this.options.maxZoom || zoom < this.options.minZoom) {
      return false;
    } else { return true; }
  },

  _handleZoomChange: function () {
    if (!this._visibleZoom()) {
      this.removeLayers(this._currentSnapshot);
      this._currentSnapshot = [];
    } else {
      /*
      for every cell in this._activeCells
        1. Get the cache key for the coords of the cell
        2. If this._cache[key] exists it will be an array of feature IDs.
        3. Call this.addLayers(this._cache[key]) to instruct the feature layer to add the layers back.
      */
      for (var i in this._activeCells) {
        var coords = this._activeCells[i].coords;
        var key = this._cacheKey(coords);
        if (this._cache[key]) {
          this.addLayers(this._cache[key]);
        }
      }
    }
  },

  /**
   * Service Methods
   */

  authenticate: function (token) {
    this.service.authenticate(token);
    return this;
  },

  metadata: function (callback, context) {
    this.service.metadata(callback, context);
    return this;
  },

  query: function () {
    return this.service.query();
  },

  _getMetadata: function (callback) {
    if (this._metadata) {
      var error;
      callback(error, this._metadata);
    } else {
      this.metadata(Util.bind(function (error, response) {
        this._metadata = response;
        callback(error, this._metadata);
      }, this));
    }
  },

  addFeature: function (feature, callback, context) {
    this._getMetadata(Util.bind(function (error, metadata) {
      if (error) {
        if (callback) { callback.call(this, error, null); }
        return;
      }

      this.service.addFeature(feature, Util.bind(function (error, response) {
        if (!error) {
          // assign ID from result to appropriate objectid field from service metadata
          feature.properties[metadata.objectIdField] = response.objectId;

          // we also need to update the geojson id for createLayers() to function
          feature.id = response.objectId;
          this.createLayers([feature]);
        }

        if (callback) {
          callback.call(context, error, response);
        }
      }, this));
    }, this));
  },

  updateFeature: function (feature, callback, context) {
    this.service.updateFeature(feature, function (error, response) {
      if (!error) {
        this.removeLayers([feature.id], true);
        this.createLayers([feature]);
      }

      if (callback) {
        callback.call(context, error, response);
      }
    }, this);
  },

  deleteFeature: function (id, callback, context) {
    this.service.deleteFeature(id, function (error, response) {
      if (!error && response.objectId) {
        this.removeLayers([response.objectId], true);
      }
      if (callback) {
        callback.call(context, error, response);
      }
    }, this);
  },

  deleteFeatures: function (ids, callback, context) {
    return this.service.deleteFeatures(ids, function (error, response) {
      if (!error && response.length > 0) {
        for (var i = 0; i < response.length; i++) {
          this.removeLayers([response[i].objectId], true);
        }
      }
      if (callback) {
        callback.call(context, error, response);
      }
    }, this);
  }
});
