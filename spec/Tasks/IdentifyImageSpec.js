describe('L.esri.Tasks.IdentifyImage', function () {
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

  var url = 'http://services.arcgis.com/mock/arcgis/rest/services/MockImageService/ImageServer/';

  var sampleResponse = {
    'objectId' : 0,
    'name' : 'Pixel',
    'value' : '-17.5575',
    'location' :
    {
      'x': -122.81,
      'y': 45.48,
      'spatialReference' : {
        'wkid': 4326
      }
    }, 'properties' : null,
    'catalogItems' : null,
    'catalogItemVisibilities' : []
  };

  var sampleResults = {
    'pixel': {
      'type': 'Feature',
      'geometry': {
        'type': 'Point',
        'coordinates': [-122.81, 45.48]
      },
      'properties': {
        'OBJECTID': 0,
        'name': 'Pixel',
        'value': '-17.5575'
      },
      'id': 0
    },
    'catalogItems': {
      'type': 'FeatureCollection',
      'features': []
    }
  };

  beforeEach(function(){
    server = sinon.fakeServer.create();
    task = L.esri.Tasks.identifyImage(url).at(latlng);
  });

  afterEach(function(){
    server.restore();
  });

  it('should identify a pixel value at location', function(done){
    server.respondWith('GET', url + 'identify?sr=4326&returnGeometry=false&geometry=-122.66%2C45.51&geometryType=esriGeometryPoint&f=json', JSON.stringify(sampleResponse));

    task.run(function(error, results, raw){
      expect(results).to.deep.equal(sampleResults);
      expect(raw).to.deep.equal(sampleResponse);
      done();
    });

    server.respond();
  });

});