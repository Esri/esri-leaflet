/*! Esri-Leaflet - v0.0.1 - 2013-09-17
*   Copyright (c) 2013 Environmental Systems Research Institute, Inc.
*   Apache License*/
(function (root, factory) {

  // Node.
  if(typeof module === 'object' && typeof module.exports === 'object') {
    exports = module.exports = factory();
  }

  // Browser Global.
  if(typeof window === "object") {
    root.Terraformer = factory();
  }

}(this, function(){
  var exports = {},
      EarthRadius = 6378137,
      DegreesPerRadian = 57.295779513082320,
      RadiansPerDegree =  0.017453292519943,
      MercatorCRS = {
        "type": "link",
        "properties": {
          "href": "http://spatialreference.org/ref/sr-org/6928/ogcwkt/",
          "type": "ogcwkt"
        }
      },
      GeographicCRS = {
        "type": "link",
        "properties": {
          "href": "http://spatialreference.org/ref/epsg/4326/ogcwkt/",
          "type": "ogcwkt"
        }
      };

  /*
  Internal: safe warning
  */
  function warn() {
    var args = Array.prototype.slice.apply(arguments);

    if (typeof console !== undefined && console.warn) {
      console.warn.apply(console, args);
    }
  }

  /*
  Internal: Extend one object with another.
  */
  function extend(destination, source) {
    for (var k in source) {
      if (source.hasOwnProperty(k)) {
        destination[k] = source[k];
      }
    }
    return destination;
  }

  /*
  Public: Calculate an bounding box for a geojson object
  */
  function calculateBounds (geojson) {

    switch (geojson.type) {
      case 'Point':
        return [ geojson.coordinates[0], geojson.coordinates[1], geojson.coordinates[0], geojson.coordinates[1]];

      case 'MultiPoint':
        return calculateBoundsFromArray(geojson.coordinates);

      case 'LineString':
        return calculateBoundsFromArray(geojson.coordinates);

      case 'MultiLineString':
        return calculateBoundsFromNestedArrays(geojson.coordinates);

      case 'Polygon':
        return calculateBoundsFromNestedArrays(geojson.coordinates);

      case 'MultiPolygon':
        return calculateBoundsFromNestedArrayOfArrays(geojson.coordinates);

      case 'Feature':
        return calculateBounds(geojson.geometry);

      case 'FeatureCollection':
        return calculateBoundsForFeatureCollection(geojson);

      case 'GeometryCollection':
        return calculateBoundsForGeometryCollection(geojson);

      default:
        throw new Error("Unknown type: " + geojson.type);
    }
  }

  /*
  Internal: Calculate an bounding box from an nested array of positions
  [
    [
      [ [lng, lat],[lng, lat],[lng, lat] ]
    ]
    [
      [lng, lat],[lng, lat],[lng, lat]
    ]
    [
      [lng, lat],[lng, lat],[lng, lat]
    ]
  ]
  */
  function calculateBoundsFromNestedArrays (array) {
    var x1 = null, x2 = null, y1 = null, y2 = null;

    for (var i = 0; i < array.length; i++) {
      var inner = array[i];

      for (var j = 0; j < inner.length; j++) {
        var lonlat = inner[j];

        var lon = lonlat[0];
        var lat = lonlat[1];

        if (x1 === null) {
          x1 = lon;
        } else if (lon < x1) {
          x1 = lon;
        }

        if (x2 === null) {
          x2 = lon;
        } else if (lon > x2) {
          x2 = lon;
        }

        if (y1 === null) {
          y1 = lat;
        } else if (lat < y1) {
          y1 = lat;
        }

        if (y2 === null) {
          y2 = lat;
        } else if (lat > y2) {
          y2 = lat;
        }
      }
    }

    return [x1, y1, x2, y2 ];
  }

  /*
  Internal: Calculate a bounding box from an array of arrays of arrays
  [
    [ [lng, lat],[lng, lat],[lng, lat] ]
    [ [lng, lat],[lng, lat],[lng, lat] ]
    [ [lng, lat],[lng, lat],[lng, lat] ]
  ]
  */
  function calculateBoundsFromNestedArrayOfArrays (array) {
    var x1 = null, x2 = null, y1 = null, y2 = null;

    for (var i = 0; i < array.length; i++) {
      var inner = array[i];

      for (var j = 0; j < inner.length; j++) {
        var innerinner = inner[j];
        for (var k = 0; k < innerinner.length; k++) {
          var lonlat = innerinner[k];

          var lon = lonlat[0];
          var lat = lonlat[1];

          if (x1 === null) {
            x1 = lon;
          } else if (lon < x1) {
            x1 = lon;
          }

          if (x2 === null) {
            x2 = lon;
          } else if (lon > x2) {
            x2 = lon;
          }

          if (y1 === null) {
            y1 = lat;
          } else if (lat < y1) {
            y1 = lat;
          }

          if (y2 === null) {
            y2 = lat;
          } else if (lat > y2) {
            y2 = lat;
          }
        }
      }
    }

    return [x1, y1, x2, y2];
  }

  /*
  Internal: Calculate a bounding box from an array of positions
  [
    [lng, lat],[lng, lat],[lng, lat]
  ]
  */
  function calculateBoundsFromArray (array) {
    var x1 = null, x2 = null, y1 = null, y2 = null;

    for (var i = 0; i < array.length; i++) {
      var lonlat = array[i];
      var lon = lonlat[0];
      var lat = lonlat[1];

      if (x1 === null) {
        x1 = lon;
      } else if (lon < x1) {
        x1 = lon;
      }

      if (x2 === null) {
        x2 = lon;
      } else if (lon > x2) {
        x2 = lon;
      }

      if (y1 === null) {
        y1 = lat;
      } else if (lat < y1) {
        y1 = lat;
      }

      if (y2 === null) {
        y2 = lat;
      } else if (lat > y2) {
        y2 = lat;
      }
    }

    return [x1, y1, x2, y2 ];
  }

  /*
  Internal: Calculate an bounding box for a feature collection
  */
  function calculateBoundsForFeatureCollection(featureCollection){
    var extents = [], extent;
    for (var i = featureCollection.features.length - 1; i >= 0; i--) {
      extent = calculateBounds(featureCollection.features[i].geometry);
      extents.push([extent[0],extent[1]]);
      extents.push([extent[2],extent[3]]);
    }

    return calculateBoundsFromArray(extents);
  }

  /*
  Internal: Calculate an bounding box for a geometry collection
  */
  function calculateBoundsForGeometryCollection(geometryCollection){
    var extents = [], extent;

    for (var i = geometryCollection.geometries.length - 1; i >= 0; i--) {
      extent = calculateBounds(geometryCollection.geometries[i]);
      extents.push([extent[0],extent[1]]);
      extents.push([extent[2],extent[3]]);
    }

    return calculateBoundsFromArray(extents);
  }

  function calculateEnvelope(geojson){
    var bounds = calculateBounds(geojson);
    return {
      x: bounds[0],
      y: bounds[1],
      w: Math.abs(bounds[0] - bounds[2]),
      h: Math.abs(bounds[1] - bounds[3])
    };
  }

  /*
  Internal: Convert radians to degrees. Used by spatial reference converters.
  */
  function radToDeg(rad) {
    return rad * DegreesPerRadian;
  }

  /*
  Internal: Convert degrees to radians. Used by spatial reference converters.
  */
  function degToRad(deg) {
    return deg * RadiansPerDegree;
  }

  /*
  Internal: Loop over each array in a geojson object and apply a function to it. Used by spatial reference converters.
  */
  function eachPosition(coordinates, func) {
    for (var i = 0; i < coordinates.length; i++) {
      // we found a number so lets convert this pair
      if(typeof coordinates[i][0] === "number"){
        coordinates[i] = func(coordinates[i]);
      }
      // we found an coordinates array it again and run THIS function against it
      if(typeof coordinates[i] === "object"){
        coordinates[i] = eachPosition(coordinates[i], func);
      }
    }
    return coordinates;
  }

  /*
  Public: Convert a GeoJSON Position object to Geographic (4326)
  */
  function positionToGeographic(position) {
    var x = position[0];
    var y = position[1];
    return [radToDeg(x / EarthRadius) - (Math.floor((radToDeg(x / EarthRadius) + 180) / 360) * 360), radToDeg((Math.PI / 2) - (2 * Math.atan(Math.exp(-1.0 * y / EarthRadius))))];
  }

  /*
  Public: Convert a GeoJSON Position object to Web Mercator (102100)
  */
  function positionToMercator(position) {
    var lng = position[0];
    var lat = Math.max(Math.min(position[1], 89.99999), -89.99999);
    return [degToRad(lng) * EarthRadius, EarthRadius/2.0 * Math.log( (1.0 + Math.sin(degToRad(lat))) / (1.0 - Math.sin(degToRad(lat))) )];
  }

  /*
  Public: Apply a function agaist all positions in a geojson object. Used by spatial reference converters.
  */
  function applyConverter(geojson, converter, noCrs){
    if(geojson.type === "Point") {
      geojson.coordinates = converter(geojson.coordinates);
    } else if(geojson.type === "Feature") {
      geojson.geometry = applyConverter(geojson.geometry, converter, true);
    } else if(geojson.type === "FeatureCollection") {
      for (var f = 0; f < geojson.features.length; f++) {
        geojson.features[f] = applyConverter(geojson.features[f], converter, true);
      }
    } else if(geojson.type === "GeometryCollection") {
      for (var g = 0; g < geojson.geometries.length; g++) {
        geojson.geometries[g] = applyConverter(geojson.geometries[g], converter, true);
      }
    } else {
      geojson.coordinates = eachPosition(geojson.coordinates, converter);
    }

    if(!noCrs){
      if(converter === positionToMercator){
        geojson.crs = MercatorCRS;
      }
    }

    if(converter === positionToGeographic){
      delete geojson.crs;
    }

    return geojson;
  }

  /*
  Public: Convert a GeoJSON object to ESRI Web Mercator (102100)
  */
  function toMercator(geojson) {
    return applyConverter(geojson, positionToMercator);
  }

  /*
  Convert a GeoJSON object to Geographic coordinates (WSG84, 4326)
  */
  function toGeographic(geojson) {
    return applyConverter(geojson, positionToGeographic);
  }


  /*
  Internal: -1,0,1 comparison function
  */
  function cmp(a, b) {
    if(a < b) {
      return -1;
    } else if(a > b) {
      return 1;
    } else {
      return 0;
    }
  }

  /*
  Internal: used for sorting
  */
  function compSort(p1, p2) {
    if(p1[0] - p2[0] > p1[1] - p2[1]) {
      return 1;
    } else if(p1[0] - p2[0] < p1[1] - p2[1]) {
      return -1;
    } else {
      return 0;
    }
  }


  /*
  Internal: used to determine turn
  */
  function turn(p, q, r) {
    // Returns -1, 0, 1 if p,q,r forms a right, straight, or left turn.
    return cmp((q[0] - p[0]) * (r[1] - p[1]) - (r[0] - p[0]) * (q[1] - p[1]), 0);
  }

  /*
  Internal: used to determine euclidean distance between two points
  */
  function euclideanDistance(p, q) {
    // Returns the squared Euclidean distance between p and q.
    var dx = q[0] - p[0];
    var dy = q[1] - p[1];

    return dx * dx + dy * dy;
  }

  function nextHullPoint(points, p) {
    // Returns the next point on the convex hull in CCW from p.
    var q = p;
    for(var r in points) {
      var t = turn(p, q, points[r]);
      if(t === -1 || t === 0 && euclideanDistance(p, points[r]) > euclideanDistance(p, q)) {
        q = points[r];
      }
    }
    return q;
  }

  function convexHull(points) {
    // implementation of the Jarvis March algorithm
    // adapted from http://tixxit.wordpress.com/2009/12/09/jarvis-march/

    if(points.length === 0) {
      return [];
    } else if(points.length === 1) {
      return points;
    }

    // Returns the points on the convex hull of points in CCW order.
    var hull = [points.sort(compSort)[0]];

    for(var p = 0; p < hull.length; p++) {
      var q = nextHullPoint(points, hull[p]);

      if(q !== hull[0]) {
        hull.push(q);
      }
    }

    return hull;
  }

  function coordinatesContainPoint(coordinates, point) {
    var contains = false;
    for(var i = -1, l = coordinates.length, j = l - 1; ++i < l; j = i) {
      if (((coordinates[i][1] <= point[1] && point[1] < coordinates[j][1]) ||
           (coordinates[j][1] <= point[1] && point[1] < coordinates[i][1])) &&
          (point[0] < (coordinates[j][0] - coordinates[i][0]) * (point[1] - coordinates[i][1]) / (coordinates[j][1] - coordinates[i][1]) + coordinates[i][0])) {
        contains = !contains;
      }
    }
    return contains;
  }

  function polygonContainsPoint(polygon, point) {
    if (polygon && polygon.length) {
      if (polygon.length === 1) { // polygon with no holes
        return coordinatesContainPoint(polygon[0], point);
      } else { // polygon with holes
        if (coordinatesContainPoint(polygon[0], point)) {
          for (var i = 1; i < polygon.length; i++) {
            if (coordinatesContainPoint(polygon[i], point)) {
              return false; // found in hole
            }
          }

          return true;
        } else {
          return false;
        }
      }
    } else {
      return false;
    }
  }

  function vertexIntersectsVertex(a1, a2, b1, b2) {
    var ua_t = (b2[0] - b1[0]) * (a1[1] - b1[1]) - (b2[1] - b1[1]) * (a1[0] - b1[0]);
    var ub_t = (a2[0] - a1[0]) * (a1[1] - b1[1]) - (a2[1] - a1[1]) * (a1[0] - b1[0]);
    var u_b  = (b2[1] - b1[1]) * (a2[0] - a1[0]) - (b2[0] - b1[0]) * (a2[1] - a1[1]);

    if ( u_b !== 0 ) {
      var ua = ua_t / u_b;
      var ub = ub_t / u_b;

      if ( 0 <= ua && ua <= 1 && 0 <= ub && ub <= 1 ) {
        return true;
      }
    }

    return false;
  }

  function arrayIntersectsArray(a, b) {
    for (var i = 0; i < a.length - 1; i++) {
      for (var j = 0; j < b.length - 1; j++) {
        if (vertexIntersectsVertex(a[i], a[i + 1], b[j], b[j + 1])) {
          return true;
        }
      }
    }

    return false;
  }

  function arrayIntersectsMultiArray(a, b) {
    for (var i = 0; i < b.length; i++) {
      var inner = b[i];

      for (var j = 0; j < inner.length - 1; j++) {
        for (var k = 0; k < a.length - 1; k++) {
          if (vertexIntersectsVertex(inner[j], inner[j + 1], a[k], a[k + 1])) {
            return true;
          }
        }
      }
    }

    return false;
  }

  function multiArrayIntersectsMultiArray(a, b) {
    for (var i = 0; i < a.length; i++) {
      if (arrayIntersectsMultiArray(a[i], b)) {
        return true;
      }
    }

    return false;
  }

  function arrayIntersectsMultiMultiArray(a, b) {
    for (var i = 0; i < b.length; i++) {
      if (arrayIntersectsMultiArray(a, b[i])) {
        return true;
      }

      return false;
    }
  }

  function multiArrayIntersectsMultiMultiArray(a, b) {
    for (var i = 0; i < a.length; i++) {
      if (arrayIntersectsMultiMultiArray(a[i], b)) {
        return true;
      }

      return false;
    }
  }

  function multiMultiArrayIntersectsMultiMultiArray(a, b) {
    for (var i = 0; i < a.length; i++) {
      if (multiArrayIntersectsMultiMultiArray(a[i], b)) {
        return true;
      }

      return false;
    }
  }

  /*
  Internal: Returns a copy of coordinates for s closed polygon
  */
  function closedPolygon(coordinates) {
    var outer = [ ];

    for (var i = 0; i < coordinates.length; i++) {
      var inner = coordinates[i].slice();

      if (pointsEqual(inner[0], inner[inner.length - 1]) === false) {
        inner.push(inner[0]);
      }

      outer.push(inner);
    }

    return outer;
  }

  function pointsEqual(a, b) {
    for (var i = 0; i < a.length; i++) {
      for (var j = 0; j < b.length; j++) {
        if (a[i] !== b[j]) {
          return false;
        }
      }
    }

    return true;
  }

  function coordinatesEqual(a, b) {
    if (a.length !== b.length) {
      return false;
    }

    var na = a.slice().sort(compSort);
    var nb = b.slice().sort(compSort);

    for (var i = 0; i < na.length; i++) {
      if (na[i].length !== nb[i].length) {
        return false;
      }
      for (var j = 0; j < na.length; j++) {
        if (na[i][j] !== nb[i][j]) {
          return false;
        }
      }
    }

    return true;
  }

  /*
  Internal: An array of variables that will be excluded form JSON objects.
  */
  var excludeFromJSON = ["length"];

  /*
  Internal: Base GeoJSON Primitive
  */
  function Primitive(geojson){
    if(geojson){
      switch (geojson.type) {
      case 'Point':
        return new Point(geojson);

      case 'MultiPoint':
        return new MultiPoint(geojson);

      case 'LineString':
        return new LineString(geojson);

      case 'MultiLineString':
        return new MultiLineString(geojson);

      case 'Polygon':
        return new Polygon(geojson);

      case 'MultiPolygon':
        return new MultiPolygon(geojson);

      case 'Feature':
        return new Feature(geojson);

      case 'FeatureCollection':
        return new FeatureCollection(geojson);

      case 'GeometryCollection':
        return new GeometryCollection(geojson);

      default:
        throw new Error("Unknown type: " + geojson.type);
      }
    }
  }

  Primitive.prototype.toMercator = function(){
    return toMercator(this);
  };

  Primitive.prototype.toGeographic = function(){
    return toGeographic(this);
  };

  Primitive.prototype.envelope = function(){
    return calculateEnvelope(this);
  };

  Primitive.prototype.bbox = function(){
    return calculateBounds(this);
  };

  Primitive.prototype.convexHull = function(){
    var coordinates = [ ], i, j;
    if (this.type === 'Point') {
      if (this.coordinates && this.coordinates.length > 0) {
        return [ this.coordinates ];
      } else {
        return [ ];
      }
    } else if (this.type === 'LineString' || this.type === 'MultiPoint') {
      if (this.coordinates && this.coordinates.length > 0) {
        coordinates = this.coordinates;
      } else {
        return [ ];
      }
    } else if (this.type === 'Polygon' || this.type === 'MultiLineString') {
      if (this.coordinates && this.coordinates.length > 0) {
        for (i = 0; i < this.coordinates.length; i++) {
          coordinates = coordinates.concat(this.coordinates[i]);
        }
      } else {
        return [ ];
      }
    } else if (this.type === 'MultiPolygon') {
      if (this.coordinates && this.coordinates.length > 0) {
        for (i = 0; i < this.coordinates.length; i++) {
          for (j = 0; j < this.coordinates[i].length; j++) {
            coordinates = coordinates.concat(this.coordinates[i][j]);
          }
        }
      } else {
        return [ ];
      }
    } else {
      throw new Error("Unable to get convex hull of " + this.type);
    }

    return convexHull(coordinates);
  };

  Primitive.prototype.toJSON = function(){
    var obj = {};
    for (var key in this) {
      if (this.hasOwnProperty(key) && excludeFromJSON.indexOf(key) === -1) {
        obj[key] = this[key];
      }
    }
    obj.bbox = calculateBounds(this);
    return obj;
  };

  Primitive.prototype.within = function(primitive) {
    var coordinates, i, contains;

    // point.within(point) :: equality
    if (primitive.type === "Point") {
      if (this.type === "Point") {
        return pointsEqual(this.coordinates, primitive.coordinates);

      }
    }

    // point.within(multilinestring)
    if (primitive.type === "MultiLineString") {
      if (this.type === "Point") {
        for (i = 0; i < primitive.coordinates.length; i++) {
          var linestring = { type: "LineString", coordinates: primitive.coordinates[i] };

          if (this.within(linestring)) {
            return true;
          }
        }
      }
    }

    // point.within(linestring), point.within(multipoint)
    if (primitive.type === "LineString" || primitive.type === "MultiPoint") {
      if (this.type === "Point") {
        for (i = 0; i < primitive.coordinates.length; i++) {
          if (this.coordinates.length !== primitive.coordinates[i].length) {
            return false;
          }

          if (pointsEqual(this.coordinates, primitive.coordinates[i])) {
            return true;
          }
        }
      }
    }

    if (primitive.type === "Polygon") {
      // polygon.within(polygon)
      if (this.type === "Polygon") {
        // check for equal polygons
        if (primitive.coordinates.length === this.coordinates.length) {
          for (i = 0; i < this.coordinates.length; i++) {
            if (coordinatesEqual(this.coordinates[i], primitive.coordinates[i])) {
              return true;
            }
          }
        }

        if (this.coordinates.length && polygonContainsPoint(primitive.coordinates, this.coordinates[0][0])) {
          return !multiArrayIntersectsMultiArray(closedPolygon(this.coordinates), closedPolygon(primitive.coordinates));
        } else {
          return false;
        }

      // point.within(polygon)
      } else if (this.type === "Point") {
        return polygonContainsPoint(primitive.coordinates, this.coordinates);

      // linestring/multipoint withing polygon
      } else if (this.type === "LineString" || this.type === "MultiPoint") {
        if (!this.coordinates || this.coordinates.length === 0) {
          return false;
        }

        for (i = 0; i < this.coordinates.length; i++) {
          if (polygonContainsPoint(primitive.coordinates, this.coordinates[i]) === false) {
            return false;
          }
        }

        return true;

      // multilinestring.within(polygon)
      } else if (this.type === "MultiLineString") {
        for (i = 0; i < this.coordinates.length; i++) {
          var ls = new LineString(this.coordinates[i]);

          if (ls.within(primitive) === false) {
            contains++;
            return false;
          }
        }

        return true;

      // multipolygon.within(polygon)
      } else if (this.type === "MultiPolygon") {
        for (i = 0; i < this.coordinates.length; i++) {
          var p1 = new Primitive({ type: "Polygon", coordinates: this.coordinates[i] });

          if (p1.within(primitive) === false) {
            return false;
          }
        }

        return true;
      }

    }

    if (primitive.type === "MultiPolygon") {
      // point.within(multipolygon)
      if (this.type === "Point") {
        if (primitive.coordinates.length) {
          for (i = 0; i < primitive.coordinates.length; i++) {
            coordinates = primitive.coordinates[i];
            if (polygonContainsPoint(coordinates, this.coordinates) && multiArrayIntersectsMultiArray(this.coordinates, primitive.coordinates) === false) {
              return true;
            }
          }
        }

        return false;
      // polygon.within(multipolygon)
      } else if (this.type === "Polygon") {
        for (i = 0; i < this.coordinates.length; i++) {
          if (primitive.coordinates[i].length === this.coordinates.length) {
            for (j = 0; j < this.coordinates.length; j++) {
              if (coordinatesEqual(this.coordinates[j], primitive.coordinates[i][j])) {
                return true;
              }
            }
          }
        }

        if (multiArrayIntersectsMultiMultiArray(this.coordinates, primitive.coordinates) === false) {
          if (primitive.coordinates.length) {
            for (i = 0; i < primitive.coordinates.length; i++) {
              coordinates = primitive.coordinates[i];
              if (polygonContainsPoint(coordinates, this.coordinates[0][0]) === false) {
                contains = false;
              } else {
                contains = true;
              }
            }

            return contains;
          }
        }

      // linestring.within(multipolygon), multipoint.within(multipolygon)
      } else if (this.type === "LineString" || this.type === "MultiPoint") {
        for (i = 0; i < primitive.coordinates.length; i++) {
          var p = { type: "Polygon", coordinates: primitive.coordinates[i] };

          if (this.within(p)) {
            return true;
          }

          return false;
        }

      // multilinestring.within(multipolygon)
      } else if (this.type === "MultiLineString") {
        for (i = 0; i < this.coordinates.length; i++) {
          var lines = new LineString(this.coordinates[i]);

          if (lines.within(primitive) === false) {
            return false;
          }
        }

        return true;

      // multipolygon.within(multipolygon)
      } else if (this.type === "MultiPolygon") {
        for (i = 0; i < primitive.coordinates.length; i++) {
          var mpoly = { type: "Polygon", coordinates: primitive.coordinates[i] };

          if (this.within(mpoly) === false) {
            return false;
          }
        }

        return true;
      }
    }

    // default to false
    return false;
  };

  Primitive.prototype.intersects = function(primitive) {
    // if we are passed a feature, use the polygon inside instead
    if (primitive.type === 'Feature') {
      primitive = primitive.geometry;
    }

    var p = new Primitive(primitive);
    if (this.within(primitive) || p.within(this)) {
      return true;
    }

    if (this.type === 'LineString') {
      if (primitive.type === 'LineString') {
        return arrayIntersectsArray(this.coordinates, primitive.coordinates);
      } else if (primitive.type === 'MultiLineString') {
        return arrayIntersectsMultiArray(this.coordinates, primitive.coordinates);
      } else if (primitive.type === 'Polygon') {
        return arrayIntersectsMultiArray(this.coordinates, closedPolygon(primitive.coordinates));
      } else if (primitive.type === 'MultiPolygon') {
        return arrayIntersectsMultiMultiArray(this.coordinates, primitive.coordinates);
      }
    } else if (this.type === 'MultiLineString') {
      if (primitive.type === 'LineString') {
        return arrayIntersectsMultiArray(primitive.coordinates, this.coordinates);
      } else if (primitive.type === 'Polygon' || primitive.type === 'MultiLineString') {
        return multiArrayIntersectsMultiArray(this.coordinates, primitive.coordinates);
      } else if (primitive.type === 'MultiPolygon') {
        return multiArrayIntersectsMultiMultiArray(this.coordinates, primitive.coordinates);
      }
    } else if (this.type === 'Polygon') {
      if (primitive.type === 'LineString') {
        return arrayIntersectsMultiArray(primitive.coordinates, closedPolygon(this.coordinates));
      } else if (primitive.type === 'MultiLineString') {
        return multiArrayIntersectsMultiArray(closedPolygon(this.coordinates), primitive.coordinates);
      } else if (primitive.type === 'Polygon') {
        return multiArrayIntersectsMultiArray(closedPolygon(this.coordinates), closedPolygon(primitive.coordinates));
      } else if (primitive.type === 'MultiPolygon') {
        return multiArrayIntersectsMultiMultiArray(closedPolygon(this.coordinates), primitive.coordinates);
      }
    } else if (this.type === 'MultiPolygon') {
      if (primitive.type === 'LineString') {
        return arrayIntersectsMultiMultiArray(primitive.coordinates, this.coordinates);
      } else if (primitive.type === 'Polygon' || primitive.type === 'MultiLineString') {
        return multiArrayIntersectsMultiMultiArray(closedPolygon(primitive.coordinates), this.coordinates);
      } else if (primitive.type === 'MultiPolygon') {
        return multiMultiArrayIntersectsMultiMultiArray(this.coordinates, primitive.coordinates);
      }
    } else if (this.type === 'Feature') {
      // in the case of a Feature, use the internal primitive for intersection
      var inner = new Primitive(this.geometry);
      return inner.intersects(primitive);
    }

    warn("Type " + this.type + " to " + primitive.type + " intersection is not supported by intersects");
    return false;
  };


  /*
  GeoJSON Point Class
    new Point();
    new Point(x,y,z,wtf);
    new Point([x,y,z,wtf]);
    new Point([x,y]);
    new Point({
      type: "Point",
      coordinates: [x,y]
    });
  */
  function Point(input){
    var args = Array.prototype.slice.call(arguments);

    if(input && input.type === "Point" && input.coordinates){
      extend(this, input);
    } else if(input && Object.prototype.toString.call(input) === "[object Array]") {
      this.coordinates = input;
    } else if(args.length >= 2) {
      this.coordinates = args;
    } else {
      throw "Terraformer: invalid input for Terraformer.Point";
    }

    this.type = "Point";
  }

  Point.prototype = new Primitive();
  Point.prototype.constructor = Point;

  /*
  GeoJSON MultiPoint Class
      new MultiPoint();
      new MultiPoint([[x,y], [x1,y1]]);
      new MultiPoint({
        type: "MultiPoint",
        coordinates: [x,y]
      });
  */
  function MultiPoint(input){
    if(input && input.type === "MultiPoint" && input.coordinates){
      extend(this, input);
    } else if(Array.isArray(input)) {
      this.coordinates = input;
    } else {
      throw "Terraformer: invalid input for Terraformer.MultiPoint";
    }

    this.type = "MultiPoint";
  }

  MultiPoint.prototype = new Primitive();
  MultiPoint.prototype.constructor = MultiPoint;
  MultiPoint.prototype.forEach = function(func){
    for (var i = 0; i < this.coordinates.length; i++) {
      func.apply(this, [this.coordinates[i], i, this.coordinates]);
    }
    return this;
  };
  MultiPoint.prototype.addPoint = function(point){
    this.coordinates.push(point);
    return this;
  };
  MultiPoint.prototype.insertPoint = function(point, index){
    this.coordinates.splice(index, 0, point);
    return this;
  };
  MultiPoint.prototype.removePoint = function(remove){
    if(typeof remove === "number"){
      this.coordinates.splice(remove, 1);
    } else {
      this.coordinates.splice(this.coordinates.indexOf(remove), 1);
    }
    return this;
  };
  MultiPoint.prototype.get = function(i){
    return new Point(this.coordinates[i]);
  };

  /*
  GeoJSON LineString Class
      new LineString();
      new LineString([[x,y], [x1,y1]]);
      new LineString({
        type: "LineString",
        coordinates: [x,y]
      });
  */
  function LineString(input){
    if(input && input.type === "LineString" && input.coordinates){
      extend(this, input);
    } else if(Array.isArray(input)) {
      this.coordinates = input;
    } else {
      throw "Terraformer: invalid input for Terraformer.LineString";
    }

    this.type = "LineString";
  }

  LineString.prototype = new Primitive();
  LineString.prototype.constructor = LineString;
  LineString.prototype.addVertex = function(point){
    this.coordinates.push(point);
    return this;
  };
  LineString.prototype.insertVertex = function(point, index){
    this.coordinates.splice(index, 0, point);
    return this;
  };
  LineString.prototype.removeVertex = function(remove){
    this.coordinates.splice(remove, 1);
    return this;
  };

  /*
  GeoJSON MultiLineString Class
      new MultiLineString();
      new MultiLineString([ [[x,y], [x1,y1]], [[x2,y2], [x3,y3]] ]);
      new MultiLineString({
        type: "MultiLineString",
        coordinates: [ [[x,y], [x1,y1]], [[x2,y2], [x3,y3]] ]
      });
  */
  function MultiLineString(input){
    if(input && input.type === "MultiLineString" && input.coordinates){
      extend(this, input);
    } else if(Array.isArray(input)) {
      this.coordinates = input;
    } else {
      throw "Terraformer: invalid input for Terraformer.MultiLineString";
    }

    this.type = "MultiLineString";
  }

  MultiLineString.prototype = new Primitive();
  MultiLineString.prototype.constructor = MultiLineString;
  MultiLineString.prototype.forEach = function(func){
    for (var i = 0; i < this.coordinates.length; i++) {
      func.apply(this, [this.coordinates[i], i, this.coordinates ]);
    }
  };
  MultiLineString.prototype.get = function(i){
    return new LineString(this.coordinates[i]);
  };

  /*
  GeoJSON Polygon Class
      new Polygon();
      new Polygon([ [[x,y], [x1,y1], [x2,y2]] ]);
      new Polygon({
        type: "Polygon",
        coordinates: [ [[x,y], [x1,y1], [x2,y2]] ]
      });
  */
  function Polygon(input){
    if(input && input.type === "Polygon" && input.coordinates){
      extend(this, input);
    } else if(Array.isArray(input)) {
      this.coordinates = input;
    } else {
      throw "Terraformer: invalid input for Terraformer.Polygon";
    }

    this.type = "Polygon";
  }

  Polygon.prototype = new Primitive();
  Polygon.prototype.constructor = Polygon;
  Polygon.prototype.addVertex = function(point){
    this.coordinates[0].push(point);
    return this;
  };
  Polygon.prototype.insertVertex = function(point, index){
    this.coordinates[0].splice(index, 0, point);
    return this;
  };
  Polygon.prototype.removeVertex = function(remove){
    this.coordinates[0].splice(remove, 1);
    return this;
  };

  Polygon.prototype.close = function() {
    this.coordinates = closedPolygon(this.coordinates);
  };

  /*
  GeoJSON MultiPolygon Class
      new MultiPolygon();
      new MultiPolygon([ [ [[x,y], [x1,y1]], [[x2,y2], [x3,y3]] ] ]);
      new MultiPolygon({
        type: "MultiPolygon",
        coordinates: [ [ [[x,y], [x1,y1]], [[x2,y2], [x3,y3]] ] ]
      });
  */
  function MultiPolygon(input){
    if(input && input.type === "MultiPolygon" && input.coordinates){
      extend(this, input);
    } else if(Array.isArray(input)) {
      this.coordinates = input;
    } else {
      throw "Terraformer: invalid input for Terraformer.MultiPolygon";
    }

    this.type = "MultiPolygon";
  }

  MultiPolygon.prototype = new Primitive();
  MultiPolygon.prototype.constructor = MultiPolygon;
  MultiPolygon.prototype.forEach = function(func){
    for (var i = 0; i < this.coordinates.length; i++) {
      func.apply(this, [this.coordinates[i], i, this.coordinates ]);
    }
  };
  MultiPolygon.prototype.get = function(i){
    return new Polygon(this.coordinates[i]);
  };

  /*
  GeoJSON Feature Class
      new Feature();
      new Feature({
        type: "Feature",
        geometry: {
          type: "Polygon",
          coordinates: [ [ [[x,y], [x1,y1]], [[x2,y2], [x3,y3]] ] ]
        }
      });
      new Feature({
        type: "Polygon",
        coordinates: [ [ [[x,y], [x1,y1]], [[x2,y2], [x3,y3]] ] ]
      });
  */
  function Feature(input){
    if(input && input.type === "Feature" && input.geometry){
      extend(this, input);
    } else if(input && input.type && input.coordinates) {
      this.geometry = input;
    } else {
      throw "Terraformer: invalid input for Terraformer.Feature";
    }

    this.type = "Feature";
  }

  Feature.prototype = new Primitive();
  Feature.prototype.constructor = Feature;

  /*
  GeoJSON FeatureCollection Class
      new FeatureCollection();
      new FeatureCollection([feature, feature1]);
      new FeatureCollection({
        type: "FeatureCollection",
        coordinates: [feature, feature1]
      });
  */
  function FeatureCollection(input){
    if(input && input.type === "FeatureCollection" && input.features){
      extend(this, input);
    } else if(Array.isArray(input)) {
      this.features = input;
    } else {
      throw "Terraformer: invalid input for Terraformer.FeatureCollection";
    }

    this.type = "FeatureCollection";
  }

  FeatureCollection.prototype = new Primitive();
  FeatureCollection.prototype.constructor = FeatureCollection;
  FeatureCollection.prototype.forEach = function(func){
    for (var i = 0; i < this.features.length; i++) {
      func.apply(this, [this.features[i], i, this.features]);
    }
  };
  FeatureCollection.prototype.get = function(id){
    var found;
    this.forEach(function(feature){
      if(feature.id === id){
        found = feature;
      }
    });
    return new Feature(found);
  };

  /*
  GeoJSON GeometryCollection Class
      new GeometryCollection();
      new GeometryCollection([geometry, geometry1]);
      new GeometryCollection({
        type: "GeometryCollection",
        coordinates: [geometry, geometry1]
      });
  */
  function GeometryCollection(input){
    if(input && input.type === "GeometryCollection" && input.geometries){
      extend(this, input);
    } else if(Array.isArray(input)) {
      this.geometries = input;
    } else if(input.coordinates && input.type){
      this.type = "GeometryCollection";
      this.geometries = [input];
    } else {
      throw "Terraformer: invalid input for Terraformer.GeometryCollection";
    }

    this.type = "GeometryCollection";
  }

  GeometryCollection.prototype = new Primitive();
  GeometryCollection.prototype.constructor = GeometryCollection;
  GeometryCollection.prototype.forEach = function(func){
    for (var i = 0; i < this.geometries.length; i++) {
      func.apply(this, [this.geometries[i], i, this.geometries]);
    }
  };
  GeometryCollection.prototype.get = function(i){
    return new Primitive(this.geometries[i]);
  };

  function createCircle(center, radius, interpolate){
    var mercatorPosition = positionToMercator(center);
    var steps = interpolate || 64;
    var polygon = {
      type: "Polygon",
      coordinates: [[]]
    };
    for(var i=1; i<=steps; i++) {
      var radians = i * (360/steps) * Math.PI / 180;
      polygon.coordinates[0].push([mercatorPosition[0] + radius * Math.cos(radians), mercatorPosition[1] + radius * Math.sin(radians)]);
    }
    return toGeographic(polygon);
  }

  function Circle (center, rad, interpolate) {
    var steps = interpolate || 64;
    var radius = rad || 250;

    if(!center || center.length < 2 || !radius || !steps) {
      throw new Error("Terraformer: missing parameter for Terraformer.Circle");
    }

    extend(this, new Feature({
      type: "Feature",
      geometry: createCircle(center, radius, steps),
      properties: {
        radius: radius,
        center: center,
        steps: steps
      }
    }));
  }

  Circle.prototype = new Primitive();
  Circle.prototype.constructor = Circle;
  Circle.prototype.recalculate = function(){
    this.geometry = createCircle(this.properties.center, this.properties.radius, this.properties.steps);
    return this;
  };
  Circle.prototype.center = function(coordinates){
    if(coordinates){
      this.properties.center = coordinates;
      this.recalculate();
    }
    return this.properties.center;
  };
  Circle.prototype.radius = function(radius){
    if(radius){
      this.properties.radius = radius;
      this.recalculate();
    }
    return this.properties.radius;
  };
  Circle.prototype.steps = function(steps){
    if(steps){
      this.properties.steps = steps;
      this.recalculate();
    }
    return this.properties.steps;
  };

  Circle.prototype.toJSON = function() {
    var output = Primitive.prototype.toJSON.call(this);
    return output;
  };

  exports.Primitive = Primitive;
  exports.Point = Point;
  exports.MultiPoint = MultiPoint;
  exports.LineString = LineString;
  exports.MultiLineString = MultiLineString;
  exports.Polygon = Polygon;
  exports.MultiPolygon = MultiPolygon;
  exports.Feature = Feature;
  exports.FeatureCollection = FeatureCollection;
  exports.GeometryCollection = GeometryCollection;
  exports.Circle = Circle;

  exports.toMercator = toMercator;
  exports.toGeographic = toGeographic;

  exports.Tools = {};
  exports.Tools.positionToMercator = positionToMercator;
  exports.Tools.positionToGeographic = positionToGeographic;
  exports.Tools.applyConverter = applyConverter;
  exports.Tools.toMercator = toMercator;
  exports.Tools.toGeographic = toGeographic;
  exports.Tools.createCircle = createCircle;

  exports.Tools.calculateBounds = calculateBounds;
  exports.Tools.calculateEnvelope = calculateEnvelope;
  exports.Tools.coordinatesContainPoint = coordinatesContainPoint;
  exports.Tools.polygonContainsPoint = polygonContainsPoint;
  exports.Tools.arrayIntersectsArray = arrayIntersectsArray;
  exports.Tools.coordinatesContainPoint = coordinatesContainPoint;
  exports.Tools.coordinatesEqual = coordinatesEqual;
  exports.Tools.convexHull = convexHull;

  exports.MercatorCRS = MercatorCRS;
  exports.GeographicCRS = GeographicCRS;

  return exports;
}));

