import { Service } from "./Service.js";
import identifyImage from "../Tasks/IdentifyImage.js";
import query from "../Tasks/Query.js";

export const ImageService = Service.extend({
  query() {
    return query(this);
  },

  identify() {
    return identifyImage(this);
  },
});

export function imageService(options) {
  return new ImageService(options);
}

export default imageService;
