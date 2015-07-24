import { Task } from './Task';

export var Identify = Task.extend({
  path: 'identify',

  between: function (start, end) {
    this.params.time = [start.valueOf(), end.valueOf()];
    return this;
  }
});

export function identify (options) {
  return new Identify(options);
}

export default identify;
