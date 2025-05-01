import { Util, Evented } from "leaflet";
import { cors } from "../Support.js";
import { cleanUrl, getUrlParams } from "../Util.js";
import Request from "../Request.js";

export const Service = Evented.extend({
  options: {
    proxy: false,
    useCors: cors,
    timeout: 0,
  },

  initialize(options) {
    options = options || {};
    this._requestQueue = [];
    this._authenticating = false;
    Util.setOptions(this, options);
    this.options.url = cleanUrl(this.options.url);
  },

  get(path, params, callback, context) {
    return this._request("get", path, params, callback, context);
  },

  post(path, params, callback, context) {
    return this._request("post", path, params, callback, context);
  },

  request(path, params, callback, context) {
    return this._request("request", path, params, callback, context);
  },

  metadata(callback, context) {
    return this._request("get", "", {}, callback, context);
  },

  authenticate(token) {
    this._authenticating = false;
    this.options.token = token;
    this._runQueue();
    return this;
  },

  getTimeout() {
    return this.options.timeout;
  },

  setTimeout(timeout) {
    this.options.timeout = timeout;
  },

  _request(method, path, params, callback, context) {
    this.fire(
      "requeststart",
      {
        url: this.options.url + path,
        params,
        method,
      },
      true,
    );

    const wrappedCallback = this._createServiceCallback(
      method,
      path,
      params,
      callback,
      context,
    );

    if (this.options.token) {
      params.token = this.options.token;
    }
    if (this.options.requestParams) {
      Util.extend(params, this.options.requestParams);
    }
    if (this._authenticating) {
      this._requestQueue.push([method, path, params, callback, context]);
    } else {
      const url = this.options.proxy
        ? `${this.options.proxy}?${this.options.url}${path}`
        : this.options.url + path;

      if ((method === "get" || method === "request") && !this.options.useCors) {
        return Request.get.JSONP(url, params, wrappedCallback, context);
      }
      return Request[method](url, params, wrappedCallback, context);
    }
  },

  _createServiceCallback(method, path, params, callback, context) {
    return Util.bind(function (error, response) {
      if (error && (error.code === 499 || error.code === 498)) {
        this._authenticating = true;

        this._requestQueue.push([method, path, params, callback, context]);

        // fire an event for users to handle and re-authenticate
        this.fire(
          "authenticationrequired",
          {
            authenticate: Util.bind(this.authenticate, this),
          },
          true,
        );

        // if the user has access to a callback they can handle the auth error
        error.authenticate = Util.bind(this.authenticate, this);
      }

      callback.call(context, error, response);

      if (error) {
        this.fire(
          "requesterror",
          {
            url: this.options.url + path,
            params,
            message: error.message,
            code: error.code,
            method,
          },
          true,
        );
      } else {
        this.fire(
          "requestsuccess",
          {
            url: this.options.url + path,
            params,
            response,
            method,
          },
          true,
        );
      }

      this.fire(
        "requestend",
        {
          url: this.options.url + path,
          params,
          method,
        },
        true,
      );
    }, this);
  },

  _runQueue() {
    for (let i = this._requestQueue.length - 1; i >= 0; i--) {
      const request = this._requestQueue[i];
      const method = request.shift();
      this[method].apply(this, request);
    }
    this._requestQueue = [];
  },
});

export function service(options) {
  options = getUrlParams(options);
  return new Service(options);
}

export default service;
