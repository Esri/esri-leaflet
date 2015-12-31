(function(EsriLeaflet){

  EsriLeaflet.Layers.FeatureManager = EsriLeaflet.Layers.FeatureGrid.extend({

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

    initialize: function (options) {
      EsriLeaflet.Layers.FeatureGrid.prototype.initialize.call(this, options);

      options.url = EsriLeaflet.Util.cleanUrl(options.url);
      options = L.setOptions(this, options);

      this._service = new EsriLeaflet.Services.FeatureLayerService(options);

      //use case insensitive regex to look for common fieldnames used for indexing
      /*global console */
      if (this.options.fields[0] !== '*'){
        var oidCheck = false;
        for (var i = 0; i < this.options.fields.length; i++){
          if (this.options.fields[i].match(/^(OBJECTID|FID|OID|ID)$/i)){
            oidCheck = true;
          }
        }
        if (oidCheck === false) {
          EsriLeaflet.Util.warn('no known esriFieldTypeOID field detected in fields Array.  Please add an attribute field containing unique IDs to ensure the layer can be drawn correctly.');
        }
      }

      // Leaflet 0.8 change to new propagation
      this._service.on('authenticationrequired requeststart requestend requesterror requestsuccess', function (e) {
        e = L.extend({
          target: this
        }, e);
        this.fire(e.type, e);
      }, this);

      if(this.options.timeField.start && this.options.timeField.end){
        this._startTimeIndex = new BinarySearchIndex();
        this._endTimeIndex = new BinarySearchIndex();
      } else if(this.options.timeField){
        this._timeIndex = new BinarySearchIndex();
      }

      this._cache = {};
      this._currentSnapshot = []; // cache of what layers should be active
      this._activeRequests = 0;
      this._pendingRequests = [];
    },

    /**
     * Layer Interface
     */

    onAdd: function(map){
      return EsriLeaflet.Layers.FeatureGrid.prototype.onAdd.call(this, map);
    },

    onRemove: function(map){
      return EsriLeaflet.Layers.FeatureGrid.prototype.onRemove.call(this, map);
    },

    getAttribution: function () {
      return this.options.attribution;
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

        // no error, features
        if(!error && featureCollection && featureCollection.features.length && !this._removed){
          // schedule adding features until the next animation frame
          EsriLeaflet.Util.requestAnimationFrame(L.Util.bind(function(){
            this._addFeatures(featureCollection.features, coords);
            this._postProcessFeatures(bounds);
          }, this));
        }

        // no error, no features
        if (!error && featureCollection && !featureCollection.features.length) {
          this._postProcessFeatures(bounds);
        }

        if(callback){
          callback.call(this, error, featureCollection);
        }
      }, this);
    },

    _postProcessFeatures: function (bounds) {
      //deincriment the request counter now that we have processed features
      this._activeRequests--;

      // if there are no more active requests fire a load event for this view
      if(this._activeRequests <= 0){
        this.fire('load', {
          bounds: bounds
        });
      }
    },

    _cacheKey: function (coords){
      return coords.z + ':' + coords.x + ':' +coords.y;
    },

    _addFeatures: function(features, coords){
      var key = this._cacheKey(coords);
      this._cache[key] = this._cache[key] || [];

      for (var i = features.length - 1; i >= 0; i--) {
        var id = features[i].id;
        this._currentSnapshot.push(id);
        this._cache[key].push(id);
        /*
        should we refactor the code in FeatureManager.setWhere()
        so that we can reuse it to make sure that we remove features
        on the client that are removed from the service?
        */

      }

      if(this.options.timeField){
        this._buildTimeIndexes(features);
      }

      var zoom = this._map.getZoom();

      if (zoom > this.options.maxZoom ||
          zoom < this.options.minZoom) { return; }

      this.createLayers(features);
    },

    _buildQuery: function(bounds){
      var query = this._service.query()
                      .intersects(bounds)
                      .where(this.options.where)
                      .fields(this.options.fields)
                      .precision(this.options.precision);

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

    setWhere: function(where, callback, context){

      this.options.where = (where && where.length) ? where : '1=1';

      var oldSnapshot = [];
      var newSnapshot = [];
      var pendingRequests = 0;
      var mostRecentError = null;
      var requestCallback = L.Util.bind(function(error, featureCollection){
        pendingRequests--;

        if(error) {
          mostRecentError = error;
        }

        if(featureCollection){
          for (var i = featureCollection.features.length - 1; i >= 0; i--) {
            newSnapshot.push(featureCollection.features[i].id);
          }
        }

        if(pendingRequests <= 0) {
          this._currentSnapshot = newSnapshot;
          // delay adding features until the next animation frame
          EsriLeaflet.Util.requestAnimationFrame(L.Util.bind(function() {
            this.removeLayers(oldSnapshot);
            this.addLayers(newSnapshot);
            if(callback) {
              callback.call(context, mostRecentError);
            }
          }, this));
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
      var pendingRequests = 0;
      var mostRecentError = null;
      var requestCallback = L.Util.bind(function(error){
        if(error){
          mostRecentError = error;
        }

        this._filterExistingFeatures(oldFrom, oldTo, from, to);

        pendingRequests--;

        if(callback && pendingRequests <= 0){
          callback.call(context, mostRecentError);
        }
      }, this);

      this.options.from = from;
      this.options.to = to;

      this._filterExistingFeatures(oldFrom, oldTo, from, to);

      if(this.options.timeFilterMode === 'server') {
        for(var key in this._activeCells){
          pendingRequests++;
          var coords = this._keyToCellCoords(key);
          var bounds = this._cellCoordsToBounds(coords);
          this._requestFeatures(bounds, key, requestCallback);
        }
      }
    },

    refresh: function(){
      for(var key in this._activeCells){
        var coords = this._keyToCellCoords(key);
        var bounds = this._cellCoordsToBounds(coords);
        this._requestFeatures(bounds, key);
      }

      if(this.redraw){
        this.once('load', function(){
          this.eachFeature(function(layer){
            this._redraw(layer.feature.id);
          }, this);
        }, this);
      }
    },

    _filterExistingFeatures: function (oldFrom, oldTo, newFrom, newTo) {
      var layersToRemove = (oldFrom && oldTo) ? this._getFeaturesInTimeRange(oldFrom, oldTo) : this._currentSnapshot;
      var layersToAdd = this._getFeaturesInTimeRange(newFrom, newTo);

      if(layersToAdd.indexOf){
        for (var i = 0; i < layersToAdd.length; i++) {
          var shouldRemoveLayer = layersToRemove.indexOf(layersToAdd[i]);
          if(shouldRemoveLayer >= 0){
            layersToRemove.splice(shouldRemoveLayer, 1);
          }
        }
      }

      // schedule adding features until the next animation frame
      EsriLeaflet.Util.requestAnimationFrame(L.Util.bind(function(){
        this.removeLayers(layersToRemove);
        this.addLayers(layersToAdd);
      }, this));
    },

    _getFeaturesInTimeRange: function(start, end){
      var ids = [];
      var search;

      if(this.options.timeField.start && this.options.timeField.end){
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

    _buildTimeIndexes: function(geojson){
      var i;
      var feature;
      if(this.options.timeField.start && this.options.timeField.end){
        var startTimeEntries = [];
        var endTimeEntries = [];
        for (i = geojson.length - 1; i >= 0; i--) {
          feature = geojson[i];
          startTimeEntries.push( {
            id: feature.id,
            value: new Date(feature.properties[this.options.timeField.start])
          });
          endTimeEntries.push( {
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
          timeEntries.push( {
            id: feature.id,
            value: new Date(feature.properties[this.options.timeField])
          });
        }

        this._timeIndex.bulkAdd(timeEntries);
      }
    },

    _featureWithinTimeRange: function(feature){
      if(!this.options.from || !this.options.to){
        return true;
      }

      var from = +this.options.from.valueOf();
      var to = +this.options.to.valueOf();

      if(typeof this.options.timeField === 'string'){
        var date = +feature.properties[this.options.timeField];
        return (date >= from) && (date <= to);
      }

      if(this.options.timeField.start &&  this.options.timeField.end){
        var startDate = +feature.properties[this.options.timeField.start];
        var endDate = +feature.properties[this.options.timeField.end];
        return ((startDate >= from) && (startDate <= to)) || ((endDate >= from) && (endDate <= to));
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

    _getMetadata: function(callback){
      if(this._metadata){
        var error;
        callback(error, this._metadata);
      } else {
        this.metadata(L.Util.bind(function(error, response) {
          this._metadata = response;
          callback(error, this._metadata);
        }, this));
      }
    },

    addFeature: function(feature, callback, context){
      this._getMetadata(L.Util.bind(function(error, metadata){
        this._service.addFeature(feature, L.Util.bind(function(error, response){
          if(!error){
            // assign ID from result to appropriate objectid field from service metadata
            feature.properties[metadata.objectIdField] = response.objectId;

            // we also need to update the geojson id for createLayers() to function
            feature.id = response.objectId;
            this.createLayers([feature]);
          }

          if(callback){
            callback.call(context, error, response);
          }
        }, this));
      }, this));
    },

    updateFeature: function(feature, callback, context){
      this._service.updateFeature(feature, function(error, response){
        if(!error){
          this.removeLayers([feature.id], true);
          this.createLayers([feature]);
        }

        if(callback){
          callback.call(context, error, response);
        }
      }, this);
    },

    deleteFeature: function(id, callback, context){
      this._service.deleteFeature(id, function(error, response){
        if(!error && response.objectId){
          this.removeLayers([response.objectId], true);
        }

        if(callback){
          callback.call(context, error, response);
        }
      }, this);
    },

    deleteFeatures: function(ids, callback, context){
      return this._service.deleteFeatures(ids, function(error, response){
        if(!error && response.length > 0){
          for (var i=0; i<response.length; i++){
            this.removeLayers([response[i].objectId], true);
          }
        }

        if(callback){
          callback.call(context, error, response);
        }
      }, this);
    }
  });

  /**
   * Temporal Binary Search Index
   */

  function BinarySearchIndex(values) {
    this.values = values || [];
  }

  BinarySearchIndex.prototype._query = function(query){
    var minIndex = 0;
    var maxIndex = this.values.length - 1;
    var currentIndex;
    var currentElement;
    var resultIndex;

    while (minIndex <= maxIndex) {
      resultIndex = currentIndex = (minIndex + maxIndex) / 2 | 0;
      currentElement = this.values[Math.round(currentIndex)];
      if (+currentElement.value < +query) {
        minIndex = currentIndex + 1;
      } else if (+currentElement.value > +query) {
        maxIndex = currentIndex - 1;
      } else {
        return currentIndex;
      }
    }

    return ~maxIndex;
  };

  BinarySearchIndex.prototype.sort = function(){
    this.values.sort(function(a, b) {
      return +b.value - +a.value;
    }).reverse();
    this.dirty = false;
  };

  BinarySearchIndex.prototype.between = function(start, end){
    if(this.dirty){
      this.sort();
    }

    var startIndex = this._query(start);
    var endIndex = this._query(end);

    if(startIndex === 0 && endIndex === 0){
      return [];
    }

    startIndex = Math.abs(startIndex);
    endIndex = (endIndex < 0) ? Math.abs(endIndex): endIndex + 1;

    return this.values.slice(startIndex, endIndex);
  };

  BinarySearchIndex.prototype.bulkAdd = function(items){
    this.dirty = true;
    this.values = this.values.concat(items);
  };

})(EsriLeaflet);
