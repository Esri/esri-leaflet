describe('L.esri.Util', function () {
  var sampleExtent = {
    xmin: -122.70,
    ymin: 45.50,
    xmax: -122.64,
    ymax: 45.52,
    spatialReference: { wkid: 4326 }
  };

  var sampleBounds = new L.LatLngBounds([
    [45.50, -122.70], //sw lat, lng
    [45.52, -122.64] //ne lat lng
  ]);

  var hostedFeatureServiceUrl = 'http://services.arcgis.com/rOo.../arcgis/rest/services/RawsomeServiceName/FeatureServer/0';
  var otherServiceUrl = 'http://demographics4.arcgis.com/arcgis/rest/services/USA_Demographics_and_Boundaries_2014/MapServer/9';
  var normalFeatureServiceUrl = 'http://oneofoursampleservers.arcgisonline.com/arcgis/rest/services/WorldTimeZones/MapServer/2';

  it('should return a L.LatLngBounds object from extentToBounds', function () {
    var bounds = L.esri.Util.extentToBounds(sampleExtent);
    expect(bounds).to.be.an.instanceof(L.LatLngBounds);
    expect(bounds.isValid()).to.be.true;
    expect(bounds.getSouthWest().lng).to.equal(sampleExtent.xmin);
    expect(bounds.getSouthWest().lat).to.equal(sampleExtent.ymin);
    expect(bounds.getNorthEast().lng).to.equal(sampleExtent.xmax);
    expect(bounds.getNorthEast().lat).to.equal(sampleExtent.ymax);
  });

  it('should convert a L.LatLngBounds object to an extent object', function () {
    var extent = L.esri.Util.boundsToExtent(sampleBounds);
    expect(extent.xmin).to.equal(sampleBounds.getSouthWest().lng);
    expect(extent.ymin).to.equal(sampleBounds.getSouthWest().lat);
    expect(extent.xmax).to.equal(sampleBounds.getNorthEast().lng);
    expect(extent.ymax).to.equal(sampleBounds.getNorthEast().lat);
  });

  it('should trim whitespace from urls with cleanUrl', function(){
    var url = L.esri.Util.cleanUrl('  http://arcgis.com/  ');
    expect(url).to.equal('http://arcgis.com/');
  });

  it('should add a trailing slash to the url with cleanUrl', function(){
    var url = L.esri.Util.cleanUrl('http://arcgis.com');
    expect(url).to.equal('http://arcgis.com/');
  });

  it('shouldnt trim spaces in the middle', function(){
    var url = L.esri.Util.cleanUrl('   http://arcgis.com/cool folder/anotherfolder ');
    expect(url).to.equal('http://arcgis.com/cool folder/anotherfolder/');
  });

  it('should convert a GeoJSON Point to an ArcGIS Point', function() {
    var input = {
      'type': 'Point',
      'coordinates': [-58.7109375,47.4609375]
    };

    var output = L.esri.Util.geojsonToArcGIS(input);

    expect(output).to.deep.equal({
      'x':-58.7109375,
      'y':47.4609375,
      'spatialReference':{
        'wkid':4326
      }
    });
  });

  it('should convert a GeoJSON Null Island to an ArcGIS Point', function() {
    var input = {
      'type': 'Point',
      'coordinates': [0,0]
    };

    var output = L.esri.Util.geojsonToArcGIS(input);

    expect(output).to.deep.equal({
      'x':0,
      'y':0,
      'spatialReference':{
        'wkid':4326
      }
    });
  });

  it('should convert a GeoJSON LineString to an ArcGIS Polyline', function() {
    var input = {
      'type': 'LineString',
      'coordinates': [ [21.4453125,-14.0625],[33.3984375,-20.7421875],[38.3203125,-24.609375] ]
    };

    var output = L.esri.Util.geojsonToArcGIS(input);

    expect(output).to.deep.equal({
      'paths':[
        [ [21.4453125,-14.0625],[33.3984375,-20.7421875],[38.3203125,-24.609375] ]
      ],
      'spatialReference':{
        'wkid':4326
      }
    });
  });

  it('should convert a GeoJSON Polygon to an ArcGIS Polygon', function() {
    var input = {
      'type': 'Polygon',
      'coordinates': [
        [ [41.8359375,71.015625],[56.953125,33.75],[21.796875,36.5625],[41.8359375,71.015625] ]
      ]
    };

    var output = L.esri.Util.geojsonToArcGIS(input);

    expect(output).to.deep.equal({
      'rings':[
        [ [41.8359375,71.015625],[56.953125,33.75],[21.796875,36.5625],[41.8359375,71.015625] ]
      ],
      'spatialReference':{
        'wkid':4326
      }
    });
  });

  it('should convert a GeoJSON Polygon w/ a hole to an ArcGIS Polygon w/ 2 rings', function() {
    var input = {
      'type': 'Polygon',
      'coordinates': [
        [ [100.0,0.0],[101.0,0.0],[101.0,1.0],[100.0,1.0],[100.0,0.0] ],
        [ [100.2,0.2],[100.8,0.2],[100.8,0.8],[100.2,0.8],[100.2,0.2] ]
      ]
    };

    var output = L.esri.Util.geojsonToArcGIS(input);

    expect(output).to.deep.equal({
      'rings': [
        [ [100, 0], [100, 1], [101, 1], [101, 0], [100, 0] ],
        [ [100.2, 0.2], [100.8, 0.2], [100.8, 0.8], [100.2, 0.8], [100.2, 0.2] ]
      ],
      'spatialReference':{
        'wkid':4326
      }
    });
  });

  it('should strip invalid rings when converting a GeoJSON Polygon to and ArcGIS Polygon', function() {
    var input = {
      'type': 'Polygon',
      'coordinates': [
        [ [100.0,0.0],[101.0,0.0],[101.0,1.0],[100.0,1.0],[100.0,0.0] ],
        [ [100.2,0.2],[100.8,0.2],[100.2,0.2] ]
      ]
    };

    var output = L.esri.Util.geojsonToArcGIS(input);

    expect(output).to.deep.equal({
      'rings': [
        [ [100, 0], [100, 1], [101, 1], [101, 0], [100, 0] ]
      ],
      'spatialReference':{
        'wkid':4326
      }
    });
  });

  it('should close ring when converting a GeoJSON Polygon w/ a hole to an ArcGIS Polygon', function() {
    var input = {
      'type': 'Polygon',
      'coordinates': [
        [ [100.0,0.0],[101.0,0.0],[101.0,1.0],[100.0,1.0] ],
        [ [100.2,0.2],[100.8,0.2],[100.8,0.8],[100.2,0.8] ]
      ]
    };

    var output = L.esri.Util.geojsonToArcGIS(input);

    expect(output).to.deep.equal({
      'rings': [
        [ [100, 0], [100, 1], [101, 1], [101, 0], [100, 0] ],
        [ [100.2, 0.2], [100.8, 0.2], [100.8, 0.8], [100.2, 0.8], [100.2, 0.2] ]
      ],
      'spatialReference':{
        'wkid':4326
      }
    });
  });

  it('should convert a GeoJSON MultiPoint to an ArcGIS Multipoint', function() {
    var input = {
      'type': 'MultiPoint',
      'coordinates': [ [41.8359375,71.015625],[56.953125,33.75],[21.796875,36.5625] ]
    };

    var output = L.esri.Util.geojsonToArcGIS(input);

    expect(output).to.deep.equal({
      'points':[ [41.8359375,71.015625],[56.953125,33.75],[21.796875,36.5625] ],
      'spatialReference':{
        'wkid':4326
      }
    });
  });

  it('should convert a GeoJSON MultiLineString to an ArcGIS Polyline', function() {
    var input = {
      'type': 'MultiLineString',
      'coordinates': [
        [ [41.8359375,71.015625],[56.953125,33.75] ],
        [ [21.796875,36.5625],[47.8359375,71.015625] ]
      ]
    };

    var output = L.esri.Util.geojsonToArcGIS(input);

    expect(output).to.deep.equal({
      'paths':[
        [ [41.8359375,71.015625],[56.953125,33.75] ],
        [ [21.796875,36.5625],[47.8359375,71.015625] ]
      ],
      'spatialReference':{
        'wkid':4326
      }
    });
  });

  it('should convert a GeoJSON MultiPolygon to an ArcGIS Polygon', function() {
    var input = {
      'type': 'MultiPolygon',
      'coordinates': [
        [
          [ [102.0, 2.0], [103.0, 2.0], [103.0, 3.0], [102.0, 3.0], [102.0, 2.0] ]
        ],
        [
          [ [100.0, 0.0], [101.0, 0.0], [101.0, 1.0], [100.0, 1.0], [100.0, 0.0] ]
        ]
      ]
    };

    var output = L.esri.Util.geojsonToArcGIS(input);
    expect(output).to.deep.equal({
      'rings':[
        [ [102, 2], [102, 3], [103, 3], [103, 2], [102, 2] ],
        [ [100, 0], [100, 1], [101, 1], [101, 0], [100, 0] ]
      ],
      'spatialReference': {
        'wkid':4326
      }
    });
  });

  it('should convert a GeoJSON MultiPolygon w/ holes to an ArcGIS Polygon', function() {
    var input = {
      'type': 'MultiPolygon',
      'coordinates': [
        [
          [ [102.0, 2.0], [103.0, 2.0], [103.0, 3.0], [102.0, 3.0], [102.0, 2.0] ]
        ],
        [
          [ [100.0, 0.0], [101.0, 0.0], [101.0, 1.0], [100.0, 1.0], [100.0, 0.0] ],
          [ [100.2, 0.2], [100.8, 0.2], [100.8, 0.8], [100.2, 0.8], [100.2, 0.2] ]
        ]
      ]
    };

    var output = L.esri.Util.geojsonToArcGIS(input);
    expect(output).to.deep.equal({
      'spatialReference': {
        'wkid': 4326
      },
      'rings': [
        [ [102,2],[102,3],[103,3],[103,2],[102,2] ],
        [ [100.2,0.2],[100.8,0.2],[100.8,0.8],[100.2,0.8],[100.2,0.2] ],
        [ [100,0],[100,1],[101,1],[101,0],[100,0] ]
      ]
    });
  });

  it('should close rings when converting a GeoJSON MultiPolygon w/ holes to an ArcGIS Polygon', function() {
    var input = {
      'type': 'MultiPolygon',
      'coordinates': [
        [
          [ [102.0, 2.0], [103.0, 2.0], [103.0, 3.0], [102.0, 3.0] ]
        ],
        [
          [ [100.0, 0.0], [101.0, 0.0], [101.0, 1.0], [100.0, 1.0] ],
          [ [100.2, 0.2], [100.8, 0.2], [100.8, 0.8], [100.2, 0.8] ]
        ]
      ]
    };

    var output = L.esri.Util.geojsonToArcGIS(input);
    expect(output).to.deep.equal({
      'spatialReference': {
        'wkid': 4326
      },
      'rings': [
        [ [102,2],[102,3],[103,3],[103,2],[102,2] ],
        [ [100.2,0.2],[100.8,0.2],[100.8,0.8],[100.2,0.8],[100.2,0.2] ],
        [ [100,0],[100,1],[101,1],[101,0],[100,0] ]
      ]
    });
  });

  it('should convert a GeoJSON Feature into an ArcGIS Feature', function(){
    var input = {
      'type':'Feature',
      'id': 'foo',
      'geometry': {
        'type': 'Polygon',
        'coordinates': [
          [ [41.8359375,71.015625],[56.953125,33.75],[21.796875,36.5625],[41.8359375,71.015625] ]
        ]
      },
      'properties': {
        'foo':'bar'
      }
    };

    var output = L.esri.Util.geojsonToArcGIS(input);

    expect(output).to.deep.equal({
      'geometry':{
        'rings':[
          [ [41.8359375,71.015625],[56.953125,33.75],[21.796875,36.5625],[41.8359375,71.015625] ]
        ],
        'spatialReference':{
          'wkid':4326
        }
      },
      'attributes': {
        'foo':'bar',
        'OBJECTID': 'foo'
      }
    });
  });

  it('should convert a GeoJSON Feature into an ArcGIS Feature w/ a custom id', function(){
    var input = {
      'type':'Feature',
      'id': 'foo',
      'geometry': {
        'type': 'Polygon',
        'coordinates': [
          [ [41.8359375,71.015625],[56.953125,33.75],[21.796875,36.5625],[41.8359375,71.015625] ]
        ]
      },
      'properties': {
        'foo':'bar'
      }
    };

    var output = L.esri.Util.geojsonToArcGIS(input, 'myId');

    expect(output).to.deep.equal({
      'geometry':{
        'rings':[
          [ [41.8359375,71.015625],[56.953125,33.75],[21.796875,36.5625],[41.8359375,71.015625] ]
        ],
        'spatialReference':{
          'wkid':4326
        }
      },
      'attributes': {
        'foo':'bar',
        'myId': 'foo'
      }
    });
  });

  it('should allow converting a GeoJSON Feature to an ArcGIS Feature with no properties or geometry', function(){
    var input = {
      'type':'Feature',
      'id': 'foo',
      'geometry': null,
      'properties': null
    };

    var output = L.esri.Util.geojsonToArcGIS(input);

    expect(output).to.deep.equal({
      'attributes': {
        'OBJECTID': 'foo'
      }
    });
  });

  it('should convert a GeoJSON FeatureCollection into an array of ArcGIS Feature JSON', function(){
    var input = {
      'type': 'FeatureCollection',
      'features': [{
        'type': 'Feature',
        'geometry': {
          'type': 'Point',
          'coordinates': [102.0, 0.5]
        },
        'properties': {
          'prop0': 'value0'
        }
      }, {
        'type': 'Feature',
        'geometry': {
          'type': 'LineString',
          'coordinates': [
            [102.0, 0.0],[103.0, 1.0],[104.0, 0.0],[105.0, 1.0]
          ]
        },
        'properties': {
          'prop0': 'value0'
        }
      }, {
        'type': 'Feature',
        'geometry': {
          'type': 'Polygon',
          'coordinates': [
            [ [100.0, 0.0],[101.0, 0.0],[101.0, 1.0],[100.0, 1.0],[100.0, 0.0] ]
          ]
        },
        'properties': {
          'prop0': 'value0'
        }
      }]
    };

    var output = L.esri.Util.geojsonToArcGIS(input);

    expect(output).to.deep.equal([{
      'geometry': {
        'x': 102,
        'y': 0.5,
        'spatialReference': {
          'wkid': 4326
        }
      },
      'attributes': {
        'prop0': 'value0'
      }
    }, {
      'geometry': {
        'paths': [
          [[102, 0],[103, 1],[104, 0],[105, 1]]
        ],
        'spatialReference': {
          'wkid': 4326
        }
      },
      'attributes': {
        'prop0': 'value0'
      }
    }, {
      'geometry': {
        'rings': [
          [ [100,0],[100,1],[101,1],[101,0],[100,0] ]
        ],
        'spatialReference': {
          'wkid': 4326
        }
      },
      'attributes': {
        'prop0': 'value0'
      }
    }]);
  });

  it('should convert a GeoJSON GeometryCollection into an array of ArcGIS Geometries', function(){
    var input = {
      'type' : 'GeometryCollection',
      'geometries' : [{
        'type' : 'Polygon',
        'coordinates' : [[[-95, 43], [-95, 50], [-90, 50], [-91, 42], [-95, 43]]]
      }, {
        'type' : 'LineString',
        'coordinates' : [[-89, 42], [-89, 50], [-80, 50], [-80, 42]]
      }, {
        'type' : 'Point',
        'coordinates' : [-94, 46]
      }]
    };

    var output = L.esri.Util.geojsonToArcGIS(input);

    expect(output).to.deep.equal([{
      'rings': [
        [[-95, 43],[-95, 50],[-90, 50],[-91, 42],[-95, 43]]
      ],
      'spatialReference': {
        'wkid': 4326
      }
    }, {
      'paths': [
        [[-89, 42],[-89, 50],[-80, 50],[-80, 42]]
      ],
      'spatialReference': {
        'wkid': 4326
      }
    }, {
      'x': -94,
      'y': 46,
      'spatialReference': {
        'wkid': 4326
      }
    }]);
  });

  it('should not modify the original GeoJSON object', function(){
    var primitive = {
      'type': 'FeatureCollection',
      'features': [{
        'type': 'Feature',
        'geometry': {
          'type': 'Point',
          'coordinates': [102.0, 0.5]
        },
        'properties': {
          'prop0': 'value0'
        }
      }, {
        'type': 'Feature',
        'geometry': {
          'type': 'LineString',
          'coordinates': [
            [102.0, 0.0],[103.0, 1.0],[104.0, 0.0],[105.0, 1.0]
          ]
        },
        'properties': {
          'prop0': 'value0'
        }
      }, {
        'type': 'Feature',
        'geometry': {
          'type': 'Polygon',
          'coordinates': [
            [ [100.0, 0.0],[101.0, 0.0],[101.0, 1.0],[100.0, 1.0],[100.0, 0.0] ]
          ]
        },
        'properties': {
          'prop0': 'value0'
        }
      }]
    };

    var original = JSON.stringify(primitive);

    L.esri.Util.geojsonToArcGIS(primitive);

    expect(original).to.deep.equal(JSON.stringify(primitive));
  });

  it('should parse an ArcGIS Point in a GeoJSON Point', function() {
    var input = {
      'x': -66.796875,
      'y': 20.0390625,
      'spatialReference': {
        'wkid': 4326
      }
    };

    var output = L.esri.Util.arcgisToGeojson(input);

    expect(output.coordinates).to.deep.equal([-66.796875,20.0390625]);
  });

  it('should parse an ArcGIS Null Island in a GeoJSON Point', function() {
    var input = {
      'x': 0,
      'y': 0,
      'spatialReference': {
        'wkid': 4326
      }
    };

    var output = L.esri.Util.arcgisToGeojson(input);
    expect(output.coordinates).to.deep.equal([0,0]);
  });

  it('should parse an ArcGIS Polyline in a GeoJSON LineString', function() {
    var input = {
      'paths': [
        [ [6.6796875,47.8125],[-65.390625,52.3828125],[-52.3828125,42.5390625] ]
      ],
      'spatialReference': {
        'wkid': 4326
      }
    };

    var output = L.esri.Util.arcgisToGeojson(input);

    expect(output.coordinates).to.deep.equal([ [6.6796875,47.8125],[-65.390625,52.3828125],[-52.3828125,42.5390625] ]);
  });

  it('should parse an ArcGIS Polygon in a GeoJSON Polygon', function() {
    var input = {
      'rings': [
        [ [41.8359375,71.015625],[56.953125,33.75],[21.796875,36.5625],[41.8359375,71.015625] ]
      ],
      'spatialReference': {
        'wkid': 4326
      }
    };

    var output = L.esri.Util.arcgisToGeojson(input);

    expect(output.coordinates).to.deep.equal([ [ [41.8359375,71.015625],[56.953125,33.75],[21.796875,36.5625],[41.8359375,71.015625] ] ]);
    expect(output.type).to.deep.equal('Polygon');
  });

  it('should close rings when parsing an ArcGIS Polygon in a GeoJSON Polygon', function() {
    var input = {
      'rings': [
        [ [41.8359375,71.015625],[56.953125,33.75],[21.796875,36.5625]]
      ],
      'spatialReference': {
        'wkid': 4326
      }
    };

    var output = L.esri.Util.arcgisToGeojson(input);

    expect(output.coordinates).to.deep.equal([ [ [41.8359375,71.015625],[56.953125,33.75],[21.796875,36.5625],[41.8359375,71.015625] ] ]);
    expect(output.type).to.deep.equal('Polygon');
  });

  it('should parse an ArcGIS Multipoint in a GeoJSON MultiPoint', function() {
    var input = {
      'points':[ [41.8359375,71.015625],[56.953125,33.75],[21.796875,36.5625] ],
      'spatialReference':{
        'wkid':4326
      }
    };

    var output = L.esri.Util.arcgisToGeojson(input);

    expect(output.coordinates).to.deep.equal([ [41.8359375,71.015625],[56.953125,33.75],[21.796875,36.5625] ]);
  });

  it('should parse an ArcGIS Polyline in a GeoJSON MultiLineString', function() {
    var input = {
      'paths':[
        [ [41.8359375,71.015625],[56.953125,33.75] ],
        [ [21.796875,36.5625],[41.8359375,71.015625] ]
      ],
      'spatialReference':{
        'wkid':4326
      }
    };

    var output = L.esri.Util.arcgisToGeojson(input);

    expect(output.coordinates).to.deep.equal([[ [41.8359375,71.015625],[56.953125,33.75] ], [ [21.796875,36.5625],[41.8359375,71.015625] ]]);
  });

  it('should parse an ArcGIS Polygon in a GeoJSON MultiPolygon', function() {
    var input = {
      'rings':[
        [[-122.63,45.52],[-122.57,45.53],[-122.52,45.50],[-122.49,45.48],[-122.64,45.49],[-122.63,45.52],[-122.63,45.52]],
        [[-83,35],[-74,35],[-74,41],[-83,41],[-83,35]]
      ],
      'spatialReference': {
        'wkid':4326
      }
    };

    var output = L.esri.Util.arcgisToGeojson(input);
    var expected = [
      [
        [ [-122.63,45.52],[-122.57,45.53],[-122.52,45.5],[-122.49,45.48],[-122.64,45.49],[-122.63,45.52],[-122.63,45.52] ]
      ],
      [
        [ [-83,35],[-83,41],[-74,41],[-74,35],[-83,35] ]
      ]
    ];

    expect(output.coordinates).to.deep.equal(expected);
    expect(output.type).to.deep.equal('MultiPolygon');
  });

  it('should strip invalid rings when converting ArcGIS Polygons to GeoJSON', function() {
    var input = {
      'rings':[
        [[-122.63,45.52],[-122.57,45.53],[-122.52,45.50],[-122.49,45.48],[-122.64,45.49],[-122.63,45.52],[-122.63,45.52]],
        [[-83,35],[-74,35],[-83,35]]
      ],
      'spatialReference': {
        'wkid':4326
      }
    };

    var output = L.esri.Util.arcgisToGeojson(input);

    expect(output.coordinates).to.deep.equal([
      [ [-122.63,45.52],[-122.57,45.53],[-122.52,45.5],[-122.49,45.48],[-122.64,45.49],[-122.63,45.52],[-122.63,45.52] ]
    ]);
    expect(output.type).to.deep.equal('Polygon');
  });

  it('should properly close rings when converting an ArcGIS Polygon in a GeoJSON MultiPolygon', function() {
    var input = {
      'rings':[
        [[-122.63,45.52],[-122.57,45.53],[-122.52,45.50],[-122.49,45.48],[-122.64,45.49]],
        [[-83,35],[-74,35],[-74,41],[-83,41]]
      ],
      'spatialReference': {
        'wkid':4326
      }
    };

    var output = L.esri.Util.arcgisToGeojson(input);

    expect(output.coordinates).to.deep.equal([
      [
        [ [-122.63,45.52],[-122.57,45.53],[-122.52,45.5],[-122.49,45.48],[-122.64,45.49],[-122.63,45.52] ]
      ],
      [
        [ [-83,35],[-83,41],[-74,41],[-74,35],[-83,35] ]
      ]
    ]);
    expect(output.type).to.deep.equal('MultiPolygon');
  });

  it('should parse an ArcGIS MultiPolygon with holes to a GeoJSON MultiPolygon', function(){
    var input = {
      'type':'polygon',
      'rings':[
        [ [-100.74462180954974,39.95017165502381],[-94.50439384003792,39.91647453608879],[-94.41650267263967,34.89313438177965],[-100.78856739324887,34.85708140996771],[-100.74462180954974,39.95017165502381] ],
        [ [-99.68993678392353,39.341088433448896],[-99.68993678392353,38.24507658785885],[-98.67919734199646,37.86444431771113],[-98.06395917020868,38.210554846669694],[-98.06395917020868,39.341088433448896],[-99.68993678392353,39.341088433448896] ],
        [ [-96.83349180978595,37.23732027507514],[-97.31689323047635,35.967330282988534],[-96.5698183075912,35.57512048069255],[-95.42724211456674,36.357601429255965],[-96.83349180978595,37.23732027507514] ],
        [ [-101.4916967324349,38.24507658785885],[-101.44775114873578,36.073960493943744],[-103.95263145328033,36.03843312329154],[-103.68895795108557,38.03770050767439],[-101.4916967324349,38.24507658785885] ]
      ],
      'spatialReference':{
        'wkid':4326
      }
    };
    var output = L.esri.Util.arcgisToGeojson(input);

    expect(output.coordinates).to.deep.equal([
      [
        [ [-100.74462180954974, 39.95017165502381], [-94.50439384003792, 39.91647453608879], [-94.41650267263967, 34.89313438177965], [-100.78856739324887, 34.85708140996771], [-100.74462180954974, 39.95017165502381] ],
        [ [-96.83349180978595, 37.23732027507514], [-97.31689323047635, 35.967330282988534], [-96.5698183075912, 35.57512048069255], [-95.42724211456674, 36.357601429255965], [-96.83349180978595, 37.23732027507514] ],
        [ [-99.68993678392353, 39.341088433448896], [-99.68993678392353, 38.24507658785885], [-98.67919734199646, 37.86444431771113], [-98.06395917020868, 38.210554846669694], [-98.06395917020868, 39.341088433448896], [-99.68993678392353, 39.341088433448896] ]
      ],
      [
        [ [-101.4916967324349, 38.24507658785885], [-101.44775114873578, 36.073960493943744], [-103.95263145328033, 36.03843312329154], [-103.68895795108557, 38.03770050767439], [-101.4916967324349, 38.24507658785885] ]
      ]
    ]);
    expect(output.type).to.deep.equal('MultiPolygon');
  });

  it('should still parse holes outside the outer rings', function(){
    var input = {
      "rings": [
        [ [-122.45,45.63], [-122.45,45.68], [-122.39,45.68], [-122.39,45.63], [-122.45,45.63] ],
        [ [-122.46,45.64], [-122.4,45.64], [-122.4,45.66], [-122.46,45.66], [-122.46,45.64] ]
      ]
    }

    var output = L.esri.Util.arcgisToGeojson(input);

    var expected = [
      [ [-122.45,45.63], [-122.45,45.68], [-122.39,45.68], [-122.39,45.63], [-122.45,45.63] ],
      [ [-122.46,45.64], [-122.4,45.64], [-122.4,45.66], [-122.46,45.66], [-122.46,45.64] ]
    ];

    expect(output.coordinates).to.deep.equal(expected);
  });

  it('should parse an ArcGIS Feature into a GeoJSON Feature', function(){
    var input = {
      'geometry': {
        'rings': [
          [ [41.8359375,71.015625],[56.953125,33.75],[21.796875,36.5625],[41.8359375,71.015625] ]
        ],
        'spatialReference': {
          'wkid': 4326
        }
      },
      'attributes': {
        'foo': 'bar'
      }
    };

    var output = L.esri.Util.arcgisToGeojson(input);

    expect(output.geometry.coordinates).to.deep.equal([
      [ [41.8359375,71.015625],[56.953125,33.75],[21.796875,36.5625],[41.8359375,71.015625] ]
    ]);
    expect(output.geometry.type).to.deep.equal('Polygon');
  });

  it('should parse an ArcGIS Feature w/ OBJECTID into a GeoJSON Feature', function(){
    var input = {
      'geometry': {
        'rings': [
          [ [41.8359375,71.015625],[56.953125,33.75],[21.796875,36.5625],[41.8359375,71.015625] ]
        ],
        'spatialReference': {
          'wkid': 4326
        }
      },
      'attributes': {
        'OBJECTID': 123
      }
    };

    var output = L.esri.Util.arcgisToGeojson(input);

    expect(output.id).to.deep.equal(123);
  });

  it('should parse an ArcGIS Feature w/ FID into a GeoJSON Feature', function(){
    var input = {
      'geometry': {
        'rings': [
          [ [41.8359375,71.015625],[56.953125,33.75],[21.796875,36.5625],[41.8359375,71.015625] ]
        ],
        'spatialReference': {
          'wkid': 4326
        }
      },
      'attributes': {
        'FID': 123
      }
    };

    var output = L.esri.Util.arcgisToGeojson(input);

    expect(output.id).to.deep.equal(123);
  });

  it('should parse an ArcGIS Feature w/ a custom id into a GeoJSON Feature', function(){
    var input = {
      'geometry': {
        'rings': [
          [ [41.8359375,71.015625],[56.953125,33.75],[21.796875,36.5625],[41.8359375,71.015625] ]
        ],
        'spatialReference': {
          'wkid': 4326
        }
      },
      'attributes': {
        'FooId': 123
      }
    };

    var output = L.esri.Util.arcgisToGeojson(input, 'FooId');

    expect(output.id).to.deep.equal(123);
  });

  it('should parse an ArcGIS Feature w/ empty attributes into a GeoJSON Feature', function(){
    var input = {
      'geometry': {
        'rings': [
          [ [41.8359375,71.015625],[56.953125,33.75],[21.796875,36.5625],[41.8359375,71.015625] ]
        ],
        'spatialReference': {
          'wkid': 4326
        }
      },
      'attributes': {}
    };

    var output = L.esri.Util.arcgisToGeojson(input);

    expect(output.geometry.coordinates).to.deep.equal([
      [ [41.8359375,71.015625],[56.953125,33.75],[21.796875,36.5625],[41.8359375,71.015625] ]
    ]);
    expect(output.geometry.type).to.deep.equal('Polygon');
  });

  it('should parse an ArcGIS Feature w/ no attributes into a GeoJSON Feature', function(){
    var input = {
      'geometry': {
        'rings': [
          [ [41.8359375,71.015625],[56.953125,33.75],[21.796875,36.5625],[41.8359375,71.015625] ]
        ],
        'spatialReference': {
          'wkid': 4326
        }
      }
    };

    var output = L.esri.Util.arcgisToGeojson(input);

    expect(output.geometry.coordinates).to.deep.equal([
      [ [41.8359375,71.015625],[56.953125,33.75],[21.796875,36.5625],[41.8359375,71.015625] ]
    ]);
    expect(output.geometry.type).to.deep.equal('Polygon');
    expect(output.properties).to.deep.equal(null);
  });

  it('should parse an ArcGIS Feature w/ no geometry into a GeoJSON Feature', function(){
    var input = {
      'attributes': {
        'foo': 'bar'
      }
    };

    var output = L.esri.Util.arcgisToGeojson(input);

    expect(output.geometry).to.deep.equal(null);
    expect(output.properties.foo).to.deep.equal('bar');
  });

  it('should not modify the original ArcGIS Geometry', function(){
    var input = {
      'geometry': {
        'rings': [
          [ [41.8359375,71.015625],[56.953125,33.75],[21.796875,36.5625],[41.8359375,71.015625] ]
        ],
        'spatialReference': {
          'wkid': 4326
        }
      },
      'attributes': {
        'foo': 'bar'
      }
    };

    var original = JSON.stringify(input);

    L.esri.Util.arcgisToGeojson(input);

    expect(original).to.deep.equal(JSON.stringify(input));
  });

  it('should convert ArcGIS Feature Sets to GeoJSON Feature Collections with objectIdFieldName', function(){
    var input = {
      'objectIdFieldName': 'OBJECTID',
      'features': [
        {
          'geometry': {
            'paths': [
              [[102, 0],[103, 1],[104, 0],[105, 1]]
            ],
            'spatialReference': {
              'wkid': 4326
            }
          },
          'attributes': {
            'prop0': 'value0',
            'OBJECTID': 1
          }
        },
          {
          'geometry': {
            'rings': [
              [ [100,0],[100,1],[101,1],[101,0],[100,0] ]
            ],
            'spatialReference': {
              'wkid': 4326
            }
          },
          'attributes': {
            'prop0': 'value0',
            'OBJECTID': 2
          }
        }
      ]
    };

    var output = L.esri.Util.responseToFeatureCollection(input);

    expect(output).to.deep.equal({
      'type': 'FeatureCollection',
      'features': [{
        'type': 'Feature',
        'geometry': {
          'type': 'Polygon',
          'coordinates': [
            [ [100.0, 0.0],[100.0, 1.0],[101.0, 1.0],[101.0, 0.0],[100.0, 0.0] ]
          ]
        },
        'properties': {
          'prop0': 'value0',
          'OBJECTID': 2
        },
        'id': 2,
      }, {
        'type': 'Feature',
        'geometry': {
          'type': 'LineString',
          'coordinates': [
            [102.0, 0.0],[103.0, 1.0],[104.0, 0.0],[105.0, 1.0]
          ]
        },
        'properties': {
          'prop0': 'value0',
          'OBJECTID': 1
        },
        'id': 1,
      }]
    });
  });

  it('should convert ArcGIS Feature Sets to GeoJSON Feature Collections with fields', function(){
    var input = {
      fields: [{
        'name': 'position',
        'type': 'esriFieldTypeString',
        'alias': 'position',
        'sqlType': 'sqlTypeNVarchar',
        'length': 256,
        'domain': null,
        'defaultValue': null
      }, {
        'name': 'OBJECTID',
        'type': 'esriFieldTypeOID',
        'alias': 'OBJECTID',
        'sqlType': 'sqlTypeInteger',
        'domain': null,
        'defaultValue': null
      }],
      'features': [
        {
          'geometry': {
            'paths': [
              [[102, 0],[103, 1],[104, 0],[105, 1]]
            ],
            'spatialReference': {
              'wkid': 4326
            }
          },
          'attributes': {
            'prop0': 'value0',
            'OBJECTID': 1
          }
        },
          {
          'geometry': {
            'rings': [
              [ [100,0],[100,1],[101,1],[101,0],[100,0] ]
            ],
            'spatialReference': {
              'wkid': 4326
            }
          },
          'attributes': {
            'prop0': 'value0',
            'OBJECTID': 2
          }
        }
      ]
    };

    var output = L.esri.Util.responseToFeatureCollection(input);

    expect(output).to.deep.equal({
      'type': 'FeatureCollection',
      'features': [{
        'type': 'Feature',
        'geometry': {
          'type': 'Polygon',
          'coordinates': [
            [ [100.0, 0.0],[100.0, 1.0],[101.0, 1.0],[101.0, 0.0],[100.0, 0.0] ]
          ]
        },
        'properties': {
          'prop0': 'value0',
          'OBJECTID': 2
        },
        'id': 2,
      }, {
        'type': 'Feature',
        'geometry': {
          'type': 'LineString',
          'coordinates': [
            [102.0, 0.0],[103.0, 1.0],[104.0, 0.0],[105.0, 1.0]
          ]
        },
        'properties': {
          'prop0': 'value0',
          'OBJECTID': 1
        },
        'id': 1,
      }]
    });
  });

  it('should know the difference between a hosted feature service and everything else', function () {
    expect(L.esri.Util.isArcgisOnline(hostedFeatureServiceUrl)).to.be.true;
    expect(L.esri.Util.isArcgisOnline(otherServiceUrl)).to.be.false;
    expect(L.esri.Util.isArcgisOnline(normalFeatureServiceUrl)).to.be.false;
  });

});