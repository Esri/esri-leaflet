import { Service } from "./Service";
import identifyFeatures from "../Tasks/IdentifyFeatures";
import query from "../Tasks/Query";
import find from "../Tasks/Find";

export var MapService = Service.extend({
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
