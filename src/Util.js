import L from 'leaflet';
import { jsonp } from './Request';
import { options } from './Options';

import {
  geojsonToArcGIS as g2a,
  arcgisToGeoJSON as a2g
} from 'arcgis-to-geojson-utils';

export function geojsonToArcGIS (geojson, idAttr) {
  return g2a(geojson, idAttr);
}

export function arcgisToGeoJSON (arcgis, idAttr) {
  return a2g(arcgis, idAttr);
}

// shallow object clone for feature properties and attributes
// from http://jsperf.com/cloning-an-object/2
export function shallowClone (obj) {
  var target = {};
  for (var i in obj) {
    if (obj.hasOwnProperty(i)) {
      target[i] = obj[i];
    }
  }
  return target;
}

// convert an extent (ArcGIS) to LatLngBounds (Leaflet)
export function extentToBounds (extent) {
  var sw = L.latLng(extent.ymin, extent.xmin);
  var ne = L.latLng(extent.ymax, extent.xmax);
  return L.latLngBounds(sw, ne);
}

// convert an LatLngBounds (Leaflet) to extent (ArcGIS)
export function boundsToExtent (bounds) {
  bounds = L.latLngBounds(bounds);
  return {
    'xmin': bounds.getSouthWest().lng,
    'ymin': bounds.getSouthWest().lat,
    'xmax': bounds.getNorthEast().lng,
    'ymax': bounds.getNorthEast().lat,
    'spatialReference': {
      'wkid': 4326
    }
  };
}

export function responseToFeatureCollection (response, idAttribute) {
  var objectIdField;
  var features = response.features || response.results;
  var count = features.length;

  if (idAttribute) {
    objectIdField = idAttribute;
  } else if (response.objectIdFieldName) {
    objectIdField = response.objectIdFieldName;
  } else if (response.fields) {
    for (var j = 0; j <= response.fields.length - 1; j++) {
      if (response.fields[j].type === 'esriFieldTypeOID') {
        objectIdField = response.fields[j].name;
        break;
      }
    }
  } else if (count) {
    /* as a last resort, check for common ID fieldnames in the first feature returned
    not foolproof. identifyFeatures can returned a mixed array of features. */
    for (var key in features[0].attributes) {
      if (key.match(/^(OBJECTID|FID|OID|ID)$/i)) {
        objectIdField = key;
        break;
      }
    }
  }

  var featureCollection = {
    type: 'FeatureCollection',
    features: []
  };

  if (count) {
    for (var i = features.length - 1; i >= 0; i--) {
      var feature = arcgisToGeoJSON(features[i], objectIdField);
      featureCollection.features.push(feature);
    }
  }

  return featureCollection;
}

  // trim url whitespace and add a trailing slash if needed
export function cleanUrl (url) {
  // trim leading and trailing spaces, but not spaces inside the url
  url = L.Util.trim(url);

  // add a trailing slash to the url if the user omitted it
  if (url[url.length - 1] !== '/') {
    url += '/';
  }

  return url;
}

export function isArcgisOnline (url) {
  /* hosted feature services can emit geojson natively. */
  return (/\.arcgis\.com.*?FeatureServer/g).test(url);
}

export function geojsonTypeToArcGIS (geoJsonType) {
  var arcgisGeometryType;
  switch (geoJsonType) {
    case 'Point':
      arcgisGeometryType = 'esriGeometryPoint';
      break;
    case 'MultiPoint':
      arcgisGeometryType = 'esriGeometryMultipoint';
      break;
    case 'LineString':
      arcgisGeometryType = 'esriGeometryPolyline';
      break;
    case 'MultiLineString':
      arcgisGeometryType = 'esriGeometryPolyline';
      break;
    case 'Polygon':
      arcgisGeometryType = 'esriGeometryPolygon';
      break;
    case 'MultiPolygon':
      arcgisGeometryType = 'esriGeometryPolygon';
      break;
  }

  return arcgisGeometryType;
}

export function warn () {
  if (console && console.warn) {
    console.warn.apply(console, arguments);
  }
}

export function calcAttributionWidth (map) {
  // either crop at 55px or user defined buffer
  return (map.getSize().x - options.attributionWidthOffset) + 'px';
}

