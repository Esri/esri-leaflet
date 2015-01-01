describe('L.esri.Tasks.Query', function () {
  function createMap(){
    // create container
    var container = document.createElement('div');

    // give container a width/height
    container.setAttribute('style', 'width:500px; height: 500px;');

    // add contianer to body
    document.body.appendChild(container);

    return L.map(container).setView([45.51, -122.66], 16);
  }

  var map = createMap();

  var server;
  var task;

  var bounds = L.latLngBounds([[45.5, -122.66],[ 45.51, -122.65]]);
  var latlng = L.latLng(45.51, -122.66);
  var rawLatlng = [45.51, -122.66];

  var rawBounds = [[45.5, -122.66],[ 45.51, -122.65]];
  var rawLatLng = [45.51, -122.66];

  var rawGeoJsonPolygon = {
    "type": "Polygon",
    "coordinates": [[
      [-97,39],[-97,41],[-94,41],[-94,39],[-97,39]
    ]]
  };

  var rawGeoJsonFeature = {"type": "Feature"}
  rawGeoJsonFeature.geometry = rawGeoJsonPolygon;

  var geoJsonPolygon = L.geoJson(rawGeoJsonPolygon);

  var featureLayerUrl = 'http://gis.example.com/mock/arcgis/rest/services/MockFeatureService/FeatureServer/0/';
  var mapServiceUrl = 'http://gis.example.com/mock/arcgis/rest/services/MockMapService/MapServer/';
  var imageServiceUrl = 'http://gis.example.com/mock/arcgis/rest/services/MockImageService/ImageServer/';

  var sampleImageServiceQueryResponse = {
    'fieldAliases': {
      'IMAGEID': 'IMAGEID',
      'OWNER': 'OWNER'
    },
    'fields': [
      {
        'name': 'IMAGEID',
        'type': 'esriFieldTypeOID',
        'alias': 'IMAGEID'
      },
      {
        'name': 'OWNER',
        'type': 'esriFieldTypeString',
        'alias': 'OWNER'
      },
    ],
    'features': [
      {
        'attributes': {
          'IMAGEID': 1,
          'OWNER': 'Joe Smith'
        },
        'geometry': {
          'rings' : [
            [ [-97.06138,32.837], [-97.06133,32.836], [-97.06124,32.834], [-97.06127,32.832], [-97.06138,32.837] ]
          ],
          'spatialReference': {
            'wkid': 4326
          }
        }
      }
    ]
  };

  var sampleImageServiceCollection = {
    'type': 'FeatureCollection',
    'features': [{
      'type': 'Feature',
      'geometry': {
        'type': 'Polygon',
        'coordinates': [
          [ [-97.06138,32.837], [-97.06133,32.836], [-97.06124,32.834], [-97.06127,32.832], [-97.06138,32.837] ]
        ]
      },
      'properties': {
        'IMAGEID': 1,
        'OWNER': 'Joe Smith'
      },
      'id': 1
    }]
  };

  var sampleMapServiceQueryResponse = {
    'fieldAliases': {
      'ObjectID': 'ObjectID',
      'Name': 'Name'
    },
    'fields': [
      {
        'name': 'ObjectID',
        'type': 'esriFieldTypeOID',
        'alias': 'ObjectID'
      },
      {
        'name': 'Name',
        'type': 'esriFieldTypeString',
        'alias': 'Name'
      },
    ],
    'features': [
      {
        'attributes': {
          'ObjectID': 1,
          'Name': 'Site'
        },
        'geometry': {
          'x': -122.81,
          'y': 45.48,
          'spatialReference': {
            'wkid': 4326
          }
        }
      }
    ]
  };

  var sampleMapServiceCollection = {
    'type': 'FeatureCollection',
    'features': [{
      'type': 'Feature',
      'geometry': {
        'type': 'Point',
        'coordinates': [-122.81, 45.48]
      },
      'properties': {
        'ObjectID': 1,
        'Name': 'Site'
      },
      'id': 1
    }]
  };

  var sampleQueryResponse = {
    'objectIdFieldName': 'FID',
    'fields': [{
      'name': 'stop_desc',
      'type': 'esriFieldTypeString',
      'alias': 'stop_desc',
      'sqlType': 'sqlTypeNVarchar',
      'length': 256,
      'domain': null,
      'defaultValue': null
    },{
      'name': 'FID',
      'type': 'esriFieldTypeInteger',
      'alias': 'FID',
      'sqlType': 'sqlTypeInteger',
      'domain': null,
      'defaultValue': null
    }],
    'features': [
      {
        'attributes': {
          'FID': 1,
          'Name': 'Site'
        },
        'geometry': {
          'x': -122.81,
          'y': 45.48,
          'spatialReference': {
            'wkid': 4326
          }
        }
      }
    ]
  };

  var sampleExtentResponse = {
    'extent': {
      'xmin': -122.66,
      'ymin': 45.5,
      'xmax': -122.65,
      'ymax': 45.51
    }
  };

  var sampleCountResponse = {
    'count': 1
  };

  var sampleFeatureCollection = {
    'type': 'FeatureCollection',
    'features': [{
      'type': 'Feature',
      'geometry': {
        'type': 'Point',
        'coordinates': [-122.81, 45.48]
      },
      'properties': {
        'FID': 1,
        'Name': 'Site'
      },
      'id': 1
    }]
  };

  var sampleIdsResponse = {
    'objectIdFieldName' : 'FID',
    'objectIds' : [1, 2]
  };

  beforeEach(function(){
    server = sinon.fakeServer.create();
    task = L.esri.Tasks.query({url: featureLayerUrl});
  });

  afterEach(function(){
    server.restore();
  });

  it('should query features', function(done){

    server.respondWith('GET', featureLayerUrl + 'query?returnGeometry=true&where=1%3D1&outSr=4326&outFields=*&f=json', JSON.stringify(sampleQueryResponse));

    var request = task.run(function(error, featureCollection, raw){
      expect(featureCollection).to.deep.equal(sampleFeatureCollection);
      expect(raw).to.deep.equal(sampleQueryResponse);
      done();
    });

    expect(request).to.be.an.instanceof(XMLHttpRequest);

    server.respond();
  });

  it('should query features within bounds', function(done){
    server.respondWith('GET', featureLayerUrl + 'query?returnGeometry=true&where=1%3D1&outSr=4326&outFields=*&inSr=4326&geometry=%7B%22xmin%22%3A-122.66%2C%22ymin%22%3A45.5%2C%22xmax%22%3A-122.65%2C%22ymax%22%3A45.51%2C%22spatialReference%22%3A%7B%22wkid%22%3A4326%7D%7D&geometryType=esriGeometryEnvelope&spatialRel=esriSpatialRelContains&f=json', JSON.stringify(sampleQueryResponse));

    task.within(bounds).run(function(error, featureCollection, raw){
      expect(featureCollection).to.deep.equal(sampleFeatureCollection);
      expect(raw).to.deep.equal(sampleQueryResponse);
      done();
    });

    server.respond();
  });

  it('should query features within geojson geometry', function(done){
    server.respondWith('GET', featureLayerUrl + 'query?returnGeometry=true&where=1%3D1&outSr=4326&outFields=*&inSr=4326&geometry=%7B%22rings%22%3A%5B%5B%5B-97%2C39%5D%2C%5B-97%2C41%5D%2C%5B-94%2C41%5D%2C%5B-94%2C39%5D%2C%5B-97%2C39%5D%5D%5D%2C%22spatialReference%22%3A%7B%22wkid%22%3A4326%7D%7D&geometryType=esriGeometryPolygon&spatialRel=esriSpatialRelContains&f=json', JSON.stringify(sampleQueryResponse));

    task.within(rawGeoJsonPolygon).run(function(error, featureCollection, raw){
      expect(featureCollection).to.deep.equal(sampleFeatureCollection);
      expect(raw).to.deep.equal(sampleQueryResponse);
      done();
    });

    server.respond();
  });

  it('should query features within geojson feature', function(done){
    server.respondWith('GET', featureLayerUrl + 'query?returnGeometry=true&where=1%3D1&outSr=4326&outFields=*&inSr=4326&geometry=%7B%22rings%22%3A%5B%5B%5B-97%2C39%5D%2C%5B-97%2C41%5D%2C%5B-94%2C41%5D%2C%5B-94%2C39%5D%2C%5B-97%2C39%5D%5D%5D%2C%22spatialReference%22%3A%7B%22wkid%22%3A4326%7D%7D&geometryType=esriGeometryPolygon&spatialRel=esriSpatialRelContains&f=json', JSON.stringify(sampleQueryResponse));

    task.within(rawGeoJsonFeature).run(function(error, featureCollection, raw){
      expect(featureCollection).to.deep.equal(sampleFeatureCollection);
      expect(raw).to.deep.equal(sampleQueryResponse);
      done();
    });

    server.respond();
  });

  it('should query features within leaflet geojson object', function(done){
    server.respondWith('GET', featureLayerUrl + 'query?returnGeometry=true&where=1%3D1&outSr=4326&outFields=*&inSr=4326&geometry=%7B%22rings%22%3A%5B%5B%5B-97%2C39%5D%2C%5B-97%2C41%5D%2C%5B-94%2C41%5D%2C%5B-94%2C39%5D%2C%5B-97%2C39%5D%5D%5D%2C%22spatialReference%22%3A%7B%22wkid%22%3A4326%7D%7D&geometryType=esriGeometryPolygon&spatialRel=esriSpatialRelContains&f=json', JSON.stringify(sampleQueryResponse));

    task.within(geoJsonPolygon).run(function(error, featureCollection, raw){
      expect(featureCollection).to.deep.equal(sampleFeatureCollection);
      expect(raw).to.deep.equal(sampleQueryResponse);
      done();
    });

    server.respond();
  });

  it('should query features that intersect bounds', function(done){
    server.respondWith('GET', featureLayerUrl + 'query?returnGeometry=true&where=1%3D1&outSr=4326&outFields=*&inSr=4326&geometry=%7B%22xmin%22%3A-122.66%2C%22ymin%22%3A45.5%2C%22xmax%22%3A-122.65%2C%22ymax%22%3A45.51%2C%22spatialReference%22%3A%7B%22wkid%22%3A4326%7D%7D&geometryType=esriGeometryEnvelope&spatialRel=esriSpatialRelIntersects&f=json', JSON.stringify(sampleQueryResponse));

    task.intersects(bounds).run(function(error, featureCollection, raw){
      expect(featureCollection).to.deep.equal(sampleFeatureCollection);
      expect(raw).to.deep.equal(sampleQueryResponse);
      done();
    });

    server.respond();
  });

  it('should query features that intersect geojson geometry', function(done){
    server.respondWith('GET', featureLayerUrl + 'query?returnGeometry=true&where=1%3D1&outSr=4326&outFields=*&inSr=4326&geometry=%7B%22rings%22%3A%5B%5B%5B-97%2C39%5D%2C%5B-97%2C41%5D%2C%5B-94%2C41%5D%2C%5B-94%2C39%5D%2C%5B-97%2C39%5D%5D%5D%2C%22spatialReference%22%3A%7B%22wkid%22%3A4326%7D%7D&geometryType=esriGeometryPolygon&spatialRel=esriSpatialRelIntersects&f=json', JSON.stringify(sampleQueryResponse));

    task.intersects(rawGeoJsonPolygon).run(function(error, featureCollection, raw){
      expect(featureCollection).to.deep.equal(sampleFeatureCollection);
      expect(raw).to.deep.equal(sampleQueryResponse);
      done();
    });

    server.respond();
  });

  it('should query features that intersect geojson feature', function(done){
    server.respondWith('GET', featureLayerUrl + 'query?returnGeometry=true&where=1%3D1&outSr=4326&outFields=*&inSr=4326&geometry=%7B%22rings%22%3A%5B%5B%5B-97%2C39%5D%2C%5B-97%2C41%5D%2C%5B-94%2C41%5D%2C%5B-94%2C39%5D%2C%5B-97%2C39%5D%5D%5D%2C%22spatialReference%22%3A%7B%22wkid%22%3A4326%7D%7D&geometryType=esriGeometryPolygon&spatialRel=esriSpatialRelIntersects&f=json', JSON.stringify(sampleQueryResponse));

    task.intersects(rawGeoJsonFeature).run(function(error, featureCollection, raw){
      expect(featureCollection).to.deep.equal(sampleFeatureCollection);
      expect(raw).to.deep.equal(sampleQueryResponse);
      done();
    });

    server.respond();
  });

  it('should query features that intersect leaflet geojson object', function(done){
    server.respondWith('GET', featureLayerUrl + 'query?returnGeometry=true&where=1%3D1&outSr=4326&outFields=*&inSr=4326&geometry=%7B%22rings%22%3A%5B%5B%5B-97%2C39%5D%2C%5B-97%2C41%5D%2C%5B-94%2C41%5D%2C%5B-94%2C39%5D%2C%5B-97%2C39%5D%5D%5D%2C%22spatialReference%22%3A%7B%22wkid%22%3A4326%7D%7D&geometryType=esriGeometryPolygon&spatialRel=esriSpatialRelIntersects&f=json', JSON.stringify(sampleQueryResponse));

    task.intersects(geoJsonPolygon).run(function(error, featureCollection, raw){
      expect(featureCollection).to.deep.equal(sampleFeatureCollection);
      expect(raw).to.deep.equal(sampleQueryResponse);
      done();
    });

    server.respond();
  });

  it('should query features that contain bounds', function(done){
    server.respondWith('GET', featureLayerUrl + 'query?returnGeometry=true&where=1%3D1&outSr=4326&outFields=*&inSr=4326&geometry=%7B%22xmin%22%3A-122.66%2C%22ymin%22%3A45.5%2C%22xmax%22%3A-122.65%2C%22ymax%22%3A45.51%2C%22spatialReference%22%3A%7B%22wkid%22%3A4326%7D%7D&geometryType=esriGeometryEnvelope&spatialRel=esriSpatialRelWithin&f=json', JSON.stringify(sampleQueryResponse));

    task.contains(bounds).run(function(error, featureCollection, raw){
      expect(featureCollection).to.deep.equal(sampleFeatureCollection);
      expect(raw).to.deep.equal(sampleQueryResponse);
      done();
    });

    server.respond();
  });

  it('should query features that contain geojson geometry', function(done){
    server.respondWith('GET', featureLayerUrl + 'query?returnGeometry=true&where=1%3D1&outSr=4326&outFields=*&inSr=4326&geometry=%7B%22rings%22%3A%5B%5B%5B-97%2C39%5D%2C%5B-97%2C41%5D%2C%5B-94%2C41%5D%2C%5B-94%2C39%5D%2C%5B-97%2C39%5D%5D%5D%2C%22spatialReference%22%3A%7B%22wkid%22%3A4326%7D%7D&geometryType=esriGeometryPolygon&spatialRel=esriSpatialRelWithin&f=json', JSON.stringify(sampleQueryResponse));

    task.contains(rawGeoJsonPolygon).run(function(error, featureCollection, raw){
      expect(featureCollection).to.deep.equal(sampleFeatureCollection);
      expect(raw).to.deep.equal(sampleQueryResponse);
      done();
    });

    server.respond();
  });

  it('should query features that contain geojson feature', function(done){
    server.respondWith('GET', featureLayerUrl + 'query?returnGeometry=true&where=1%3D1&outSr=4326&outFields=*&inSr=4326&geometry=%7B%22rings%22%3A%5B%5B%5B-97%2C39%5D%2C%5B-97%2C41%5D%2C%5B-94%2C41%5D%2C%5B-94%2C39%5D%2C%5B-97%2C39%5D%5D%5D%2C%22spatialReference%22%3A%7B%22wkid%22%3A4326%7D%7D&geometryType=esriGeometryPolygon&spatialRel=esriSpatialRelWithin&f=json', JSON.stringify(sampleQueryResponse));

    task.contains(rawGeoJsonFeature).run(function(error, featureCollection, raw){
      expect(featureCollection).to.deep.equal(sampleFeatureCollection);
      expect(raw).to.deep.equal(sampleQueryResponse);
      done();
    });

    server.respond();
  });

  it('should query features that contain leaflet geojson object', function(done){
    //                                           query?returnGeometry=true&where=1%3D1&outSr=4326&outFields=*&inSr=4326&geometry=%7B%22rings%22%3A%5B%5B%5B-97%2C39%5D%2C%5B-97%2C41%5D%2C%5B-94%2C41%5D%2C%5B-94%2C39%5D%2C%5B-97%2C39%5D%5D%5D%2C%22spatialReference%22%3A%7B%22wkid%22%3A4326%7D%7D&geometryType=esriGeometryPolygon&spatialRel=esriSpatialRelWithin&f=json
    server.respondWith('GET', featureLayerUrl + 'query?returnGeometry=true&where=1%3D1&outSr=4326&outFields=*&inSr=4326&geometry=%7B%22rings%22%3A%5B%5B%5B-97%2C39%5D%2C%5B-97%2C41%5D%2C%5B-94%2C41%5D%2C%5B-94%2C39%5D%2C%5B-97%2C39%5D%5D%5D%2C%22spatialReference%22%3A%7B%22wkid%22%3A4326%7D%7D&geometryType=esriGeometryPolygon&spatialRel=esriSpatialRelWithin&f=json', JSON.stringify(sampleQueryResponse));

    task.contains(geoJsonPolygon).run(function(error, featureCollection, raw){
      expect(featureCollection).to.deep.equal(sampleFeatureCollection);
      expect(raw).to.deep.equal(sampleQueryResponse);
      done();
    });

    server.respond();
  });

  it('should query features that overlap bounds', function(done){
    server.respondWith('GET', featureLayerUrl + 'query?returnGeometry=true&where=1%3D1&outSr=4326&outFields=*&inSr=4326&geometry=%7B%22xmin%22%3A-122.66%2C%22ymin%22%3A45.5%2C%22xmax%22%3A-122.65%2C%22ymax%22%3A45.51%2C%22spatialReference%22%3A%7B%22wkid%22%3A4326%7D%7D&geometryType=esriGeometryEnvelope&spatialRel=esriSpatialRelOverlaps&f=json', JSON.stringify(sampleQueryResponse));

    task.overlaps(bounds).run(function(error, featureCollection, raw){
      expect(featureCollection).to.deep.equal(sampleFeatureCollection);
      expect(raw).to.deep.equal(sampleQueryResponse);
      done();
    });

    server.respond();
  });

  it('should query features that overlap geojson geometry', function(done){
    server.respondWith('GET', featureLayerUrl + 'query?returnGeometry=true&where=1%3D1&outSr=4326&outFields=*&inSr=4326&geometry=%7B%22rings%22%3A%5B%5B%5B-97%2C39%5D%2C%5B-97%2C41%5D%2C%5B-94%2C41%5D%2C%5B-94%2C39%5D%2C%5B-97%2C39%5D%5D%5D%2C%22spatialReference%22%3A%7B%22wkid%22%3A4326%7D%7D&geometryType=esriGeometryPolygon&spatialRel=esriSpatialRelOverlaps&f=json', JSON.stringify(sampleQueryResponse));

    task.overlaps(rawGeoJsonPolygon).run(function(error, featureCollection, raw){
      expect(featureCollection).to.deep.equal(sampleFeatureCollection);
      expect(raw).to.deep.equal(sampleQueryResponse);
      done();
    });

    server.respond();
  });

  it('should query features that overlap geojson feature', function(done){
    server.respondWith('GET', featureLayerUrl + 'query?returnGeometry=true&where=1%3D1&outSr=4326&outFields=*&inSr=4326&geometry=%7B%22rings%22%3A%5B%5B%5B-97%2C39%5D%2C%5B-97%2C41%5D%2C%5B-94%2C41%5D%2C%5B-94%2C39%5D%2C%5B-97%2C39%5D%5D%5D%2C%22spatialReference%22%3A%7B%22wkid%22%3A4326%7D%7D&geometryType=esriGeometryPolygon&spatialRel=esriSpatialRelOverlaps&f=json', JSON.stringify(sampleQueryResponse));

    task.overlaps(rawGeoJsonFeature).run(function(error, featureCollection, raw){
      expect(featureCollection).to.deep.equal(sampleFeatureCollection);
      expect(raw).to.deep.equal(sampleQueryResponse);
      done();
    });

    server.respond();
  });

  it('should query features that overlap leaflet geojson object', function(done){
    server.respondWith('GET', featureLayerUrl + 'query?returnGeometry=true&where=1%3D1&outSr=4326&outFields=*&inSr=4326&geometry=%7B%22rings%22%3A%5B%5B%5B-97%2C39%5D%2C%5B-97%2C41%5D%2C%5B-94%2C41%5D%2C%5B-94%2C39%5D%2C%5B-97%2C39%5D%5D%5D%2C%22spatialReference%22%3A%7B%22wkid%22%3A4326%7D%7D&geometryType=esriGeometryPolygon&spatialRel=esriSpatialRelOverlaps&f=json', JSON.stringify(sampleQueryResponse));

    task.overlaps(geoJsonPolygon).run(function(error, featureCollection, raw){
      expect(featureCollection).to.deep.equal(sampleFeatureCollection);
      expect(raw).to.deep.equal(sampleQueryResponse);
      done();
    });

    server.respond();
  });

  it('should query features near a latlng', function(done){
    server.respondWith('GET', featureLayerUrl + 'query?returnGeometry=true&where=1%3D1&outSr=4326&outFields=*&geometry=-122.66%2C45.51&geometryType=esriGeometryPoint&spatialRel=esriSpatialRelIntersects&units=esriSRUnit_Meter&distance=500&inSr=4326&f=json', JSON.stringify(sampleQueryResponse));

    task.nearby(latlng, 500).run(function(error, featureCollection, raw){
      expect(featureCollection).to.deep.equal(sampleFeatureCollection);
      expect(raw).to.deep.equal(sampleQueryResponse);
      done();
    });

    server.respond();
  });

  it('should query features with a where option', function(done){
    server.respondWith('GET', featureLayerUrl + 'query?returnGeometry=true&where=NAME%3D\'Site\'&outSr=4326&outFields=*&f=json', JSON.stringify(sampleQueryResponse));

    task.where('NAME="Site"').run(function(error, featureCollection, raw){
      expect(featureCollection).to.deep.equal(sampleFeatureCollection);
      expect(raw).to.deep.equal(sampleQueryResponse);
      done();
    });

    server.respond();
  });

  it('should limit queries for pagination', function(done){
    server.respondWith('GET', featureLayerUrl + 'query?returnGeometry=true&where=1%3D1&outSr=4326&outFields=*&limit=10&f=json', JSON.stringify(sampleQueryResponse));

    task.limit(10).run(function(error, featureCollection, raw){
      expect(featureCollection).to.deep.equal(sampleFeatureCollection);
      expect(raw).to.deep.equal(sampleQueryResponse);
      done();
    });

    server.respond();
  });

  it('should offset queries for pagination', function(done){
    server.respondWith('GET', featureLayerUrl + 'query?returnGeometry=true&where=1%3D1&outSr=4326&outFields=*&offset=10&f=json', JSON.stringify(sampleQueryResponse));

    task.offset(10).run(function(error, featureCollection, raw){
      expect(featureCollection).to.deep.equal(sampleFeatureCollection);
      expect(raw).to.deep.equal(sampleQueryResponse);
      done();
    });

    server.respond();
  });

  it('should query features in a given time range', function(done){
    server.respondWith('GET', featureLayerUrl + 'query?returnGeometry=true&where=1%3D1&outSr=4326&outFields=*&time=1357027200000%2C1388563200000&f=json', JSON.stringify(sampleQueryResponse));

    var start = new Date('January 1 2013 GMT-0800');
    var end = new Date('January 1 2014 GMT-0800');

    task.between(start, end).run(function(error, featureCollection, raw){
      expect(featureCollection).to.deep.equal(sampleFeatureCollection);
      expect(raw).to.deep.equal(sampleQueryResponse);
      done();
    });

    server.respond();
  });

  it('should set output fields for queries', function(done){
    server.respondWith('GET', featureLayerUrl + 'query?returnGeometry=true&where=1%3D1&outSr=4326&outFields=Name%2CFID&f=json', JSON.stringify(sampleQueryResponse));

    task.fields(['Name', 'FID']).run(function(error, featureCollection, raw){
      expect(featureCollection).to.deep.equal(sampleFeatureCollection);
      expect(raw).to.deep.equal(sampleQueryResponse);
      done();
    });

    server.respond();
  });

  it('should limit geometry percision', function(done){
    server.respondWith('GET', featureLayerUrl + 'query?returnGeometry=true&where=1%3D1&outSr=4326&outFields=*&geometryPrecision=4&f=json', JSON.stringify(sampleQueryResponse));

    task.precision(4).run(function(error, featureCollection, raw){
      expect(featureCollection).to.deep.equal(sampleFeatureCollection);
      expect(raw).to.deep.equal(sampleQueryResponse);
      done();
    });

    server.respond();
  });

  it('should identify features and simplify geometries', function(done){
    server.respondWith('GET', featureLayerUrl + 'query?returnGeometry=true&where=1%3D1&outSr=4326&outFields=*&maxAllowableOffset=0.000010728836059556101&f=json', JSON.stringify(sampleQueryResponse));

    task.simplify(map, 0.5).run(function(error, featureCollection, raw){
      expect(featureCollection).to.deep.equal(sampleFeatureCollection);
      expect(raw).to.deep.equal(sampleQueryResponse);
      done();
    });

    server.respond();
  });

  it('should order query output ascending', function(done){
    server.respondWith('GET', featureLayerUrl + 'query?returnGeometry=true&where=1%3D1&outSr=4326&outFields=*&orderByFields=Name%20ASC&f=json', JSON.stringify(sampleQueryResponse));

    task.orderBy('Name').run(function(error, featureCollection, raw){
      expect(featureCollection).to.deep.equal(sampleFeatureCollection);
      expect(raw).to.deep.equal(sampleQueryResponse);
      done();
    });

    server.respond();
  });

  it('should order query output descending', function(done){
    server.respondWith('GET', featureLayerUrl + 'query?returnGeometry=true&where=1%3D1&outSr=4326&outFields=*&orderByFields=Name%20DESC&f=json', JSON.stringify(sampleQueryResponse));

    task.orderBy('Name', 'DESC').run(function(error, featureCollection, raw){
      expect(featureCollection).to.deep.equal(sampleFeatureCollection);
      expect(raw).to.deep.equal(sampleQueryResponse);
      done();
    });

    server.respond();
  });

  it('should order query output with multiple features', function(done){
    server.respondWith('GET', featureLayerUrl + 'query?returnGeometry=true&where=1%3D1&outSr=4326&outFields=*&orderByFields=Name%20DESC%2CScore%20ASC&f=json', JSON.stringify(sampleQueryResponse));

    task.orderBy('Name', 'DESC').orderBy('Score', 'ASC').run(function(error, featureCollection, raw){
      expect(featureCollection).to.deep.equal(sampleFeatureCollection);
      expect(raw).to.deep.equal(sampleQueryResponse);
      done();
    });

    server.respond();
  });

  it('should be able to query specific feature ids', function(done){
    server.respondWith('GET', featureLayerUrl + 'query?returnGeometry=true&where=1%3D1&outSr=4326&outFields=*&objectIds=1%2C2&f=json', JSON.stringify(sampleQueryResponse));

    task.featureIds([1,2]).run(function(error, featureCollection, raw){
      expect(featureCollection).to.deep.equal(sampleFeatureCollection);
      expect(raw).to.deep.equal(sampleQueryResponse);
      done();
    });

    server.respond();
  });

  it('should be able to query token', function(done){
    server.respondWith('GET', featureLayerUrl + 'query?returnGeometry=true&where=1%3D1&outSr=4326&outFields=*&token=foo&f=json', JSON.stringify(sampleQueryResponse));

    task.token('foo').run(function(error, featureCollection, raw){
      expect(featureCollection).to.deep.equal(sampleFeatureCollection);
      expect(raw).to.deep.equal(sampleQueryResponse);
      done();
    });

    server.respond();
  });

  it('should query bounds', function(done){
    server.respondWith('GET', featureLayerUrl + 'query?returnGeometry=true&where=1%3D1&outSr=4326&outFields=*&returnExtentOnly=true&f=json', JSON.stringify(sampleExtentResponse));

    var request = task.bounds(function(error, latlngbounds, raw){
      expect(latlngbounds).to.deep.equal(bounds);
      expect(raw).to.deep.equal(sampleExtentResponse);
      done();
    });

    expect(request).to.be.an.instanceof(XMLHttpRequest);

    server.respond();
  });

  it('should query count', function(done){
    server.respondWith('GET', featureLayerUrl + 'query?returnGeometry=true&where=1%3D1&outSr=4326&outFields=*&returnCountOnly=true&f=json', JSON.stringify(sampleCountResponse));

    var request = task.count(function(error, count, raw){
      expect(count).to.equal(1);
      expect(raw).to.deep.equal(sampleCountResponse);
      done();
    });

    expect(request).to.be.an.instanceof(XMLHttpRequest);

    server.respond();
  });

  it('should query ids', function(done){
    server.respondWith('GET', featureLayerUrl + 'query?returnGeometry=true&where=1%3D1&outSr=4326&outFields=*&returnIdsOnly=true&f=json', JSON.stringify(sampleIdsResponse));

    var request = task.ids(function(error, ids, raw){
      expect(ids).to.deep.equal([1,2]);
      expect(raw).to.deep.equal(sampleIdsResponse);
      done();
    });

    expect(request).to.be.an.instanceof(XMLHttpRequest);

    server.respond();
  });

  it('should use a feature layer service to query features', function(done){
    server.respondWith('GET', featureLayerUrl + 'query?returnGeometry=true&where=1%3D1&outSr=4326&outFields=*&f=json', JSON.stringify(sampleQueryResponse));

    var service = new L.esri.Services.FeatureLayer({url: featureLayerUrl});

    var request = service.query().run(function(error, featureCollection, raw){
      expect(featureCollection).to.deep.equal(sampleFeatureCollection);
      expect(raw).to.deep.equal(sampleQueryResponse);
      done();
    });

    expect(request).to.be.an.instanceof(XMLHttpRequest);

    server.respond();
  });

  it('should use a map service to query features', function(done){
    server.respondWith('GET', mapServiceUrl + '0/query?returnGeometry=true&where=1%3D1&outSr=4326&outFields=*&f=json', JSON.stringify(sampleMapServiceQueryResponse));

    var service = new L.esri.Services.MapService({url: mapServiceUrl});

    service.query().layer(0).run(function(error, featureCollection, raw){
      expect(featureCollection).to.deep.equal(sampleMapServiceCollection);
      expect(raw).to.deep.equal(sampleMapServiceQueryResponse);
      done();
    });

    server.respond();
  });

  it('should use a image service to query features', function(done){
    server.respondWith('GET', imageServiceUrl + 'query?returnGeometry=true&where=1%3D1&outSr=4326&outFields=*&pixelSize=1%2C1&f=json', JSON.stringify(sampleImageServiceQueryResponse));

    var service = new L.esri.Services.MapService({url: imageServiceUrl});

    var request = service.query().pixelSize([1, 1]).run(function(error, featureCollection, raw){
      expect(featureCollection).to.deep.equal(sampleImageServiceCollection);
      expect(raw).to.deep.equal(sampleImageServiceQueryResponse);
      done();
    });

    expect(request).to.be.an.instanceof(XMLHttpRequest);

    server.respond();
  });

  it('should make GET queries with no service', function(done){
    server.respondWith('GET', mapServiceUrl + '0/query?returnGeometry=true&where=1%3D1&outSr=4326&outFields=*&f=json', JSON.stringify(sampleMapServiceQueryResponse));

    var queryTask = new L.esri.Tasks.Query({url: mapServiceUrl + '0'});

    var request = queryTask.where("1=1").run(function(error, featureCollection, raw){
      expect(featureCollection).to.deep.equal(sampleMapServiceCollection);
      expect(raw).to.deep.equal(sampleMapServiceQueryResponse);
      done();
    });

    server.respond();
  });

  it('query tasks without services should make GET requests w/ JSONP', function(done){
    var queryTask = new L.esri.Tasks.Query({url: mapServiceUrl + '0'});
    queryTask.options.useCors = false;

    var request = queryTask.where("1=1").run(function(error, featureCollection, raw){
      expect(featureCollection).to.deep.equal(sampleMapServiceCollection);
      expect(raw).to.deep.equal(sampleMapServiceQueryResponse);
      done();
    });

    window._EsriLeafletCallbacks[request.id](sampleMapServiceQueryResponse);
  });

  it('query tasks without services should make POST requests', function(done){
    server.respondWith('POST', mapServiceUrl + '0/query', JSON.stringify(sampleMapServiceQueryResponse));
    var queryTask = new L.esri.Tasks.Query({url: mapServiceUrl + '0'});
    var request = queryTask.where(
      "this is a dumb way to make sure the request is more than 2000 characters" +
      "this is a dumb way to make sure the request is more than 2000 characters" +
      "this is a dumb way to make sure the request is more than 2000 characters" +
      "this is a dumb way to make sure the request is more than 2000 characters" +
      "this is a dumb way to make sure the request is more than 2000 characters" +
      "this is a dumb way to make sure the request is more than 2000 characters" +
      "this is a dumb way to make sure the request is more than 2000 characters" +
      "this is a dumb way to make sure the request is more than 2000 characters" +
      "this is a dumb way to make sure the request is more than 2000 characters" +
      "this is a dumb way to make sure the request is more than 2000 characters" +
      "this is a dumb way to make sure the request is more than 2000 characters" +
      "this is a dumb way to make sure the request is more than 2000 characters" +
      "this is a dumb way to make sure the request is more than 2000 characters" +
      "this is a dumb way to make sure the request is more than 2000 characters" +
      "this is a dumb way to make sure the request is more than 2000 characters" +
      "this is a dumb way to make sure the request is more than 2000 characters" +
      "this is a dumb way to make sure the request is more than 2000 characters" +
      "this is a dumb way to make sure the request is more than 2000 characters" +
      "this is a dumb way to make sure the request is more than 2000 characters" +
      "this is a dumb way to make sure the request is more than 2000 characters" +
      "this is a dumb way to make sure the request is more than 2000 characters" +
      "this is a dumb way to make sure the request is more than 2000 characters" +
      "this is a dumb way to make sure the request is more than 2000 characters" +
      "this is a dumb way to make sure the request is more than 2000 characters" +
      "this is a dumb way to make sure the request is more than 2000 characters" +
      "this is a dumb way to make sure the request is more than 2000 characters").
      run(function(error, featureCollection, raw){
        expect(featureCollection).to.deep.equal(sampleMapServiceCollection);
        expect(raw).to.deep.equal(sampleMapServiceQueryResponse);
        done();
    });

    server.respond();
  });

  it('should query GeoJSON from ArcGIS Online', function(done){
    task = L.esri.Tasks.query({url: 'http://services.arcgis.com/mock/arcgis/rest/services/MockFeatureService/FeatureServer/0/'});

    server.respondWith('GET', 'http://services.arcgis.com/mock/arcgis/rest/services/MockFeatureService/FeatureServer/0/query?returnGeometry=true&where=1%3D1&outSr=4326&outFields=*&f=geojson', JSON.stringify(sampleFeatureCollection));

    var request = task.run(function(error, featureCollection, raw){
      expect(featureCollection).to.deep.equal(sampleFeatureCollection);
      expect(raw).to.deep.equal(sampleFeatureCollection);
      done();
    });

    expect(request).to.be.an.instanceof(XMLHttpRequest);

    server.respond();
  });

});