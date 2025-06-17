import { Service } from "./Service.js";
import identifyFeatures from "../Tasks/IdentifyFeatures.js";
import query from "../Tasks/Query.js";
import find from "../Tasks/Find.js";

export const MapService = Service.extend({
  identify() {
    return identifyFeatures(this);
  },

  find() {
    return find(this);
  },

  query() {
    return query(this);
  },
});

export function mapService(options) {
  return new MapService(options);
}

export default mapService;
