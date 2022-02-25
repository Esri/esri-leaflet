import { point, latLng } from 'leaflet';
import { Task } from './Task';
import {
  warn,
  responseToFeatureCollection,
  isArcgisOnline,
  extentToBounds,
  _setGeometry
} from '../Util';

export var Query = Task.extend({
  setters: {
    offset: 'resultOffset',
    limit: 'resultRecordCount',
    fields: 'outFields',
    precision: 'geometryPrecision',
    featureIds: 'objectIds',
    returnGeometry: 'returnGeometry',
    returnM: 'returnM',
    transform: 'datumTransformation',
    token: 'token'
  },

  path: 'query',

  params: {
    returnGeometry: true,
    where: '1=1',
    outSR: 4326,
    outFields: '*'
  },

  // Returns a feature if its shape is wholly contained within the search geometry. Valid for all shape type combinations.
  within: function (geometry) {
    this._setGeometryParams(geometry);
    this.params.spatialRel = 'esriSpatialRelContains'; // to the REST api this reads geometry **contains** layer
    return this;
  },

  // Returns a feature if any spatial relationship is found. Applies to all shape type combinations.
  intersects: function (geometry) {
    this._setGeometryParams(geometry);
    this.params.spatialRel = 'esriSpatialRelIntersects';
    return this;
  },

  // Returns a feature if its shape wholly contains the search geometry. Valid for all shape type combinations.
  contains: function (geometry) {
    this._setGeometryParams(geometry);
    this.params.spatialRel = 'esriSpatialRelWithin'; // to the REST api this reads geometry **within** layer
    return this;
  },

  // Returns a feature if the intersection of the interiors of the two shapes is not empty and has a lower dimension than the maximum dimension of the two shapes. Two lines that share an endpoint in common do not cross. Valid for Line/Line, Line/Area, Multi-point/Area, and Multi-point/Line shape type combinations.
  crosses: function (geometry) {
    this._setGeometryParams(geometry);
    this.params.spatialRel = 'esriSpatialRelCrosses';
    return this;
  },

  // Returns a feature if the two shapes share a common boundary. However, the intersection of the interiors of the two shapes must be empty. In the Point/Line case, the point may touch an endpoint only of the line. Applies to all combinations except Point/Point.
  touches: function (geometry) {
    this._setGeometryParams(geometry);
    this.params.spatialRel = 'esriSpatialRelTouches';
    return this;
  },

  // Returns a feature if the intersection of the two shapes results in an object of the same dimension, but different from both of the shapes. Applies to Area/Area, Line/Line, and Multi-point/Multi-point shape type combinations.
  overlaps: function (geometry) {
    this._setGeometryParams(geometry);
    this.params.spatialRel = 'esriSpatialRelOverlaps';
    return this;
  },

  // Returns a feature if the envelope of the two shapes intersects.
  bboxIntersects: function (geometry) {
    this._setGeometryParams(geometry);
    this.params.spatialRel = 'esriSpatialRelEnvelopeIntersects';
    return this;
  },

  // if someone can help decipher the ArcObjects explanation and translate to plain speak, we should mention this method in the doc
  indexIntersects: function (geometry) {
    this._setGeometryParams(geometry);
    this.params.spatialRel = 'esriSpatialRelIndexIntersects'; // Returns a feature if the envelope of the query geometry intersects the index entry for the target geometry
    return this;
  },

  // only valid for Feature Services running on ArcGIS Server 10.3+ or ArcGIS Online
  nearby: function (latlng, radius) {
    latlng = latLng(latlng);
    this.params.geometry = [latlng.lng, latlng.lat];
    this.params.geometryType = 'esriGeometryPoint';
    this.params.spatialRel = 'esriSpatialRelIntersects';
    this.params.units = 'esriSRUnit_Meter';
    this.params.distance = radius;
    this.params.inSR = 4326;
    return this;
  },

  where: function (string) {
    // instead of converting double-quotes to single quotes, pass as is, and provide a more informative message if a 400 is encountered
    this.params.where = string;
    return this;
  },

  between: function (start, end) {
    this.params.time = [start.valueOf(), end.valueOf()];
    return this;
  },

  simplify: function (map, factor) {
    var mapWidth = Math.abs(map.getBounds().getWest() - map.getBounds().getEast());
    this.params.maxAllowableOffset = (mapWidth / map.getSize().y) * factor;
    return this;
  },

  orderBy: function (fieldName, order) {
    order = order || 'ASC';
    this.params.orderByFields = (this.params.orderByFields) ? this.params.orderByFields + ',' : '';
    this.params.orderByFields += ([fieldName, order]).join(' ');
    return this;
  },

  run: function (callback, context) {
    this._cleanParams();

    // services hosted on ArcGIS Online and ArcGIS Server 10.3.1+ support requesting geojson directly
    if (this.options.isModern || (isArcgisOnline(this.options.url) && this.options.isModern === undefined)) {
      this.params.f = 'geojson';

      return this.request(function (error, response) {
        this._trapSQLerrors(error);
        callback.call(context, error, response, response);
      }, this);

      // otherwise convert it in the callback then pass it on
    } else {
      return this.request(function (error, response) {
        this._trapSQLerrors(error);
        callback.call(context, error, (response && responseToFeatureCollection(response)), response);
      }, this);
    }
  },

  count: function (callback, context) {
    this._cleanParams();
    this.params.returnCountOnly = true;
    return this.request(function (error, response) {
      callback.call(this, error, (response && response.count), response);
    }, context);
  },

  ids: function (callback, context) {
    this._cleanParams();
    this.params.returnIdsOnly = true;
    return this.request(function (error, response) {
      callback.call(this, error, (response && response.objectIds), response);
    }, context);
  },

  // only valid for Feature Services running on ArcGIS Server 10.3+ or ArcGIS Online
  bounds: function (callback, context) {
    this._cleanParams();
    this.params.returnExtentOnly = true;
    return this.request(function (error, response) {
      if (response && response.extent && extentToBounds(response.extent)) {
        callback.call(context, error, extentToBounds(response.extent), response);
      } else {
        error = {
          message: 'Invalid Bounds'
        };
        callback.call(context, error, null, response);
      }
    }, context);
  },

  distinct: function () {
    // geometry must be omitted for queries requesting distinct values
    this.params.returnGeometry = false;
    this.params.returnDistinctValues = true;
    return this;
  },

  // only valid for image services
  pixelSize: function (rawPoint) {
    var castPoint = point(rawPoint);
    this.params.pixelSize = [castPoint.x, castPoint.y];
    return this;
  },

  // only valid for map services
  layer: function (layer) {
    this.path = layer + '/query';
    return this;
  },

  _trapSQLerrors: function (error) {
    if (error) {
      if (error.code === '400') {
        warn('one common syntax error in query requests is encasing string values in double quotes instead of single quotes');
      }
    }
  },

  _cleanParams: function () {
    delete this.params.returnIdsOnly;
    delete this.params.returnExtentOnly;
    delete this.params.returnCountOnly;
  },

  _setGeometryParams: function (geometry) {
    this.params.inSR = 4326;
    var converted = _setGeometry(geometry);
    this.params.geometry = converted.geometry;
    this.params.geometryType = converted.geometryType;
  }

});

export function query (options) {
  return new Query(options);
}

export default query;