/* globals Terraformer */
(function (root, factory) {

  // Node.
  if(typeof module === 'object' && typeof module.exports === 'object') {
    exports = module.exports = factory(require('terraformer'));
  }

  // Browser Global.
  if(typeof root.navigator === "object") {
    if (!root.Terraformer){
      throw new Error("Terraformer.ArcGIS requires the core Terraformer library. https://github.com/esri/Terraformer");
    }
    root.Terraformer.ArcGIS = factory(root.Terraformer);
  }

}(this, function(Terraformer) {
  var exports = {};

  // shallow object clone for feature properties and attributes
  // from http://jsperf.com/cloning-an-object/2
  function clone(obj) {
    var target = {};
    for (var i in obj) {
      if (obj.hasOwnProperty(i)) {
        target[i] = obj[i];
      }
    }
    return target;
  }

  // determine if polygon ring coordinates are clockwise. clockwise signifies outer ring, counter-clockwise an inner ring
  // or hole. this logic was found at http://stackoverflow.com/questions/1165647/how-to-determine-if-a-list-of-polygon-
  // points-are-in-clockwise-order
  function ringIsClockwise(ringToTest) {
    var total = 0,i = 0;
    var rLength = ringToTest.length;
    var pt1 = ringToTest[i];
    var pt2;
    for (i; i < rLength - 1; i++) {
      pt2 = ringToTest[i + 1];
      total += (pt2[0] - pt1[0]) * (pt2[1] + pt1[1]);
      pt1 = pt2;
    }
    return (total >= 0);
  }

  // This function flattens holes in polygons to one array of rings
  //
  // [
  //   [ array of outer coordinates ]
  //   [ hole coordinates ]
  //   [ hole coordinates ]
  // ]
  // becomes
  // [
  //   [ array of outer coordinates ]
  //   [ hole coordinates ]
  //   [ hole coordinates ]
  // ]
  function flattenPolygonRings(poly){
    var output = [];
    var polygon = poly.slice(0);
    var outerRing = polygon.shift().slice(0);

    if(!ringIsClockwise(outerRing)){
      outerRing.reverse();
    }

    output.push(outerRing);

    for (var i = 0; i < polygon.length; i++) {
      var hole = polygon[i].slice(0);
      if(ringIsClockwise(hole)){
        hole.reverse();
      }
      output.push(hole);
    }

    return output;
  }

  // This function flattens holes in multipolygons to one array of polygons
  // so
  // [
  //   [
  //     [ array of outer coordinates ]
  //     [ hole coordinates ]
  //     [ hole coordinates ]
  //   ],
  //   [
  //     [ array of outer coordinates ]
  //     [ hole coordinates ]
  //     [ hole coordinates ]
  //   ],
  // ]
  // becomes
  // [
  //   [ array of outer coordinates ]
  //   [ hole coordinates ]
  //   [ hole coordinates ]
  //   [ array of outer coordinates ]
  //   [ hole coordinates ]
  //   [ hole coordinates ]
  // ]
  function flattenMultiPolygonRings(rings){
    var output = [];
    for (var i = 0; i < rings.length; i++) {
      var polygon = flattenPolygonRings(rings[i]);
      for (var x = polygon.length - 1; x >= 0; x--) {
        var ring = polygon[x].slice(0);
        output.push(ring);
      }
    }
    return output;
  }

  function coordinatesContainCoordinates(outer, inner){
    var intersects = Terraformer.Tools.arrayIntersectsArray(outer, inner);
    var contains = Terraformer.Tools.coordinatesContainPoint(outer, inner[0]);
    if(!intersects && contains){
      return true;
    }
    return false;
  }

  // do any polygons in this array contain any other polygons in this array?
  // used for checking for holes in arcgis rings
  function convertRingsToGeoJSON(rings){
    var outerRings = [];
    var holes = [];

    // for each ring
    for (var r = 0; r < rings.length; r++) {
      var ring = rings[r].slice(0);

      // is this ring an outer ring? is it clockwise?
      if(ringIsClockwise(ring)){
        var polygon = [ ring ];
        outerRings.push(polygon); // push to outer rings
      } else {
        holes.push(ring); // counterclockwise push to holes
      }
    }

    // while there are holes left...
    while(holes.length){
      // pop a hole off out stack
      var hole = holes.pop();
      var matched = false;

      // loop over all outer rings and see if they contain our hole.
      for (var x = outerRings.length - 1; x >= 0; x--) {
        var outerRing = outerRings[x][0];
        if(coordinatesContainCoordinates(outerRing, hole)){
          // the hole is contained push it into our polygon
          outerRings[x].push(hole);

          // we matched the hole
          matched = true;

          // stop checking to see if other outer rings contian this hole
          break;
        }
      }

      // no outer rings contain this hole turn it into and outer ring (reverse it)
      if(!matched){
        outerRings.push([ hole.reverse() ]);
      }
    }

    if(outerRings.length === 1){
      return {
        type: "Polygon",
        coordinates: outerRings[0]
      };
    } else {
      return {
        type: "MultiPolygon",
        coordinates: outerRings
      };
    }
  }

  // ArcGIS -> GeoJSON
  function parse(arcgis){
    var geojson = {};

    if(arcgis.x && arcgis.y){
      geojson.type = "Point";
      geojson.coordinates = [arcgis.x, arcgis.y];
    }

    if(arcgis.points){
      geojson.type = "MultiPoint";
      geojson.coordinates = arcgis.points.slice(0);
    }

    if(arcgis.paths) {
      if(arcgis.paths.length === 1){
        geojson.type = "LineString";
        geojson.coordinates = arcgis.paths[0].slice(0);
      } else {
        geojson.type = "MultiLineString";
        geojson.coordinates = arcgis.paths.slice(0);
      }
    }

    if(arcgis.rings) {
      geojson = convertRingsToGeoJSON(arcgis.rings.slice(0));
    }

    if(arcgis.geometry) {
      geojson.type = "Feature";
      geojson.geometry = parse(arcgis.geometry);
      geojson.properties = clone(arcgis.attributes) || {};
    }

    var inputSpatialReference = (arcgis.geometry) ? arcgis.geometry.spatialReference : arcgis.spatialReference;

    //convert spatial ref if needed
    if(inputSpatialReference && inputSpatialReference.wkid === 102100){
      geojson = Terraformer.toGeographic(geojson);
    }

    return new Terraformer.Primitive(geojson);
  }

  // GeoJSON -> ArcGIS
  function convert(geojson, sr){
    var spatialReference;

    if(sr){
      spatialReference = sr;
    } else if (geojson && geojson.crs === Terraformer.MercatorCRS) {
      spatialReference = { wkid: 102100 };
    } else {
      spatialReference = { wkid: 4326 };
    }

    var result = {};
    var i;

    switch(geojson.type){
    case "Point":
      result.x = geojson.coordinates[0];
      result.y = geojson.coordinates[1];
      result.spatialReference = spatialReference;
      break;
    case "MultiPoint":
      result.points = geojson.coordinates.slice(0);
      result.spatialReference = spatialReference;
      break;
    case "LineString":
      result.paths = [geojson.coordinates.slice(0)];
      result.spatialReference = spatialReference;
      break;
    case "MultiLineString":
      result.paths = geojson.coordinates.slice(0);
      result.spatialReference = spatialReference;
      break;
    case "Polygon":
      result.rings = flattenPolygonRings(geojson.coordinates.slice(0));
      result.spatialReference = spatialReference;
      break;
    case "MultiPolygon":
      result.rings = flattenMultiPolygonRings(geojson.coordinates.slice(0));
      result.spatialReference = spatialReference;
      break;
    case "Feature":
      result.geometry = convert(geojson.geometry);
      result.attributes = clone(geojson.properties);
      break;
    case "FeatureCollection":
      result = [];
      for (i = 0; i < geojson.features.length; i++){
        result.push(convert(geojson.features[i]));
      }
      break;
    case "GeometryCollection":
      result = [];
      for (i = 0; i < geojson.geometries.length; i++){
        result.push(convert(geojson.geometries[i]));
      }
      break;
    }

    return result;
  }

  exports.parse   = parse;
  exports.convert = convert;
  exports.toGeoJSON = parse;
  exports.fromGeoJSON = convert;

  return exports;
}));
(function (root, factory) {

  // Node.
  if(typeof module === 'object' && typeof module.exports === 'object') {
    exports = module.exports = factory(require("terraformer"));
  }

  if(typeof root.navigator === "object") {
    if (!root.Terraformer){
      throw new Error("Terraformer.RTree requires the core Terraformer library. https://github.com/esri/Terraformer");
    }
    root.Terraformer.RTree = factory(root.Terraformer).RTree;
  }

}(this, function(Terraformer) {
  var exports = { };

  function isArray(obj) {
    return Object.prototype.toString.call(obj) === '[object Array]';
  }

  /******************************************************************************
 rtree.js - General-Purpose Non-Recursive Javascript R-Tree Library
 Version 0.6.2, December 5st 2009
 Copyright (c) 2009 Jon-Carlos Rivera
 Permission is hereby granted, free of charge, to any person obtaining
 a copy of this software and associated documentation files (the
 "Software"), to deal in the Software without restriction, including
 without limitation the rights to use, copy, modify, merge, publish,
 distribute, sublicense, and/or sell copies of the Software, and to
 permit persons to whom the Software is furnished to do so, subject to
 the following conditions:
 The above copyright notice and this permission notice shall be
 included in all copies or substantial portions of the Software.
 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 Jon-Carlos Rivera - imbcmdth@hotmail.com
 ******************************************************************************/

/*
 * RTree - A simple r-tree structure for great results.
 * @constructor
 */
var RTree = function (width) {
    // Variables to control tree-dimensions
    var _Min_Width = 3; // Minimum width of any node before a merge
    var _Max_Width = 6; // Maximum width of any node before a split
    if (!isNaN(width)) {
      _Min_Width = Math.floor(width / 2.0);
      _Max_Width = width;
    }

    this.min_width = _Min_Width;
    this.max_width = _Max_Width;

    // Start with an empty root-tree
    var _T = {
      x: 0,
      y: 0,
      w: 0,
      h: 0,
      id: "root",
      nodes: []
    };

   /* @function
    * @description Function to generate unique strings for element IDs
    * @param {String} n      The prefix to use for the IDs generated.
    * @return {String}        A guarenteed unique ID.
    */
    var _name_to_id = (function() {
      // hide our idCache inside this closure
      var idCache = {};

      // return the api: our function that returns a unique string with incrementing number appended to given idPrefix
      return function(idPrefix) {
        var idVal = 0;
        if (idPrefix in idCache) {
          idVal = idCache[idPrefix]++;
        } else {
          idCache[idPrefix] = 0;
        }
        return idPrefix + "_" + idVal;
      };
    })();

    // This is my special addition to the world of r-trees
    // every other (simple) method I found produced crap trees
    // this skews insertions to prefering squarer and emptier nodes
    RTree.Rectangle.squarified_ratio = function(l, w, fill) {
      // Area of new enlarged rectangle
      var lperi = (l + w) / 2.0; // Average size of a side of the new rectangle
      var larea = l * w; // Area of new rectangle
      // return the ratio of the perimeter to the area - the closer to 1 we are,
      // the more "square" a rectangle is. conversly, when approaching zero the
      // more elongated a rectangle is
      var lgeo = larea / (lperi * lperi);
      return (larea * fill / lgeo);
    };

   /* find the best specific node(s) for object to be deleted from
    * [ leaf node parent ] = _remove_subtree(rectangle, object, root)
    * @private
    */
    var _remove_subtree = function(rect, obj, root) {
        var hit_stack = []; // Contains the elements that overlap
        var count_stack = []; // Contains the elements that overlap
        var ret_array = [];
        var current_depth = 1;

        if (!rect || !RTree.Rectangle.overlap_rectangle(rect, root)) {
          return ret_array;
        }

        var ret_obj = {
          x: rect.x,
          y: rect.y,
          w: rect.w,
          h: rect.h,
          target: obj
        };

        count_stack.push(root.nodes.length);
        hit_stack.push(root);

        do {
          var tree = hit_stack.pop();
          var i = count_stack.pop() - 1;

          if ("target" in ret_obj) { // We are searching for a target
            while (i >= 0) {
              var ltree = tree.nodes[i];
              if (RTree.Rectangle.overlap_rectangle(ret_obj, ltree)) {
                if ((ret_obj.target && "leaf" in ltree && ltree.leaf === ret_obj.target) || (!ret_obj.target && ("leaf" in ltree || RTree.Rectangle.contains_rectangle(ltree, ret_obj)))) { // A Match !!
                  // Yup we found a match...
                  // we can cancel search and start walking up the list
                  if ("nodes" in ltree) { // If we are deleting a node not a leaf...
                    ret_array = _search_subtree(ltree, true, [], ltree);
                    tree.nodes.splice(i, 1);
                  } else {
                    ret_array = tree.nodes.splice(i, 1);
                  }
                  // Resize MBR down...
                  RTree.Rectangle.make_MBR(tree.nodes, tree);
                  delete ret_obj.target;
                  if (tree.nodes.length < _Min_Width) { // Underflow
                    ret_obj.nodes = _search_subtree(tree, true, [], tree);
                  }
                  break;
                }
                /*  else if("load" in ltree) { // A load
                }*/
                else if ("nodes" in ltree) { // Not a Leaf
                  current_depth += 1;
                  count_stack.push(i);
                  hit_stack.push(tree);
                  tree = ltree;
                  i = ltree.nodes.length;
                }
              }
              i -= 1;
            }
          } else if ("nodes" in ret_obj) { // We are unsplitting
            tree.nodes.splice(i + 1, 1); // Remove unsplit node
            // ret_obj.nodes contains a list of elements removed from the tree so far
            if (tree.nodes.length > 0) {
              RTree.Rectangle.make_MBR(tree.nodes, tree);
            }
            for (var t = 0; t < ret_obj.nodes.length; t++) {
              _insert_subtree(ret_obj.nodes[t], tree);
            }
            ret_obj.nodes.length = 0;
            if (hit_stack.length === 0 && tree.nodes.length <= 1) { // Underflow..on root!
              ret_obj.nodes = _search_subtree(tree, true, ret_obj.nodes, tree);
              tree.nodes.length = 0;
              hit_stack.push(tree);
              count_stack.push(1);
            } else if (hit_stack.length > 0 && tree.nodes.length < _Min_Width) { // Underflow..AGAIN!
              ret_obj.nodes = _search_subtree(tree, true, ret_obj.nodes, tree);
              tree.nodes.length = 0;
            } else {
              delete ret_obj.nodes; // Just start resizing
            }
          } else { // we are just resizing
            RTree.Rectangle.make_MBR(tree.nodes, tree);
          }
          current_depth -= 1;
        } while (hit_stack.length > 0);

        return (ret_array);
        };

   /* choose the best damn node for rectangle to be inserted into
    * [ leaf node parent ] = _choose_leaf_subtree(rectangle, root to start search at)
    * @private
    */
    var _choose_leaf_subtree = function(rect, root) {
        var best_choice_index = -1;
        var best_choice_stack = [];
        var best_choice_area;

        var load_callback = function(local_tree, local_node) {
            return function(data) {
              local_tree._attach_data(local_node, data);
            };
        };

        best_choice_stack.push(root);
        var nodes = root.nodes;

        do {
          if (best_choice_index !== -1) {
            best_choice_stack.push(nodes[best_choice_index]);
            nodes = nodes[best_choice_index].nodes;
            best_choice_index = -1;
          }

          for (var i = nodes.length - 1; i >= 0; i--) {
            var ltree = nodes[i];
            if ("leaf" in ltree) {
              // Bail out of everything and start inserting
              best_choice_index = -1;
              break;
            }

            // Area of new enlarged rectangle
            var old_lratio = RTree.Rectangle.squarified_ratio(ltree.w, ltree.h, ltree.nodes.length + 1);

            // Enlarge rectangle to fit new rectangle
            var nw = Math.max(ltree.x + ltree.w, rect.x + rect.w) - Math.min(ltree.x, rect.x);
            var nh = Math.max(ltree.y + ltree.h, rect.y + rect.h) - Math.min(ltree.y, rect.y);

            // Area of new enlarged rectangle
            var lratio = RTree.Rectangle.squarified_ratio(nw, nh, ltree.nodes.length + 2);

            if (best_choice_index < 0 || Math.abs(lratio - old_lratio) < best_choice_area) {
              best_choice_area = Math.abs(lratio - old_lratio);
              best_choice_index = i;
            }
          }
        } while (best_choice_index !== -1);

        return (best_choice_stack);
        };

   /* split a set of nodes into two roughly equally-filled nodes
    * [ an array of two new arrays of nodes ] = linear_split(array of nodes)
    * @private
    */
    var _linear_split = function(nodes) {
        var n = _pick_linear(nodes);
        while (nodes.length > 0) {
          _pick_next(nodes, n[0], n[1]);
        }
        return (n);
        };

   /* insert the best source rectangle into the best fitting parent node: a or b
    * [] = pick_next(array of source nodes, target node array a, target node array b)
    * @private
    */
    var _pick_next = function(nodes, a, b) {
        // Area of new enlarged rectangle
        var area_a = RTree.Rectangle.squarified_ratio(a.w, a.h, a.nodes.length + 1);
        var area_b = RTree.Rectangle.squarified_ratio(b.w, b.h, b.nodes.length + 1);
        var high_area_delta;
        var high_area_node;
        var lowest_growth_group;

        for (var i = nodes.length - 1; i >= 0; i--) {
          var l = nodes[i];
          var new_area_a = {};
          new_area_a.x = Math.min(a.x, l.x);
          new_area_a.y = Math.min(a.y, l.y);
          new_area_a.w = Math.max(a.x + a.w, l.x + l.w) - new_area_a.x;
          new_area_a.h = Math.max(a.y + a.h, l.y + l.h) - new_area_a.y;
          var change_new_area_a = Math.abs(RTree.Rectangle.squarified_ratio(new_area_a.w, new_area_a.h, a.nodes.length + 2) - area_a);

          var new_area_b = {};
          new_area_b.x = Math.min(b.x, l.x);
          new_area_b.y = Math.min(b.y, l.y);
          new_area_b.w = Math.max(b.x + b.w, l.x + l.w) - new_area_b.x;
          new_area_b.h = Math.max(b.y + b.h, l.y + l.h) - new_area_b.y;
          var change_new_area_b = Math.abs(RTree.Rectangle.squarified_ratio(new_area_b.w, new_area_b.h, b.nodes.length + 2) - area_b);

          if (!high_area_node || !high_area_delta || Math.abs(change_new_area_b - change_new_area_a) < high_area_delta) {
            high_area_node = i;
            high_area_delta = Math.abs(change_new_area_b - change_new_area_a);
            lowest_growth_group = change_new_area_b < change_new_area_a ? b : a;
          }
        }
        var temp_node = nodes.splice(high_area_node, 1)[0];
        if (a.nodes.length + nodes.length + 1 <= _Min_Width) {
          a.nodes.push(temp_node);
          RTree.Rectangle.expand_rectangle(a, temp_node);
        } else if (b.nodes.length + nodes.length + 1 <= _Min_Width) {
          b.nodes.push(temp_node);
          RTree.Rectangle.expand_rectangle(b, temp_node);
        } else {
          lowest_growth_group.nodes.push(temp_node);
          RTree.Rectangle.expand_rectangle(lowest_growth_group, temp_node);
        }
        };

   /* pick the "best" two starter nodes to use as seeds using the "linear" criteria
    * [ an array of two new arrays of nodes ] = pick_linear(array of source nodes)
    * @private
    */
    var _pick_linear = function(nodes) {
        var lowest_high_x = nodes.length - 1;
        var highest_low_x = 0;
        var lowest_high_y = nodes.length - 1;
        var highest_low_y = 0;
        var t1, t2;

        for (var i = nodes.length - 2; i >= 0; i--) {
          var l = nodes[i];
          if (l.x > nodes[highest_low_x].x) {
            highest_low_x = i;
          } else if (l.x + l.w < nodes[lowest_high_x].x + nodes[lowest_high_x].w) {
            lowest_high_x = i;
          }
          if (l.y > nodes[highest_low_y].y) {
            highest_low_y = i;
          } else if (l.y + l.h < nodes[lowest_high_y].y + nodes[lowest_high_y].h) {
            lowest_high_y = i;
          }
        }
        var dx = Math.abs((nodes[lowest_high_x].x + nodes[lowest_high_x].w) - nodes[highest_low_x].x);
        var dy = Math.abs((nodes[lowest_high_y].y + nodes[lowest_high_y].h) - nodes[highest_low_y].y);
        if (dx > dy) {
          if (lowest_high_x > highest_low_x) {
            t1 = nodes.splice(lowest_high_x, 1)[0];
            t2 = nodes.splice(highest_low_x, 1)[0];
          } else {
            t2 = nodes.splice(highest_low_x, 1)[0];
            t1 = nodes.splice(lowest_high_x, 1)[0];
          }
        } else {
          if (lowest_high_y > highest_low_y) {
            t1 = nodes.splice(lowest_high_y, 1)[0];
            t2 = nodes.splice(highest_low_y, 1)[0];
          } else {
            t2 = nodes.splice(highest_low_y, 1)[0];
            t1 = nodes.splice(lowest_high_y, 1)[0];
          }
        }
        return ([{
          x: t1.x,
          y: t1.y,
          w: t1.w,
          h: t1.h,
          nodes: [t1]
        }, {
          x: t2.x,
          y: t2.y,
          w: t2.w,
          h: t2.h,
          nodes: [t2]
        }]);
        };

    var _attach_data = function(node, more_tree) {
        node.nodes = more_tree.nodes;
        node.x = more_tree.x;
        node.y = more_tree.y;
        node.w = more_tree.w;
        node.h = more_tree.h;
        return (node);
    };

   /* non-recursive internal search function
    * [ nodes | objects ] = _search_subtree(rectangle, [return node data], [array to fill], root to begin search at)
    * @private
    */
    var _search_subtree = function(rect, return_node, return_array, root) {
      var hit_stack = []; // Contains the elements that overlap
      if (!RTree.Rectangle.overlap_rectangle(rect, root)) {
        return return_array;
      }

      var load_callback = function(local_tree, local_node) {
          return function(data) {
            local_tree._attach_data(local_node, data);
          };
      };

      hit_stack.push(root.nodes);

      do {
        var nodes = hit_stack.pop();

        for (var i = nodes.length - 1; i >= 0; i--) {
          var ltree = nodes[i];
          if (RTree.Rectangle.overlap_rectangle(rect, ltree)) {
            if ("nodes" in ltree) { // Not a Leaf
              hit_stack.push(ltree.nodes);
            } else if ("leaf" in ltree) { // A Leaf !!
              if (!return_node) {
                return_array.push(ltree.leaf);
              } else {
                return_array.push(ltree);
              }
            }
          }
        }
      } while (hit_stack.length > 0);

      return return_array;
    };

    var _search_subtree_reverse = function(rect, return_node, return_array, root) {
      var hit_stack = []; // Contains the elements that overlap
      if (!RTree.Rectangle.overlap_rectangle(root, rect)) {
        return return_array;
      }

      var load_callback = function(local_tree, local_node) {
          return function(data) {
            local_tree._attach_data(local_node, data);
          };
      };

      hit_stack.push(root.nodes);

      do {
        var nodes = hit_stack.pop();

        for (var i = nodes.length - 1; i >= 0; i--) {
          var ltree = nodes[i];
          if (RTree.Rectangle.overlap_rectangle(ltree, rect)) {
            if ("nodes" in ltree) { // Not a Leaf
              hit_stack.push(ltree.nodes);
            } else if ("leaf" in ltree) { // A Leaf !!
              if (!return_node) {
                return_array.push(ltree.leaf);
              } else {
                return_array.push(ltree);
              }
            }
          }
        }
      } while (hit_stack.length > 0);

      return return_array;
    };

   /* non-recursive internal insert function
    * [] = _insert_subtree(rectangle, object to insert, root to begin insertion at)
    * @private
    */
    var _insert_subtree = function(node, root) {
      var bc; // Best Current node
      // Initial insertion is special because we resize the Tree and we don't
      // care about any overflow (seriously, how can the first object overflow?)
      if (root.nodes.length === 0) {
        root.x = node.x;
        root.y = node.y;
        root.w = node.w;
        root.h = node.h;
        root.nodes.push(node);
        return;
      }

      // Find the best fitting leaf node
      // choose_leaf returns an array of all tree levels (including root)
      // that were traversed while trying to find the leaf
      var tree_stack = _choose_leaf_subtree(node, root);
      var ret_obj = node; //{x:rect.x,y:rect.y,w:rect.w,h:rect.h, leaf:obj};
      // Walk back up the tree resizing and inserting as needed
      do {
        //handle the case of an empty node (from a split)
        if (bc && "nodes" in bc && bc.nodes.length === 0) {
          var pbc = bc; // Past bc
          bc = tree_stack.pop();
          for (var t = 0; t < bc.nodes.length; t++) {
            if (bc.nodes[t] === pbc || bc.nodes[t].nodes.length === 0) {
              bc.nodes.splice(t, 1);
              break;
            }
          }
        } else {
          bc = tree_stack.pop();
        }

        // If there is data attached to this ret_obj
        if ("leaf" in ret_obj || "nodes" in ret_obj || isArray(ret_obj)) {
          // Do Insert
          if (isArray(ret_obj)) {
            for (var ai = 0; ai < ret_obj.length; ai++) {
              RTree.Rectangle.expand_rectangle(bc, ret_obj[ai]);
            }
            bc.nodes = bc.nodes.concat(ret_obj);
          } else {
            RTree.Rectangle.expand_rectangle(bc, ret_obj);
            bc.nodes.push(ret_obj); // Do Insert
          }

          if (bc.nodes.length <= _Max_Width) { // Start Resizeing Up the Tree
            ret_obj = {
              x: bc.x,
              y: bc.y,
              w: bc.w,
              h: bc.h
            };
          } else { // Otherwise Split this Node
            // linear_split() returns an array containing two new nodes
            // formed from the split of the previous node's overflow
            var a = _linear_split(bc.nodes);
            ret_obj = a; //[1];
            if (tree_stack.length < 1) { // If are splitting the root..
              bc.nodes.push(a[0]);
              tree_stack.push(bc); // Reconsider the root element
              ret_obj = a[1];
            }
          }
        } else { // Otherwise Do Resize
          //Just keep applying the new bounding rectangle to the parents..
          RTree.Rectangle.expand_rectangle(bc, ret_obj);
          ret_obj = {
            x: bc.x,
            y: bc.y,
            w: bc.w,
            h: bc.h
          };
        }
      } while (tree_stack.length > 0);
    };

   /* returns a JSON representation of the tree
    * @public
    */
    this.serialize = function(callback) {
      callback(null, _T);
    };

   /* accepts a JSON representation of the tree and inserts it
    * @public
    */
    this.deserialize = function(new_tree, where, callback) {

      var args = Array.prototype.slice.call(arguments);

      switch (args.length) {
      case 1:
        where = _T;
        break;
      case 2:
        if(typeof args[1] === "function"){
          where = _T;
          callback = args[1];
        }
        break;
      }

      var deserialized = _attach_data(where, new_tree);

      if(callback){
        callback(null, deserialized);
      }
    };

   /* non-recursive search function
    * [ nodes | objects ] = RTree.search(rectangle, [return node data], [array to fill])
    * @public
    */

    this.search = function(shape, callback) {
      var rect;
      if(shape.type){
        var b = Terraformer.Tools.calculateBounds(shape);
        rect = {
          x: b[0],
          y: b[1],
          w: Math.abs(b[0] - b[2]),
          h: Math.abs(b[1] - b[3])
        };
      } else {
        rect = shape;
      }

      var args = [ rect, false, [ ], _T ];

      if (rect === undefined) {
        throw "Wrong number of arguments. RT.Search requires at least a bounding rectangle.";
      }

      var results = _search_subtree.apply(this, args);

      if(callback){
        callback(null, results);
      }
    };

    this.within = function(shape, callback) {
      var rect;
      if(shape.type){
        var b = Terraformer.Tools.calculateBounds(shape);
        rect = {
          x: b[0],
          y: b[1],
          w: Math.abs(b[0] - b[2]),
          h: Math.abs(b[1] - b[3])
        };
      } else {
        rect = shape;
      }

      var args = [ rect, false, [ ], _T ];

      if (rect === undefined) {
        throw "Wrong number of arguments. RT.Search requires at least a bounding rectangle.";
      }

      var search = _search_subtree_reverse.apply(this, args);

      if(callback){
        callback(null, search);
      }
    };


   /* non-recursive function that deletes a specific
    * [ number ] = RTree.remove(rectangle, obj)
    */
    this.remove = function(shape, obj, callback) {
      var args = Array.prototype.slice.call(arguments);

      // you only passed shape
      if(args.length === 1){
        // so make the args (shape, false)
        args.push(false);
      }

      // you passed (shape, obj, callback)
      // pop the callback off the args list
      if(args.length === 3){
        callback = args.pop();
      }

      // convert shape (the first arg) to a bbox if its geojson
      if(args && args[0] && args[0].type){
        var b = Terraformer.Tools.calculateBounds(args[0]);
        args[0] = {
          x: b[0],
          y: b[1],
          w: Math.abs(b[0] - b[2]),
          h: Math.abs(b[1] - b[3])
        };
      }

      // push a new root node onto the args stack
      args.push(_T);

      if(obj === false) { // Do area-wide delete
        var numberdeleted = 0;
        var ret_array = [];
        do {
          numberdeleted = ret_array.length;
          ret_array = ret_array.concat(_remove_subtree.apply(this, args));
        } while( numberdeleted !==  ret_array.length);
        if(callback){
          callback(null, ret_array);
        }
      } else { // Delete a specific item
        var removal = _remove_subtree.apply(this, args);
        if(callback){
          callback(null, removal);
        }
      }
    };

   /* non-recursive insert function
    * [] = RTree.insert(rectangle, object to insert)
    */
    this.insert = function(shape, obj, callback) {
      var rect;
      if(shape.type){
        var b = Terraformer.Tools.calculateBounds(shape);
        rect = {
          x: b[0],
          y: b[1],
          w: Math.abs(b[0] - b[2]),
          h: Math.abs(b[1] - b[3])
        };
      } else {
        rect = shape;
      }

      if (arguments.length < 2) {
        throw "Wrong number of arguments. RT.Insert requires at least a bounding rectangle or GeoJSON and an object.";
      }

      var insert = _insert_subtree({
        x: rect.x,
        y: rect.y,
        w: rect.w,
        h: rect.h,
        leaf: obj
      }, _T);

      if(callback){
        callback(null, insert);
      }
    };

   /* non-recursive delete function
    * [deleted object] = RTree.remove(rectangle, [object to delete])
    */

    //End of RTree
  };

/* Rectangle - Generic rectangle object - Not yet used */
RTree.Rectangle = function(ix, iy, iw, ih) { // new Rectangle(bounds) or new Rectangle(x, y, w, h)
  var x, x2, y, y2, w, h;

  if (ix.x) {
    x = ix.x;
    y = ix.y;
    if (ix.w !== 0 && !ix.w && ix.x2) {
      w = ix.x2 - ix.x;
      h = ix.y2 - ix.y;
    } else {
      w = ix.w;
      h = ix.h;
    }
    x2 = x + w;
    y2 = y + h; // For extra fastitude
  } else {
    x = ix;
    y = iy;
    w = iw;
    h = ih;
    x2 = x + w;
    y2 = y + h; // For extra fastitude
  }

  this.x1 = this.x = function() {
    return x;
  };
  this.y1 = this.y = function() {
    return y;
  };
  this.x2 = function() {
    return x2;
  };
  this.y2 = function() {
    return y2;
  };
  this.w = function() {
    return w;
  };
  this.h = function() {
    return h;
  };

  this.toJSON = function() {
    return ('{"x":' + x.toString() + ', "y":' + y.toString() + ', "w":' + w.toString() + ', "h":' + h.toString() + '}');
  };

  this.overlap = function(a) {
    return (this.x() < a.x2() && this.x2() > a.x() && this.y() < a.y2() && this.y2() > a.y());
  };

  this.expand = function(a) {
    var nx = Math.min(this.x(), a.x());
    var ny = Math.min(this.y(), a.y());
    w = Math.max(this.x2(), a.x2()) - nx;
    h = Math.max(this.y2(), a.y2()) - ny;
    x = nx;
    y = ny;
    return (this);
  };

  this.setRect = function(ix, iy, iw, ih) {
    var x, x2, y, y2, w, h;
    if (ix.x) {
      x = ix.x;
      y = ix.y;
      if (ix.w !== 0 && !ix.w && ix.x2) {
        w = ix.x2 - ix.x;
        h = ix.y2 - ix.y;
      } else {
        w = ix.w;
        h = ix.h;
      }
      x2 = x + w;
      y2 = y + h; // For extra fastitude
    } else {
      x = ix;
      y = iy;
      w = iw;
      h = ih;
      x2 = x + w;
      y2 = y + h; // For extra fastitude
    }
  };
  //End of RTree.Rectangle
};

/* returns true if rectangle 1 overlaps rectangle 2
 * [ boolean ] = overlap_rectangle(rectangle a, rectangle b)
 * @static function
 */
RTree.Rectangle.overlap_rectangle = function(a, b) {
  return (a.x < (b.x + b.w) && (a.x + a.w) > b.x && a.y < (b.y + b.h) && (a.y + a.h) > b.y);
};

/* returns true if rectangle a is contained in rectangle b
 * [ boolean ] = contains_rectangle(rectangle a, rectangle b)
 * @static function
 */
RTree.Rectangle.contains_rectangle = function(a, b) {
  return ((a.x + a.w) <= (b.x + b.w) && a.x >= b.x && (a.y + a.h) <= (b.y + b.h) && a.y >= b.y);
};

/* expands rectangle A to include rectangle B, rectangle B is untouched
 * [ rectangle a ] = expand_rectangle(rectangle a, rectangle b)
 * @static function
 */
RTree.Rectangle.expand_rectangle = function(a, b) {
  var nx, ny;

  // unintuitively, this is way way faster than max/min
  if (a.x < b.x) {
    nx = a.x;
  } else {
    nx = b.x;
  }

  if (a.y < b.y) {
    ny = a.y;
  } else {
    ny = b.y;
  }

  if (a.x + a.w > b.x + b.w) {
    a.w = (a.x + a.w) - nx;
  } else {
    a.w = (b.x + b.w) - nx;
  }

  if (a.y + a.h > b.y + b.h) {
    a.h = (a.y + a.h) - ny;
  } else {
    a.h = (b.y + b.h) - ny;
  }

  a.x = nx;
  a.y = ny;

  return (a);
};

/* generates a minimally bounding rectangle for all rectangles in
 * array "nodes". If rect is set, it is modified into the MBR. Otherwise,
 * a new rectangle is generated and returned.
 * [ rectangle a ] = make_MBR(rectangle array nodes, rectangle rect)
 * @static function
 */
RTree.Rectangle.make_MBR = function(nodes, rect) {
  if (nodes.length < 1) {
    return ({
      x: 0,
      y: 0,
      w: 0,
      h: 0
    });
  }
  //throw "make_MBR: nodes must contain at least one rectangle!";
  if (!rect) {
    rect = {
      x: nodes[0].x,
      y: nodes[0].y,
      w: nodes[0].w,
      h: nodes[0].h
    };
  } else {
    rect.x = nodes[0].x;
    rect.y = nodes[0].y;
    rect.w = nodes[0].w;
    rect.h = nodes[0].h;
  }

  for (var i = nodes.length - 1; i > 0; i--) {
    RTree.Rectangle.expand_rectangle(rect, nodes[i]);
  }

  return (rect);
};


  exports.RTree = RTree;

  return exports;
}));
/* globals L */

