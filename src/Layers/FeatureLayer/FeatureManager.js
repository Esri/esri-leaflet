(function(L){

  L.esri.Layers.FeatureManager = L.esri.Layers.FeatureGrid.extend({

    /**
     * Options
     */

    options: {
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

    initialize: function (url, options) {
      L.esri.Layers.FeatureGrid.prototype.initialize.call(this, options);

      options = L.setOptions(this, options);

      this.url = L.esri.Util.cleanUrl(url);

      this._service = new L.esri.Services.FeatureLayer(this.url, options);

      // Leaflet 0.8 change to new propagation
      this._service.on('authenticationrequired requeststart requestend requesterror requestsuccess', this._propagateEvent, this);

      if(options.timeField){
        this.timeIndex = new TemporalIndex();
      }

      this._cache = {};
      this._currentSnapshot = []; // cache of what layers should be active
      this._activeRequests = 0;
    },

    /**
     * Layer Interface
     */

    onAdd: function(map){
      return L.esri.Layers.FeatureGrid.prototype.onAdd.call(this, map);
    },

    onRemove: function(map){
      return L.esri.Layers.FeatureGrid.prototype.onRemove.call(this, map);
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

      this._buildQuery(bounds).run(function(error, featureCollection, response){
        if(response && response.exceededTransferLimit){
          this.fire('drawlimitexceeded');
        }

        //deincriment the request counter
        this._activeRequests--;

        if(!error && featureCollection.features.length){
          this._addFeatures(featureCollection.features, coords);
        }

        if(callback){
          callback.call(this, error, featureCollection);
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
      var query = this._service.query().within(bounds).where(this.options.where).fields(this.options.fields).precision(this.options.precision);

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
          this._currentSnapshot = newShapshot;
          this.removeLayers(oldSnapshot);
          this.addLayers(newShapshot);

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

      return this;
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

    setTimeRange: function(from, to, callback, context){
      var oldFrom = this.options.from;
      var oldTo = this.options.to;
      var requestCallback = L.Util.bind(function(){
        this._filterExistingFeatures(oldFrom, oldTo, from, to);
        if(callback){
          callback.call(context);
        }
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

    _filterExistingFeatures: function (oldFrom, oldTo, newFrom, newTo) {
      var oldFeatures = this._getFeaturesInTimeRange(oldFrom, oldTo);
      var newFeatures = this._getFeaturesInTimeRange(newFrom, newTo);
      this.removeLayers(oldFeatures);
      this.addLayers(newFeatures);
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
    },

    /**
     * Service Methods
     */

    authenticate: function(token){
      this._service.authenticate(token);
      return this;
    },

    metadata: function(callback, context){
      this._service.metadata(callback, context);
      return this;
    },

    query: function(){
      return this._service.query();
    },

    addFeature: function(feature, callback, context){
      this._service.addFeature(feature, function(error, response){
        //@ TODO
      }, context);
      return this;
    },

    updateFeature: function(feature, callback, context){
      this._service.updateFeature(feature, function(error, response){
        //@ TODO
      }, context);
      return this;
    },

    removeFeature: function(id, callback, context){
      this._service.removeFeature(id, function(error, response){
        //@ TODO
      }, context);
      return this;
    },

    // from https://github.com/Leaflet/Leaflet/blob/v0.7.2/src/layer/FeatureGroup.js
    // @TODO remove at Leaflet 0.8
    _propagateEvent: function (e) {
      e = L.extend({
        layer: e.target,
        target: this
      }, e);
      this.fire(e.type, e);
    }
  });

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
      currentElement = this.values[Math.round(currentIndex)];
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