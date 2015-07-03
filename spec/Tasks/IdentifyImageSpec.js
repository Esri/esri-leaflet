describe('L.esri.Tasks.IdentifyImage', function () {

  function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

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
  var rawLatlng = [45.51, -122.66];

  var imageServiceUrl = 'http://services.arcgis.com/mock/arcgis/rest/services/MockImageService/ImageServer/';

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
    }
  };

  var sampleResponseWithCatalogItems = {
    'objectId' : 0,
    'name' : 'Pixel',
    'value' : '17, 22, 39, 45',
    'location' :
    {
      'x' : -13527177.6374152,
      'y' : 5837991.41167063,
      'spatialReference' : {
        'wkid' : 54004
      }
    },
    'properties' :
    {
      'Values' : [
        '10 18 34 43',
        '17 22 39 45'
      ]
    },
    'catalogItems' :
    {
      'objectIdFieldName' : 'OBJECTID',
      'spatialReference' : {
        'wkid' : 54004
      },
      'geometryType' : 'esriGeometryPolygon',
      'features' : [
        {
          'geometry' :
          {
            'rings' :
            [
              [
                [-13460551.7089, 5854521.5319],
                [-13478287.1495, 5790460.0595],
                [-13495758.3317, 5726819.8268],
                [-13512973.0996, 5663593.4924],
                [-13529939.0436, 5600773.8464],
                [-13593636.8922, 5614581.7474],
                [-13657532.2448, 5627959.8481],
                [-13721616.7496, 5640902.1352],
                [-13785881.8549, 5653402.7833],
                [-13770610.5633, 5717098.1159],
                [-13755121.9097, 5781227.8467],
                [-13739408.9372, 5845800.1358],
                [-13723464.45, 5910823.3172],
                [-13657416.2669, 5897455.1875],
                [-13591575.2527, 5883610.99],
                [-13525950.7118, 5869297.4578],
                [-13460551.7089, 5854521.5319]
              ]
            ]
          },
          'attributes' :
          {
            'OBJECTID' : 6,
            'Name' : 'p046r028_7t19990907.met;p046r028_7t19990907.met',
            'MinPS' : 0,
            'MaxPS' : 28.5,
            'LowPS' : 14.25,
            'HighPS' : 114,
            'Category' : 1,
            'Tag' : 'Pansharpened',
            'GroupName' : 'p046r028_7t19990907',
            'ProductName' : 'Level1',
            'CenterX' : -13624980.3112093,
            'CenterY' : 5756154.02144619,
            'ZOrder' : null,
            'SOrder' : null,
            'StereoID' : '',
            'SensorName' : 'Landsat-7-ETM+',
            'AcquisitionDate' : 936662400000,
            'SunAzimuth' : 150.8831799,
            'SunElevation' : 46.5205819,
            'CloudCover' : 0,
            'Shape_Length' : 1058133.67231272,
            'Shape_Area' : 69904833443.6272
          }
        },
        {
          'geometry' :
          {
            'rings' :
            [
              [
                [-13292489.9099, 5855431.779],
                [-13310286.7337, 5791381.4753],
                [-13327810.7467, 5727748.1244],
                [-13345069.9061, 5664524.4905],
                [-13362071.9117, 5601703.4638],
                [-13425742.0169, 5615460.9307],
                [-13489617.0175, 5628791.9699],
                [-13553688.6321, 5641690.4875],
                [-13617948.3761, 5654150.574],
                [-13602646.9571, 5717848.4135],
                [-13587119.9125, 5781976.6214],
                [-13571360.1713, 5846543.2654],
                [-13555360.4191, 5911556.581],
                [-13489311.5669, 5898227.932],
                [-13423477.4153, 5884426.3329],
                [-13357867.1993, 5870158.6064],
                [-13292489.9099, 5855431.779]
              ]
            ]
          },
          'attributes' :
          {
            'OBJECTID' : 2,
            'Name' : 'p045r028_7t19991002.met;p045r028_7t19991002.met',
            'MinPS' : 0,
            'MaxPS' : 28.5,
            'LowPS' : 14.25,
            'HighPS' : 114,
            'Category' : 1,
            'Tag' : 'Pansharpened',
            'GroupName' : 'p045r028_7t19991002',
            'ProductName' : 'Level1',
            'CenterX' : -13456998.9817332,
            'CenterY' : 5756986.51347787,
            'ZOrder' : null,
            'SOrder' : null,
            'StereoID' : '',
            'SensorName' : 'Landsat-7-ETM+',
            'AcquisitionDate' : 938822400000,
            'SunAzimuth' : 157.6031865,
            'SunElevation' : 37.975699,
            'CloudCover' : 50,
            'Shape_Length' : 1058012.72377166,
            'Shape_Area' : 69884678121.7441
          }
        }
      ]
    },
    'catalogItemVisibilities' : [
      0.671180049953907,
      0.328819950035319
    ]
  };

  var sampleResultsWithCatlaogItems = {
  'pixel': {
    'type': 'Feature',
    'geometry': {
      'type': 'Point',
      'coordinates': [-13527177.6374152, 5837991.41167063]
    },
    'crs': {
      'type': 'EPSG',
      'properties': {
         'code': 54004
      }
    },
    'properties': {
      'OBJECTID': 0,
      'name': 'Pixel',
      'value': '17, 22, 39, 45',
      'values': [
        '10 18 34 43',
        '17 22 39 45'
      ]
    },
    'id': 0
  },
  'catalogItems': {
    'type':'FeatureCollection',
      'features': [{
        'type': 'Feature',
        'geometry': {
          'type': 'Polygon',
          'coordinates': [
            [
              [-13292489.9099, 5855431.779],
              [-13310286.7337, 5791381.4753],
              [-13327810.7467, 5727748.1244],
              [-13345069.9061, 5664524.4905],
              [-13362071.9117, 5601703.4638],
              [-13425742.0169, 5615460.9307],
              [-13489617.0175, 5628791.9699],
              [-13553688.6321, 5641690.4875],
              [-13617948.3761, 5654150.574],
              [-13602646.9571, 5717848.4135],
              [-13587119.9125, 5781976.6214],
              [-13571360.1713, 5846543.2654],
              [-13555360.4191, 5911556.581],
              [-13489311.5669, 5898227.932],
              [-13423477.4153, 5884426.3329],
              [-13357867.1993, 5870158.6064],
              [-13292489.9099, 5855431.779]
            ]
          ]
        },
        'properties': {
          'OBJECTID': 2,
          'Name': 'p045r028_7t19991002.met;p045r028_7t19991002.met',
          'MinPS': 0,
          'MaxPS': 28.5,
          'LowPS': 14.25,
          'HighPS': 114,
          'Category': 1,
          'Tag': 'Pansharpened',
          'GroupName': 'p045r028_7t19991002',
          'ProductName': 'Level1',
          'CenterX': -13456998.9817332,
          'CenterY': 5756986.51347787,
          'ZOrder': null,
          'SOrder': null,
          'StereoID': '',
          'SensorName': 'Landsat-7-ETM+',
          'AcquisitionDate': 938822400000,
          'SunAzimuth': 157.6031865,
          'SunElevation': 37.975699,
          'CloudCover': 50,
          'Shape_Length': 1058012.72377166,
          'Shape_Area': 69884678121.7441,
          'catalogItemVisibility': 0.671180049953907
        },
        'id': 2
      }, {
        'type': 'Feature',
        'geometry': {
          'type': 'Polygon',
          'coordinates': [
            [
              [-13460551.7089, 5854521.5319],
              [-13478287.1495, 5790460.0595],
              [-13495758.3317, 5726819.8268],
              [-13512973.0996, 5663593.4924],
              [-13529939.0436, 5600773.8464],
              [-13593636.8922, 5614581.7474],
              [-13657532.2448, 5627959.8481],
              [-13721616.7496, 5640902.1352],
              [-13785881.8549, 5653402.7833],
              [-13770610.5633, 5717098.1159],
              [-13755121.9097, 5781227.8467],
              [-13739408.9372, 5845800.1358],
              [-13723464.45, 5910823.3172],
              [-13657416.2669, 5897455.1875],
              [-13591575.2527, 5883610.99],
              [-13525950.7118, 5869297.4578],
              [-13460551.7089, 5854521.5319]
            ]
          ]
        },
        'properties': {
          'OBJECTID': 6,
          'Name': 'p046r028_7t19990907.met;p046r028_7t19990907.met',
          'MinPS': 0,
          'MaxPS': 28.5,
          'LowPS': 14.25,
          'HighPS': 114,
          'Category': 1,
          'Tag': 'Pansharpened',
          'GroupName': 'p046r028_7t19990907',
          'ProductName': 'Level1',
          'CenterX': -13624980.3112093,
          'CenterY': 5756154.02144619,
          'ZOrder': null,
          'SOrder': null,
          'StereoID': '',
          'SensorName': 'Landsat-7-ETM+',
          'AcquisitionDate': 936662400000,
          'SunAzimuth': 150.8831799,
          'SunElevation': 46.5205819,
          'CloudCover': 0,
          'Shape_Length': 1058133.67231272,
          'Shape_Area': 69904833443.6272,
          'catalogItemVisibility': 0.328819950035319
        },
        'id': 6
      }]
    }
  };

  beforeEach(function(){
    server = sinon.fakeServer.create();
    task = L.esri.Tasks.identifyImage({url: imageServiceUrl}).at(latlng);
  });

  afterEach(function(){
    server.restore();
  });

  it('should identify a pixel value at location', function(done){
    server.respondWith('GET', imageServiceUrl + 'identify?returnGeometry=false&geometry=%7B%22x%22%3A-122.66%2C%22y%22%3A45.51%2C%22spatialReference%22%3A%7B%22wkid%22%3A4326%7D%7D&geometryType=esriGeometryPoint&f=json', JSON.stringify(sampleResponse));

    var request = task.run(function(error, results, raw){
      expect(results).to.deep.equal(sampleResults);
      expect(raw).to.deep.equal(sampleResponse);
      done();
    });

    expect(request).to.be.an.instanceof(XMLHttpRequest);

    server.respond();
  });

  it('should identify a pixel value at location with simple LatLng', function(done){
    server.respondWith('GET', imageServiceUrl + 'identify?returnGeometry=false&geometry=%7B%22x%22%3A-122.66%2C%22y%22%3A45.51%2C%22spatialReference%22%3A%7B%22wkid%22%3A4326%7D%7D&geometryType=esriGeometryPoint&f=json', JSON.stringify(sampleResponse));

    var request = task.at(rawLatlng).run(function(error, results, raw){
      expect(results).to.deep.equal(sampleResults);
      expect(raw).to.deep.equal(sampleResponse);
      done();
    });

    expect(request).to.be.an.instanceof(XMLHttpRequest);

    server.respond();
  });

  it('should identify a pixel value with mosaic rule', function(done){
    var mosaicRule = {mosaicMethod:'esriMosaicLockRaster','lockRasterIds':[8]};
    server.respondWith('GET', imageServiceUrl + 'identify?returnGeometry=false&geometry=%7B%22x%22%3A-122.66%2C%22y%22%3A45.51%2C%22spatialReference%22%3A%7B%22wkid%22%3A4326%7D%7D&geometryType=esriGeometryPoint&mosaicRule=%7B%22mosaicMethod%22%3A%22esriMosaicLockRaster%22%2C%22lockRasterIds%22%3A%5B8%5D%7D&f=json', JSON.stringify(sampleResponse));

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
    server.respondWith('GET', imageServiceUrl + 'identify?returnGeometry=false&geometry=%7B%22x%22%3A-122.66%2C%22y%22%3A45.51%2C%22spatialReference%22%3A%7B%22wkid%22%3A4326%7D%7D&geometryType=esriGeometryPoint&renderingRule=%7B%22rasterFunction%22%3A%22RFTAspectColor%22%7D&f=json', JSON.stringify(sampleResponse));

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
    var pixelSize = [15, 15];

    server.respondWith('GET', imageServiceUrl + 'identify?returnGeometry=false&geometry=%7B%22x%22%3A-122.66%2C%22y%22%3A45.51%2C%22spatialReference%22%3A%7B%22wkid%22%3A4326%7D%7D&geometryType=esriGeometryPoint&pixelSize=15%2C15&f=json', JSON.stringify(sampleResponse));

    task.setPixelSize(pixelSize);

    expect(task.getPixelSize()).to.equal(pixelSize);

    task.run(function(error, results, raw){
      expect(results).to.deep.equal(sampleResults);
      expect(raw).to.deep.equal(sampleResponse);
      done();
    });

    server.respond();
  });

  it('should identify a pixel value with a pixel size string', function(done){
    var pixelSize = '1,1';

    server.respondWith('GET', imageServiceUrl + 'identify?returnGeometry=false&geometry=%7B%22x%22%3A-122.66%2C%22y%22%3A45.51%2C%22spatialReference%22%3A%7B%22wkid%22%3A4326%7D%7D&geometryType=esriGeometryPoint&pixelSize=1%2C1&f=json', JSON.stringify(sampleResponse));

    task.setPixelSize(pixelSize);
    expect(task.getPixelSize()).to.equal(pixelSize);

    task.run(function(error, results, raw){
      expect(results).to.deep.equal(sampleResults);
      expect(raw).to.deep.equal(sampleResponse);
      done();
    });

    server.respond();
  });

  it('should return catalog items', function(done){
    server.respondWith('GET', imageServiceUrl + 'identify?returnGeometry=true&geometry=%7B%22x%22%3A-122.66%2C%22y%22%3A45.51%2C%22spatialReference%22%3A%7B%22wkid%22%3A4326%7D%7D&geometryType=esriGeometryPoint&returnCatalogItems=true&f=json', JSON.stringify(sampleResponseWithCatalogItems));

    task.returnGeometry(true).returnCatalogItems(true);
    task.run(function(error, results, raw) {
      expect(results).to.deep.equal(sampleResultsWithCatlaogItems);
      expect(raw).to.deep.equal(sampleResponseWithCatalogItems);
      done();
    });

    server.respond();
  });

  it('should return catalog items w/o geometry', function(done){
    var sampleResponseWithCatalogItemsNoGeometry = deepClone(sampleResponseWithCatalogItems);
    var sampleResutlsWithCatalogItemsNoGeomerty = deepClone(sampleResultsWithCatlaogItems);
    for (var i = sampleResponseWithCatalogItemsNoGeometry.catalogItems.features.length - 1; i >= 0; i--) {
      delete(sampleResponseWithCatalogItemsNoGeometry.catalogItems.features[i].geometry);
      sampleResutlsWithCatalogItemsNoGeomerty.catalogItems.features[i].geometry = null;
    }
    server.respondWith('GET', imageServiceUrl + 'identify?returnGeometry=false&geometry=%7B%22x%22%3A-122.66%2C%22y%22%3A45.51%2C%22spatialReference%22%3A%7B%22wkid%22%3A4326%7D%7D&geometryType=esriGeometryPoint&returnCatalogItems=true&f=json', JSON.stringify(sampleResponseWithCatalogItemsNoGeometry));

    task.returnCatalogItems(true);
    task.run(function(error, results, raw) {
      expect(results).to.deep.equal(sampleResutlsWithCatalogItemsNoGeomerty);
      expect(raw).to.deep.equal(sampleResponseWithCatalogItemsNoGeometry);
      done();
    });

    server.respond();
  });

});