describe('L.esri.Layers.FeatureManager', function () {
  function createMap(){
    // create container
    var container = document.createElement('div');

    // give container a width/height
    container.setAttribute('style', 'width:500px; height: 500px;');

    // add contianer to body
    document.body.appendChild(container);

    return L.map(container, {
      minZoom: 1,
      maxZoom: 19
    }).setView([45.51, -122.66], 14);
  }

  var url = 'http://gis.example.com/mock/arcgis/rest/services/MockService/MockFeatureServer/0';
  var layer;
  var sandbox;
  var server;
  var MockLayer;
  var map = createMap();
  var oldRaf;
  var requests;

  beforeEach(function(){
    xhr = sinon.useFakeXMLHttpRequest();
    requests = [];

    xhr.onCreate = function (xhr) {
      requests.push(xhr);
    };
  });

  afterEach(function(){
    requests = [];
  });

  beforeEach(function(){
    server = sinon.fakeServer.create();
    sandbox = sinon.sandbox.create();
    oldRaf = L.esri.Util.requestAnimationFrame;

    MockLayer = L.esri.Layers.FeatureManager.extend({
      createLayers: sandbox.spy(),
      addLayers: sandbox.spy(),
      removeLayers: sandbox.spy()
    });

    layer = new MockLayer({
      url: url,
      timeField: 'Time',
      attribution: 'Esri',
      minZoom : 1,
      maxZoom : 15
    });

    L.esri.Util.requestAnimationFrame = function(cd){
      cd();
    };
  });

  afterEach(function(){
    server.restore();
    sandbox.restore();
    L.esri.Util.requestAnimationFrame = oldRaf;
  });

  var fields = [
    {
      'name': 'OBJECTID',
      'type': 'esriFieldTypeOID',
      'alias': 'OBJECTID',
      'sqlType': 'sqlTypeInteger',
      'domain': null,
      'defaultValue': null
    },{
      'name': 'Name',
      'type': 'esriFieldTypeString',
      'alias': 'Name',
      'sqlType': 'sqlTypeNVarchar',
      'length': 256,
      'domain': null,
      'defaultValue': null
    },{
      'name': 'Type',
      'type': 'esriFieldTypeString',
      'alias': 'Type',
      'sqlType': 'sqlTypeNVarchar',
      'domain': null,
      'defaultValue': null
    },
    {
      'name': 'Time',
      'type': 'esriFieldTypeDate',
      'alias': 'Time',
      'sqlType': 'sqlTypeTimestamp2',
      'domain': null,
      'defaultValue': null
    }
  ];

  var feature1 = {
    'attributes': {
      'OBJECTID': 1,
      'Name': 'Site 1',
      'Type': 'Active',
      'Time': new Date('January 1 2014 GMT-0800').valueOf()
    },
    'geometry': {
      'x': -122.673339,
      'y': 45.537134,
      'spatialReference': {
        'wkid': 4326
      }
    }
  };

  var feature2 = {
    'attributes': {
      'OBJECTID': 2,
      'Name': 'Site 2',
      'Type': 'Inactive',
      'Time': new Date('January 15 2014 GMT-0800').valueOf()
    },
    'geometry': {
      'x': -122.673342,
      'y': 45.537161,
      'spatialReference': {
        'wkid': 4326
      }
    }
  };

  var feature3 = {
    'attributes': {
      'OBJECTID': 3,
      'Name': 'Site 3',
      'Type': 'Active',
      'Time': new Date('January 12 2014 GMT-0800').valueOf()
    },
    'geometry': {
      'x': -122.629394,
      'y': 45.537134,
      'spatialReference': {
        'wkid': 4326
      }
    }
  };

  var feature4 = {
    'attributes': {
      'OBJECTID': 4,
      'Name': 'Site 4',
      'Type': 'Inactive',
      'StartTime': new Date('January 10 2014 GMT-0800').valueOf(),
      'EndTime': new Date('January 11 2014 GMT-0800').valueOf()
    },
    'geometry': {
      'x': -122.673342,
      'y': 45.537161,
      'spatialReference': {
        'wkid': 4326
      }
    }
  };

  var feature5 = {
    'attributes': {
      'OBJECTID': 5,
      'Name': 'Site 5',
      'Type': 'Active',
      'StartTime': new Date('January 14 2014 GMT-0800').valueOf(),
      'EndTime': new Date('January 15 2014 GMT-0800').valueOf()
    },
    'geometry': {
      'x': -122.629394,
      'y': 45.537134,
      'spatialReference': {
        'wkid': 4326
      }
    }
  };

  var feature6 = {
    'attributes': {
      'OBJECTID': 6,
      'Name': 'Site 6',
      'Type': 'Active',
      'StartTime': new Date('January 14 2014 GMT-0800').valueOf(),
      'EndTime': new Date('January 15 2014 GMT-0800').valueOf()
    },
    'geometry': {
      'rings': [
        [
          [-109.02,36.98],
          [-109.02,40.97],
          [-102.06,40.97],
          [-102.06,37.01],
          [-109.02,36.98]
        ]
      ],
      'spatialReference': {
        'wkid': 4326
      }
    }
  };

  it('should be able to add itself to a map', function(){
    layer.addTo(map);
    expect(map.hasLayer(layer)).to.equal(true);
  });

  it('should display an attribution if one was passed', function(){
    layer.addTo(map);
    expect(map.attributionControl._container.innerHTML).to.contain('Esri');
  });

  it('should be able to remove itself to a map', function(){
    layer.addTo(map);
    map.removeLayer(layer);
    map.hasLayer(layer);
    expect(map.hasLayer(layer)).to.equal(false);
  });

  it('should create features based on the current view of the map', function(){
    server.respondWith('GET', 'http://gis.example.com/mock/arcgis/rest/services/MockService/MockFeatureServer/0/query?returnGeometry=true&where=1%3D1&outSr=4326&outFields=*&inSr=4326&geometry=%7B%22xmin%22%3A-122.6953125%2C%22ymin%22%3A45.521743896993634%2C%22xmax%22%3A-122.6513671875%2C%22ymax%22%3A45.55252525134013%2C%22spatialReference%22%3A%7B%22wkid%22%3A4326%7D%7D&geometryType=esriGeometryEnvelope&spatialRel=esriSpatialRelIntersects&geometryPrecision=6&f=json', JSON.stringify({
      fields: fields,
      features: [feature1, feature2],
      objectIdFieldName: 'OBJECTID'
    }));

    layer.addTo(map);

    server.respond();

    expect(layer.createLayers).to.have.been.calledWith([
      {
        'type': 'Feature',
        'geometry': {
          'type': 'Point',
          'coordinates': [-122.673342,45.537161]
        },
        'properties': {
          'OBJECTID': 2,
          'Name': 'Site 2',
          'Type': 'Inactive',
          'Time': new Date('January 15 2014 GMT-0800').valueOf()
        },
        'id': 2
      },
      {
        'type': 'Feature',
        'geometry': {
          'type': 'Point',
          'coordinates': [-122.673339,45.537134]
        },
        'properties': {
          'OBJECTID': 1,
          'Name': 'Site 1',
          'Type': 'Active',
          'Time': new Date('January 1 2014 GMT-0800').valueOf()
        },
        'id': 1
      }
    ]);

  });

  it('should fire a drawlimitexceeded event when there are more features then can be requested', function(done){
    server.respondWith('GET', 'http://gis.example.com/mock/arcgis/rest/services/MockService/MockFeatureServer/0/query?returnGeometry=true&where=1%3D1&outSr=4326&outFields=*&inSr=4326&geometry=%7B%22xmin%22%3A-122.6953125%2C%22ymin%22%3A45.521743896993634%2C%22xmax%22%3A-122.6513671875%2C%22ymax%22%3A45.55252525134013%2C%22spatialReference%22%3A%7B%22wkid%22%3A4326%7D%7D&geometryType=esriGeometryEnvelope&spatialRel=esriSpatialRelIntersects&geometryPrecision=6&f=json', JSON.stringify({
      fields: fields,
      features: [],
      objectIdFieldName: 'OBJECTID',
      exceededTransferLimit: true
    }));

    layer.addTo(map);

    layer.on('drawlimitexceeded', function(e){
      expect(e.type).to.equal('drawlimitexceeded');
      done();
    });

    server.respond();
  });

  it('should filter existing features with a single time field', function(){
    server.respondWith('GET', 'http://gis.example.com/mock/arcgis/rest/services/MockService/MockFeatureServer/0/query?returnGeometry=true&where=1%3D1&outSr=4326&outFields=*&inSr=4326&geometry=%7B%22xmin%22%3A-122.6953125%2C%22ymin%22%3A45.521743896993634%2C%22xmax%22%3A-122.6513671875%2C%22ymax%22%3A45.55252525134013%2C%22spatialReference%22%3A%7B%22wkid%22%3A4326%7D%7D&geometryType=esriGeometryEnvelope&spatialRel=esriSpatialRelIntersects&geometryPrecision=6&f=json', JSON.stringify({
      fields: fields,
      features: [feature2, feature3],
      objectIdFieldName: 'OBJECTID'
    }));

    layer.addTo(map);

    server.respond();

    layer.setTimeRange(new Date('January 11 2014 GMT-0800'), new Date('January 13 2014 GMT-0800'));

    expect(layer.removeLayers).to.have.been.calledWith([2]);
    expect(layer.addLayers).to.have.been.calledWith([3]);

    layer.setTimeRange(new Date('January 14 2014 GMT-0800'), new Date('January 16 2014 GMT-0800'));

    expect(layer.removeLayers).to.have.been.calledWith([3]);
    expect(layer.addLayers).to.have.been.calledWith([2]);
  });

  it('should load more features with a single time field', function(){
    server.respondWith('GET', 'http://gis.example.com/mock/arcgis/rest/services/MockService/MockFeatureServer/0/query?returnGeometry=true&where=1%3D1&outSr=4326&outFields=*&inSr=4326&geometry=%7B%22xmin%22%3A-122.6953125%2C%22ymin%22%3A45.521743896993634%2C%22xmax%22%3A-122.6513671875%2C%22ymax%22%3A45.55252525134013%2C%22spatialReference%22%3A%7B%22wkid%22%3A4326%7D%7D&geometryType=esriGeometryEnvelope&spatialRel=esriSpatialRelIntersects&geometryPrecision=6&time=1385884800000%2C1389340800000&f=json', JSON.stringify({
      fields: fields,
      features: [feature1],
      objectIdFieldName: 'OBJECTID'
    }));

    layer.setTimeRange(new Date('Dec 1 2013 GMT-0800'), new Date('January 10 2014 GMT-0800'));

    layer.addTo(map);

    server.respond();

    expect(layer.createLayers).to.have.been.calledWith([{
      'type': 'Feature',
      'geometry': {
        'type': 'Point',
        'coordinates': [-122.673339,45.537134]
      },
      'properties': {
        'OBJECTID': 1,
        'Name': 'Site 1',
        'Type': 'Active',
        'Time': new Date('January 1 2014 GMT-0800').valueOf()
      },
      'id': 1
    }]);

    server.respondWith('GET', 'http://gis.example.com/mock/arcgis/rest/services/MockService/MockFeatureServer/0/query?returnGeometry=true&where=1%3D1&outSr=4326&outFields=*&inSr=4326&geometry=%7B%22xmin%22%3A-122.6953125%2C%22ymin%22%3A45.521743896993634%2C%22xmax%22%3A-122.6513671875%2C%22ymax%22%3A45.55252525134013%2C%22spatialReference%22%3A%7B%22wkid%22%3A4326%7D%7D&geometryType=esriGeometryEnvelope&spatialRel=esriSpatialRelIntersects&geometryPrecision=6&time=1389686400000%2C1389859200000&f=json', JSON.stringify({
      fields: fields,
      features: [feature2],
      objectIdFieldName: 'OBJECTID'
    }));

    layer.setTimeRange(new Date('January 14 2014 GMT-0800'), new Date('January 16 2014 GMT-0800'));

    server.respond();

    expect(layer.removeLayers).to.have.been.calledWith([1]);

    expect(layer.createLayers).to.have.been.calledWith([{
      'type': 'Feature',
      'geometry': {
        'type': 'Point',
        'coordinates': [-122.673342,45.537161]
      },
      'properties': {
        'OBJECTID': 2,
        'Name': 'Site 2',
        'Type': 'Inactive',
        'Time': new Date('January 15 2014 GMT-0800').valueOf()
      },
      'id': 2
    }]);
  });

  it('should filter existing features with a start and end time field', function(){
    layer = new MockLayer({
      url: url,
      timeField: {
        start: 'StartTime',
        end: 'EndTime'
      }
    });

    server.respondWith('GET', 'http://gis.example.com/mock/arcgis/rest/services/MockService/MockFeatureServer/0/query?returnGeometry=true&where=1%3D1&outSr=4326&outFields=*&inSr=4326&geometry=%7B%22xmin%22%3A-122.6953125%2C%22ymin%22%3A45.521743896993634%2C%22xmax%22%3A-122.6513671875%2C%22ymax%22%3A45.55252525134013%2C%22spatialReference%22%3A%7B%22wkid%22%3A4326%7D%7D&geometryType=esriGeometryEnvelope&spatialRel=esriSpatialRelIntersects&geometryPrecision=6&f=json', JSON.stringify({
      fields: fields,
      features: [feature4, feature5],
      objectIdFieldName: 'OBJECTID'
    }));

    layer.addTo(map);

    server.respond();

    layer.setTimeRange(new Date('January 9 2014 GMT-0800'), new Date('January 12 2014 GMT-0800'));

    expect(layer.removeLayers).to.have.been.calledWith([5]);
    expect(layer.addLayers).to.have.been.calledWith([4, 4]);

    layer.setTimeRange(new Date('January 13 2014 GMT-0800'), new Date('January 16 2014 GMT-0800'));

    expect(layer.removeLayers).to.have.been.calledWith([4, 4]);
    expect(layer.addLayers).to.have.been.calledWith([5, 5]);
  });

  it('should load more features  with a start and end time field', function(){
    layer = new MockLayer({
      url: url,
      timeField: {
        start: 'StartTime',
        end: 'EndTime'
      }
    });

    server.respondWith('GET', 'http://gis.example.com/mock/arcgis/rest/services/MockService/MockFeatureServer/0/query?returnGeometry=true&where=1%3D1&outSr=4326&outFields=*&inSr=4326&geometry=%7B%22xmin%22%3A-122.6953125%2C%22ymin%22%3A45.521743896993634%2C%22xmax%22%3A-122.6513671875%2C%22ymax%22%3A45.55252525134013%2C%22spatialReference%22%3A%7B%22wkid%22%3A4326%7D%7D&geometryType=esriGeometryEnvelope&spatialRel=esriSpatialRelIntersects&geometryPrecision=6&time=1389254400000%2C1389513600000&f=json', JSON.stringify({
      fields: fields,
      features: [feature4],
      objectIdFieldName: 'OBJECTID'
    }));

    layer.setTimeRange(new Date('January 9 2014 GMT-0800'), new Date('January 12 2014 GMT-0800'));
    layer.addTo(map);

    server.respond();

    expect(layer.createLayers).to.have.been.calledWith([{
      'geometry': {
        'type': 'Point',
        'coordinates': [-122.673342,45.537161]
      },
      'id': 4,
      'properties': {
        'OBJECTID': 4,
        'Name': 'Site 4',
        'Type': 'Inactive',
        'StartTime': new Date('January 10 2014 GMT-0800').valueOf(),
        'EndTime': new Date('January 11 2014 GMT-0800').valueOf()
      },
      'type': 'Feature'
    }]);

    server.respondWith('GET', 'http://gis.example.com/mock/arcgis/rest/services/MockService/MockFeatureServer/0/query?returnGeometry=true&where=1%3D1&outSr=4326&outFields=*&inSr=4326&geometry=%7B%22xmin%22%3A-122.6953125%2C%22ymin%22%3A45.521743896993634%2C%22xmax%22%3A-122.6513671875%2C%22ymax%22%3A45.55252525134013%2C%22spatialReference%22%3A%7B%22wkid%22%3A4326%7D%7D&geometryType=esriGeometryEnvelope&spatialRel=esriSpatialRelIntersects&geometryPrecision=6&time=1389600000000%2C1389859200000&f=json', JSON.stringify({
      fields: fields,
      features: [feature5],
      objectIdFieldName: 'OBJECTID'
    }));

    var callback = sinon.spy();

    layer.setTimeRange(new Date('January 13 2014 GMT-0800'), new Date('January 16 2014 GMT-0800'), callback);

    server.respond();

    expect(callback).to.have.been.called;
    expect(layer.removeLayers).to.have.been.calledWith([4, 4]);
    expect(layer.createLayers).to.have.been.calledWith([{
      'geometry': {
        'type': 'Point',
        'coordinates': [-122.629394,45.537134]
      },
      'id': 5,
      'properties': {
        'OBJECTID': 5,
        'Name': 'Site 5',
        'Type': 'Active',
        'StartTime': new Date('January 14 2014 GMT-0800').valueOf(),
        'EndTime': new Date('January 15 2014 GMT-0800').valueOf()
      },
      'type': 'Feature'
    }]);
  });

  it('should filter features with a where parameter', function(){
    server.respondWith('GET', /Type%3D\'Active\'/g, JSON.stringify({
      fields: fields,
      features: [feature1],
      objectIdFieldName: 'OBJECTID'
    }));

    server.respondWith('GET', /Type%3D\'Inactive\'/g, JSON.stringify({
      fields: fields,
      features: [feature2],
      objectIdFieldName: 'OBJECTID'
    }));

    layer.setWhere('Type=\'Active\'');

    layer.addTo(map);
    server.respond();

    expect(layer.createLayers).to.have.been.calledWith([{
      'type': 'Feature',
      'geometry': {
        'type': 'Point',
        'coordinates': [-122.673339,45.537134]
      },
      'properties': {
        'OBJECTID': 1,
        'Name': 'Site 1',
        'Type': 'Active',
        'Time': new Date('January 1 2014 GMT-0800').valueOf()
      },
      'id': 1
    }]);

    var callback = sinon.spy();

    layer.setWhere('Type=\'Inactive\'', callback);

    server.respond();

    expect(callback).to.have.been.called;
    expect(layer.removeLayers.getCall(0).args[0][0]).to.equal(1);
    expect(layer.createLayers).to.have.been.calledWith([{
      'type': 'Feature',
      'geometry': {
        'type': 'Point',
        'coordinates': [-122.673342,45.537161]
      },
      'properties': {
        'OBJECTID': 2,
        'Name': 'Site 2',
        'Type': 'Inactive',
        'Time': new Date('January 15 2014 GMT-0800').valueOf()
      },
      'id': 2
    }]);
  });

  it('should return true for features with a single time field in the current time range', function(){
    layer.setTimeRange(new Date('Dec 1 2013 GMT-0800'), new Date('January 10 2014 GMT-0800'));

    expect(layer._featureWithinTimeRange({
      'type': 'Feature',
      'geometry': {
        'type': 'Point',
        'coordinates': [-122.673339,45.537134]
      },
      'properties': {
        'OBJECTID': 1,
        'Name': 'Site 1',
        'Type': 'Active',
        'Time': new Date('January 1 2014 GMT-0800').valueOf()
      },
      'id': 1
    })).to.equal(true);

    expect(layer._featureWithinTimeRange({
      'type': 'Feature',
      'geometry': {
        'type': 'Point',
        'coordinates': [-122.673342,45.537161]
      },
      'properties': {
        'OBJECTID': 2,
        'Name': 'Site 2',
        'Type': 'Inactive',
        'Time': new Date('January 15 2014 GMT-0800').valueOf()
      },
      'id': 2
    })).not.to.equal(true);
  });

  it('should return true for features with a single feature with start and end time fields in the current time range', function(){
    var layer = new L.esri.Layers.FeatureManager({
      url: url,
      from: new Date('Dec 1 2013 GMT-0800'),
      to: new Date('January 12 2014 GMT-0800'),
      timeField: {
        start: 'StartTime',
        end: 'EndTime'
      }
    });

    expect(layer._featureWithinTimeRange({
      'type': 'Feature',
      'geometry': {
        'type': 'Point',
        'coordinates': [-122.673339,45.537134]
      },
      'properties': {
        'OBJECTID': 1,
        'Name': 'Site 1',
        'Type': 'Active',
        'StartTime': new Date('January 10 2014 GMT-0800').valueOf(),
        'EndTime': new Date('January 11 2014 GMT-0800').valueOf()
      },
      'id': 1
    })).to.equal(true);

    expect(layer._featureWithinTimeRange({
      'type': 'Feature',
      'geometry': {
        'type': 'Point',
        'coordinates': [-122.673342,45.537161]
      },
      'properties': {
        'OBJECTID': 2,
        'Name': 'Site 2',
        'Type': 'Inactive',
        'StartTime': new Date('January 14 2014 GMT-0800').valueOf(),
        'EndTime': new Date('January 15 2014 GMT-0800').valueOf()
      },
      'id': 2
    })).to.equal(false);
  });

  it('should return false when no time range is set', function(){
    expect(layer._featureWithinTimeRange({
      'type': 'Feature',
      'geometry': {
        'type': 'Point',
        'coordinates': [-122.673339,45.537134]
      },
      'properties': {
        'OBJECTID': 1,
        'Name': 'Site 1',
        'Type': 'Active',
        'StartTime': new Date('January 10 2014 GMT-0800').valueOf(),
        'EndTime': new Date('January 11 2014 GMT-0800').valueOf()
      },
      'id': 1
    })).to.equal(true);
  });

  it('should be able to get the time range', function(){
    layer.setTimeRange(new Date('January 13 2014 GMT-0800'), new Date('January 16 2014 GMT-0800'));
    expect(layer.getTimeRange()).to.deep.equal([new Date('January 13 2014 GMT-0800'), new Date('January 16 2014 GMT-0800')]);
  });

  it('should be able to get the where', function(){
    expect(layer.getWhere()).to.equal('1=1');
  });

  it('should be able to reset the where', function(){
    layer.setWhere('Type="Active"');
    layer.setWhere();
    expect(layer.getWhere()).to.equal('1=1');
  });

  it('should expose the authenticate method on the underlying service', function(){
    var spy = sinon.spy(layer._service, 'authenticate');
    layer.authenticate('foo');
    expect(spy).to.have.been.calledWith('foo');
  });

  it('should expose the metadata method on the underlying service', function(){
    var spy = sinon.spy(layer._service, 'metadata');
    var callback = sinon.spy();
    layer.metadata(callback);
    expect(spy).to.have.been.calledWith(callback);
  });

  it('should expose the query method on the underlying service', function(){
    var spy = sinon.spy(layer._service, 'query');
    var query = layer.query();
    expect(query).to.be.an.instanceof(L.esri.Tasks.Query);
    expect(query._service).to.equal(layer._service);
  });

  // this is now really difficult with fakeServer. Should use a simple request list.
  // xit('should wrap the addFeature method on the underlying service', function(done){
  //   layer._metadata = {
  //     objectIdField: 'OBJECTID'
  //   };

  //   layer.addFeature({
  //     type: 'Feature',
  //     geometry: {
  //       type: 'Point',
  //       coordinates: [45, -121]
  //     },
  //     properties: {
  //       foo: 'bar'
  //     }
  //   }, function(error, response){
  //     expect(response).to.deep.equal({
  //       'objectId': 1,
  //       'success': true
  //     });

  //     done();
  //   });

  //   requests[0].respond(200, { 'Content-Type': 'text/plain; charset=utf-8' }, JSON.stringify({
  //     'addResults' : [{
  //       'objectId' : 1,
  //       'success' : true
  //     }]
  //   }));
  // });

  it('should wrap the updateFeature method on the underlying service and refresh', function(done){
    server.respondWith('POST', 'http://gis.example.com/mock/arcgis/rest/services/MockService/MockFeatureServer/0/updateFeatures', JSON.stringify({
      'updateResults' : [{
        'objectId' : 1,
        'success' : true
      }]
    }));

    layer.updateFeature({
      type: 'Feature',
      id: 1,
      geometry: {
        type: 'Point',
        coordinates: [45, -121]
      },
      properties: {
        foo: 'bar'
      }
    }, function(error, response){
      expect(response).to.deep.equal({
        'objectId': 1,
        'success': true
      });
      done();
    });

    server.respond();
  });

  it('should wrap the removeFeature method on the underlying service', function(done){
    server.respondWith('POST', 'http://gis.example.com/mock/arcgis/rest/services/MockService/MockFeatureServer/0/deleteFeatures', JSON.stringify({
      'deleteResults' : [{
        'objectId' : 1,
        'success' : true
      }]
    }));

    layer.deleteFeature(1, function(error, response){
      expect(layer.removeLayers).to.have.been.calledWith([1]);
      expect(response).to.deep.equal({
        'objectId': 1,
        'success': true
      });
      done();
    });

    server.respond();
  });

  it('should wrap the removeFeatures method on the underlying service', function(done){
    server.respondWith('POST', 'http://gis.example.com/mock/arcgis/rest/services/MockService/MockFeatureServer/0/deleteFeatures', JSON.stringify({
      'deleteResults' : [{
        'objectId' : 1,
        'success' : true
      },{
        'objectId' : 2,
        'success' : true
      }]
    }));

    layer.deleteFeatures([1,2], function(error, response){
      expect(layer.removeLayers).to.have.been.calledWith([1]);
      expect(layer.removeLayers).to.have.been.calledWith([2]);
      expect(response[1]).to.deep.equal({
        'objectId': 2,
        'success': true
      });
      done();
    });

    server.respond();
  });

  it('should support generalizing geometries', function(){
    server.respondWith('GET', 'http://gis.example.com/mock/arcgis/rest/services/MockService/MockFeatureServer/0/query?returnGeometry=true&where=1%3D1&outSr=4326&outFields=*&inSr=4326&geometry=%7B%22xmin%22%3A-122.6953125%2C%22ymin%22%3A45.521743896993634%2C%22xmax%22%3A-122.6513671875%2C%22ymax%22%3A45.55252525134013%2C%22spatialReference%22%3A%7B%22wkid%22%3A4326%7D%7D&geometryType=esriGeometryEnvelope&spatialRel=esriSpatialRelIntersects&geometryPrecision=6&maxAllowableOffset=0.00004291534423829546&f=json', JSON.stringify({
      fields: fields,
      features: [feature6],
      objectIdFieldName: 'OBJECTID',
    }));

    var layer = new MockLayer({
      url: 'http://gis.example.com/mock/arcgis/rest/services/MockService/MockFeatureServer/0/',
      simplifyFactor: 0.5
    });

    layer.addTo(map);

    server.respond();

    expect(layer.createLayers).to.have.been.calledWith([{
      'type': 'Feature',
      'geometry': {
        'type': 'Polygon',
        'coordinates': [
          [
            [-109.02,36.98],
            [-109.02,40.97],
            [-102.06,40.97],
            [-102.06,37.01],
            [-109.02,36.98]
          ]
        ]
      },
      'properties': {
        'OBJECTID': 6,
        'Name': 'Site 6',
        'Type': 'Active',
        'StartTime': new Date('January 14 2014 GMT-0800').valueOf(),
        'EndTime': new Date('January 15 2014 GMT-0800').valueOf()
      },
      'id': 6
    }]);
  });

  it('should propagate events from the service', function(){
    server.respondWith('GET', 'http://gis.example.com/mock/arcgis/rest/services/MockService/MockFeatureServer/0/query?returnGeometry=true&where=1%3D1&outSr=4326&outFields=*&inSr=4326&geometry=%7B%22xmin%22%3A-122.6953125%2C%22ymin%22%3A45.521743896993634%2C%22xmax%22%3A-122.6513671875%2C%22ymax%22%3A45.55252525134013%2C%22spatialReference%22%3A%7B%22wkid%22%3A4326%7D%7D&geometryType=esriGeometryEnvelope&spatialRel=esriSpatialRelIntersects&geometryPrecision=6&f=json', JSON.stringify({
      fields: fields,
      features: [],
      objectIdFieldName: 'OBJECTID',
      exceededTransferLimit: true
    }));

    var requeststartSpy = sinon.spy();
    var requestendSpy = sinon.spy();

    layer.on('requeststart', requeststartSpy);
    layer.on('requestend', requestendSpy);

    layer.addTo(map);

    server.respond();

    expect(requeststartSpy.callCount).to.be.above(0);
    expect(requestendSpy.callCount).to.be.above(0);
  });

  it('should NOT create layers when the zoom level is outside allowed range', function (done) {

    map.setZoom(14);

    server.respondWith('GET', 'http://services.arcgis.com/mock/arcgis/rest/services/MockService/MockFeatureServer/0/query?returnGeometry=true&where=1%3D1&outSr=4326&outFields=*&inSr=4326&geometry=%7B%22xmin%22%3A-122.6953125%2C%22ymin%22%3A45.521743896993634%2C%22xmax%22%3A-122.6513671875%2C%22ymax%22%3A45.55252525134013%2C%22spatialReference%22%3A%7B%22wkid%22%3A4326%7D%7D&geometryType=esriGeometryEnvelope&spatialRel=esriSpatialRelIntersects&geometryPrecision=6&f=json', JSON.stringify({
      fields: fields,
      features: [feature1, feature2],
      objectIdFieldName: 'OBJECTID'
    }));

    layer.addTo(map);

    map.once('zoomend', function () {

      server.respond();

      expect(layer.createLayers).not.to.have.been.called;
      done();
    });

    map.setZoom(17);


  });

  // this test needs reworked
  // it('should create layers when the zoom level is inside allowed range', function (done) {

  //   map.setZoom(14);

  //   server.respondWith('GET', 'http://services.arcgis.com/mock/arcgis/rest/services/MockService/MockFeatureServer/0/query?returnGeometry=true&where=1%3D1&outSr=4326&outFields=*&inSr=4326&geometry=%7B%22xmin%22%3A-122.6953125%2C%22ymin%22%3A45.521743896993634%2C%22xmax%22%3A-122.6513671875%2C%22ymax%22%3A45.55252525134013%2C%22spatialReference%22%3A%7B%22wkid%22%3A4326%7D%7D&geometryType=esriGeometryEnvelope&spatialRel=esriSpatialRelIntersects&geometryPrecision=6&f=json', JSON.stringify({
  //     fields: fields,
  //     features: [feature1, feature2],
  //     objectIdFieldName: 'OBJECTID'
  //   }));

  //   layer.addTo(map);

  //   map.once('zoomend', function () {

  //     server.respond();

  //     expect(layer.createLayers).to.have.been.called;
  //     done();
  //   });

  //   map.setZoom(11);


  // });

});
