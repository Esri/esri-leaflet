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

  var url = 'http://services.arcgis.com/mock/arcgis/rest/services/MockFeatureService/FeatureServer/0/';

  var sampleQueryResponse = {
    'objectIdFieldName': 'FID',
    'feilds': [{
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
    task = L.esri.Tasks.query(url);
  });

  afterEach(function(){
    server.restore();
  });

  it('should query features', function(done){
    server.respondWith('GET', url + 'query?where=1%3D1&outSr=4326&outFields=*&f=json', JSON.stringify(sampleQueryResponse));

    task.run(function(error, featureCollection, raw){
      expect(featureCollection).to.deep.equal(sampleFeatureCollection);
      expect(raw).to.deep.equal(sampleQueryResponse);
      done();
    });

    server.respond();
  });

  it('should query features within bounds', function(done){
    server.respondWith('GET', url + 'query?where=1%3D1&outSr=4326&outFields=*&geometry=%7B%22xmin%22%3A-122.66%2C%22ymin%22%3A45.5%2C%22xmax%22%3A-122.65%2C%22ymax%22%3A45.51%2C%22spatialReference%22%3A%7B%22wkid%22%3A4326%7D%7D&geometryType=esriGeometryEnvelope&spatialRel=esriSpatialRelIntersects&f=json', JSON.stringify(sampleQueryResponse));

    task.within(bounds).run(function(error, featureCollection, raw){
      expect(featureCollection).to.deep.equal(sampleFeatureCollection);
      expect(raw).to.deep.equal(sampleQueryResponse);
      done();
    });

    server.respond();
  });

  it('should query features near a latlng', function(done){
    server.respondWith('GET', url + 'query?where=1%3D1&outSr=4326&outFields=*&geometry=-122.66%2C45.51&geometryType=esriGeometryPoint&spatialRel=esriSpatialRelIntersects&units=esriSRUnit_Meter&distance=500&inSr=4326&f=json', JSON.stringify(sampleQueryResponse));

    task.nearby(latlng, 500).run(function(error, featureCollection, raw){
      expect(featureCollection).to.deep.equal(sampleFeatureCollection);
      expect(raw).to.deep.equal(sampleQueryResponse);
      done();
    });

    server.respond();
  });

  it('should query features with a where option', function(done){
    server.respondWith('GET', url + 'query?where=NAME%3D\'Site\'&outSr=4326&outFields=*&f=json', JSON.stringify(sampleQueryResponse));

    task.where('NAME="Site"').run(function(error, featureCollection, raw){
      expect(featureCollection).to.deep.equal(sampleFeatureCollection);
      expect(raw).to.deep.equal(sampleQueryResponse);
      done();
    });

    server.respond();
  });

  it('should limit queries for pagination', function(done){
    server.respondWith('GET', url + 'query?where=1%3D1&outSr=4326&outFields=*&limit=10&f=json', JSON.stringify(sampleQueryResponse));

    task.limit(10).run(function(error, featureCollection, raw){
      expect(featureCollection).to.deep.equal(sampleFeatureCollection);
      expect(raw).to.deep.equal(sampleQueryResponse);
      done();
    });

    server.respond();
  });

  it('should offset queries for pagination', function(done){
    server.respondWith('GET', url + 'query?where=1%3D1&outSr=4326&outFields=*&offset=10&f=json', JSON.stringify(sampleQueryResponse));

    task.offset(10).run(function(error, featureCollection, raw){
      expect(featureCollection).to.deep.equal(sampleFeatureCollection);
      expect(raw).to.deep.equal(sampleQueryResponse);
      done();
    });

    server.respond();
  });

  it('should query features in a given time range', function(done){
    server.respondWith('GET', url + 'query?where=1%3D1&outSr=4326&outFields=*&time=1357027200000%2C1388563200000&f=json', JSON.stringify(sampleQueryResponse));

    var start = new Date('January 1 2013');
    var end = new Date('January 1 2014');

    task.between(start, end).run(function(error, featureCollection, raw){
      expect(featureCollection).to.deep.equal(sampleFeatureCollection);
      expect(raw).to.deep.equal(sampleQueryResponse);
      done();
    });

    server.respond();
  });

  it('should set output fields for queries', function(done){
    server.respondWith('GET', url + 'query?where=1%3D1&outSr=4326&outFields=Name%2CFID&f=json', JSON.stringify(sampleQueryResponse));

    task.fields(['Name', 'FID']).run(function(error, featureCollection, raw){
      expect(featureCollection).to.deep.equal(sampleFeatureCollection);
      expect(raw).to.deep.equal(sampleQueryResponse);
      done();
    });

    server.respond();
  });

  it('should limit geometry percision', function(done){
    server.respondWith('GET', url + 'query?where=1%3D1&outSr=4326&outFields=*&geometryPrecision=4&f=json', JSON.stringify(sampleQueryResponse));

    task.precision(4).run(function(error, featureCollection, raw){
      expect(featureCollection).to.deep.equal(sampleFeatureCollection);
      expect(raw).to.deep.equal(sampleQueryResponse);
      done();
    });

    server.respond();
  });

  it('should identify features and simplify geometries', function(done){
    server.respondWith('GET', url + 'query?where=1%3D1&outSr=4326&outFields=*&maxAllowableOffset=0.000010728836059556101&f=json', JSON.stringify(sampleQueryResponse));

    task.simplify(map, 0.5).run(function(error, featureCollection, raw){
      expect(featureCollection).to.deep.equal(sampleFeatureCollection);
      expect(raw).to.deep.equal(sampleQueryResponse);
      done();
    });

    server.respond();
  });

  it('should order query output ascending', function(done){
    server.respondWith('GET', url + 'query?where=1%3D1&outSr=4326&outFields=*&orderByFields=Name%20ASC&f=json', JSON.stringify(sampleQueryResponse));

    task.orderBy('Name').run(function(error, featureCollection, raw){
      expect(featureCollection).to.deep.equal(sampleFeatureCollection);
      expect(raw).to.deep.equal(sampleQueryResponse);
      done();
    });

    server.respond();
  });

  it('should order query output descending', function(done){
    server.respondWith('GET', url + 'query?where=1%3D1&outSr=4326&outFields=*&orderByFields=Name%20DESC&f=json', JSON.stringify(sampleQueryResponse));

    task.orderBy('Name', 'DESC').run(function(error, featureCollection, raw){
      expect(featureCollection).to.deep.equal(sampleFeatureCollection);
      expect(raw).to.deep.equal(sampleQueryResponse);
      done();
    });

    server.respond();
  });

  it('should order query output with multiple features', function(done){
    server.respondWith('GET', url + 'query?where=1%3D1&outSr=4326&outFields=*&orderByFields=Name%20DESC%2CScore%20ASC&f=json', JSON.stringify(sampleQueryResponse));

    task.orderBy('Name', 'DESC').orderBy('Score', 'ASC').run(function(error, featureCollection, raw){
      expect(featureCollection).to.deep.equal(sampleFeatureCollection);
      expect(raw).to.deep.equal(sampleQueryResponse);
      done();
    });

    server.respond();
  });

  it('should be able to query specific feature ids', function(done){
    server.respondWith('GET', url + 'query?where=1%3D1&outSr=4326&outFields=*&objectIds=1%2C2&f=json', JSON.stringify(sampleQueryResponse));

    task.featureIds([1,2]).run(function(error, featureCollection, raw){
      expect(featureCollection).to.deep.equal(sampleFeatureCollection);
      expect(raw).to.deep.equal(sampleQueryResponse);
      done();
    });

    server.respond();
  });

  it('should be able to query token', function(done){
    server.respondWith('GET', url + 'query?where=1%3D1&outSr=4326&outFields=*&token=foo&f=json', JSON.stringify(sampleQueryResponse));

    task.token('foo').run(function(error, featureCollection, raw){
      expect(featureCollection).to.deep.equal(sampleFeatureCollection);
      expect(raw).to.deep.equal(sampleQueryResponse);
      done();
    });

    server.respond();
  });

  it('should query bounds', function(done){
    server.respondWith('GET', url + 'query?where=1%3D1&outSr=4326&outFields=*&returnExtentOnly=true&f=json', JSON.stringify(sampleExtentResponse));

    task.bounds(function(error, latlngbounds, raw){
      expect(latlngbounds).to.deep.equal(bounds);
      expect(raw).to.deep.equal(sampleExtentResponse);
      done();
    });

    server.respond();
  });

  it('should query count', function(done){
    server.respondWith('GET', url + 'query?where=1%3D1&outSr=4326&outFields=*&returnCountOnly=true&f=json', JSON.stringify(sampleCountResponse));

    task.count(function(error, count, raw){
      expect(count).to.equal(1);
      expect(raw).to.deep.equal(sampleCountResponse);
      done();
    });

    server.respond();
  });

  it('should query ids', function(done){
    server.respondWith('GET', url + 'query?where=1%3D1&outSr=4326&outFields=*&returnIdsOnly=true&f=json', JSON.stringify(sampleIdsResponse));

    task.ids(function(error, ids, raw){
      expect(ids).to.deep.equal([1,2]);
      expect(raw).to.deep.equal(sampleIdsResponse);
      done();
    });

    server.respond();
  });

  it('should use a service to query features', function(done){
    server.respondWith('GET', url + 'query?where=1%3D1&outSr=4326&outFields=*&f=json', JSON.stringify(sampleQueryResponse));

    var service = new L.esri.Services.FeatureLayer(url);

    service.query().run(function(error, featureCollection, raw){
      expect(featureCollection).to.deep.equal(sampleFeatureCollection);
      expect(raw).to.deep.equal(sampleQueryResponse);
      done();
    });

    server.respond();
  });

});