L.esri = {
  _callback: {}
};

// Namespace for various support variables we need to track
L.esri.Support = {
  // from: https://github.com/Modernizr/Modernizr/blob/master/feature-detects/cors.js#L20
  CORS: !!(window.XMLHttpRequest && 'withCredentials' in new XMLHttpRequest())
};

// AJAX handlers for CORS (modern browsers) or JSONP (older browsers)
L.esri.RequestHandlers = {
  CORS: function(url, params, callback, context){
    var httpRequest = new XMLHttpRequest();

    params.f="json";

    httpRequest.onreadystatechange = function(){
      var response;
      if (httpRequest.readyState === 4) {
        try {
          response = JSON.parse(httpRequest.responseText);
        } catch(e) {
          response = {
            error: "Could not parse response as JSON."
          };
        }
        if(context){
          callback.call(context, response);
        } else {
          callback(response);
        }
      }
    };

    httpRequest.open('GET', url + L.esri.Util.serialize(params), true);
    httpRequest.send(null);
  },
  JSONP: function(url, params, callback, context){
    var callbackId = "c"+(Math.random() * 1e9).toString(36).replace(".", "_");

    params.f="json";
    params.callback="L.esri._callback."+callbackId;

    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url + L.esri.Util.serialize(params);
    script.id = callbackId;

    L.esri._callback[callbackId] = function(response){
      if(context){
        callback.call(context, response);
      } else {
        callback(response);
      }
      document.body.removeChild(script);
      delete L.esri._callback[callbackId];
    };

    document.body.appendChild(script);
  }
};

