L.esri.Tasks.Identify = L.esri.Tasks.Task.extend({
  path: 'identify',

  between: function(start, end){
    this.params.time = ([start.valueOf(), end.valueOf()]).join(',');
    return this;
  },

  returnGeometry: function (returnGeometry) {
    this.params.returnGeometry = returnGeometry;
    return this;
  }
});
