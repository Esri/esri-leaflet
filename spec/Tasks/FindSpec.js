describe('L.esri.Tasks.Find', function () {
  var server;
  var task;

  // create map
  var mapServiceUrl = 'http://services.arcgis.com/mock/arcgis/rest/services/MockMapService/MapServer/';

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
      'geometry': null,
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
    task = L.esri.Tasks.find({url: mapServiceUrl});
  });

  afterEach(function(){
    server.restore();
  });

  it('should find features with provided layer id and search text', function(done){
    server.respondWith('GET', mapServiceUrl + 'find?sr=4326&contains=true&returnGeometry=true&returnZ=true&returnM=false&layers=0&searchText=Site&f=json', JSON.stringify(sampleResponse));

    var request = task.layers('0').text('Site').run(function(error, featureCollection, raw){
      expect(featureCollection).to.deep.equal(sampleFeatureCollection);
      expect(raw).to.deep.equal(sampleResponse);
      done();
    });

    expect(request).to.be.an.instanceof(XMLHttpRequest);

    server.respond();
  });

  it('should find features by specified search field', function(done){
    server.respondWith('GET', mapServiceUrl + 'find?sr=4326&contains=true&returnGeometry=true&returnZ=true&returnM=false&layers=0&searchText=Site&searchFields=Field&f=json', JSON.stringify(sampleResponseWithSearchFields));

    task.layers('0').text('Site').fields('Field').run(function(error, featureCollection, raw){
      expect(featureCollection).to.deep.equal(sampleFeatureCollection);
      expect(raw).to.deep.equal(sampleResponseWithSearchFields);
      done();
    });

    server.respond();
  });

  it('should find an exact match for the search text', function(done){
    server.respondWith('GET', mapServiceUrl + 'find?sr=4326&contains=false&returnGeometry=true&returnZ=true&returnM=false&layers=0&searchText=Site&f=json', JSON.stringify(sampleResponse));

    task.layers('0').text('Site').contains(false).run(function(error, featureCollection, raw){
      expect(featureCollection).to.deep.equal(sampleFeatureCollection);
      expect(raw).to.deep.equal(sampleResponse);
      done();
    });

    server.respond();
  });

  it('should find features and limit geometries to a given precision', function(done){
    server.respondWith('GET', mapServiceUrl + 'find?sr=4326&contains=true&returnGeometry=true&returnZ=true&returnM=false&layers=0&searchText=Site&geometryPrecision=4&f=json', JSON.stringify(sampleResponse));

    task.layers('0').text('Site').precision(4).run(function(error, featureCollection, raw){
      expect(featureCollection).to.deep.equal(sampleFeatureCollection);
      expect(raw).to.deep.equal(sampleResponse);
      done();
    });

    server.respond();
  });

  it('should find features without geometry', function(done){
    server.respondWith('GET', mapServiceUrl + 'find?sr=4326&contains=true&returnGeometry=false&returnZ=true&returnM=false&layers=0&searchText=Site&f=json', JSON.stringify(sampleResponseWithoutGeometry));

    task.layers('0').text('Site').returnGeometry(false).run(function(error, featureCollection, raw){
      expect(featureCollection).to.deep.equal(sampleFeatureCollectionWithoutGeometry);
      expect(raw).to.deep.equal(sampleResponseWithoutGeometry);
      done();
    });

    server.respond();
  });

  it('should identify features with a token', function(done){
    server.respondWith('GET', mapServiceUrl + 'find?sr=4326&contains=true&returnGeometry=true&returnZ=true&returnM=false&layers=0&searchText=Site&token=foo&f=json', JSON.stringify(sampleResponse));

    task.layers('0').text('Site').token('foo').run(function(error, featureCollection, raw){
      expect(featureCollection).to.deep.equal(sampleFeatureCollection);
      expect(raw).to.deep.equal(sampleResponse);
      done();
    });

    server.respond();
  });

  it('should use a service to execute the find task', function(done){
    var service = L.esri.Services.mapService({url: mapServiceUrl});

    server.respondWith('GET', mapServiceUrl + 'find?sr=4326&contains=true&returnGeometry=true&returnZ=true&returnM=false&layers=0&searchText=Site&f=json', JSON.stringify(sampleResponse));

    var request = service.find().layers('0').text('Site').run(function(error, featureCollection, raw){
      expect(featureCollection).to.deep.equal(sampleFeatureCollection);
      expect(raw).to.deep.equal(sampleResponse);
      done();
    });

    expect(request).to.be.an.instanceof(XMLHttpRequest);

    server.respond();
  });

  it('should use JSONP to execute without a service', function(done){
    var myTask = L.esri.Tasks.find({
      url: mapServiceUrl,
      useCors: false
    });

    var request = myTask.layers('0').text('Site').run(function(error, featureCollection, raw){
      expect(featureCollection).to.deep.equal(sampleFeatureCollection);
      expect(raw).to.deep.equal(sampleResponse);
      done();
    });

    window._EsriLeafletCallbacks[request.id](sampleResponse);
  });
});