// Choose the correct AJAX handler depending on CORS support
L.esri.get = (L.esri.Support.CORS) ? L.esri.RequestHandlers.CORS : L.esri.RequestHandlers.JSONP;

// General utility namespace
L.esri.Util = {
  // make it so that passed `function` never gets called
  // twice within `delay` milliseconds. Used to throttle
  // `move` events on the layer.
  // http://remysharp.com/2010/07/21/throttling-function-calls/
  debounce: function (fn, delay, context) {
    var timer = null;
    return function() {
      var context = this||context, args = arguments;
      clearTimeout(timer);
      timer = setTimeout(function () {
        fn.apply(context, args);
      }, delay);
    };
  },
  // round a number away from zero used to snap
  // row/columns away from the origin of the grid
  roundAwayFromZero: function (num){
    return (num > 0) ? Math.ceil(num) : Math.floor(num);
  },
  trim: function(str) {
    return str.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
  },
  cleanUrl: function(url){
    url = L.esri.Util.trim(url);

    //add a trailing slash to the url if the user omitted it
    if(url[url.length-1] !== "/"){
      url += "/";
    }

    return url;
  },
  // quick and dirty serialization
  serialize: function(params){
    var qs="?";

    for(var param in params){
      if(params.hasOwnProperty(param)){
        var key = param;
        var value = params[param];
        qs+=encodeURIComponent(key);
        qs+="=";
        qs+=encodeURIComponent(value);
        qs+="&";
      }
    }

    return qs.substring(0, qs.length - 1);
  },

  // index of polyfill, needed for IE 8
  indexOf: function(arr, obj, start){
    start = start || 0;
    if(arr.indexOf){
      return arr.indexOf(obj, start);
    }
    for (var i = start, j = arr.length; i < j; i++) {
      if (arr[i] === obj) { return i; }
    }
    return -1;
  },

  // convert an extent (ArcGIS) to LatLngBounds (Leaflet)
  extentToBounds: function(extent){
    var southWest = new L.LatLng(extent.ymin, extent.xmin);
    var northEast = new L.LatLng(extent.ymax, extent.xmax);
    return new L.LatLngBounds(southWest, northEast);
  },

  // convert an LatLngBounds (Leaflet) to extent (ArcGIS)
  boundsToExtent: function(bounds) {
    return {
      "xmin": bounds.getSouthWest().lng,
      "ymin": bounds.getSouthWest().lat,
      "xmax": bounds.getNorthEast().lng,
      "ymax": bounds.getNorthEast().lat,
      "spatialReference": {
        "wkid" : 4326
      }
    };
  },

  // convert a LatLngBounds (Leaflet) to a Envelope (Terraformer.Rtree)
  boundsToEnvelope: function(bounds){
    var extent = L.esri.Util.boundsToExtent(bounds);
    return {
      x: extent.xmin,
      y: extent.ymin,
      w: Math.abs(extent.xmin - extent.xmax),
      h: Math.abs(extent.ymin - extent.ymax)
    };
  }
};

