import { Util, DomUtil } from "leaflet";
import { Support } from "./Support.js";

let callbacks = 0;

function serialize(params) {
  let data = "";

  params.f = params.f || "json";

  for (const key in params) {
    if (Object.hasOwn(params, key)) {
      const param = params[key];
      const type = Object.prototype.toString.call(param);
      let value;

      if (data.length) {
        data += "&";
      }

      if (type === "[object Array]") {
        value =
          Object.prototype.toString.call(param[0]) === "[object Object]"
            ? JSON.stringify(param)
            : param.join(",");
      } else if (type === "[object Object]") {
        value = JSON.stringify(param);
      } else if (type === "[object Date]") {
        value = param.valueOf();
      } else {
        value = param;
      }

      data += `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
    }
  }

  const APOSTROPHE_URL_ENCODE = "%27";
  return data.replaceAll("'", APOSTROPHE_URL_ENCODE);
}

function createRequest(callback, context) {
  const httpRequest = new window.XMLHttpRequest();

  httpRequest.onerror = function () {
    httpRequest.onreadystatechange = Util.falseFn;

    callback.call(
      context,
      {
        error: {
          code: 500,
          message: "XMLHttpRequest error",
        },
      },
      null,
    );
  };

  httpRequest.onreadystatechange = function () {
    let response;
    let error;

    if (httpRequest.readyState === 4) {
      try {
        response = JSON.parse(httpRequest.responseText);
      } catch (e) {
        response = null;
        error = {
          code: 500,
          message:
            "Could not parse response as JSON. This could also be caused by a CORS or XMLHttpRequest error.",
        };
      }

      if (!error && response.error) {
        error = response.error;
        response = null;
      }

      httpRequest.onerror = Util.falseFn;

      callback.call(context, error, response);
    }
  };

  httpRequest.ontimeout = function () {
    this.onerror();
  };

  return httpRequest;
}

function xmlHttpPost(url, params, callback, context) {
  const httpRequest = createRequest(callback, context);
  httpRequest.open("POST", url);

  if (typeof context !== "undefined" && context !== null) {
    if (typeof context.options !== "undefined") {
      httpRequest.timeout = context.options.timeout;
    }
  }
  httpRequest.setRequestHeader(
    "Content-Type",
    "application/x-www-form-urlencoded; charset=UTF-8",
  );
  httpRequest.send(serialize(params));

  return httpRequest;
}

function xmlHttpGet(url, params, callback, context) {
  const httpRequest = createRequest(callback, context);
  httpRequest.open("GET", `${url}?${serialize(params)}`, true);

  if (typeof context !== "undefined" && context !== null) {
    if (typeof context.options !== "undefined") {
      httpRequest.timeout = context.options.timeout;
      if (context.options.withCredentials) {
        httpRequest.withCredentials = true;
      }
    }
  }
  httpRequest.send(null);

  return httpRequest;
}

// AJAX handlers for CORS (modern browsers) or JSONP (older browsers)
export function request(url, params, callback, context) {
  const paramString = serialize(params);
  const httpRequest = createRequest(callback, context);
  const requestLength = `${url}?${paramString}`.length;

  // ie10/11 require the request be opened before a timeout is applied
  if (requestLength <= 2000 && Support.cors) {
    httpRequest.open("GET", `${url}?${paramString}`);
  } else if (requestLength > 2000 && Support.cors) {
    httpRequest.open("POST", url);
    httpRequest.setRequestHeader(
      "Content-Type",
      "application/x-www-form-urlencoded; charset=UTF-8",
    );
  }

  if (typeof context !== "undefined" && context !== null) {
    if (typeof context.options !== "undefined") {
      httpRequest.timeout = context.options.timeout;
      if (context.options.withCredentials) {
        httpRequest.withCredentials = true;
      }
    }
  }

  // request is less than 2000 characters and the browser supports CORS, make GET request with XMLHttpRequest
  if (requestLength <= 2000 && Support.cors) {
    httpRequest.send(null);

    // request is more than 2000 characters and the browser supports CORS, make POST request with XMLHttpRequest
  } else if (requestLength > 2000 && Support.cors) {
    httpRequest.send(paramString);

    // request is less  than 2000 characters and the browser does not support CORS, make a JSONP request
  } else if (requestLength <= 2000 && !Support.cors) {
    return jsonp(url, params, callback, context);

    // request is longer then 2000 characters and the browser does not support CORS, log a warning
  } else {
    warn(
      `a request to ${url} was longer then 2000 characters and this browser cannot make a cross-domain post request. Please use a proxy https://developers.arcgis.com/esri-leaflet/api-reference/request/`,
    );
    return;
  }

  return httpRequest;
}

export function jsonp(url, params, callback, context) {
  window._EsriLeafletCallbacks = window._EsriLeafletCallbacks || {};
  const callbackId = `c${callbacks}`;
  params.callback = `window._EsriLeafletCallbacks.${callbackId}`;

  window._EsriLeafletCallbacks[callbackId] = function (response) {
    if (window._EsriLeafletCallbacks[callbackId] !== true) {
      let error;
      const responseType = Object.prototype.toString.call(response);

      if (
        !(
          responseType === "[object Object]" ||
          responseType === "[object Array]"
        )
      ) {
        error = {
          error: {
            code: 500,
            message: "Expected array or object as JSONP response",
          },
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

  const script = DomUtil.create("script", null, document.body);
  script.type = "text/javascript";
  script.src = `${url}?${serialize(params)}`;
  script.id = callbackId;
  script.onerror = function (error) {
    if (error && window._EsriLeafletCallbacks[callbackId] !== true) {
      // Can't get true error code: it can be 404, or 401, or 500
      const err = {
        error: {
          code: 500,
          message: "An unknown error occurred",
        },
      };

      callback.call(context, err);
      window._EsriLeafletCallbacks[callbackId] = true;
    }
  };
  DomUtil.addClass(script, "esri-leaflet-jsonp");

  callbacks++;

  return {
    id: callbackId,
    url: script.src,
    abort() {
      window._EsriLeafletCallbacks._callback[callbackId]({
        code: 0,
        message: "Request aborted.",
      });
    },
  };
}

const get = Support.cors ? xmlHttpGet : jsonp;
get.CORS = xmlHttpGet;
get.JSONP = jsonp;

export function warn(...args) {
  if (console && console.warn) {
    console.warn.apply(console, args);
  }
}

// choose the correct AJAX handler depending on CORS support
export { get };

// always use XMLHttpRequest for posts
export { xmlHttpPost as post };

// export the Request object to call the different handlers for debugging
export const Request = {
  request,
  get,
  post: xmlHttpPost,
};

export default Request;
