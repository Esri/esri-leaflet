import { latLng, latLngBounds, LatLng, LatLngBounds, Util, DomUtil, GeoJSON } from 'leaflet';
import { request, warn } from './Request';
import { options } from './Options';
import { Support } from './Support';

import {
  geojsonToArcGIS as g2a,
  arcgisToGeoJSON as a2g
} from '@terraformer/arcgis';

var BASE_LEAFLET_ATTRIBUTION_STRING = '<a href="http://leafletjs.com" title="A JS library for interactive maps">Leaflet</a>';
var POWERED_BY_ESRI_ATTRIBUTION_STRING = 'Powered by <a href="https://www.esri.com">Esri</a>';

export function geojsonToArcGIS (geojson, idAttr) {
  return g2a(geojson, idAttr);
}

export function arcgisToGeoJSON (arcgis, idAttr) {
  return a2g(arcgis, idAttr);
}

// convert an extent (ArcGIS) to LatLngBounds (Leaflet)
export function extentToBounds (extent) {
  // "NaN" coordinates from ArcGIS Server indicate a null geometry
  if (extent.xmin !== 'NaN' && extent.ymin !== 'NaN' && extent.xmax !== 'NaN' && extent.ymax !== 'NaN') {
    var sw = latLng(extent.ymin, extent.xmin);
    var ne = latLng(extent.ymax, extent.xmax);
    return latLngBounds(sw, ne);
  } else {
    return null;
  }
}

// convert an LatLngBounds (Leaflet) to extent (ArcGIS)
export function boundsToExtent (bounds) {
  bounds = latLngBounds(bounds);
  return {
    xmin: bounds.getSouthWest().lng,
    ymin: bounds.getSouthWest().lat,
    xmax: bounds.getNorthEast().lng,
    ymax: bounds.getNorthEast().lat,
    spatialReference: {
      wkid: 4326
    }
  };
}

var knownFieldNames = /^(OBJECTID|FID|OID|ID)$/i;

// Attempts to find the ID Field from response
export function _findIdAttributeFromResponse (response) {
  var result;

  if (response.objectIdFieldName) {
    // Find Id Field directly
    result = response.objectIdFieldName;
  } else if (response.fields) {
    // Find ID Field based on field type
    for (var j = 0; j <= response.fields.length - 1; j++) {
      if (response.fields[j].type === 'esriFieldTypeOID') {
        result = response.fields[j].name;
        break;
      }
    }
    if (!result) {
      // If no field was marked as being the esriFieldTypeOID try well known field names
      for (j = 0; j <= response.fields.length - 1; j++) {
        if (response.fields[j].name.match(knownFieldNames)) {
          result = response.fields[j].name;
          break;
        }
      }
    }
  }
  return result;
}

// This is the 'last' resort, find the Id field from the specified feature
export function _findIdAttributeFromFeature (feature) {
  for (var key in feature.attributes) {
    if (key.match(knownFieldNames)) {
      return key;
    }
  }
}

export function responseToFeatureCollection (response, idAttribute) {
  var objectIdField;
  var features = response.features || response.results;
  var count = features && features.length;

  if (idAttribute) {
    objectIdField = idAttribute;
  } else {
    objectIdField = _findIdAttributeFromResponse(response);
  }

  var featureCollection = {
    type: 'FeatureCollection',
    features: []
  };

  if (count) {
    for (var i = features.length - 1; i >= 0; i--) {
      var feature = arcgisToGeoJSON(features[i], objectIdField || _findIdAttributeFromFeature(features[i]));
      featureCollection.features.push(feature);
    }
  }

  return featureCollection;
}

// trim url whitespace and add a trailing slash if needed
export function cleanUrl (url) {
  // trim leading and trailing spaces, but not spaces inside the url
  url = Util.trim(url);

  // add a trailing slash to the url if the user omitted it
  if (url[url.length - 1] !== '/') {
    url += '/';
  }

  return url;
}