L.esri.Mixins = {};

L.esri.Mixins.featureGrid = {
  _activeRequests: 0,
  _initializeFeatureGrid: function(map){
    this._map = map;
    this._previousCells = [];
    this.center = this._map.getCenter();
    this.origin = this._map.project(this.center);

    this._moveHandler = L.esri.Util.debounce(function(e){
      if(e.type === "zoomend"){
        this.origin = this._map.project(this.center);
        this._previousCells = [];
      }
      this._requestFeatures(e.target.getBounds());
    }, this.options.debounce, this);

    map.on("zoomend resize move", this._moveHandler, this);

    this._requestFeatures(map.getBounds());
  },
  _destroyFeatureGrid: function(map){
    map.off("zoomend resize move", this._moveHandler, this);
  },
  _requestFeatures: function(bounds){
    var cells = this._cellsWithin(bounds);

    if(cells) {
      this.fire("loading", { bounds: bounds });
    }

    for (var i = 0; i < cells.length; i++) {
      this._makeRequest(cells[i], cells, bounds);
    }
  },
  _makeRequest: function(cell, cells, bounds){
    this._activeRequests++;

    L.esri.get(this.url+"query", {
      geometryType: "esriGeometryEnvelope",
      geometry: JSON.stringify(L.esri.Util.boundsToExtent(cell.bounds)),
      outFields:"*",
      outSr: 4326
    }, function(response){

      //deincriment the request counter
      this._activeRequests--;

      // if there are no more active requests fire a load event for this view
      if(this._activeRequests <= 0){
        this.fire("load", {
          bounds: bounds,
          cells: cells
        });
      }

      // call the render method to render features
      this._render(response);
    }, this);
  },
  _cellsWithin: function(mapBounds){
    var size = this._map.getSize();
    var offset = this._map.project(this._map.getCenter());
    var padding = Math.min(this.options.cellSize/size.x, this.options.cellSize/size.y);
    var bounds = mapBounds.pad(0.1);
    var cells = [];

    var topLeftPoint = this._map.project(bounds.getNorthWest());
    var bottomRightPoint = this._map.project(bounds.getSouthEast());

    var topLeft = topLeftPoint.subtract(offset).divideBy(this.options.cellSize);
    var bottomRight = bottomRightPoint.subtract(offset).divideBy(this.options.cellSize);

    var offsetRows = Math.round((this.origin.x - offset.x) / this.options.cellSize);
    var offsetCols = Math.round((this.origin.y - offset.y) / this.options.cellSize);

    var minRow = L.esri.Util.roundAwayFromZero(topLeft.x)-offsetRows;
    var maxRow = L.esri.Util.roundAwayFromZero(bottomRight.x)-offsetRows;
    var minCol = L.esri.Util.roundAwayFromZero(topLeft.y)-offsetCols;
    var maxCol = L.esri.Util.roundAwayFromZero(bottomRight.y)-offsetCols;

    for (var row = minRow; row < maxRow; row++) {
      for (var col = minCol; col < maxCol; col++) {
        var cellId = "cell:"+row+":"+col;
        var duplicate = L.esri.Util.indexOf(this._previousCells, cellId) >= 0;

        if(!duplicate || !this.options.deduplicate){
          var cellBounds = this._cellExtent(row, col);
          var cellCenter = cellBounds.getCenter();
          var radius = cellCenter.distanceTo(cellBounds.getNorthWest());
          var distance = cellCenter.distanceTo(this.center);
          var cell = {
            row: row,
            col: col,
            id: cellId,
            center: cellCenter,
            bounds: cellBounds,
            distance:distance,
            radius: radius
          };
          cells.push(cell);
          this._previousCells.push(cellId);
        }
      }
    }

    cells.sort(function (a, b) {
      return a.distance - b.distance;
    });

    return cells;
  },
  _cellExtent: function(row, col){
    var swPoint = this._cellPoint(row, col);
    var nePoint = this._cellPoint(row+1, col+1);
    var sw = this._map.unproject(swPoint);
    var ne = this._map.unproject(nePoint);
    return L.latLngBounds(sw, ne);
  },
  _cellPoint:function(row, col){
    var x = this.origin.x + (row*this.options.cellSize);
    var y = this.origin.y + (col*this.options.cellSize);
    return [x, y];
  }
};

