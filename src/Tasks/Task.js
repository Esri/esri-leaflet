L.esri.Tasks.Task = L.Class.extend({
  initialize: function(endpoint){
    if(endpoint.url && endpoint.get){
      this._service = endpoint;
      this.url = endpoint.url;
    } else {
      this.url = L.esri.Util.cleanUrl(endpoint);
    }

    this.params = L.Util.extend({}, this.params);
  },
  request: function(callback, context){
    if(this._service){
      this._service.request(this.path, this.params, callback, context);
    } else {
      L.esri.request(this.url + this.path, this.params, callback, context);
    }
  }
});