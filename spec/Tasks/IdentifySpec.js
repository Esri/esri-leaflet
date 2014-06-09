describe('L.esri.Tasks.Identify', function () {
  function createMap(){
    // create container
    var container = document.createElement('div');

    // give container a width/height
    container.setAttribute('style', 'width:500px; height: 500px;');

    // add contianer to body
    document.body.appendChild(container);

    return L.map(container).setView([45.51, -122.66], 16);
  }

  var server;
  var task;

  // create map
  var map = createMap();

  var latlng = map.getCenter();

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
    task = L.esri.Tasks.identify(url).on(map).at(latlng);
  });

  afterEach(function(){
    server.restore();
  });

  it('should identify features', function(done){
    server.respondWith('GET', url + 'identify?sr=4326&layers=all&tolerance=3&imageDisplay=500%2C500%2C96&mapExtent=-122.66535758972167%2C45.50624163368495%2C-122.65462875366211%2C45.51376023843158&geometry=-122.66%2C45.51&geometryType=esriGeometryPoint&f=json', JSON.stringify(sampleResponse));

    task.run(function(error, featureCollection, raw){
      expect(featureCollection).to.deep.equal(sampleFeatureCollection);
      expect(raw).to.deep.equal(sampleResponse);
      done();
    });

    server.respond();
  });

  it('should identify features with a layer definition', function(done){
    server.respondWith('GET', url + 'identify?sr=4326&layers=all&tolerance=3&imageDisplay=500%2C500%2C96&mapExtent=-122.66535758972167%2C45.50624163368495%2C-122.65462875366211%2C45.51376023843158&geometry=-122.66%2C45.51&geometryType=esriGeometryPoint&layerDefs=0%3ANAME%3DOregon&f=json', JSON.stringify(sampleResponse));

    task.layerDef(0, 'NAME=Oregon').run(function(error, featureCollection, raw){
      expect(featureCollection).to.deep.equal(sampleFeatureCollection);
      expect(raw).to.deep.equal(sampleResponse);
      done();
    });

    server.respond();
  });

  it('should identify features with a 2 layer definitions', function(done){

    server.respondWith('GET', url + 'identify?sr=4326&layers=all&tolerance=3&imageDisplay=500%2C500%2C96&mapExtent=-122.66535758972167%2C45.50624163368495%2C-122.65462875366211%2C45.51376023843158&geometry=-122.66%2C45.51&geometryType=esriGeometryPoint&layerDefs=0%3ANAME%3DOregon%3B1%3ANAME%3DMultnomah&f=json', JSON.stringify(sampleResponse));

    task.layerDef(0, 'NAME=Oregon').layerDef(1, 'NAME=Multnomah').run(function(error, featureCollection, raw){
      expect(featureCollection).to.deep.equal(sampleFeatureCollection);
      expect(raw).to.deep.equal(sampleResponse);
      done();
    });

    server.respond();
  });

  it('should identify features in a given time range', function(done){
    server.respondWith('GET', url + 'identify?sr=4326&layers=all&tolerance=3&imageDisplay=500%2C500%2C96&mapExtent=-122.66535758972167%2C45.50624163368495%2C-122.65462875366211%2C45.51376023843158&geometry=-122.66%2C45.51&geometryType=esriGeometryPoint&time=1357027200000%2C1388563200000&f=json', JSON.stringify(sampleResponse));

    var start = new Date('January 1 2013');
    var end = new Date('January 1 2014');

    task.between(start, end).run(function(error, featureCollection, raw){
      expect(featureCollection).to.deep.equal(sampleFeatureCollection);
      expect(raw).to.deep.equal(sampleResponse);
      done();
    });

    server.respond();
  });

  it('should restrict identification to specific layers', function(done){
    server.respondWith('GET', url + 'identify?sr=4326&layers=top&tolerance=3&imageDisplay=500%2C500%2C96&mapExtent=-122.66535758972167%2C45.50624163368495%2C-122.65462875366211%2C45.51376023843158&geometry=-122.66%2C45.51&geometryType=esriGeometryPoint&f=json', JSON.stringify(sampleResponse));

    task.layers('top').run(function(error, featureCollection, raw){
      expect(featureCollection).to.deep.equal(sampleFeatureCollection);
      expect(raw).to.deep.equal(sampleResponse);
      done();
    });

    server.respond();
  });

  it('should identify features and limit geometries to a given precision', function(done){
    server.respondWith('GET', url + 'identify?sr=4326&layers=all&tolerance=3&imageDisplay=500%2C500%2C96&mapExtent=-122.66535758972167%2C45.50624163368495%2C-122.65462875366211%2C45.51376023843158&geometry=-122.66%2C45.51&geometryType=esriGeometryPoint&geometryPrecision=4&f=json', JSON.stringify(sampleResponse));

    task.precision(4).run(function(error, featureCollection, raw){
      expect(featureCollection).to.deep.equal(sampleFeatureCollection);
      expect(raw).to.deep.equal(sampleResponse);
      done();
    });

    server.respond();
  });

  it('should identify features and simplify geometries', function(done){
    server.respondWith('GET', url + 'identify?sr=4326&layers=all&tolerance=3&imageDisplay=500%2C500%2C96&mapExtent=-122.66535758972167%2C45.50624163368495%2C-122.65462875366211%2C45.51376023843158&geometry=-122.66%2C45.51&geometryType=esriGeometryPoint&maxAllowableOffset=0.000010728836059556101&f=json', JSON.stringify(sampleResponse));

    task.simplify(map, 0.5).run(function(error, featureCollection, raw){
      expect(featureCollection).to.deep.equal(sampleFeatureCollection);
      expect(raw).to.deep.equal(sampleResponse);
      done();
    });

    server.respond();
  });

  it('should identify features with a token', function(done){
    server.respondWith('GET', url + 'identify?sr=4326&layers=all&tolerance=3&imageDisplay=500%2C500%2C96&mapExtent=-122.66535758972167%2C45.50624163368495%2C-122.65462875366211%2C45.51376023843158&geometry=-122.66%2C45.51&geometryType=esriGeometryPoint&token=foo&f=json', JSON.stringify(sampleResponse));

    task.token('foo').run(function(error, featureCollection, raw){
      expect(featureCollection).to.deep.equal(sampleFeatureCollection);
      expect(raw).to.deep.equal(sampleResponse);
      done();
    });

    server.respond();
  });

  it('should identify features within a certain pixel tolerance', function(done){
    server.respondWith('GET', url + 'identify?sr=4326&layers=all&tolerance=4&imageDisplay=500%2C500%2C96&mapExtent=-122.66535758972167%2C45.50624163368495%2C-122.65462875366211%2C45.51376023843158&geometry=-122.66%2C45.51&geometryType=esriGeometryPoint&f=json', JSON.stringify(sampleResponse));

    task.tolerance(4).run(function(error, featureCollection, raw){
      expect(featureCollection).to.deep.equal(sampleFeatureCollection);
      expect(raw).to.deep.equal(sampleResponse);
      done();
    });

    server.respond();
  });

  it('should use a service to execute the request', function(done){
    var service = L.esri.Services.mapService(url);

    server.respondWith('GET', url + 'identify?sr=4326&layers=all&tolerance=3&imageDisplay=500%2C500%2C96&mapExtent=-122.66535758972167%2C45.50624163368495%2C-122.65462875366211%2C45.51376023843158&geometry=-122.66%2C45.51&geometryType=esriGeometryPoint&f=json', JSON.stringify(sampleResponse));

    service.identify().on(map).at(latlng).run(function(error, featureCollection, raw){
      expect(featureCollection).to.deep.equal(sampleFeatureCollection);
      expect(raw).to.deep.equal(sampleResponse);
      done();
    });

    server.respond();
  });

});