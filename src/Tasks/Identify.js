import { Task } from "./Task.js";

export const Identify = Task.extend({
  path: "identify",

  between(start, end) {
    this.params.time = [start.valueOf(), end.valueOf()];
    return this;
  },
});

export function identify(options) {
  return new Identify(options);
}

export default identify;
