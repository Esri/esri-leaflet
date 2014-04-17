(function(L){

  L.esri.FeatureManager = L.esri.FeatureGrid.extend({

    /**
     * Constructor
     */

    options: {
      where: "1=1",
      fields: ["*"],
      from: false,
      to: false,
      timeField: false,
      timeFilterMode: "server",
      smoothFactor: 0
    },

    /**
     * Constructor
     */

    initialize: function (url, options) {
      L.esri.FeatureGrid.prototype.initialize.call(this, options);

      options = L.setOptions(this, options);

      this.url = L.esri.Util.cleanUrl(url);

      this._timeEnabled = !!(options.from && options.to);

      if(this._timeEnabled){
        this.timeIndex = new TemporalIndex();
      }

      this._currentSnapshot = []; // cache of what layers should be active
      this._activeRequests = 0;
    },

    /**
     * Layer Interface
     */

    onAdd: function(){
      L.esri.FeatureGrid.prototype.onAdd.call(this);
    },

    onRemove: function(){
      L.esri.FeatureGrid.prototype.onRemove.call(this);
    },

    /**
     * Feature Managment
     */

    createCell: function(bounds){
      this._requestFeatures(bounds);
    },

    _requestFeatures: function(bounds, callback){

      this._activeRequests++;

      // our first active request fires loading
      if(this._activeRequests === 1){
        this.fire("loading", {
          bounds: bounds
        });
      }

      L.esri.get(this.url + "query", this._buildQueryParams(bounds), function(response){
        //deincriment the request counter
        this._activeRequests--;

        if(!this._getObjectIdField()){
          this._setObjectIdField(response);
        }

        var features = [];

        for (var i = response.features.length - 1; i >= 0; i--) {
          features.push(L.esri.Util.arcgisToGeojson(response.features[i], {
            idAttribute: this._getObjectIdField()
          }));
        };

        this._addFeatures(features);

        if(callback){
          callback.call(this, features);
        }

        // if there are no more active requests fire a load event for this view
        if(this._activeRequests <= 0){
          this.fire("load", {
            bounds: bounds
          });
        }
      }, this);
    },

    _addFeatures: function(features){
      for (var i = features.length - 1; i >= 0; i--) {
        this._currentSnapshot.push(features[i].id);
      };

      if(this._timeEnabled){
        this._buildTimeIndexes(features);
      }

      this.createLayers(features);
    },

    _buildQueryParams: function(bounds){
      var requestParams = {
        returnGeometry: true,
        spatialRel: "esriSpatialRelIntersects",
        geometryType: "esriGeometryEnvelope",
        geometry: JSON.stringify(L.esri.Util.boundsToExtent(bounds)),
        outFields: this.options.fields.join(","),
        outSR: 4326,
        inSR: 4326,
        where: this.options.where
      };

      if(this.options.smoothFactor){
        requestParams.maxAllowableOffset = this._getMaxAllowableOffset();
      }

      if(this.options.timeFilterMode === "server" && this.options.from && this.options.to){
        requestParams.time = this.options.from.valueOf() +","+this.options.to.valueOf();
      }

      return requestParams;
    },

    /**
     * Where Methods
     */

    setWhere: function(where, callback){
      this.options.where = (where && where.length) ? where : '1=1';
      var oldSnapshot = [];

      for (var i = this._currentSnapshot.length - 1; i >= 0; i--) {
        oldSnapshot.push(this._currentSnapshot[i]);
      };

      this._requestFeatures(this._map.getBounds(), function(geojson){
        // at this point all layers (both meeting the query and not should be on the map)
        var newShapshot = [];

        for (var i = geojson.length - 1; i >= 0; i--) {
          newShapshot.push(geojson[i].id);
        };

        var states = this._diffLayerState(oldSnapshot, newShapshot);

        this._currentSnapshot = states.newFeatures;

        this.removeLayers(states.oldFeatures);
        this.addLayers(states.newFeatures);

        if(callback) {
          callback.call(this);
        }
      });
    },

    getWhere: function(){
      return this.options.where;
    },

    /**
     * Time Range Methods
     */

    getTimeRange: function(){
      return [this.options.from, this.options.to];
    },

    setTimeRange: function(from, to){
      var oldFrom = this.options.from;
      var oldTo = this.options.to;

      this.options.from = from;
      this.options.to = to;

      this._filterExistingFeatures(oldFrom, oldTo, from, to);

      if(this.options.timeFilterMode === "server") {
        this._requestFeatures(this._map.getBounds(), L.Util.bind(function(){
          this._filterExistingFeatures(oldFrom, oldTo, from, to);
        }, this));
      }
    },

    _diffLayerState: function(oldFeatures, newFeatures){
       var featuresToRemove = [];

      for (var i = oldFeatures.length - 1; i >= 0; i--) {
        var idx = newFeatures.indexOf(oldFeatures[i]);
        if (idx >= 0) {
          featuresToRemove.push(idx);
        }
      };

      for (var i = featuresToRemove.length - 1; i >= 0; i--) {
        oldFeatures.splice(featuresToRemove[i], 1);
        newFeatures.splice(featuresToRemove[i], 1);
      };

      return {
        oldFeatures: oldFeatures,
        newFeatures: newFeatures
      }
    },

    _filterExistingFeatures: function (oldFrom, oldTo, newFrom, newTo) {
      var oldFeatures = this._getFeaturesInTimeRange(oldFrom, oldTo);
      var newFeatures = this._getFeaturesInTimeRange(newFrom, newTo);

      var states = this._diffLayerState(oldFeatures, newFeatures);

      this._currentSnapshot = states.newFeatures;

      this.removeLayers(state.oldFeatures);
      this.addLayers(state.newFeatures);
    },


    _getFeaturesInTimeRange: function(start, end){
      var ids = [];
      var search;

      if(this.options.timeField.start && this.options.timeField.end){
        var startTimes = this.timeIndex.between(start, end, this.options.timeField.start);
        var endTimes = this.timeIndex.between(start, end, this.options.timeField.end);
        search = startTimes.concat.endTimes;
      } else {
        var search = this.timeIndex.between(start, end, this.options.timeField);
      }

      for (var i = search.length - 1; i >= 0; i--) {
        ids.push(search[i].id);
      };

      return ids;
    },

    _buildTimeIndexes: function(geojson){
      var timeEntries = [];

      for (var i = geojson.length - 1; i >= 0; i--) {
        timeEntries.push(this._createTimeEntry(geojson[i]));
      };

      this.timeIndex.add(timeEntries);
    },

    _createTimeEntry: function(feature){
      var timeEntry = {
        id: feature.id
      };

      if(this.options.timeField.start && this.options.timeField.end){
        timeEntry.start = new Date(feature.properties[this.options.timeField.start]);
        timeEntry.end = new Date(feature.properties[this.options.timeField.end]);
      } else {
        timeEntry.date = new Date(feature.properties[this.options.timeField]);
      }

      return timeEntry;
    },

    _featureWithinTimeRange: function(feature){
      if(!this.options.timeField || !this.options.from || !this.options.to){
        return true;
      }

      var from = this.options.from.valueOf();
      var to = this.options.to.valueOf();

      if(typeof this.options.timeField === "string"){
        var date = feature.properties[this.options.timeField];
        return (date > from) && (date < to);
      }

      if(this.options.timeField.from, this.options.timeField.to){
        var startDate = feature.properties[this.options.timeField.from];
        var endDate = feature.properties[this.options.timeField.to];
        return ((startDate > from) && (startDate < to)) || ((endDate > from) && (endDate < to));
      }
    },

    /**
     * Utility Methods
     */

    _getMaxAllowableOffset: function(){
      var mapWidth = Math.abs(this._map.getBounds().getWest() - this._map.getBounds().getEast());
      var mapWidthPx = this._map.getSize().y;

      return (mapWidth / mapWidthPx) * (1 - this.options.smoothFactor)
    },


    _setObjectIdField: function(response){
      if(response.objectIdFieldName){
        this._objectIdField = response.objectIdFieldName;
      } else {
        if(response.fields){
          for (var j = 0; j <= response.fields.length - 1; j++) {
            if(response.fields[j].type === "esriFieldTypeOID") {
              this._objectIdField = response.fields[j].name;
              break;
            }
          }
        }
      }
    },

    _getObjectIdField: function(response){
      return this._objectIdField;
    }
  });

  L.esri.featureManager = function(options){
    return new L.esri.FeatureManager(options);
  }

  /**
   * Temporal Binary Search Index
   */

  function TemporalIndex(values) {
    this.values = values || [];
    this.lastKey;
  }

  TemporalIndex.prototype._query = function(key, query){
    if(Object.prototype.toString.call(query) === '[object Date]'){
      query = query.valueOf();
    }

    var minIndex = 0;
    var maxIndex = this.values.length - 1;
    var currentIndex;
    var currentElement;
    var resultIndex;

    while (minIndex <= maxIndex) {
      resultIndex = currentIndex = (minIndex + maxIndex) / 2 | 0;
      currentElement = this.values[currentIndex];

      if (currentElement[key] < query) {
        minIndex = currentIndex + 1;
      } else if (currentElement[key] > query) {
        maxIndex = currentIndex - 1;
      } else {
        return currentIndex;
      }
    }

    return Math.abs(maxIndex);
  }

  TemporalIndex.prototype.query = function(key, query){
    this.sortOn(key);
    return this._query(key, query);
  }

  TemporalIndex.prototype.sortOn = function(key){
    if(this.lastKey != key){
      this.lastKey = key;
      this.values.sort(function(a, b) {
        return a[key] - b[key];
      });
    }
  };

  TemporalIndex.prototype.between = function(start, end, key){
    this.sortOn(key);

    var startIndex = this._query(key, start);
    var endIndex = this._query(key, end);

    return this.values.slice(startIndex, endIndex);
  }

  TemporalIndex.prototype.add = function(values){
    this.values  = this.values.concat(values);
  }

}(L));