L.esri.Mixins.identifiableLayer = {
  identify:function(latLng, options, callback){
    var defaults = {
      sr: '4265',
      mapExtent: JSON.stringify(L.esri.Util.boundsToExtent(this._map.getBounds())),
      tolerance: 3,
      geometryType: 'esriGeometryPoint',
      imageDisplay: '800,600,96',
      geometry: JSON.stringify({
        x: latLng.lng,
        y: latLng.lat,
        spatialReference: {
          wkid: 4265
        }
      })
    };

    var params;

    if (typeof options === 'function' && typeof callback === 'undefined') {
      callback = options;
      params = defaults;
    } else if (typeof options === 'object') {
      if (options.layerDefs) {
        options.layerDefs = this.parseLayerDefs(options.layerDefs);
      }

      params = L.Util.extend(defaults, options);
    }

    L.esri.get(this._url + '/identify', params, callback);
  },
  parseLayerDefs: function (layerDefs) {
    if (layerDefs instanceof Array) {
      //throw 'must be object or string';
      return '';
    }

    if (typeof layerDefs === 'object') {
      return JSON.stringify(layerDefs);
    }

    return layerDefs;
  }
};

(function(L){

  var tileProtocol = (window.location.protocol !== "https:") ? "http:" : "https:";
  var attributionStyles = "line-height:9px; text-overflow:ellipsis; white-space:nowrap;overflow:hidden; display:inline-block;";
  var logoStyles = "position:absolute; top:-38px; right:2px;";
  var attributionLogo = "<img src='https://serverapi.arcgisonline.com/jsapi/arcgis/3.5/js/esri/images/map/logo-med.png' alt='Powered by Esri' class='esri-attribution-logo' style='"+logoStyles+"'>";
  var formatTextAttributions = function formatTextAttributions(text){
    return "<span class='esri-attributions' style='"+attributionStyles+"'>" + text + "</span>";
  };

  L.esri.BasemapLayer = L.TileLayer.extend({
    statics: {
      TILES: {
        Streets: {
          urlTemplate: tileProtocol + "//{s}.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}/",
          attributionUrl: "https://static.arcgis.com/attribution/World_Street_Map?f=json",
          options: {
            minZoom: 1,
            maxZoom: 19,
            subdomains: ["server", "services"],
            attribution: formatTextAttributions("Esri") + attributionLogo
          }
        },
        Topographic: {
          urlTemplate: tileProtocol + "//{s}.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}/",
          attributionUrl: "https://static.arcgis.com/attribution/World_Topo_Map?f=json",
          options: {
            minZoom: 1,
            maxZoom: 19,
            subdomains: ["server", "services"],
            attribution: formatTextAttributions("Esri") + attributionLogo
          }
        },
        Oceans: {
          urlTemplate: "https://server.arcgisonline.com/ArcGIS/rest/services/Ocean_Basemap/MapServer/tile/{z}/{y}/{x}/",
          attributionUrl: "https://static.arcgis.com/attribution/Ocean_Basemap?f=json",
          options: {
            minZoom: 1,
            maxZoom: 16,
            subdomains: ["server", "services"],
            attribution: formatTextAttributions("Esri") + attributionLogo
          }
        },
        NationalGeographic: {
          urlTemplate: "https://server.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}/",
          options: {
            minZoom: 1,
            maxZoom: 16,
            subdomains: ["server", "services"],
            attribution: formatTextAttributions("Esri") + attributionLogo
          }
        },
        Gray: {
          urlTemplate: tileProtocol + "//{s}.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}/",
          options: {
            minZoom: 1,
            maxZoom: 16,
            subdomains: ["server", "services"],
            attribution: formatTextAttributions("Esri, NAVTEQ, DeLorme") + attributionLogo
          }
        },
        GrayLabels: {
          urlTemplate: tileProtocol + "//{s}.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Reference/MapServer/tile/{z}/{y}/{x}/",
          options: {
            minZoom: 1,
            maxZoom: 16,
            subdomains: ["server", "services"]
          }
        },
        Imagery: {
          urlTemplate: tileProtocol + "//{s}.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}/",
          options: {
            minZoom: 1,
            maxZoom: 19,
            subdomains: ["server", "services"],
            attribution: formatTextAttributions("Esri, DigitalGlobe, GeoEye, i-cubed, USDA, USGS, AEX, Getmapping, Aerogrid, IGN, IGP, swisstopo, and the GIS User Community") + attributionLogo
          }
        },
        ImageryLabels: {
          urlTemplate: tileProtocol + "//{s}.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}/",
          options: {
            minZoom: 1,
            maxZoom: 19,
            subdomains: ["server", "services"]
          }
        },
        ImageryTransportation: {
          urlTemplate: tileProtocol + "//{s}.arcgisonline.com/ArcGIS/rest/services/Reference/World_Transportation/MapServer/tile/{z}/{y}/{x}/",
          options: {
            minZoom: 1,
            maxZoom: 19,
            subdomains: ["server", "services"]
          }
        },
        ImageryAlternateLabels: {
          urlTemplate: tileProtocol + "//{s}.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places_Alternate/MapServer/tile/{z}/{y}/{x}/",
          options: {
            minZoom: 1,
            maxZoom: 12,
            subdomains: ["server", "services"]
          }
        },
        ShadedRelief: {
          urlTemplate: tileProtocol + "//{s}.arcgisonline.com/ArcGIS/rest/services/World_Shaded_Relief/MapServer/tile/{z}/{y}/{x}/",
          options: {
            minZoom: 1,
            maxZoom: 13,
            subdomains: ["server", "services"],
            attribution: formatTextAttributions("ESRI, NAVTEQ, DeLorme") + attributionLogo
          }
        }

      }
    },
    initialize: function(key, options){
      var config;
      // set the config variable with the appropriate config object
      if (typeof key === "object" && key.urlTemplate && key.options){
        config = key;
      } else if(typeof key === "string" && L.esri.BasemapLayer.TILES[key]){
        config = L.esri.BasemapLayer.TILES[key];
      } else {
        throw new Error("L.esri.BasemapLayer: Invalid parameter. Use one of 'Streets', 'Topographic', 'Oceans', 'NationalGeographic', 'Gray', 'GrayLabels', 'Imagery', 'ImageryLabels', 'ImageryTransportation', 'ImageryAlternateLabels' or 'ShadedRelief'");
      }

      // merge passed options into the config options
      var mergedOptions = L.Util.extend(config.options, options);

      // clean up our input url
      var url = L.esri.Util.cleanUrl(config.urlTemplate);

      // call the initialize method on L.TileLayer to set everything up
      L.TileLayer.prototype.initialize.call(this, url, L.Util.setOptions(this, mergedOptions));

      // if this basemap requires dynamic attribution set it up
      if(config.attributionUrl){
        var attributionUrl = L.esri.Util.cleanUrl(config.attributionUrl);
        this._dynamicAttribution = true;
        this._getAttributionData(attributionUrl);
      }
    },
    _dynamicAttribution: false,
    bounds: null,
    zoom: null,
    onAdd: function(map){
      L.TileLayer.prototype.onAdd.call(this, map);
      if(this._dynamicAttribution){
        this.on("load", this._handleTileUpdates, this);
        this._map.on("viewreset zoomend dragend", this._handleTileUpdates, this);
      }
      this._map.on("resize", this._resizeAttribution, this);
    },
    onRemove: function(map){
      if(this._dynamicAttribution){
        this.off("load", this._handleTileUpdates, this);
        this._map.off("viewreset zoomend dragend", this._handleTileUpdates, this);
      }
      this._map.off("resize", this._resizeAttribution, this);
      L.TileLayer.prototype.onRemove.call(this, map);
    },
    _handleTileUpdates: function(e){
      var newBounds;
      var newZoom;

      if(e.type === "load"){
        newBounds = this._map.getBounds();
        newZoom = this._map.getZoom();
      }

      if(e.type === "viewreset" || e.type === "dragend" || e.type ==="zoomend"){
        newBounds = e.target.getBounds();
        newZoom = e.target.getZoom();
      }

      if(this.attributionBoundingBoxes && newBounds && newZoom){
        if(!newBounds.equals(this.bounds) || newZoom !== this.zoom){
          this.bounds = newBounds;
          this.zoom = newZoom;
          this._updateMapAttribution();
        }
      }
    },
    _resizeAttribution: function(){
      var mapWidth = this._map.getSize().x;
      this._getAttributionLogo().style.display = (mapWidth < 600) ? "none":"block";
      this._getAttributionSpan().style.maxWidth =  (mapWidth* 0.75) + "px";
    },
    _getAttributionData: function(url){
      this.attributionBoundingBoxes = [];
      L.esri.get(url, {}, this._processAttributionData, this);
    },
    _processAttributionData: function(attributionData){
      for (var c = 0; c < attributionData.contributors.length; c++) {
        var contributor = attributionData.contributors[c];
        for (var i = 0; i < contributor.coverageAreas.length; i++) {
          var coverageArea = contributor.coverageAreas[i];
          var southWest = new L.LatLng(coverageArea.bbox[0], coverageArea.bbox[1]);
          var northEast = new L.LatLng(coverageArea.bbox[2], coverageArea.bbox[3]);
          this.attributionBoundingBoxes.push({
            attribution: contributor.attribution,
            score: coverageArea.score,
            bounds: new L.LatLngBounds(southWest, northEast),
            minZoom: coverageArea.zoomMin,
            maxZoom: coverageArea.zoomMax
          });
        }
      }
      this.attributionBoundingBoxes.sort(function(a,b){
        if (a.score < b.score){ return -1; }
        if (a.score > b.score){ return 1; }
        return 0;
      });
      if(this.bounds){
        this._updateMapAttribution();
      }
    },
    _getAttributionSpan:function(){
      return this._map._container.querySelectorAll('.esri-attributions')[0];
    },
    _getAttributionLogo:function(){
      return this._map._container.querySelectorAll('.esri-attribution-logo')[0];
    },
    _updateMapAttribution: function(){
      var newAttributions = '';
      for (var i = 0; i < this.attributionBoundingBoxes.length; i++) {
        var attr = this.attributionBoundingBoxes[i];
        if(this.bounds.intersects(attr.bounds) && this.zoom >= attr.minZoom && this.zoom <= attr.maxZoom) {
          var attribution = this.attributionBoundingBoxes[i].attribution;
          if(newAttributions.indexOf(attribution) === -1){
            if(newAttributions.length > 0){
              newAttributions += ', ';
            }
            newAttributions += attribution;
          }
        }
      }
      this._getAttributionSpan().innerHTML = newAttributions;
      this._resizeAttribution();
    }
  });

  L.esri.basemapLayer = function(key, options){
    return new L.esri.BasemapLayer(key, options);
  };

})(L);
/* globals Terraformer, L */
(function(L){

  // toggles the visibility of a layer. Used to
  // show or hide layers that move in or out of
  // the map bounds
  function setLayerVisibility(layer, visible){
    var style = (visible) ? "block" : "none";

    if(layer._icon){
      layer._icon.style.display = style;
    }

    if(layer._shadow){
      layer._shadow.style.display = style;
    }

    if(layer._layers){
      for(var layerid in layer._layers){
        if(layer._layers.hasOwnProperty(layerid)){
          layer._layers[layerid]._container.style.display = style;
        }
      }
    }
  }

  L.esri.FeatureLayer = L.GeoJSON.extend({
    includes: L.esri.Mixins.featureGrid,
    options: {
      cellSize: 512,
      debounce: 100,
      deduplicate: true
    },
    initialize: function(url, options){
      this.index = new Terraformer.RTree();
      this.url = L.esri.Util.cleanUrl(url);
      L.Util.setOptions(this, options);

      L.esri.get(this.url, {}, function(response){
        this.fire("metadata", { metadata: response });
      }, this);

      L.GeoJSON.prototype.initialize.call(this, [], options);
    },
    onAdd: function(map){
      L.LayerGroup.prototype.onAdd.call(this, map);
      map.on("zoomend resize move", this._update, this);
      this._initializeFeatureGrid(map);
    },
    onRemove: function(map){
      map.off("zoomend resize move", this._update, this);
      L.LayerGroup.prototype.onRemove.call(this, map);
      this._destroyFeatureGrid(map);
    },
    getLayerId: function(layer){
      return layer.feature.id;
    },
    _update: function(e){
      var envelope = L.esri.Util.boundsToEnvelope(e.target.getBounds());
      this.index.search(envelope, L.Util.bind(function(error,results){
        this.eachLayer(L.Util.bind(function(layer){
          var id = layer.feature.id;
          setLayerVisibility(layer, L.esri.Util.indexOf(results, id) >= 0);
        }, this));
      }, this));
    },
    _render: function(response){
      if(response.objectIdFieldName && response.features.length && !response.error){
        var idKey = response.objectIdFieldName;
        for (var i = response.features.length - 1; i >= 0; i--) {
          var feature = response.features[i];
          var id = feature.attributes[idKey];
          if(!this._layers[id]){
            var geojson = Terraformer.ArcGIS.parse(feature);
            geojson.id = id;
            this.index.insert(geojson,id);
            this.addData(geojson);
            var layer = this._layers[id];
            this.fire("render", {
              feature: layer,
              geojson: geojson
            });
          }
        }
      }
    }
  });

  L.esri.featureLayer = function(url, options){
    return new L.esri.FeatureLayer(url, options);
  };

})(L);
/* globals L */

