import { Service } from "./Service";
import identifyImage from "../Tasks/IdentifyImage";
import query from "../Tasks/Query";

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
