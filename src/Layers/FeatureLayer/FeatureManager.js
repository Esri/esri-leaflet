(function(L){

  L.esri.FeatureManager = L.esri.FeatureGrid.extend({

    /**
     * Constructor
     */

    options: {
      where: '1=1',
      fields: ['*'],
      from: false,
      to: false,
      timeField: false,
      timeFilterMode: 'server',
      simplifyFactor: 0
    },

    /**
     * Constructor
     */

    initialize: function (url, options) {
      L.esri.FeatureGrid.prototype.initialize.call(this, options);

      options = L.setOptions(this, options);

      this.url = L.esri.Util.cleanUrl(url);

      this._timeEnabled = !!(options.from && options.to);

      this._service = new L.esri.Services.FeatureLayer(this.url);

      if(this._timeEnabled){
        this.timeIndex = new TemporalIndex();
      }

      this._cache = {};
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

    createCell: function(bounds, coords){
      this._requestFeatures(bounds, coords);
    },

    _requestFeatures: function(bounds, coords, callback){
      this._activeRequests++;

      // our first active request fires loading
      if(this._activeRequests === 1){
        this.fire('loading', {
          bounds: bounds
        });
      }

      this._buildQuery(bounds).run(function(error, response){
        //deincriment the request counter
        this._activeRequests--;

        if(!error && response.features.length){
          this._addFeatures(response.features, coords);
        }

        if(callback){
          callback.call(this, error, response);
        }

        // if there are no more active requests fire a load event for this view
        if(this._activeRequests <= 0){
          this.fire('load', {
            bounds: bounds
          });
        }
      }, this);
    },

    _addFeatures: function(features, coords){
      this._cache[coords] = this._cache[coords] || [];

      for (var i = features.length - 1; i >= 0; i--) {
        var id = features[i].id;
        this._cache[coords].push(id);
        this._currentSnapshot.push(id);
      }

      if(this._timeEnabled){
        this._buildTimeIndexes(features);
      }

      this.createLayers(features);
    },

    _buildQuery: function(bounds){
      var query = this._service.query().within(bounds).where(this.options.where).fields(this.options.fields);

      if(this.options.simplifyFactor){
        query.simplify(this._map, this.options.simplifyFactor);
      }

      if(this.options.timeFilterMode === 'server' && this.options.from && this.options.to){
        query.between(this.options.from, this.options.to);
      }

      return query;
    },

    /**
     * Where Methods
     */

    setWhere: function(where, callback){
      this.options.where = (where && where.length) ? where : '1=1';
      var oldSnapshot = [];
      var newShapshot = [];
      var pendingRequests = 0;
      var requestCallback = L.Util.bind(function(error, featureCollection){
        if(featureCollection){
          for (var i = featureCollection.features.length - 1; i >= 0; i--) {
            newShapshot.push(featureCollection.features[i].id);
          }
        }

        pendingRequests--;

        if(pendingRequests <= 0){
          var states = this._diffLayerState(oldSnapshot, newShapshot);

          this._currentSnapshot = states.newFeatures;

          this.removeLayers(states.oldFeatures);
          this.addLayers(states.newFeatures);

          if(callback) {
            callback.call(this);
          }
        }
      }, this);

      for (var i = this._currentSnapshot.length - 1; i >= 0; i--) {
        oldSnapshot.push(this._currentSnapshot[i]);
      }

      for(var key in this._activeCells){
        pendingRequests++;
        var coords = this._keyToCellCoords(key);
        var bounds = this._cellCoordsToBounds(coords);
        this._requestFeatures(bounds, key, requestCallback);
      }
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
      var requestCallback = L.Util.bind(function(){
        this._filterExistingFeatures(oldFrom, oldTo, from, to);
      }, this);

      this.options.from = from;
      this.options.to = to;

      this._filterExistingFeatures(oldFrom, oldTo, from, to);

      if(this.options.timeFilterMode === 'server') {
        for(var key in this._activeCells){
          var coords = this._keyToCellCoords(key);
          var bounds = this._cellCoordsToBounds(coords);
          this._requestFeatures(bounds, key, requestCallback);
        }
      }
    },

    _diffLayerState: function(oldFeatures, newFeatures){
       var featuresToRemove = [];

      for (var i = oldFeatures.length - 1; i >= 0; i--) {
        var idx = newFeatures.indexOf(oldFeatures[i]);
        if (idx >= 0) {
          featuresToRemove.push(idx);
        }
      }

      for (i = featuresToRemove.length - 1; i >= 0; i--) {
        oldFeatures.splice(featuresToRemove[i], 1);
        newFeatures.splice(featuresToRemove[i], 1);
      }

      return {
        oldFeatures: oldFeatures,
        newFeatures: newFeatures
      };
    },

    _filterExistingFeatures: function (oldFrom, oldTo, newFrom, newTo) {
      var oldFeatures = this._getFeaturesInTimeRange(oldFrom, oldTo);
      var newFeatures = this._getFeaturesInTimeRange(newFrom, newTo);

      var state = this._diffLayerState(oldFeatures, newFeatures);

      this._currentSnapshot = state.newFeatures;

      this.removeLayers(state.oldFeatures);
      this.addLayers(state.newFeatures);
    },


    _getFeaturesInTimeRange: function(start, end){
      var ids = [];
      var search;

      if(this.options.timeField.start && this.options.timeField.end){
        var startTimes = this.timeIndex.between(start, end, this.options.timeField.start);
        var endTimes = this.timeIndex.between(start, end, this.options.timeField.end);
        search = startTimes.concat(endTimes);
      } else {
        search = this.timeIndex.between(start, end, this.options.timeField);
      }

      for (var i = search.length - 1; i >= 0; i--) {
        ids.push(search[i].id);
      }

      return ids;
    },

    _buildTimeIndexes: function(geojson){
      var timeEntries = [];

      for (var i = geojson.length - 1; i >= 0; i--) {
        timeEntries.push(this._createTimeEntry(geojson[i]));
      }

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

      if(typeof this.options.timeField === 'string'){
        var date = feature.properties[this.options.timeField];
        return (date > from) && (date < to);
      }

      if(this.options.timeField.from &&  this.options.timeField.to){
        var startDate = feature.properties[this.options.timeField.from];
        var endDate = feature.properties[this.options.timeField.to];
        return ((startDate > from) && (startDate < to)) || ((endDate > from) && (endDate < to));
      }
    }

  });

  L.esri.featureManager = function(options){
    return new L.esri.FeatureManager(options);
  };

  /**
   * Temporal Binary Search Index
   */

  function TemporalIndex(values) {
    this.values = values || [];
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
      resultIndex = currentIndex = (minIndex + maxIndex) / 2 || 0;
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
  };

  TemporalIndex.prototype.query = function(key, query){
    this.sortOn(key);
    return this._query(key, query);
  };

  TemporalIndex.prototype.sortOn = function(key){
    if(this.lastKey !== key){
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
  };

  TemporalIndex.prototype.add = function(values){
    this.values  = this.values.concat(values);
  };

}(L));