export function setEsriAttribution (map) {
  if (map.attributionControl && !map.attributionControl._esriAttributionAdded) {
    map.attributionControl.setPrefix('<a href="http://leafletjs.com" title="A JS library for interactive maps">Leaflet</a> | Powered by <a href="https://www.esri.com">Esri</a>');

    var hoverAttributionStyle = document.createElement('style');
    hoverAttributionStyle.type = 'text/css';
    hoverAttributionStyle.innerHTML = '.esri-truncated-attribution:hover {' +
      'white-space: normal;' +
    '}';

    document.getElementsByTagName('head')[0].appendChild(hoverAttributionStyle);
    L.DomUtil.addClass(map.attributionControl._container, 'esri-truncated-attribution:hover');

    // define a new css class in JS to trim attribution into a single line
    var attributionStyle = document.createElement('style');
    attributionStyle.type = 'text/css';
    attributionStyle.innerHTML = '.esri-truncated-attribution {' +
      'vertical-align: -3px;' +
      'white-space: nowrap;' +
      'overflow: hidden;' +
      'text-overflow: ellipsis;' +
      'display: inline-block;' +
      'transition: 0s white-space;' +
      'transition-delay: 1s;' +
      'max-width: ' + calcAttributionWidth(map) + ';' +
    '}';

    document.getElementsByTagName('head')[0].appendChild(attributionStyle);
    L.DomUtil.addClass(map.attributionControl._container, 'esri-truncated-attribution');

    // update the width used to truncate when the map itself is resized
    map.on('resize', function (e) {
      map.attributionControl._container.style.maxWidth = calcAttributionWidth(e.target);
    });

    map.attributionControl._esriAttributionAdded = true;
  }
}

export function _getAttributionData (url, map) {
  jsonp(url, {}, L.Util.bind(function (error, attributions) {
    if (error) { return; }
    map._esriAttributions = [];
    for (var c = 0; c < attributions.contributors.length; c++) {
      var contributor = attributions.contributors[c];

      for (var i = 0; i < contributor.coverageAreas.length; i++) {
        var coverageArea = contributor.coverageAreas[i];
        var southWest = L.latLng(coverageArea.bbox[0], coverageArea.bbox[1]);
        var northEast = L.latLng(coverageArea.bbox[2], coverageArea.bbox[3]);
        map._esriAttributions.push({
          attribution: contributor.attribution,
          score: coverageArea.score,
          bounds: L.latLngBounds(southWest, northEast),
          minZoom: coverageArea.zoomMin,
          maxZoom: coverageArea.zoomMax
        });
      }
    }

    map._esriAttributions.sort(function (a, b) {
      return b.score - a.score;
    });

    // pass the same argument as the map's 'moveend' event
    var obj = { target: map };
    _updateMapAttribution(obj);
  }, this));
}

export function _updateMapAttribution (evt) {
  var map = evt.target;
  var oldAttributions = map._esriAttributions;

  if (map && map.attributionControl && oldAttributions) {
    var newAttributions = '';
    var bounds = map.getBounds();
    var wrappedBounds = L.latLngBounds(
      bounds.getSouthWest().wrap(),
      bounds.getNorthEast().wrap()
    );
    var zoom = map.getZoom();

    for (var i = 0; i < oldAttributions.length; i++) {
      var attribution = oldAttributions[i];
      var text = attribution.attribution;

      if (!newAttributions.match(text) && attribution.bounds.intersects(wrappedBounds) && zoom >= attribution.minZoom && zoom <= attribution.maxZoom) {
        newAttributions += (', ' + text);
      }
    }

    newAttributions = newAttributions.substr(2);
    var attributionElement = map.attributionControl._container.querySelector('.esri-dynamic-attribution');

    attributionElement.innerHTML = newAttributions;
    attributionElement.style.maxWidth = calcAttributionWidth(map);

    map.fire('attributionupdated', {
      attribution: newAttributions
    });
  }
}

export var Util = {
  shallowClone: shallowClone,
  warn: warn,
  cleanUrl: cleanUrl,
  isArcgisOnline: isArcgisOnline,
  geojsonTypeToArcGIS: geojsonTypeToArcGIS,
  responseToFeatureCollection: responseToFeatureCollection,
  geojsonToArcGIS: geojsonToArcGIS,
  arcgisToGeoJSON: arcgisToGeoJSON,
  boundsToExtent: boundsToExtent,
  extentToBounds: extentToBounds,
  calcAttributionWidth: calcAttributionWidth,
  setEsriAttribution: setEsriAttribution,
  _getAttributionData: _getAttributionData,
  _updateMapAttribution: _updateMapAttribution
};

export default Util;
