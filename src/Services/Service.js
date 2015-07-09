EsriLeaflet.Services.Service = L.Class.extend({

  includes: L.Mixin.Events,

  options: {
    proxy: false,
    useCors: EsriLeaflet.Support.CORS
  },

  initialize: function (options) {
    options = options || {};
    this._requestQueue = [];
    this._authenticating = false;
    L.Util.setOptions(this, options);
    this.options.url = EsriLeaflet.Util.cleanUrl(this.options.url);
  },

  get: function (path, params, callback, context) {
    return this._request('get', path, params, callback, context);
  },

  post: function (path, params, callback, context) {
    return this._request('post', path, params, callback, context);
  },

  request: function (path, params, callback, context) {
    return this._request('request', path, params, callback, context);
  },

  metadata: function (callback, context) {
    return this._request('get', '', {}, callback, context);
  },

  authenticate: function(token){
    this._authenticating = false;
    this.options.token = token;
    this._runQueue();
    return this;
  },

  _request: function(method, path, params, callback, context){
    this.fire('requeststart', {
      url: this.options.url + path,
      params: params,
      method: method
    });

    var wrappedCallback = this._createServiceCallback(method, path, params, callback, context);

    if (this.options.token) {
      params.token = this.options.token;
    }

    if (this._authenticating) {
      this._requestQueue.push([method, path, params, callback, context]);
      return;
    } else {
      var url = (this.options.proxy) ? this.options.proxy + '?' + this.options.url + path : this.options.url + path;

      if((method === 'get' || method === 'request') && !this.options.useCors){
        return EsriLeaflet.Request.get.JSONP(url, params, wrappedCallback);
      } else {
        return EsriLeaflet[method](url, params, wrappedCallback);
      }
    }
  },

  _createServiceCallback: function(method, path, params, callback, context){
    return L.Util.bind(function(error, response){

      if (error && (error.code === 499 || error.code === 498)) {
        this._authenticating = true;

        this._requestQueue.push([method, path, params, callback, context]);

        // fire an event for users to handle and re-authenticate
        this.fire('authenticationrequired', {
          authenticate: L.Util.bind(this.authenticate, this)
        });

        // if the user has access to a callback they can handle the auth error
        error.authenticate = L.Util.bind(this.authenticate, this);
      }

      callback.call(context, error, response);

      if(error) {
        this.fire('requesterror', {
          url: this.options.url + path,
          params: params,
          message: error.message,
          code: error.code,
          method: method
        });
      } else {
        this.fire('requestsuccess', {
          url: this.options.url + path,
          params: params,
          response: response,
          method: method
        });
      }

      this.fire('requestend', {
        url: this.options.url + path,
        params: params,
        method: method
      });
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

EsriLeaflet.Services.service = function(params){
  return new EsriLeaflet.Services.Service(params);
};