/* Extract url params if any and store them in requestParams attribute.
   Return the options params updated */
export function getUrlParams (options) {
  if (options.url.indexOf('?') !== -1) {
    options.requestParams = options.requestParams || {};
    var queryString = options.url.substring(options.url.indexOf('?') + 1);
    options.url = options.url.split('?')[0];
    options.requestParams = JSON.parse('{"' + decodeURI(queryString).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}');
  }
  options.url = cleanUrl(options.url.split('?')[0]);
  return options;
}

export function isArcgisOnline (url) {
  /* hosted feature services support geojson as an output format
  utility.arcgis.com services are proxied from a variety of ArcGIS Server vintages, and may not */
  return (/^(?!.*utility\.arcgis\.com).*\.arcgis\.com.*FeatureServer/i).test(url);
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

export function calcAttributionWidth (map) {
  // either crop at 55px or user defined buffer
  return (map.getSize().x - options.attributionWidthOffset) + 'px';
}

export function setEsriAttribution (map) {
  if (!map.attributionControl) {
    return;
  }

  if (!map.attributionControl._esriAttributionLayerCount) {
    map.attributionControl._esriAttributionLayerCount = 0;
  }

  if (map.attributionControl._esriAttributionLayerCount === 0) {
    // Dynamically creating the CSS rules, only run this once per page load:
    if (!map.attributionControl._esriAttributionAddedOnce) {
      var hoverAttributionStyle = document.createElement('style');
      hoverAttributionStyle.type = 'text/css';
      hoverAttributionStyle.innerHTML = '.esri-truncated-attribution:hover {' +
        'white-space: normal;' +
      '}';
      document.getElementsByTagName('head')[0].appendChild(hoverAttributionStyle);

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

      // update the width used to truncate when the map itself is resized
      map.on('resize', function (e) {
        if (map.attributionControl) {
          map.attributionControl._container.style.maxWidth = calcAttributionWidth(e.target);
        }
      });

      map.attributionControl._esriAttributionAddedOnce = true;
    }

    map.attributionControl.setPrefix(BASE_LEAFLET_ATTRIBUTION_STRING + ' | ' + POWERED_BY_ESRI_ATTRIBUTION_STRING);
    DomUtil.addClass(map.attributionControl._container, 'esri-truncated-attribution:hover');
    DomUtil.addClass(map.attributionControl._container, 'esri-truncated-attribution');
  }

  // Track the number of esri-leaflet layers that are on the map so we can know when we can remove the attribution (below in removeEsriAttribution)
  map.attributionControl._esriAttributionLayerCount = map.attributionControl._esriAttributionLayerCount + 1;
}

export function removeEsriAttribution (map) {
  if (!map.attributionControl) {
    return;
  }

  // Only remove the attribution if we're about to remove the LAST esri-leaflet layer (_esriAttributionLayerCount)
  if (map.attributionControl._esriAttributionLayerCount && map.attributionControl._esriAttributionLayerCount === 1) {
    map.attributionControl.setPrefix(BASE_LEAFLET_ATTRIBUTION_STRING);
    DomUtil.removeClass(map.attributionControl._container, 'esri-truncated-attribution:hover');
    DomUtil.removeClass(map.attributionControl._container, 'esri-truncated-attribution');
  }
  map.attributionControl._esriAttributionLayerCount = map.attributionControl._esriAttributionLayerCount - 1;
}

export function _setGeometry (geometry) {
  var params = {
    geometry: null,
    geometryType: null
  };

  // convert bounds to extent and finish
  if (geometry instanceof LatLngBounds) {
    // set geometry + geometryType
    params.geometry = boundsToExtent(geometry);
    params.geometryType = 'esriGeometryEnvelope';
    return params;
  }

  // convert L.Marker > L.LatLng
  if (geometry.getLatLng) {
    geometry = geometry.getLatLng();
  }

  // convert L.LatLng to a geojson point and continue;
  if (geometry instanceof LatLng) {
    geometry = {
      type: 'Point',
      coordinates: [geometry.lng, geometry.lat]
    };
  }

  // handle L.GeoJSON, pull out the first geometry
  if (geometry instanceof GeoJSON) {
    // reassign geometry to the GeoJSON value  (we are assuming that only one feature is present)
    geometry = geometry.getLayers()[0].feature.geometry;
    params.geometry = geojsonToArcGIS(geometry);
    params.geometryType = geojsonTypeToArcGIS(geometry.type);
  }

  // Handle L.Polyline and L.Polygon
  if (geometry.toGeoJSON) {
    geometry = geometry.toGeoJSON();
  }

  // handle GeoJSON feature by pulling out the geometry
  if (geometry.type === 'Feature') {
    // get the geometry of the geojson feature
    geometry = geometry.geometry;
  }

  // confirm that our GeoJSON is a point, line or polygon
  if (geometry.type === 'Point' || geometry.type === 'LineString' || geometry.type === 'Polygon' || geometry.type === 'MultiPolygon') {
    params.geometry = geojsonToArcGIS(geometry);
    params.geometryType = geojsonTypeToArcGIS(geometry.type);
    return params;
  }

  // warn the user if we havn't found an appropriate object
  warn('invalid geometry passed to spatial query. Should be L.LatLng, L.LatLngBounds, L.Marker or a GeoJSON Point, Line, Polygon or MultiPolygon object');
}

export function _getAttributionData (url, map) {
  if (Support.cors) {
    request(url, {}, Util.bind(function (error, attributions) {
      if (error) { return; }
      map._esriAttributions = [];
      for (var c = 0; c < attributions.contributors.length; c++) {
        var contributor = attributions.contributors[c];

        for (var i = 0; i < contributor.coverageAreas.length; i++) {
          var coverageArea = contributor.coverageAreas[i];
          var southWest = latLng(coverageArea.bbox[0], coverageArea.bbox[1]);
          var northEast = latLng(coverageArea.bbox[2], coverageArea.bbox[3]);
          map._esriAttributions.push({
            attribution: contributor.attribution,
            score: coverageArea.score,
            bounds: latLngBounds(southWest, northEast),
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
}

export function _updateMapAttribution (evt) {
  var map = evt.target;
  var oldAttributions = map._esriAttributions;

  if (!map || !map.attributionControl) return;

  var attributionElement = map.attributionControl._container.querySelector('.esri-dynamic-attribution');

  if (attributionElement && oldAttributions) {
    var newAttributions = '';
    var bounds = map.getBounds();
    var wrappedBounds = latLngBounds(
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
    attributionElement.innerHTML = newAttributions;
    attributionElement.style.maxWidth = calcAttributionWidth(map);

    map.fire('attributionupdated', {
      attribution: newAttributions
    });
  }
}

// for backwards compatibility
export { warn };

export var EsriUtil = {
  warn: warn,
  cleanUrl: cleanUrl,
  getUrlParams: getUrlParams,
  isArcgisOnline: isArcgisOnline,
  geojsonTypeToArcGIS: geojsonTypeToArcGIS,
  responseToFeatureCollection: responseToFeatureCollection,
  geojsonToArcGIS: geojsonToArcGIS,
  arcgisToGeoJSON: arcgisToGeoJSON,
  boundsToExtent: boundsToExtent,
  extentToBounds: extentToBounds,
  calcAttributionWidth: calcAttributionWidth,
  setEsriAttribution: setEsriAttribution,
  _setGeometry: _setGeometry,
  _getAttributionData: _getAttributionData,
  _updateMapAttribution: _updateMapAttribution,
  _findIdAttributeFromFeature: _findIdAttributeFromFeature,
  _findIdAttributeFromResponse: _findIdAttributeFromResponse
};

export default EsriUtil;
