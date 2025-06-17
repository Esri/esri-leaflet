import { Service } from "./Service.js";
import query from "../Tasks/Query.js";
import { geojsonToArcGIS } from "../Util.js";

export const FeatureLayerService = Service.extend({
  options: {
    idAttribute: "OBJECTID",
  },

  query() {
    return query(this);
  },

  addFeature(feature, callback, context) {
    this.addFeatures(feature, callback, context);
  },

  addFeatures(features, callback, context) {
    const featuresArray = features.features ? features.features : [features];
    for (let i = featuresArray.length - 1; i >= 0; i--) {
      delete featuresArray[i].id;
    }
    features = geojsonToArcGIS(features);
    features = featuresArray.length > 1 ? features : [features];
    return this.post(
      "addFeatures",
      {
        features,
      },
      (error, response) => {
        // For compatibility reason with former addFeature function,
        // we return the object in the array and not the array itself
        const result =
          response && response.addResults
            ? response.addResults.length > 1
              ? response.addResults
              : response.addResults[0]
            : undefined;
        if (callback) {
          callback.call(context, error || response.addResults[0].error, result);
        }
      },
      context,
    );
  },

  updateFeature(feature, callback, context) {
    this.updateFeatures(feature, callback, context);
  },

  updateFeatures(features, callback, context) {
    const featuresArray = features.features ? features.features : [features];
    features = geojsonToArcGIS(features, this.options.idAttribute);
    features = featuresArray.length > 1 ? features : [features];

    return this.post(
      "updateFeatures",
      {
        features,
      },
      (error, response) => {
        // For compatibility reason with former updateFeature function,
        // we return the object in the array and not the array itself
        const result =
          response && response.updateResults
            ? response.updateResults.length > 1
              ? response.updateResults
              : response.updateResults[0]
            : undefined;
        if (callback) {
          callback.call(
            context,
            error || response.updateResults[0].error,
            result,
          );
        }
      },
      context,
    );
  },

  deleteFeature(id, callback, context) {
    this.deleteFeatures(id, callback, context);
  },

  deleteFeatures(ids, callback, context) {
    return this.post(
      "deleteFeatures",
      {
        objectIds: ids,
      },
      (error, response) => {
        // For compatibility reason with former deleteFeature function,
        // we return the object in the array and not the array itself
        const result =
          response && response.deleteResults
            ? response.deleteResults.length > 1
              ? response.deleteResults
              : response.deleteResults[0]
            : undefined;
        if (callback) {
          callback.call(
            context,
            error || response.deleteResults[0].error,
            result,
          );
        }
      },
      context,
    );
  },
});

export function featureLayerService(options) {
  return new FeatureLayerService(options);
}

export default featureLayerService;
