import L from 'leaflet';
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
  } else {
    objectIdField = 'OBJECTID';
  }

  var featureCollection = {
    type: 'FeatureCollection',
    features: []
  };
  var features = response.features || response.results;
  if (features.length) {
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
  /* hosted feature services can emit geojson natively.
  our check for 'geojson' support will need to be revisted
  once the functionality makes its way to ArcGIS Server*/
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
  extentToBounds: extentToBounds
};

export default Util;
