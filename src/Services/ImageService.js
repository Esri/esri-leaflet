import { Service } from './Service';
import identifyImage from '../Tasks/IdentifyImage';
import query from '../Tasks/Query';

export var ImageService = Service.extend({

  query: function () {
    return query(this);
  },

  identify: function () {
    return identifyImage(this);
  }
});

export function imageService (options) {
  return new ImageService(options);
}

export default imageService;
