import { Util } from "leaflet";
import featureLayerService from "../../Services/FeatureLayerService.js";
import {
  getUrlParams,
  warn,
  setEsriAttribution,
  removeEsriAttribution,
} from "../../Util.js";
import { FeatureGrid } from "./FeatureGrid.js";
import BinarySearchIndex from "tiny-binary-search";

export const FeatureManager = FeatureGrid.extend({
  /**
   * Options
   */

  options: {
    attribution: null,
    where: "1=1",
    fields: ["*"],
    from: false,
    to: false,
    timeField: false,
    timeFilterMode: "server",
    simplifyFactor: 0,
    precision: 6,
    fetchAllFeatures: false,
  },

  /**
   * Constructor
   */

  initialize(options) {
    FeatureGrid.prototype.initialize.call(this, options);

    options = getUrlParams(options);
    options = Util.setOptions(this, options);

    this.service = featureLayerService(options);
    this.service.addEventParent(this);

    // use case insensitive regex to look for common fieldnames used for indexing
    if (this.options.fields[0] !== "*") {
      let oidCheck = false;
      for (let i = 0; i < this.options.fields.length; i++) {
        if (this.options.fields[i].match(/^(OBJECTID|FID|OID|ID)$/i)) {
          oidCheck = true;
        }
      }
      if (oidCheck === false) {
        warn(
          "no known esriFieldTypeOID field detected in fields Array.  Please add an attribute field containing unique IDs to ensure the layer can be drawn correctly.",
        );
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

  onAdd(map) {
    // include 'Powered by Esri' in map attribution
    setEsriAttribution(map);

    this.service.metadata(function (err, metadata) {
      if (!err) {
        const supportedFormats = metadata.supportedQueryFormats;

        // Check if someone has requested that we don't use geoJSON, even if it's available
        let forceJsonFormat = false;
        if (
          this.service.options.isModern === false ||
          this.options.fetchAllFeatures
        ) {
          forceJsonFormat = true;
        }

        // Unless we've been told otherwise, check to see whether service can emit GeoJSON natively
        if (
          !forceJsonFormat &&
          supportedFormats &&
          supportedFormats.indexOf("geoJSON") !== -1
        ) {
          this.service.options.isModern = true;
        }

        if (metadata.objectIdField) {
          this.service.options.idAttribute = metadata.objectIdField;
        }

        // add copyright text listed in service metadata
        if (
          !this.options.attribution &&
          map.attributionControl &&
          metadata.copyrightText
        ) {
          this.options.attribution = metadata.copyrightText;
          map.attributionControl.addAttribution(this.getAttribution());
        }
      }
    }, this);

    map.on("zoomend", this._handleZoomChange, this);

    return FeatureGrid.prototype.onAdd.call(this, map);
  },

  onRemove(map) {
    removeEsriAttribution(map);
    map.off("zoomend", this._handleZoomChange, this);

    return FeatureGrid.prototype.onRemove.call(this, map);
  },

  getAttribution() {
    return this.options.attribution;
  },

  /**
   * Feature Management
   */

  createCell(bounds, coords) {
    // dont fetch features outside the scale range defined for the layer
    if (this._visibleZoom()) {
      this._requestFeatures(bounds, coords);
    }
  },

  _requestFeatures(bounds, coords, callback, offset) {
    this._activeRequests++;

    // default param
    offset = offset || 0;

    const originalWhere = this.options.where;

    // our first active request fires loading
    if (this._activeRequests === 1) {
      this.fire(
        "loading",
        {
          bounds,
        },
        true,
      );
    }

    return this._buildQuery(bounds, offset).run(function (
      error,
      featureCollection,
      response,
    ) {
      if (response && response.exceededTransferLimit) {
        this.fire("drawlimitexceeded");
      }

      // the where changed while this request was being run so don't it.
      if (this.options.where !== originalWhere) {
        return;
      }

      // no error, features
      if (!error && featureCollection && featureCollection.features.length) {
        // schedule adding features until the next animation frame
        Util.requestAnimFrame(
          Util.bind(function () {
            this._addFeatures(featureCollection.features, coords);
            this._postProcessFeatures(bounds);
          }, this),
        );
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
      if (
        response &&
        (response.exceededTransferLimit ||
          (response.properties && response.properties.exceededTransferLimit)) &&
        this.options.fetchAllFeatures
      ) {
        this._requestFeatures(
          bounds,
          coords,
          callback,
          offset + featureCollection.features.length,
        );
      }
    }, this);
  },

  _postProcessFeatures(bounds) {
    // deincrement the request counter now that we have processed features
    this._activeRequests--;

    // if there are no more active requests fire a load event for this view
    if (this._activeRequests <= 0) {
      this.fire("load", {
        bounds,
      });
    }
  },

  _cacheKey(coords) {
    return `${coords.z}:${coords.x}:${coords.y}`;
  },

  _addFeatures(features, coords) {
    // coords is optional - will be false if coming from addFeatures() function
    let key;
    if (coords) {
      key = this._cacheKey(coords);
      this._cache[key] = this._cache[key] || [];
    }

    for (let i = features.length - 1; i >= 0; i--) {
      const id = features[i].id;

      if (this._currentSnapshot.indexOf(id) === -1) {
        this._currentSnapshot.push(id);
      }
      if (typeof key !== "undefined" && this._cache[key].indexOf(id) === -1) {
        this._cache[key].push(id);
      }
    }

    if (this.options.timeField) {
      this._buildTimeIndexes(features);
    }

    this.createLayers(features);
  },

  _buildQuery(bounds, offset) {
    let query = this.service
      .query()
      .intersects(bounds)
      .where(this.options.where)
      .fields(this.options.fields)
      .precision(this.options.precision);

    if (this.options.fetchAllFeatures && !isNaN(parseInt(offset))) {
      query = query.offset(offset);
    }

    query.params["resultType"] = "tile";

    if (this.options.requestParams) {
      Util.extend(query.params, this.options.requestParams);
    }

    if (this.options.simplifyFactor) {
      query.simplify(this._map, this.options.simplifyFactor);
    }

    if (
      this.options.timeFilterMode === "server" &&
      this.options.from &&
      this.options.to
    ) {
      query.between(this.options.from, this.options.to);
    }

    return query;
  },

  /**
   * Where Methods
   */

  setWhere(where, callback, context) {
    this.options.where = where && where.length ? where : "1=1";

    const oldSnapshot = [];
    const newSnapshot = [];
    let pendingRequests = 0;
    let requestError = null;
    const requestCallback = Util.bind(function (error, featureCollection) {
      if (error) {
        requestError = error;
      }

      if (featureCollection) {
        for (let i = featureCollection.features.length - 1; i >= 0; i--) {
          newSnapshot.push(featureCollection.features[i].id);
        }
      }

      pendingRequests--;

      if (
        pendingRequests <= 0 &&
        this._visibleZoom() &&
        where === this.options.where // the where is still the same so use this one
      ) {
        this._currentSnapshot = newSnapshot;
        // schedule adding features for the next animation frame
        Util.requestAnimFrame(
          Util.bind(function () {
            this.removeLayers(oldSnapshot);
            this.addLayers(newSnapshot);
            if (callback) {
              callback.call(context, requestError);
            }
          }, this),
        );
      }
    }, this);

    for (let i = this._currentSnapshot.length - 1; i >= 0; i--) {
      oldSnapshot.push(this._currentSnapshot[i]);
    }

    this._cache = {};

    for (const key in this._cells) {
      pendingRequests++;
      const coords = this._keyToCellCoords(key);
      const bounds = this._cellCoordsToBounds(coords);
      this._requestFeatures(bounds, coords, requestCallback);
    }

    return this;
  },

  getWhere() {
    return this.options.where;
  },

  /**
   * Time Range Methods
   */

  getTimeRange() {
    return [this.options.from, this.options.to];
  },

  setTimeRange(from, to, callback, context) {
    const oldFrom = this.options.from;
    const oldTo = this.options.to;
    let pendingRequests = 0;
    let requestError = null;
    const requestCallback = Util.bind(function (error) {
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

    if (this.options.timeFilterMode === "server") {
      for (const key in this._cells) {
        pendingRequests++;
        const coords = this._keyToCellCoords(key);
        const bounds = this._cellCoordsToBounds(coords);
        this._requestFeatures(bounds, coords, requestCallback);
      }
    }

    return this;
  },

  refresh() {
    this.setWhere(this.options.where);
  },

  _filterExistingFeatures(oldFrom, oldTo, newFrom, newTo) {
    const layersToRemove =
      oldFrom && oldTo
        ? this._getFeaturesInTimeRange(oldFrom, oldTo)
        : this._currentSnapshot;
    const layersToAdd = this._getFeaturesInTimeRange(newFrom, newTo);

    if (layersToAdd.indexOf) {
      for (let i = 0; i < layersToAdd.length; i++) {
        const shouldRemoveLayer = layersToRemove.indexOf(layersToAdd[i]);
        if (shouldRemoveLayer >= 0) {
          layersToRemove.splice(shouldRemoveLayer, 1);
        }
      }
    }

    // schedule adding features until the next animation frame
    Util.requestAnimFrame(
      Util.bind(function () {
        this.removeLayers(layersToRemove);
        this.addLayers(layersToAdd);
      }, this),
    );
  },

  _getFeaturesInTimeRange(start, end) {
    const ids = [];
    let search;

    if (this.options.timeField.start && this.options.timeField.end) {
      const startTimes = this._startTimeIndex.between(start, end);
      const endTimes = this._endTimeIndex.between(start, end);
      search = startTimes.concat(endTimes);
    } else if (this._timeIndex) {
      search = this._timeIndex.between(start, end);
    } else {
      warn(
        "You must set timeField in the layer constructor in order to manipulate the start and end time filter.",
      );
      return [];
    }

    for (let i = search.length - 1; i >= 0; i--) {
      ids.push(search[i].id);
    }

    return ids;
  },

  _buildTimeIndexes(geojson) {
    let i;
    let feature;
    if (this.options.timeField.start && this.options.timeField.end) {
      const startTimeEntries = [];
      const endTimeEntries = [];
      for (i = geojson.length - 1; i >= 0; i--) {
        feature = geojson[i];
        startTimeEntries.push({
          id: feature.id,
          value: new Date(feature.properties[this.options.timeField.start]),
        });
        endTimeEntries.push({
          id: feature.id,
          value: new Date(feature.properties[this.options.timeField.end]),
        });
      }
      this._startTimeIndex.bulkAdd(startTimeEntries);
      this._endTimeIndex.bulkAdd(endTimeEntries);
    } else {
      const timeEntries = [];
      for (i = geojson.length - 1; i >= 0; i--) {
        feature = geojson[i];
        timeEntries.push({
          id: feature.id,
          value: new Date(feature.properties[this.options.timeField]),
        });
      }

      this._timeIndex.bulkAdd(timeEntries);
    }
  },

  _featureWithinTimeRange(feature) {
    if (!this.options.from || !this.options.to) {
      return true;
    }

    const from = +this.options.from.valueOf();
    const to = +this.options.to.valueOf();

    if (typeof this.options.timeField === "string") {
      const date = +feature.properties[this.options.timeField];
      return date >= from && date <= to;
    }

    if (this.options.timeField.start && this.options.timeField.end) {
      const startDate = +feature.properties[this.options.timeField.start];
      const endDate = +feature.properties[this.options.timeField.end];
      return (
        (startDate >= from && startDate <= to) ||
        (endDate >= from && endDate <= to) ||
        (startDate <= from && endDate >= to)
      );
    }
  },

  _visibleZoom() {
    // check to see whether the current zoom level of the map is within the optional limit defined for the FeatureLayer
    if (!this._map) {
      return false;
    }
    const zoom = this._map.getZoom();
    if (zoom > this.options.maxZoom || zoom < this.options.minZoom) {
      return false;
    }
    return true;
  },

  _handleZoomChange() {
    if (!this._visibleZoom()) {
      // if we have moved outside the visible zoom range clear the current snapshot, no layers should be active
      this.removeLayers(this._currentSnapshot);
      this._currentSnapshot = [];
    } else {
      /*
      for every cell in this._cells
        1. Get the cache key for the coords of the cell
        2. If this._cache[key] exists it will be an array of feature IDs.
        3. Call this.addLayers(this._cache[key]) to instruct the feature layer to add the layers back.
      */
      for (const i in this._cells) {
        const coords = this._cells[i].coords;
        const key = this._cacheKey(coords);
        if (this._cache[key]) {
          this.addLayers(this._cache[key]);
        }
      }
    }
  },

  /**
   * Service Methods
   */

  authenticate(token) {
    this.service.authenticate(token);
    return this;
  },

  metadata(callback, context) {
    this.service.metadata(callback, context);
    return this;
  },

  query() {
    return this.service.query();
  },

  _getMetadata(callback) {
    if (this._metadata) {
      let error;
      callback(error, this._metadata);
    } else {
      this.metadata(
        Util.bind(function (error, response) {
          this._metadata = response;
          callback(error, this._metadata);
        }, this),
      );
    }
  },

  addFeature(feature, callback, context) {
    this.addFeatures(feature, callback, context);
  },

  addFeatures(features, callback, context) {
    this._getMetadata(
      Util.bind(function (error, metadata) {
        if (error) {
          if (callback) {
            callback.call(this, error, null);
          }
          return;
        }
        // GeoJSON featureCollection or simple feature
        const featuresArray = features.features
          ? features.features
          : [features];

        this.service.addFeatures(
          features,
          Util.bind(function (error, response) {
            if (!error) {
              for (let i = featuresArray.length - 1; i >= 0; i--) {
                // assign ID from result to appropriate objectid field from service metadata
                featuresArray[i].properties[metadata.objectIdField] =
                  featuresArray.length > 1
                    ? response[i].objectId
                    : response.objectId;
                // we also need to update the geojson id for createLayers() to function
                featuresArray[i].id =
                  featuresArray.length > 1
                    ? response[i].objectId
                    : response.objectId;
              }
              this._addFeatures(featuresArray);
            }

            if (callback) {
              callback.call(context, error, response);
            }
          }, this),
        );
      }, this),
    );
  },

  updateFeature(feature, callback, context) {
    this.updateFeatures(feature, callback, context);
  },

  updateFeatures(features, callback, context) {
    // GeoJSON featureCollection or simple feature
    const featuresArray = features.features ? features.features : [features];
    this.service.updateFeatures(
      features,
      function (error, response) {
        if (!error) {
          for (let i = featuresArray.length - 1; i >= 0; i--) {
            this.removeLayers([featuresArray[i].id], true);
          }
          this._addFeatures(featuresArray);
        }

        if (callback) {
          callback.call(context, error, response);
        }
      },
      this,
    );
  },

  deleteFeature(id, callback, context) {
    this.deleteFeatures(id, callback, context);
  },

  deleteFeatures(ids, callback, context) {
    return this.service.deleteFeatures(
      ids,
      function (error, response) {
        const responseArray = response.length ? response : [response];
        if (!error && responseArray.length > 0) {
          for (let i = responseArray.length - 1; i >= 0; i--) {
            this.removeLayers([responseArray[i].objectId], true);
          }
        }
        if (callback) {
          callback.call(context, error, response);
        }
      },
      this,
    );
  },
});
