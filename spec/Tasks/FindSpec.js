describe('L.esri.Tasks.Find', function () {
  var server;
  var task;

  // create map
  var url = 'http://services.arcgis.com/mock/arcgis/rest/services/MockMapService/MapServer/';

  var sampleResponse = {
    'results': [
      {
        'layerId': 0,
        'layerName': 'Features',
        'displayFieldName': 'Name',
        'value': '0',
        'attributes': {
          'OBJECTID': 1,
          'Name': 'Site'
        },
        'geometryType': 'esriGeometryPoint',
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

  var sampleResponseWithSearchFields = {
    'results': [
      {
        'layerId': 0,
        'layerName': 'Features',
        'displayFieldName': 'Name',
        'foundFieldName': 'Field',
        'value': '0',
        'attributes': {
          'OBJECTID': 1,
          'Name': 'Site'
        },
        'geometryType': 'esriGeometryPoint',
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

  var sampleResponseWithoutGeometry = {
    'results': [
      {
        'layerId': 0,
        'layerName': 'Features',
        'displayFieldName': 'Name',
        'value': '0',
        'attributes': {
          'OBJECTID': 1,
          'Name': 'Site'
        }
      }
    ]
  };

  var sampleFeatureCollectionWithoutGeometry = {
    'type': 'FeatureCollection',
    'features': [{
      'type': 'Feature',
      'properties': {
        'OBJECTID': 1,
        'Name': 'Site'
      },
      'id': 1
    }]
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
        'OBJECTID': 1,
        'Name': 'Site'
      },
      'id': 1
    }]
  };

  beforeEach(function(){
    server = sinon.fakeServer.create();
    task = L.esri.Tasks.find(url);
  });

  afterEach(function(){
    server.restore();
  });

  it('should find features with provided layer id and searchText', function(done){
    server.respondWith('GET', url + 'find?sr=4326&contains=true&returnGeometry=true&returnZ=true&returnM=false&layers=0&searchText=Site&f=json', JSON.stringify(sampleResponse));

    task.layers('0').searchText('Site').run(function(error, featureCollection, raw){
      expect(featureCollection).to.deep.equal(sampleFeatureCollection);
      expect(raw).to.deep.equal(sampleResponse);
      done();
    });

    server.respond();
  });

  it('should find features by specified search field', function(done){
    server.respondWith('GET', url + 'find?sr=4326&contains=true&returnGeometry=true&returnZ=true&returnM=false&layers=0&searchText=Site&searchField=Field&f=json', JSON.stringify(sampleResponseWithSearchFields));

    task.searchFields('Field').run(function(error, featureCollection, raw){
      expect(featureCollection).to.deep.equal(sampleFeatureCollection);
      expect(raw).to.deep.equal(sampleResponseWithSearchFields);
      done();
    });

    server.respond();
  });

  it('should find an exact match for the searchText', function(done){
    server.respondWith('GET', url + 'find?sr=4326&contains=false&returnGeometry=true&returnZ=true&returnM=false&layers=0&searchText=Site&f=json', JSON.stringify(sampleResponse));

    task.searchText('Site').contains(false).run(function(error, featureCollection, raw){
      expect(featureCollection).to.deep.equal(sampleFeatureCollection);
      expect(raw).to.deep.equal(sampleResponse);
      done();
    });

    server.respond();
  });

  it('should find features and limit geometries to a given precision', function(done){
    server.respondWith('GET', url + 'find?sr=4326&contains=true&returnGeometry=true&returnZ=true&returnM=false&layers=0&searchText=Site&geometryPrecision=4&f=json', JSON.stringify(sampleResponse));

    task.precision(4).run(function(error, featureCollection, raw){
      expect(featureCollection).to.deep.equal(sampleFeatureCollection);
      expect(raw).to.deep.equal(sampleResponse);
      done();
    });

    server.respond();
  });

  it('should find features without geometry', function(done){
    server.respondWith('GET', url + 'find?sr=4326&contains=true&returnGeometry=false&returnZ=true&returnM=false&layers=0&searchText=Site&f=json', JSON.stringify(sampleResponse));

    task.geometry(false).run(function(error, featureCollection, raw){
      expect(featureCollection).to.deep.equal(sampleFeatureCollectionWithoutGeometry);
      expect(raw).to.deep.equal(sampleResponseWithoutGeometry);
      done();
    });

    server.respond();
  });

  it('should identify features with a token', function(done){
    server.respondWith('GET', url + 'find?sr=4326&contains=true&returnGeometry=true&returnZ=true&returnM=false&layers=0&searchText=Site&token=foo&f=json', JSON.stringify(sampleResponse));

    task.token('foo').run(function(error, featureCollection, raw){
      expect(featureCollection).to.deep.equal(sampleFeatureCollection);
      expect(raw).to.deep.equal(sampleResponse);
      done();
    });

    server.respond();
  });

  it('should use a service to execute the find task', function(done){
    var service = L.esri.Services.mapService(url);

    server.respondWith('GET', url + 'find?sr=4326&contains=true&returnGeometry=true&returnZ=true&returnM=false&layers=0&searchText=Site&f=json', JSON.stringify(sampleResponse));

    service.find().layers('0').searchText('Site').run(function(error, featureCollection, raw){
      expect(featureCollection).to.deep.equal(sampleFeatureCollection);
      expect(raw).to.deep.equal(sampleResponse);
      done();
    });

    server.respond();
  });
});