L.esri.TiledMapLayer = L.TileLayer.extend({
  includes: L.esri.Mixins.identifiableLayer,
  initialize: function(url, options){
    options = options || {};

    // set the urls
    this.serviceUrl = L.esri.Util.cleanUrl(url);
    this.tileUrl = this.serviceUrl + "tile/{z}/{y}/{x}";

    //if this is looking at the AGO tiles subdomain insert the subdomain placeholder
    if(this.tileUrl.match("://tiles.arcgis.com")){
      this.tileUrl = this.tileUrl.replace("://tiles.arcgis.com", "://tiles{s}.arcgis.com");
      options.subdomains = ["1", "2", "3", "4"];
    }

    L.esri.get(this.serviceUrl, {}, function(response){
      this.fire("metadata", { metadata: response });
    }, this);

    // init layer by calling TileLayers initialize method
    L.TileLayer.prototype.initialize.call(this, this.tileUrl, options);
  }
});

L.esri.tiledMapLayer = function(key, options){
  return new L.esri.TiledMapLayer(key, options);
};
/* globals L */

/*!
 * The MIT License (MIT)
 *
 * Copyright (c) 2013 Sanborn Map Company, Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

L.esri.DynamicMapLayer = L.ImageOverlay.extend({
  includes: L.esri.Mixins.identifiableLayer,

  defaultParams: {
    format: 'png8',
    transparent: true,
    f: 'image',
    bboxSR: 102100,
    imageSR: 102100,
    layers: '',
    opacity: 1
  },

  initialize: function (url, options) {
    this._url = L.esri.Util.cleanUrl(url);
    this._layerParams = L.Util.extend({}, this.defaultParams);

    for (var opt in options) {
      if (!this.options.hasOwnProperty(opt)) {
        this._layerParams[opt] = options[opt];
      }
    }

    delete this._layerParams.token;

    this._parseLayers();
    this._parseLayerDefs();

    L.esri.get(this._url, {}, function(response){
      this.fire("metadata", { metadata: response });
    }, this);

    L.Util.setOptions(this, options);
  },

  onAdd: function (map) {
    this._map = map;

    if (!this._image) {
      this._initImage();
    }

    map._panes.overlayPane.appendChild(this._image);

    map.on({
      'viewreset': this._reset,
      'moveend': this._update,
      'zoomend': this._zoomUpdate
    }, this);

    if (map.options.zoomAnimation && L.Browser.any3d) {
      map.on('zoomanim', this._animateZoom, this);
    }

    if (map.options.crs && map.options.crs.code) {
      var sr = map.options.crs.code.split(":")[1];
      this._layerParams.bboxSR = sr;
      this._layerParams.imageSR = sr;
    }

    this._reset();
    //this._update();
  },

  onRemove: function (map) {
    map.getPanes().overlayPane.removeChild(this._image);

    map.off({
      'viewreset': this._reset,
      'moveend': this._update
    }, this);

    if (map.options.zoomAnimation) {
      map.off('zoomanim', this._animateZoom, this);
    }
  },

  _animateZoom: function (e) {
    var map = this._map,
        image = this._image,
        scale = map.getZoomScale(e.zoom),

        nw = this._map.getBounds().getNorthWest(),
        se = this._map.getBounds().getSouthEast(),

        topLeft = map._latLngToNewLayerPoint(nw, e.zoom, e.center),
        size = map._latLngToNewLayerPoint(se, e.zoom, e.center)._subtract(topLeft),
        origin = topLeft._add(size._multiplyBy((1 / 2) * (1 - 1 / scale)));

    image.style[L.DomUtil.TRANSFORM] = L.DomUtil.getTranslateString(origin) + ' scale(' + scale + ') ';
  },

  _parseLayers: function () {
    if (typeof this._layerParams.layers === 'undefined') {
      delete this._layerParams.layerOption;
      return;
    }

    var action = this._layerParams.layerOption || null,
        layers = this._layerParams.layers || null,
        verb = 'show',
        verbs = ['show', 'hide', 'include', 'exclude'];

    delete this._layerParams.layerOption;

    if (!action) {
      if (layers instanceof Array) {
        this._layerParams.layers = verb + ':' + layers.join(',');
      } else if (typeof layers === 'string') {
        var match = layers.match(':');

        if (match) {
          layers = layers.split(match[0]);
          if (Number(layers[1].split(',')[0])) {
            if (verbs.indexOf(layers[0]) !== -1) {
              verb = layers[0];
            }

            layers = layers[1];
          }
        }
        this._layerParams.layers = verb + ':' + layers;
      }
    } else {
      if (verbs.indexOf(action) !== -1) {
        verb = action;
      }

      this._layerParams.layers = verb + ':' + layers;
    }
  },

  _parseLayerDefs: function () {
    if (typeof this._layerParams.layerDefs === 'undefined') {
      return;
    }

    var layerDefs = this._layerParams.layerDefs;

    var defs = [];

    if (layerDefs instanceof Array) {
      var len = layerDefs.length;
      for (var i = 0; i < len; i++) {
        if (layerDefs[i]) {
          defs.push(i + ':' + layerDefs[i]);
        }
      }
    } else if (typeof layerDefs === 'object') {
      for (var layer in layerDefs) {
        if(layerDefs.hasOwnProperty(layer)){
          defs.push(layer + ':' + layerDefs[layer]);
        }
      }
    } else {
      delete this._layerParams.layerDefs;
      return;
    }
    this._layerParams.layerDefs = defs.join(';');
  },

  _initImage: function () {
    this._image = L.DomUtil.create('img', 'leaflet-image-layer');

    if (this._map.options.zoomAnimation && L.Browser.any3d) {
      L.DomUtil.addClass(this._image, 'leaflet-zoom-animated');
    } else {
      L.DomUtil.addClass(this._image, 'leaflet-zoom-hide');
    }

    this._updateOpacity();

    L.Util.extend(this._image, {
      galleryimg: 'no',
      onselectstart: L.Util.falseFn,
      onmousemove: L.Util.falseFn,
      onload: L.Util.bind(this._onImageLoad, this),
      src: this._getImageUrl()
    });
  },

  _getImageUrl: function () {
    var bounds = this._map.getBounds(),
        size = this._map.getSize(),
        ne = this._map.options.crs.project(bounds._northEast),
        sw = this._map.options.crs.project(bounds._southWest);

    this._layerParams.bbox = [sw.x, sw.y, ne.x, ne.y].join(',');
    this._layerParams.size = size.x + ',' + size.y;

    var url = this._url + 'export' + L.Util.getParamString(this._layerParams);

    if (typeof this.options.token !== 'undefined'){
      url = url + '&token=' + this.options.token;
    }

    return url;
  },

  _update: function (e) {
    if (this._map._panTransition && this._map._panTransition._inProgress) {
      return;
    }

    var zoom = this._map.getZoom();
    if (zoom > this.options.maxZoom || zoom < this.options.minZoom) {
      return;
    }

    this._newImage = L.DomUtil.create('img', 'leaflet-image-layer');

    if (this._map.options.zoomAnimation && L.Browser.any3d) {
      L.DomUtil.addClass(this._newImage, 'leaflet-zoom-animated');
    } else {
      L.DomUtil.addClass(this._newImage, 'leaflet-zoom-hide');
    }

    this._updateOpacity();

    L.Util.extend(this._newImage, {
      galleryimg: 'no',
      onselectstart: L.Util.falseFn,
      onmousemove: L.Util.falseFn,
      onload: L.Util.bind(this._onNewImageLoad, this),
      src: this._getImageUrl()
    });
  },

  _updateOpacity: function(){
    L.DomUtil.setOpacity(this._image, this.options.opacity);
    if(this._newImage){
      L.DomUtil.setOpacity(this._newImage, this.options.opacity);
    }
  },

  _zoomUpdate: function (e) {
    //console.log(e);
    //console.log(this._image);
    //console.log(this._newImage);
  },

  _onNewImageLoad: function () {
    var bounds = this._map.getBounds(),
        nw = L.latLng(bounds._northEast.lat, bounds._southWest.lng),
        se = L.latLng(bounds._southWest.lat, bounds._northEast.lng);

    var topLeft = this._map.latLngToLayerPoint(nw),
        size = this._map.latLngToLayerPoint(se)._subtract(topLeft);
    L.DomUtil.setPosition(this._newImage, topLeft);
    this._newImage.style.width = size.x + 'px';
    this._newImage.style.height = size.y + 'px';

    // this._map._panes.overlayPane.appendChild(this._newImage);
    // this._map._panes.overlayPane.removeChild(this._image);

    if (this._image == null) {
      this._map._panes.overlayPane.appendChild(this._newImage);
    } else {
      this._map._panes.overlayPane.insertBefore(this._newImage,this._image);
    }
    this._map._panes.overlayPane.removeChild(this._image);

    this._image = this._newImage;
    this._newImage = null;
  },

  _onImageLoad: function () {
    this.fire('load');
      //if (this._image.style.display == 'none') {
      //  this._image.style.display = 'block';
      //}
  },

  _reset: function () {
    return;
  }
});

L.esri.dynamicMapLayer = function (url, options) {
  return new L.esri.DynamicMapLayer(url, options);
};