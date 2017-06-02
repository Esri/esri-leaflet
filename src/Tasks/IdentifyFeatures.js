import { LatLngBounds, LatLng, GeoJSON } from 'leaflet';
import { Identify } from './Identify';
import { warn,
  responseToFeatureCollection,
  boundsToExtent,
  geojsonToArcGIS,
  geojsonTypeToArcGIS 
} from '../Util';

export var IdentifyFeatures = Identify.extend({
  setters: {
    'layers': 'layers',
    'precision': 'geometryPrecision',
    'tolerance': 'tolerance',
    'returnGeometry': 'returnGeometry'
  },

  params: {
    sr: 4326,
    layers: 'all',
    tolerance: 3,
    returnGeometry: true
  },

  on: function (map) {
    var extent = boundsToExtent(map.getBounds());
    var size = map.getSize();
    this.params.imageDisplay = [size.x, size.y, 96];
    this.params.mapExtent = [extent.xmin, extent.ymin, extent.xmax, extent.ymax];
    return this;
  },

  at: function (geometry) {
    this._setGeometry(geometry);
    return this;
  },

  layerDef: function (id, where) {
    this.params.layerDefs = (this.params.layerDefs) ? this.params.layerDefs + ';' : '';
    this.params.layerDefs += ([id, where]).join(':');
    return this;
  },

  simplify: function (map, factor) {
    var mapWidth = Math.abs(map.getBounds().getWest() - map.getBounds().getEast());
    this.params.maxAllowableOffset = (mapWidth / map.getSize().y) * factor;
    return this;
  },

  run: function (callback, context) {
    return this.request(function (error, response) {
      // immediately invoke with an error
      if (error) {
        callback.call(context, error, undefined, response);
        return;

      // ok no error lets just assume we have features...
      } else {
        var featureCollection = responseToFeatureCollection(response);
        response.results = response.results.reverse();
        for (var i = 0; i < featureCollection.features.length; i++) {
          var feature = featureCollection.features[i];
          feature.layerId = response.results[i].layerId;
        }
        callback.call(context, undefined, featureCollection, response);
      }
    });
  },
  _setGeometry: function (geometry) {
    this.params.inSr = 4326;

    // convert bounds to extent and finish
    if (geometry instanceof LatLngBounds) {
      // set geometry + geometryType
      this.params.geometry = boundsToExtent(geometry);
      this.params.geometryType = 'esriGeometryEnvelope';
      return;
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
      this.params.geometry = geojsonToArcGIS(geometry);
      this.params.geometryType = geojsonTypeToArcGIS(geometry.type);
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
      this.params.geometry = geojsonToArcGIS(geometry);
      this.params.geometryType = geojsonTypeToArcGIS(geometry.type);
      return;
    }

    // warn the user if we havn't found an appropriate object
    warn('invalid geometry passed to spatial query. Should be L.LatLng, L.LatLngBounds, L.Marker or a GeoJSON Point, Line, Polygon or MultiPolygon object');

    return;
  }
});

export function identifyFeatures (options) {
  return new IdentifyFeatures(options);
}

export default identifyFeatures;
