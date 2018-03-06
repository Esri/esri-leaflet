/* eslint-env mocha */
/* eslint-disable handle-callback-err */
describe('L.esri.Find', function () {
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

  beforeEach(function () {
    task = L.esri.find({url: mapServiceUrl});
  });

  afterEach(function () {
    fetchMock.restore();
  });

  it('should find features with provided layer id and search text', function (done) {
    fetchMock.getOnce(
      mapServiceUrl + 'find?f=json&sr=4326&contains=true&returnGeometry=true&returnZ=true&returnM=false&layers=0&searchText=Site',
      JSON.stringify(sampleResponse)
    );
    task.layers('0').text('Site').run(function (error, featureCollection, raw) {
      expect(featureCollection).to.deep.equal(sampleFeatureCollection);
      expect(raw).to.deep.equal(sampleResponse);
      done();
    }, this);
    // Test for Promise ?
    // expect(this.request).to.be.an.instanceof(XMLHttpRequest);
  });

  it('should find features by specified search field', function (done) {
    fetchMock.getOnce(
      mapServiceUrl + 'find?f=json&sr=4326&contains=true&returnGeometry=true&returnZ=true&returnM=false&layers=0&searchText=Site&searchFields=Field',
      JSON.stringify(sampleResponseWithSearchFields)
    );

    task.layers('0').text('Site').fields('Field').run(function (error, featureCollection, raw) {
      expect(featureCollection).to.deep.equal(sampleFeatureCollection);
      expect(raw).to.deep.equal(sampleResponseWithSearchFields);
      done();
    });
  });

  it('should find an exact match for the search text', function (done) {
    fetchMock.getOnce(
      mapServiceUrl + 'find?f=json&sr=4326&contains=false&returnGeometry=true&returnZ=true&returnM=false&layers=0&searchText=Site',
      JSON.stringify(sampleResponse)
    );

    task.layers('0').text('Site').contains(false).run(function (error, featureCollection, raw) {
      expect(featureCollection).to.deep.equal(sampleFeatureCollection);
      expect(raw).to.deep.equal(sampleResponse);
      done();
    });
  });

  it('should fetch unformatted results from 10.5+', function (done) {
    fetchMock.getOnce(
      mapServiceUrl + 'find?f=json&sr=4326&contains=true&returnGeometry=true&returnZ=true&returnM=false&layers=0&searchText=Site&returnUnformattedValues=true',
      JSON.stringify(sampleResponse)
    );

    task.layers('0').text('Site').format(false).run(function (error, featureCollection, raw) {
      expect(featureCollection).to.deep.equal(sampleFeatureCollection);
      expect(raw).to.deep.equal(sampleResponse);
      done();
    });
  });

  it('should find features and limit geometries to a given precision', function (done) {
    fetchMock.getOnce(
      mapServiceUrl + 'find?f=json&sr=4326&contains=true&returnGeometry=true&returnZ=true&returnM=false&layers=0&searchText=Site&geometryPrecision=4',
      JSON.stringify(sampleResponse)
    );

    task.layers('0').text('Site').precision(4).run(function (error, featureCollection, raw) {
      expect(featureCollection).to.deep.equal(sampleFeatureCollection);
      expect(raw).to.deep.equal(sampleResponse);
      done();
    });
  });

  it('should find features without geometry', function (done) {
    fetchMock.getOnce(
      mapServiceUrl + 'find?f=json&sr=4326&contains=true&returnGeometry=false&returnZ=true&returnM=false&layers=0&searchText=Site',
      JSON.stringify(sampleResponseWithoutGeometry)
    );
    task.layers('0').text('Site').returnGeometry(false).run(function (error, featureCollection, raw) {
      expect(featureCollection).to.deep.equal(sampleFeatureCollectionWithoutGeometry);
      expect(raw).to.deep.equal(sampleResponseWithoutGeometry);
      done();
    });
  });

  it('should identify features with a token', function (done) {
    fetchMock.getOnce(
      mapServiceUrl + 'find?f=json&sr=4326&contains=true&returnGeometry=true&returnZ=true&returnM=false&layers=0&searchText=Site&token=foo',
      JSON.stringify(sampleResponse)
    );
    task.layers('0').text('Site').token('foo').run(function (error, featureCollection, raw) {
      expect(featureCollection).to.deep.equal(sampleFeatureCollection);
      expect(raw).to.deep.equal(sampleResponse);
      done();
    });
  });

  it('should use a service to execute the find task', function (done) {
    var service = L.esri.mapService({url: mapServiceUrl});

    fetchMock.getOnce(
      mapServiceUrl + 'find?f=json&sr=4326&contains=true&returnGeometry=true&returnZ=true&returnM=false&layers=0&searchText=Site',
      JSON.stringify(sampleResponse)
    );
    service.find().layers('0').text('Site').run(function (error, featureCollection, raw) {
      expect(featureCollection).to.deep.equal(sampleFeatureCollection);
      expect(raw).to.deep.equal(sampleResponse);
      done();
    });
    // Test for Promise ?
    // expect(request).to.be.an.instanceof(XMLHttpRequest);
  });

  it('should use JSONP to execute without a service', function (done) {
    var myTask = L.esri.find({
      url: mapServiceUrl,
      useCors: false
    });

    var request = myTask.layers('0').text('Site').run(function (error, featureCollection, raw) {
      expect(featureCollection).to.deep.equal(sampleFeatureCollection);
      expect(raw).to.deep.equal(sampleResponse);
      done();
    });

    window._EsriLeafletCallbacks[request.id](sampleResponse);
  });

  it('should pass through arbitrary request parameters', function (done) {
    var myTask = L.esri.find({
      url: mapServiceUrl,
      requestParams: {
        foo: 'bar'
      }
    });

    fetchMock.getOnce(
      mapServiceUrl + 'find?f=json&sr=4326&contains=true&returnGeometry=true&returnZ=true&returnM=false&layers=0&searchText=Site&foo=bar',
      JSON.stringify(sampleResponse)
    );
    myTask.layers('0').text('Site').run(function (error, featureCollection, raw) {
      expect(featureCollection).to.deep.equal(sampleFeatureCollection);
      expect(raw).to.deep.equal(sampleResponse);
      done();
    });
    // Test for Promise ?
    // expect(request).to.be.an.instanceof(XMLHttpRequest);
  });
});
/* eslint-enable handle-callback-err */
