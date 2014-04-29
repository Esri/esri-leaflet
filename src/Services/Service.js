// @TODO proxy support
L.esri.Service = L.Evented.extend({

  options: {
    proxy: false
  },

  initialize: function (url, options) {
    this.url = L.esri.Util.cleanUrl(url);
    this._requestQueue = [];
    this._authenticating = false;
    options =  L.Util.setOptions(this, options);
  },

  get: function (path, params, callback, context) {
    this.request('get', path, params, callback, context);
  },

  post: function (path, params, callback, context) {
    this.request('post', path, params, callback, context);
  },

  metadata: function (callback, context) {
    this.request('get', '', {}, callback, context);
  },

  request: function(method, path, params, callback, context){
    var wrappedCallback = this._createServiceCallback('post', path, params, callback, context);

    if (this.options.token) {
      params.token = this.options.token;
    }

    if (this._authenticating) {
      this._requestQueue.push(method, path, params, callback, context);
    } else {

      var url = (this.options.proxy) ? this.options.proxy + '?' + this.url + path : this.url + path;
      L.esri[method](url, params, wrappedCallback);
    }
  },

  authenticate: function(token){
    this._authenticating = false;
    this.options.token = token;
    this._runQueue();
  },

  _createServiceCallback: function(method, path, params, callback, context){
    var request = [method, path, params, callback, context];

    return L.Util.bind(function(error, response){
      if (error && (error.code === 499 || error.code === 498)) {
        this._authenticating = true;

        this._requestQueue.push(request);

        this.fire('authenticationrequired', {
          authenticate: this.authenticate
        });
      } else {
        if(context){
          callback.call(context, error, response);
        } else {
          callback(error, response);
        }
      }
    }, this);
  },

  _runQueue: function(){
    for (var i = this._requestQueue.length - 1; i >= 0; i--) {
      var request = this._requestQueue[i];
      var method = request.shift();
      this[method].apply(this, request);
    }
    this._requestQueue = [];
  }

});

L.esri.service = function(url, params){
  return new L.esri.services(url, params);
};