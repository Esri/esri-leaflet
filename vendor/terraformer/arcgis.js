(function (root, factory) {

  // Node.
  if(typeof module === 'object' && typeof module.exports === 'object') {
    exports = module.exports = factory();
  }

  // AMD.
  if(typeof define === 'function' && define.amd) {
    define(["terraformer/terraformer"],factory);
  }

  // Browser Global.
  if(typeof root.navigator === "object") {
    if (typeof root.Terraformer === "undefined"){
      root.Terraformer = {};
    }
    root.Terraformer.ArcGIS = factory();
  }

}(this, function() {
  var exports = { };
  var Terraformer;

  // Local Reference To Browser Global
  if(typeof this.navigator === "object") {
    Terraformer = this.Terraformer;
  }

  // Setup Node Dependencies
  if(typeof module === 'object' && typeof module.exports === 'object') {
    Terraformer = require('terraformer');
  }

  // Setup AMD Dependencies
  if(arguments[0] && typeof define === 'function' && define.amd) {
    Terraformer = arguments[0];
  }

  
  // This function flattens holes in multipolygons to one array of polygons
  function flattenHoles(array){
    var output = [], polygon;
    for (var i = 0; i < array.length; i++) {
      polygon = array[i];
      if(polygon.length > 1){
        for (var ii = 0; ii < polygon.length; ii++) {
          output.push(polygon[ii]);
        }
      } else {
        output.push(polygon[0]);
      }

    }
    return output;
  }

  function findGeometryType(input){
    if(input.x && input.y){
      return "Point";
    }
    if(input.points){
      return "MultiPoint";
    }
    if(input.paths) {
      return (input.paths.length === 1) ? "LineString" : "MultiLineString";
    }
    if(input.rings) {
      return (input.rings.length === 1) ? "Polygon" : "MultiPolygon";
    }
    if(input.attributes && input.geometry) {
      return "Feature";
    }
    throw "Terraformer: invalid ArcGIS input. Are you sure your data is properly formatted?";
  }

  // this takes an arcgis geometry and converts it to geojson
  function parse(arcgis){
    var type = findGeometryType(arcgis);
    var inputSpatialReference = (arcgis.geometry) ? arcgis.geometry.spatialReference : arcgis.spatialReference;
    var geojson = {
      type: type
    };

    if(type === "Feature") {
      geojson.properties = arcgis.attributes;
    }

    switch(type){
    case "Point":
      geojson.coordinates = [arcgis.x, arcgis.y];
      break;
    case "MultiPoint":
      geojson.coordinates = arcgis.points;
      break;
    case "LineString":
      geojson.coordinates = arcgis.paths[0];
      break;
    case "MultiLineString":
      geojson.coordinates = arcgis.paths;
      break;
    case "Polygon":
      geojson.coordinates = arcgis.rings;
      break;
    case "MultiPolygon":
      geojson.coordinates = [arcgis.rings];
      break;
    case "Feature":
      geojson.geometry = parse(arcgis.geometry);

      break;
    }

    //convert spatial ref if needed
    if(inputSpatialReference.wkid === 102100){
      geojson = Terraformer.toGeographic(geojson);
    }

    return new Terraformer.Primitive(geojson);
  }

  // this takes a point line or polygon geojson object and converts it to the appropriate
  function convert(geojson, sr){
    var spatialReference = (sr) ? sr : { wkid: 4326 };
    var result = {};

    switch(geojson.type){
    case "Point":
      result.x = geojson.coordinates[0];
      result.y = geojson.coordinates[1];
      result.spatialReference = spatialReference;
      break;
    case "MultiPoint":
      result.points = geojson.coordinates;
      result.spatialReference = spatialReference;
      break;
    case "LineString":
      result.paths = [geojson.coordinates];
      result.spatialReference = spatialReference;
      break;
    case "MultiLineString":
      result.paths = geojson.coordinates;
      result.spatialReference = spatialReference;
      break;
    case "Polygon":
      result.rings = geojson.coordinates;
      result.spatialReference = spatialReference;
      break;
    case "MultiPolygon":
      result.rings = flattenHoles(geojson.coordinates);
      result.spatialReference = spatialReference;
      break;
    case "Feature":
      result.geometry = convert(geojson.geometry);
      result.attributes = geojson.properties;
      break;
    }

    return result;
  }

  exports.parse   = parse;
  exports.convert = convert;
  return exports;
}));