import { Service } from './Service.js';
import identifyImage from '../Tasks/IdentifyImage.js';
import query from '../Tasks/Query.js';

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
