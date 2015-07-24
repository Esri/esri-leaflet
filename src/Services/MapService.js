import { Service } from './Service';
import identifyFeatures from '../Tasks/IdentifyFeatures';
import query from '../Tasks/Query';
import find from '../Tasks/Find';

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
