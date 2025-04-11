import { Task } from "./Task.js";
import { responseToFeatureCollection } from "../Util.js";

export const Find = Task.extend({
  setters: {
    // method name > param name
    contains: "contains",
    text: "searchText",
    fields: "searchFields", // denote an array or single string
    spatialReference: "sr",
    sr: "sr",
    layers: "layers",
    returnGeometry: "returnGeometry",
    maxAllowableOffset: "maxAllowableOffset",
    precision: "geometryPrecision",
    dynamicLayers: "dynamicLayers",
    returnZ: "returnZ",
    returnM: "returnM",
    gdbVersion: "gdbVersion",
    // skipped implementing this (for now) because the REST service implementation isnt consistent between operations
    // 'transform': 'datumTransformations',
    token: "token",
  },

  path: "find",

  params: {
    sr: 4326,
    contains: true,
    returnGeometry: true,
    returnZ: true,
    returnM: false,
  },

  layerDefs(id, where) {
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
      callback.call(
        context,
        error,
        response && responseToFeatureCollection(response),
        response,
      );
    }, context);
  },
});

export function find(options) {
  return new Find(options);
}

export default find;
