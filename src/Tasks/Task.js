import { Class, Util } from "leaflet";
import { cors } from "../Support.js";
import { cleanUrl, getUrlParams } from "../Util.js";
import Request from "../Request.js";

export const Task = Class.extend({
  options: {
    proxy: false,
    useCors: cors,
  },

  // Generate a method for each methodName:paramName in the setters for this task.
  generateSetter(param, context) {
    return Util.bind(function (value) {
      this.params[param] = value;
      return this;
    }, context);
  },

  initialize(endpoint) {
    // endpoint can be either a url (and options) for an ArcGIS Rest Service or an instance of EsriLeaflet.Service
    if (endpoint.request && endpoint.options) {
      this._service = endpoint;
      Util.setOptions(this, endpoint.options);
    } else {
      Util.setOptions(this, endpoint);
      this.options.url = cleanUrl(endpoint.url);
    }

    // clone default params into this object
    this.params = Util.extend({}, this.params || {});

    // generate setter methods based on the setters object implimented a child class
    if (this.setters) {
      for (const setter in this.setters) {
        const param = this.setters[setter];
        this[setter] = this.generateSetter(param, this);
      }
    }
  },

  token(token) {
    if (this._service) {
      this._service.authenticate(token);
    } else {
      this.params.token = token;
    }
    return this;
  },

  apikey(apikey) {
    return this.token(apikey);
  },

  // ArcGIS Server Find/Identify 10.5+
  format(boolean) {
    // use double negative to expose a more intuitive positive method name
    this.params.returnUnformattedValues = !boolean;
    return this;
  },

  request(callback, context) {
    if (this.options.requestParams) {
      Util.extend(this.params, this.options.requestParams);
    }
    if (this._service) {
      return this._service.request(this.path, this.params, callback, context);
    }

    return this._request("request", this.path, this.params, callback, context);
  },

  _request(method, path, params, callback, context) {
    const url = this.options.proxy
      ? `${this.options.proxy}?${this.options.url}${path}`
      : this.options.url + path;

    if ((method === "get" || method === "request") && !this.options.useCors) {
      return Request.get.JSONP(url, params, callback, context);
    }

    return Request[method](url, params, callback, context);
  },
});

export function task(options) {
  options = getUrlParams(options);
  return new Task(options);
}

export default task;
