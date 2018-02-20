import { DomUtil } from 'leaflet';
import Support from './Support';
import { warn } from './Util';
import { request as esriRequest, encodeQueryString } from '@esri/arcgis-rest-request';

var callbacks = 0;

// not sure how to handle errors yet
function xmlHttpPost (url, params, callback, context) {
  var request = esriRequest(url, {
    params: params,
    httpMethod: 'POST'
  });

  L.Util.bind(request.then(response => {
    callback.call(context, null, response);
  }), this);
}

// not sure how to handle errors yet
function xmlHttpGet (url, params, callback, context) {
  var request = esriRequest(url, {
    params: params,
    httpMethod: 'GET'
  });

  L.Util.bind(request.then(response => {
    callback.call(context, null, response);
  }), this);
}

// AJAX handlers for CORS (modern browsers) or JSONP (older browsers)
export function request (url, params, callback, context) {
  var paramString = encodeQueryString(params);
  var requestLength = (url + '?' + paramString).length;

  // to do: https://github.com/Esri/arcgis-rest-js/issues/114
  // if (typeof context !== 'undefined' && context !== null) {
  //   if (typeof context.options !== 'undefined') {
  //     httpRequest.timeout = context.options.timeout;
  //   }
  // }

  if (requestLength <= 2000 && Support.cors) {
    this.get(url, params, callback, context);
    return;
  } else if (requestLength > 2000 && Support.cors) {
    this.post(url, params, callback, context);
    return;
  }

  // request is less than 2000 characters and the browser does not support CORS, make a JSONP request
  if (requestLength <= 2000 && !Support.cors) {
    return jsonp(url, params, callback, context);

  // request has more than 2000 characters and the browser does not support CORS, log a warning
  } else {
    warn('a request to ' + url + ' was longer then 2000 characters and this browser cannot make a cross-domain post request. Please use a proxy http://esri.github.io/esri-leaflet/api-reference/request.html');
    return;
  }
}

export function jsonp (url, params, callback, context) {
  params.f = params.f || 'json';

  window._EsriLeafletCallbacks = window._EsriLeafletCallbacks || {};
  var callbackId = 'c' + callbacks;
  params.callback = 'window._EsriLeafletCallbacks.' + callbackId;

  window._EsriLeafletCallbacks[callbackId] = function (response) {
    if (window._EsriLeafletCallbacks[callbackId] !== true) {
      var error;
      var responseType = Object.prototype.toString.call(response);

      if (!(responseType === '[object Object]' || responseType === '[object Array]')) {
        error = {
          error: {
            code: 500,
            message: 'Expected array or object as JSONP response'
          }
        };
        response = null;
      }

      if (!error && response.error) {
        error = response;
        response = null;
      }

      callback.call(context, error, response);
      window._EsriLeafletCallbacks[callbackId] = true;
    }
  };

  var script = DomUtil.create('script', null, document.body);
  script.type = 'text/javascript';
  script.src = url + '?' + encodeQueryString(params);
  script.id = callbackId;
  DomUtil.addClass(script, 'esri-leaflet-jsonp');

  callbacks++;

  return {
    id: callbackId,
    url: script.src,
    abort: function () {
      window._EsriLeafletCallbacks._callback[callbackId]({
        code: 0,
        message: 'Request aborted.'
      });
    }
  };
}

var get = ((Support.cors) ? xmlHttpGet : jsonp);
get.CORS = xmlHttpGet;
get.JSONP = jsonp;

// choose the correct AJAX handler depending on CORS support
export { get };

// always use XMLHttpRequest for posts
export { xmlHttpPost as post };

// export the Request object to call the different handlers for debugging
export var Request = {
  request: request,
  get: get,
  post: xmlHttpPost
};

export default Request;
