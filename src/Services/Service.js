L.esri.Services.Service = L.Class.extend({

  includes: L.Mixin.Events,

  options: {
    proxy: false,
    useCors: true
  },

  initialize: function (url, options) {
    this.url = L.esri.Util.cleanUrl(url);
    this._requestQueue = [];
    this._authenticating = false;
    options =  L.Util.setOptions(this, options);
  },

  get: function (path, params, callback, context) {
    return this._request('get', path, params, callback, context);
  },

  post: function (path, params, callback, context) {
    return this._request('post', path, params, callback, context);
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
      url: this.url + path,
      params: params
    });

    var wrappedCallback = this._createServiceCallback(method, path, params, callback, context);

    if (this.options.token) {
      params.token = this.options.token;
    }

    if (this._authenticating) {
      this._requestQueue.push([method, path, params, callback, context]);
    } else {
      var url = (this.options.proxy) ? this.options.proxy + '?' + this.url + path : this.url + path;

      if(method === 'get' && !this.options.useCors){
        return L.esri.Request.get.JSONP(url, params, wrappedCallback);
      } else {
        return L.esri[method](url, params, wrappedCallback);
      }
    }
  },

  _createServiceCallback: function(method, path, params, callback, context){
    var request = [method, path, params, callback, context];

    return L.Util.bind(function(error, response){

      if (error && (error.code === 499 || error.code === 498)) {
        this._authenticating = true;

        this._requestQueue.push(request);

        this.fire('authenticationrequired', {
          authenticate: L.Util.bind(this.authenticate, this)
        });
      } else {
        callback.call(context, error, response);

        if(error) {
          this.fire('requesterror', {
            url: this.url + path,
            params: params,
            message: error.message,
            code: error.code
          });
        } else {
          this.fire('requestsuccess', {
            url: this.url + path,
            params: params,
            response: response
          });
        }

        this.fire('requestend', {
          url: this.url + path,
          params: params
        });
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

L.esri.Services.service = function(url, params){
  return new L.esri.Services.Service(url, params);
};