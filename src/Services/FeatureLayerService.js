import { Service } from './Service';
import query from '../Tasks/Query';
import { geojsonToArcGIS } from '../Util';

export var FeatureLayerService = Service.extend({

  options: {
    idAttribute: 'OBJECTID'
  },

  query: function () {
    return query(this);
  },

  addFeature: function (feature, callback, context) {
    delete feature.id;

    feature = geojsonToArcGIS(feature);

    return this.post('addFeatures', {
      features: [feature]
    }, function (error, response) {
      var result = (response && response.addResults) ? response.addResults[0] : undefined;
      if (callback) {
        callback.call(context, error || response.addResults[0].error, result);
      }
    }, context);
  },

  addFeatures: function (featureCollection, callback, context) {
    for (var i = featureCollection.features.length - 1; i >= 0; i--) {
      delete featureCollection.features[i].id;
    }
    var features = geojsonToArcGIS(featureCollection);
    return this.post('addFeatures', {
      features: features
    }, function (error, response) {
      var result = (response && response.addResults) ? response.addResults : undefined;
      if (callback) {
        callback.call(context, error || response.addResults[0].error, result);
      }
    }, context);
  },

  updateFeature: function (feature, callback, context) {
    feature = geojsonToArcGIS(feature, this.options.idAttribute);

    return this.post('updateFeatures', {
      features: [feature]
    }, function (error, response) {
      var result = (response && response.updateResults) ? response.updateResults[0] : undefined;
      if (callback) {
        callback.call(context, error || response.updateResults[0].error, result);
      }
    }, context);
  },

  updateFeatures: function (featureCollection, callback, context) {
    var features = geojsonToArcGIS(featureCollection, this.options.idAttribute);

    return this.post('updateFeatures', {
      features: features
    }, function (error, response) {
      var result = (response && response.updateResults) ? response.updateResults : undefined;
      if (callback) {
        callback.call(context, error || response.updateResults[0].error, result);
      }
    }, context);
  },

  deleteFeature: function (id, callback, context) {
    return this.post('deleteFeatures', {
      objectIds: id
    }, function (error, response) {
      var result = (response && response.deleteResults) ? response.deleteResults[0] : undefined;
      if (callback) {
        callback.call(context, error || response.deleteResults[0].error, result);
      }
    }, context);
  },

  deleteFeatures: function (ids, callback, context) {
    return this.post('deleteFeatures', {
      objectIds: ids
    }, function (error, response) {
      // pass back the entire array
      var result = (response && response.deleteResults) ? response.deleteResults : undefined;
      if (callback) {
        callback.call(context, error || response.deleteResults[0].error, result);
      }
    }, context);
  }
});

export function featureLayerService (options) {
  return new FeatureLayerService(options);
}

export default featureLayerService;
