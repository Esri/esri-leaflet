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
      'crs': {
        'type': 'EPSG',
        'properties': {
           'code': 4326
        }
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
    server.respondWith('GET', url + 'identify?returnGeometry=false&geometry=%7B%22x%22%3A-122.66%2C%22y%22%3A45.51%2C%22spatialReference%22%3A%7B%22wkid%22%3A4326%7D%7D&geometryType=esriGeometryPoint&f=json', JSON.stringify(sampleResponse));

    task.run(function(error, results, raw){
      expect(results).to.deep.equal(sampleResults);
      expect(raw).to.deep.equal(sampleResponse);
      done();
    });

    server.respond();
  });

  it('should identify a pixel value with mosaic rule', function(done){
    var mosaicRule = {mosaicMethod:'esriMosaicLockRaster','lockRasterIds':[8]};
    server.respondWith('GET', url + 'identify?returnGeometry=false&geometry=%7B%22x%22%3A-122.66%2C%22y%22%3A45.51%2C%22spatialReference%22%3A%7B%22wkid%22%3A4326%7D%7D&geometryType=esriGeometryPoint&mosaicRule=%7B%22mosaicMethod%22%3A%22esriMosaicLockRaster%22%2C%22lockRasterIds%22%3A%5B8%5D%7D&f=json', JSON.stringify(sampleResponse));

    task.setMosaicRule(mosaicRule);
    expect(task.getMosaicRule()).to.deep.equal(mosaicRule);

    task.run(function(error, results, raw){
      expect(results).to.deep.equal(sampleResults);
      expect(raw).to.deep.equal(sampleResponse);
      done();
    });

    server.respond();
  });

  it('should identify a pixel value with rendering rule', function(done){
    var renderingRule = {rasterFunction : 'RFTAspectColor'};
    server.respondWith('GET', url + 'identify?returnGeometry=false&geometry=%7B%22x%22%3A-122.66%2C%22y%22%3A45.51%2C%22spatialReference%22%3A%7B%22wkid%22%3A4326%7D%7D&geometryType=esriGeometryPoint&renderingRule=%7B%22rasterFunction%22%3A%22RFTAspectColor%22%7D&f=json', JSON.stringify(sampleResponse));

    task.setRenderingRule(renderingRule);
    expect(task.getRenderingRule()).to.deep.equal(renderingRule);

    task.run(function(error, results, raw){
      expect(results).to.deep.equal(sampleResults);
      expect(raw).to.deep.equal(sampleResponse);
      done();
    });

    server.respond();
  });

  it('should identify a pixel value with a pixel size array', function(done){
    var pixelSize = [15,15];
    server.respondWith('GET', url + 'identify?returnGeometry=false&geometry=%7B%22x%22%3A-122.66%2C%22y%22%3A45.51%2C%22spatialReference%22%3A%7B%22wkid%22%3A4326%7D%7D&geometryType=esriGeometryPoint&pixelSize=15%2C15&f=json', JSON.stringify(sampleResponse));

    task.setPixelSize(pixelSize);
    expect(task.getPixelSize()).to.equal('15,15');

    task.run(function(error, results, raw){
      expect(results).to.deep.equal(sampleResults);
      expect(raw).to.deep.equal(sampleResponse);
      done();
    });

    server.respond();
  });

  it('should identify a pixel value with a pixel size string', function(done){
    var pixelSize = '1,1';
    server.respondWith('GET', url + 'identify?returnGeometry=false&geometry=%7B%22x%22%3A-122.66%2C%22y%22%3A45.51%2C%22spatialReference%22%3A%7B%22wkid%22%3A4326%7D%7D&geometryType=esriGeometryPoint&pixelSize=1%2C1&f=json', JSON.stringify(sampleResponse));

    task.setPixelSize(pixelSize);
    expect(task.getPixelSize()).to.equal(pixelSize);

    task.run(function(error, results, raw){
      expect(results).to.deep.equal(sampleResults);
      expect(raw).to.deep.equal(sampleResponse);
      done();
    });

    server.respond();
  });

});