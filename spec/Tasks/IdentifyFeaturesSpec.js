/* eslint-env mocha */
/* eslint-disable handle-callback-err */
describe('L.esri.IdentifyFeatures', function () {
  function createMap () {
    // create container
    var container = document.createElement('div');

    // give container a width/height
    container.setAttribute('style', 'width:500px; height: 500px;');

    // add contianer to body
    document.body.appendChild(container);

    return L.map(container).setView([45.51, -122.66], 16);
  }
  var task;

  // create map
  var map = createMap();

  var latlng = map.getCenter();
  var rawLatlng = [45.51, -122.66];

  var bounds = L.latLngBounds([[45.5, -122.66], [45.51, -122.65]]);

  var rawGeoJsonPolygon = {
    'type': 'Polygon',
    'coordinates': [[
      [-97, 39], [-97, 41], [-94, 41], [-94, 39], [-97, 39]
    ]]
  };

  var geoJsonPolygon = L.geoJSON(rawGeoJsonPolygon);

  var mapServiceUrl = 'http://services.arcgis.com/mock/arcgis/rest/services/MockMapService/MapServer/';

  var sampleResponse = {
    'results': [
      {
        'layerId': 0,
        'layerName': 'Features',
        'displayFieldName': 'Name',
        'value': '0',
        'attributes': {
          'objectid': 1,
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

  // use 'objectid' instead of 'OBJECTID' to trap irregular casing
  var sampleFeatureCollection = {
    'type': 'FeatureCollection',
    'features': [
      {
        'type': 'Feature',
        'geometry': {
          'type': 'Point',
          'coordinates': [-122.81, 45.48]
        },
        'properties': {
          'objectid': 1,
          'Name': 'Site'
        },
        'id': 1,
        'layerId': 0
      }
    ]
  };

  beforeEach(function () {
    fetchMock.config.warnOnFallback = false;
    task = L.esri.identifyFeatures({url: mapServiceUrl}).on(map).at(latlng);
  });

  afterEach(function () {
    fetchMock.restore();
  });

  it('should identify features', function (done) {
    fetchMock.catch(function (responseUrl, responseOpts) {
      expect(responseUrl).to.contain(mapServiceUrl + 'identify');
      expect(responseUrl).to.contain('sr=4326');
      expect(responseUrl).to.contain('layers=all');
      expect(responseUrl).to.contain('tolerance=3');
      expect(responseUrl).to.contain('returnGeometry=true');
      expect(responseUrl).to.contain('imageDisplay=500%2C500%2C96');
      expect(responseUrl).to.match(/mapExtent=-122\.\d+%2C45\.\d+%2C-122\.\d+%2C45\.\d+/g);
      expect(responseUrl).to.contain('geometryType=esriGeometryPoint');
      expect(responseUrl).to.contain('geometry=%7B%22x%22%3A-122.66%2C%22y%22%3A45.51%2C%22spatialReference%22%3A%7B%22wkid%22%3A4326%7D%7D');
      return sampleResponse;
    });
    task.run(function (error, featureCollection, raw) {
      expect(featureCollection).to.deep.equal(sampleFeatureCollection);
      expect(raw).to.deep.equal(sampleResponse);
      done();
    });
  });

  it('should identify features with a layer definition', function (done) {
    fetchMock.catch(function (responseUrl, responseOpts) {
      expect(responseUrl).to.contain('layerDefs=0%3ANAME%3DOregon');
      return sampleResponse;
    });

    task.layerDef(0, 'NAME=Oregon').run(function (error, featureCollection, raw) {
      expect(featureCollection).to.deep.equal(sampleFeatureCollection);
      expect(raw).to.deep.equal(sampleResponse);
      done();
    });
  });

  it('should identify features with 2 layer definitions', function (done) {
    fetchMock.catch(function (responseUrl, responseOpts) {
      expect(responseUrl).to.contain('layerDefs=0%3ANAME%3DOregon%3B1%3ANAME%3DMultnomah');
      return sampleResponse;
    });

    task.layerDef(0, 'NAME=Oregon').layerDef(1, 'NAME=Multnomah').run(function (error, featureCollection, raw) {
      expect(featureCollection).to.deep.equal(sampleFeatureCollection);
      expect(raw).to.deep.equal(sampleResponse);
      done();
    });
  });

  it('should identify features in a given time range', function (done) {
    var start = new Date('January 1 2013 GMT-0800');
    var end = new Date('January 1 2014 GMT-0800');

    fetchMock.catch(function (responseUrl, responseOpts) {
      expect(responseUrl).to.contain('time=1357027200000%2C1388563200000');
      return sampleResponse;
    });

    task.between(start, end).run(function (error, featureCollection, raw) {
      expect(featureCollection).to.deep.equal(sampleFeatureCollection);
      expect(raw).to.deep.equal(sampleResponse);
      done();
    });
  });

  it('should restrict identification to specific layers', function (done) {
    fetchMock.catch(function (responseUrl, responseOpts) {
      return sampleResponse;
    });

    task.layers('top').run(function (error, featureCollection, raw) {
      expect(featureCollection).to.deep.equal(sampleFeatureCollection);
      expect(raw).to.deep.equal(sampleResponse);
      done();
    });
  });

  it('should identify features and limit geometries to a given precision', function (done) {
    fetchMock.catch(function (responseUrl, responseOpts) {
      expect(responseUrl).to.contain('geometryPrecision=4');
      return sampleResponse;
    });

    task.precision(4).run(function (error, featureCollection, raw) {
      expect(featureCollection).to.deep.equal(sampleFeatureCollection);
      expect(raw).to.deep.equal(sampleResponse);
      done();
    });
  });

  it('should identify features and simplify geometries', function (done) {
    fetchMock.catch(function (responseUrl, responseOpts) {
      expect(responseUrl).to.contain('maxAllowableOffset=0.000010728836059570312');
      return sampleResponse;
    });

    task.simplify(map, 0.5).run(function (error, featureCollection, raw) {
      expect(featureCollection).to.deep.equal(sampleFeatureCollection);
      expect(raw).to.deep.equal(sampleResponse);
      done();
    });
  });

  it('should identify features with a token', function (done) {
    fetchMock.catch(function (responseUrl, responseOpts) {
      expect(responseUrl).to.contain('token=foo');
      return sampleResponse;
    });

    task.token('foo').run(function (error, featureCollection, raw) {
      expect(featureCollection).to.deep.equal(sampleFeatureCollection);
      expect(raw).to.deep.equal(sampleResponse);
      done();
    });
  });

  it('should identify features within a certain pixel tolerance', function (done) {
    fetchMock.catch(function (responseUrl, responseOpts) {
      expect(responseUrl).to.contain('tolerance=4');
      return sampleResponse;
    });

    task.tolerance(4).run(function (error, featureCollection, raw) {
      expect(featureCollection).to.deep.equal(sampleFeatureCollection);
      expect(raw).to.deep.equal(sampleResponse);
      done();
    });
  });

  it('should fetch unformatted results from 10.5+', function (done) {
    fetchMock.catch(function (responseUrl, responseOpts) {
      expect(responseUrl).to.contain('returnUnformattedValues=true');
      return sampleResponse;
    });

    task.format(false).run(function (error, featureCollection, raw) {
      expect(featureCollection).to.deep.equal(sampleFeatureCollection);
      expect(raw).to.deep.equal(sampleResponse);
      done();
    });
  });

  it('should use a service to execute the request', function (done) {
    var service = L.esri.mapService({url: mapServiceUrl});

    fetchMock.catch(function (responseUrl, responseOpts) {
      expect(responseUrl).to.contain(mapServiceUrl + 'identify');
      expect(responseUrl).to.contain('sr=4326');
      expect(responseUrl).to.contain('layers=all');
      expect(responseUrl).to.contain('tolerance=3');
      expect(responseUrl).to.contain('returnGeometry=true');
      expect(responseUrl).to.contain('imageDisplay=500%2C500%2C96');
      expect(responseUrl).to.match(/mapExtent=-122\.\d+%2C45\.\d+%2C-122\.\d+%2C45\.\d+/g);
      expect(responseUrl).to.contain('geometryType=esriGeometryPoint');
      expect(responseUrl).to.contain('geometry=%7B%22x%22%3A-122.66%2C%22y%22%3A45.51%2C%22spatialReference%22%3A%7B%22wkid%22%3A4326%7D%7D');
      return sampleResponse;
    });

    service.identify().on(map).at(latlng).run(function (error, featureCollection, raw) {
      expect(featureCollection).to.deep.equal(sampleFeatureCollection);
      expect(raw).to.deep.equal(sampleResponse);
      done();
    });
  });

  it('should use a service to execute the request with simple LatLng', function (done) {
    var service = L.esri.mapService({url: mapServiceUrl});

    fetchMock.catch(function (responseUrl, responseOpts) {
      expect(responseUrl).to.contain(mapServiceUrl + 'identify');
      expect(responseUrl).to.contain('sr=4326');
      expect(responseUrl).to.contain('layers=all');
      expect(responseUrl).to.contain('tolerance=3');
      expect(responseUrl).to.contain('returnGeometry=true');
      expect(responseUrl).to.contain('imageDisplay=500%2C500%2C96');
      expect(responseUrl).to.match(/mapExtent=-122\.\d+%2C45\.\d+%2C-122\.\d+%2C45\.\d+/g);
      expect(responseUrl).to.contain('geometryType=esriGeometryPoint');
      expect(responseUrl).to.contain('geometry=%7B%22x%22%3A-122.66%2C%22y%22%3A45.51%2C%22spatialReference%22%3A%7B%22wkid%22%3A4326%7D%7D');
      return sampleResponse;
    });

    service.identify().on(map).at(rawLatlng).run(function (error, featureCollection, raw) {
      expect(featureCollection).to.deep.equal(sampleFeatureCollection);
      expect(raw).to.deep.equal(sampleResponse);
      done();
    });
  });

  it('should return layerId of features in response', function (done) {
    var service = L.esri.mapService({url: mapServiceUrl});

    fetchMock.catch(function (responseUrl, responseOpts) {
      return sampleResponse;
    });

    service.identify().on(map).at(rawLatlng).run(function (error, featureCollection, raw) {
      expect(featureCollection.features[0].layerId).to.deep.equal(0);
      expect(raw).to.deep.equal(sampleResponse);
      done();
    });
  });

  it('should identify features with an input extent', function (done) {
    var extentTask = L.esri.identifyFeatures({url: mapServiceUrl}).on(map).at(bounds);

    fetchMock.catch(function (responseUrl, responseOpts) {
      expect(responseUrl).to.contain('geometry=%7B%22xmin%22%3A-122.66%2C%22ymin%22%3A45.5%2C%22xmax%22%3A-122.65%2C%22ymax%22%3A45.51%2C%22spatialReference%22%3A%7B%22wkid%22%3A4326%7D%7D');
      expect(responseUrl).to.contain('geometryType=esriGeometryEnvelope');
      expect(responseUrl).to.contain('sr=4326');
      return sampleResponse;
    });

    extentTask.run(function (error, featureCollection, raw) {
      expect(featureCollection).to.deep.equal(sampleFeatureCollection);
      expect(raw).to.deep.equal(sampleResponse);
      done();
    });
  });

  it('should identify features with raw geojson input', function (done) {
    var rawTask = L.esri.identifyFeatures({url: mapServiceUrl}).on(map).at(rawGeoJsonPolygon);

    fetchMock.catch(function (responseUrl, responseOpts) {
      expect(responseUrl).to.contain('geometry=%7B%22rings%22%3A%5B%5B%5B-97%2C39%5D%2C%5B-97%2C41%5D%2C%5B-94%2C41%5D%2C%5B-94%2C39%5D%2C%5B-97%2C39%5D%5D%5D%2C%22spatialReference%22%3A%7B%22wkid%22%3A4326%7D%7D');
      expect(responseUrl).to.contain('geometryType=esriGeometryPolygon');
      expect(responseUrl).to.contain('sr=4326');
      return sampleResponse;
    });

    rawTask.run(function (error, featureCollection, raw) {
      expect(featureCollection).to.deep.equal(sampleFeatureCollection);
      expect(raw).to.deep.equal(sampleResponse);
      done();
    });
  });

  it('should identify features with geojson input', function (done) {
    var polygonTask = L.esri.identifyFeatures({url: mapServiceUrl}).on(map).at(geoJsonPolygon);

    fetchMock.catch(function (responseUrl, responseOpts) {
      expect(responseUrl).to.contain('geometry=%7B%22rings%22%3A%5B%5B%5B-97%2C39%5D%2C%5B-97%2C41%5D%2C%5B-94%2C41%5D%2C%5B-94%2C39%5D%2C%5B-97%2C39%5D%5D%5D%2C%22spatialReference%22%3A%7B%22wkid%22%3A4326%7D%7D');
      expect(responseUrl).to.contain('geometryType=esriGeometryPolygon');
      expect(responseUrl).to.contain('sr=4326');
      return sampleResponse;
    });

    polygonTask.run(function (error, featureCollection, raw) {
      expect(featureCollection).to.deep.equal(sampleFeatureCollection);
      expect(raw).to.deep.equal(sampleResponse);
      done();
    });
  });

  it('should identify features passing through arbitrary request parameters', function (done) {
    var polygonTask = L.esri.identifyFeatures({
      url: mapServiceUrl,
      requestParams: {
        foo: 'bar'
      }
    }).on(map).at(geoJsonPolygon);

    fetchMock.catch(function (responseUrl, responseOpts) {
      expect(responseUrl).to.contain('geometry=%7B%22rings%22%3A%5B%5B%5B-97%2C39%5D%2C%5B-97%2C41%5D%2C%5B-94%2C41%5D%2C%5B-94%2C39%5D%2C%5B-97%2C39%5D%5D%5D%2C%22spatialReference%22%3A%7B%22wkid%22%3A4326%7D%7D');
      expect(responseUrl).to.contain('geometryType=esriGeometryPolygon');
      expect(responseUrl).to.contain('sr=4326');
      expect(responseUrl).to.contain('foo=bar');
      return sampleResponse;
    });

    polygonTask.run(function (error, featureCollection, raw) {
      expect(featureCollection).to.deep.equal(sampleFeatureCollection);
      expect(raw).to.deep.equal(sampleResponse);
      done();
    });
  });
});
/* eslint-enable handle-callback-err */
