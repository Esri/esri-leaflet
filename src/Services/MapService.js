import { Service } from './Service.js';
import identifyFeatures from '../Tasks/IdentifyFeatures.js';
import query from '../Tasks/Query.js';
import find from '../Tasks/Find.js';

export var MapService = Service.extend({

  identify: function () {
    return identifyFeatures(this);
  },

  find: function () {
    return find(this);
  },

  query: function () {
    return query(this);
  }

});

export function mapService (options) {
  return new MapService(options);
}

export default mapService;
