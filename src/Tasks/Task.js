L.esri.Tasks.Task = L.Class.extend({
  generateSetter: function(param, context){
    var isArray = param.match(/([a-zA-Z]+)\[\]/);

    param = (isArray) ? isArray[1] : param;

    if(isArray){
      return L.Util.bind(function(value){
        // this.params[param] = (this.params[param]) ? this.params[param] + ',' : '';
        if (L.Util.isArray(value)) {
          this.params[param] = value.join(',');
        } else {
          this.params[param] = value;
        }
        return this;
      }, context);
    } else {
      return L.Util.bind(function(value){
        this.params[param] = value;
        return this;
      }, context);
    }
  },
  initialize: function(endpoint){
    if(endpoint.url && endpoint.get){
      this._service = endpoint;
      this.url = endpoint.url;
    } else {
      this.url = L.esri.Util.cleanUrl(endpoint);
    }

    this.params = L.Util.extend({}, this.params || {});

    if(this.setters){
      for (var setter in this.setters){
        var param = this.setters[setter];
        this[setter] = this.generateSetter(param, this);
      }
    }
  },
  token: function(token){
    if(this._service){
      this._service.authenticate(token);
    } else {
      this.params.token = token;
    }
    return this;
  },
  request: function(callback, context){
    if(this._service){
      return this._service.request(this.path, this.params, callback, context);
    } else {
      return L.esri.request(this.url + this.path, this.params, callback, context);
    }
  }
});