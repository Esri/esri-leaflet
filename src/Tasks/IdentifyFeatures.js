import { latLng } from "leaflet";
import { Identify } from "./Identify.js";
import {
  responseToFeatureCollection,
  boundsToExtent,
  _setGeometry,
} from "../Util.js";

export const IdentifyFeatures = Identify.extend({
  setters: {
    layers: "layers",
    precision: "geometryPrecision",
    tolerance: "tolerance",
    // skipped implementing this (for now) because the REST service implementation isnt consistent between operations.
    // 'transform': 'datumTransformations'
    returnGeometry: "returnGeometry",
  },

  params: {
    sr: 4326,
    layers: "all",
    tolerance: 3,
    returnGeometry: true,
  },

  on(map) {
    const extent = boundsToExtent(map.getBounds());
    const size = map.getSize();
    this.params.imageDisplay = [size.x, size.y, 96];
    this.params.mapExtent = [
      extent.xmin,
      extent.ymin,
      extent.xmax,
      extent.ymax,
    ];
    return this;
  },

  at(geometry) {
    // cast lat, long pairs in raw array form manually
    if (geometry.length === 2) {
      geometry = latLng(geometry);
    }
    this._setGeometryParams(geometry);
    return this;
  },

  layerDef(id, where) {
    this.params.layerDefs = this.params.layerDefs
      ? `${this.params.layerDefs};`
      : "";
    this.params.layerDefs += [id, where].join(":");
    return this;
  },

  simplify(map, factor) {
    const mapWidth = Math.abs(
      map.getBounds().getWest() - map.getBounds().getEast(),
    );
    this.params.maxAllowableOffset = (mapWidth / map.getSize().y) * factor;
    return this;
  },

  run(callback, context) {
    return this.request((error, response) => {
      // immediately invoke with an error
      if (error) {
        callback.call(context, error, undefined, response);

        // ok no error lets just assume we have features...
      } else {
        const featureCollection = responseToFeatureCollection(response);
        response.results = response.results.reverse();
        for (let i = 0; i < featureCollection.features.length; i++) {
          const feature = featureCollection.features[i];
          feature.layerId = response.results[i].layerId;
        }
        callback.call(context, undefined, featureCollection, response);
      }
    });
  },

  _setGeometryParams(geometry) {
    const converted = _setGeometry(geometry);
    this.params.geometry = converted.geometry;
    this.params.geometryType = converted.geometryType;
  },
});

export function identifyFeatures(options) {
  return new IdentifyFeatures(options);
}

export default identifyFeatures;
