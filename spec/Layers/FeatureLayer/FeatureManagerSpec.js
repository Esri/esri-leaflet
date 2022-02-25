/* eslint-env mocha */
/* eslint-disable handle-callback-err */
/* eslint-disable no-unused-expressions */
describe('L.esri.FeatureManager', function () {
  function createMap () {
    // create container
    var container = document.createElement('div');

    // give container a width/height
    container.setAttribute('style', 'width:500px; height: 500px;');

    // add container to body
    document.body.appendChild(container);

    return L.map(container, {
      minZoom: 1,
      maxZoom: 19
      // trackResize: false
    }).setView([45.51, -122.66], 14);
  }

  var url =
    'http://gis.example.com/mock/arcgis/rest/services/MockService/MockFeatureServer/0';
  var urlWithParams =
    'http://gis.example.com/mock/arcgis/rest/services/MockService/MockFeatureServer/0?foo=bar';
  var layer;
  var sandbox;
  var server;
  var MockLayer;
  var map;
  var oldRaf;
  var requests;
  var xhr;

  beforeEach(function () {
    xhr = sinon.useFakeXMLHttpRequest(); // eslint-disable-line no-native-reassign
    requests = [];

    xhr.onCreate = function (xhr) {
      requests.push(xhr);
    };

    server = sinon.fakeServer.create();
    sandbox = sinon.createSandbox();
    oldRaf = L.Util.requestAnimFrame;

    MockLayer = L.esri.FeatureManager.extend({
      createLayers: sandbox.spy(),
      addLayers: sandbox.spy(),
      removeLayers: sandbox.spy()
    });

    layer = new MockLayer({
      url: url,
      timeField: 'Time',
      attribution: 'Esri',
      minZoom: 1,
      maxZoom: 15
    });

    map = createMap();
    L.Util.requestAnimFrame = function (cd, context) {
      cd.call(context);
    };
  });

  afterEach(function () {
    xhr.restore();
    requests = [];
    server.restore();
    sandbox.restore();
    L.Util.requestAnimFrame = oldRaf;
  });

  var fields = [
    {
      name: 'OBJECTID',
      type: 'esriFieldTypeOID',
      alias: 'OBJECTID',
      sqlType: 'sqlTypeInteger',
      domain: null,
      defaultValue: null
    },
    {
      name: 'Name',
      type: 'esriFieldTypeString',
      alias: 'Name',
      sqlType: 'sqlTypeNVarchar',
      length: 256,
      domain: null,
      defaultValue: null
    },
    {
      name: 'Type',
      type: 'esriFieldTypeString',
      alias: 'Type',
      sqlType: 'sqlTypeNVarchar',
      domain: null,
      defaultValue: null
    },
    {
      name: 'Time',
      type: 'esriFieldTypeDate',
      alias: 'Time',
      sqlType: 'sqlTypeTimestamp2',
      domain: null,
      defaultValue: null
    }
  ];

  var feature1 = {
    attributes: {
      OBJECTID: 1,
      Name: 'Site 1',
      Type: 'Active',
      Time: new Date('January 1 2014 GMT-0800').valueOf()
    },
    geometry: {
      x: -122.673339,
      y: 45.537134,
      spatialReference: {
        wkid: 4326
      }
    }
  };

  var feature2 = {
    attributes: {
      OBJECTID: 2,
      Name: 'Site 2',
      Type: 'Inactive',
      Time: new Date('January 15 2014 GMT-0800').valueOf()
    },
    geometry: {
      x: -122.673342,
      y: 45.537161,
      spatialReference: {
        wkid: 4326
      }
    }
  };

  var feature3 = {
    attributes: {
      OBJECTID: 3,
      Name: 'Site 3',
      Type: 'Active',
      Time: new Date('January 12 2014 GMT-0800').valueOf()
    },
    geometry: {
      x: -122.629394,
      y: 45.537134,
      spatialReference: {
        wkid: 4326
      }
    }
  };

  var feature4 = {
    attributes: {
      OBJECTID: 4,
      Name: 'Site 4',
      Type: 'Inactive',
      StartTime: new Date('January 10 2014 GMT-0800').valueOf(),
      EndTime: new Date('January 11 2014 GMT-0800').valueOf()
    },
    geometry: {
      x: -122.673342,
      y: 45.537161,
      spatialReference: {
        wkid: 4326
      }
    }
  };

  var feature5 = {
    attributes: {
      OBJECTID: 5,
      Name: 'Site 5',
      Type: 'Active',
      StartTime: new Date('January 14 2014 GMT-0800').valueOf(),
      EndTime: new Date('January 15 2014 GMT-0800').valueOf()
    },
    geometry: {
      x: -122.629394,
      y: 45.537134,
      spatialReference: {
        wkid: 4326
      }
    }
  };

  var feature6 = {
    attributes: {
      OBJECTID: 6,
      Name: 'Site 6',
      Type: 'Active',
      StartTime: new Date('January 14 2014 GMT-0800').valueOf(),
      EndTime: new Date('January 15 2014 GMT-0800').valueOf()
    },
    geometry: {
      rings: [
        [
          [-109.02, 36.98],
          [-109.02, 40.97],
          [-102.06, 40.97],
          [-102.06, 37.01],
          [-109.02, 36.98]
        ]
      ],
      spatialReference: {
        wkid: 4326
      }
    }
  };

  // geojson:
  var feature7 = {
    type: 'Feature',
    geometry:
    {
      type: 'Polygon',
      coordinates:
      [
        [
          [-90.3038149502124, 38.6539545785218],
          [-90.3038498654697, 38.6539303067945],
          [-90.3038737094094, 38.6539138632284],
          [-90.3039181787535, 38.6538794680055],
          [-90.3042877084603, 38.6542092694323],
          [-90.3042196068492, 38.6542595646522],
          [-90.3041648638806, 38.6542969769789],
          [-90.3038149502124, 38.6539545785218]
        ]
      ]
    },
    properties: null
  };

  var feature8 = {
    type: 'Feature',
    geometry:
    {
      type: 'Polygon',
      coordinates:
      [
        [
          [-90.3038149502124, 38.6539545785218],
          [-90.3038498654697, 38.6539303067945],
          [-90.3038737094094, 38.6539138632284]
        ]
      ]
    },
    properties: null
  };

  it('should be able to add itself to a map', function () {
    layer.addTo(map);
    expect(map.hasLayer(layer)).to.equal(true);
  });

  it('should display an attribution if one was passed', function () {
    layer.addTo(map);
    expect(map.attributionControl._container.innerHTML).to.contain('Esri');
  });

  it('should store additional params passed in url', function () {
    layer = new MockLayer({
      url: urlWithParams
    }).addTo(map);

    expect(layer.options.requestParams).to.deep.equal({ foo: 'bar' });
    expect(layer.options.url).to.deep.equal(url + '/');
  });

  it('should use additional params passed in options', function () {
    server.respondWith(
      'GET',
      'http://gis.example.com/mock/arcgis/rest/services/MockService/MockFeatureServer/0/query?returnGeometry=true&where=1%3D1&outSR=4326&outFields=*&inSR=4326&geometry=%7B%22xmin%22%3A-122.6953125%2C%22ymin%22%3A45.49094569262732%2C%22xmax%22%3A-122.6513671875%2C%22ymax%22%3A45.521743896993634%2C%22spatialReference%22%3A%7B%22wkid%22%3A4326%7D%7D&geometryType=esriGeometryEnvelope&spatialRel=esriSpatialRelIntersects&geometryPrecision=6&resultType=tile&foo=bar&f=json',
      JSON.stringify({
        fields: fields,
        features: [feature2],
        objectIdFieldName: 'OBJECTID'
      })
    );

    layer = new MockLayer({
      url: url,
      requestParams: {
        foo: 'bar'
      }
    });

    layer.addTo(map);

    server.respond();
    expect(layer.createLayers).to.have.been.calledWith([
      {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [-122.673342, 45.537161]
        },
        properties: {
          OBJECTID: 2,
          Name: 'Site 2',
          Type: 'Inactive',
          Time: new Date('January 15 2014 GMT-0800').valueOf()
        },
        id: 2
      }
    ]);
  });

  it('should be able to remove itself from a map', function () {
    layer.addTo(map);
    map.removeLayer(layer);
    map.hasLayer(layer);
    expect(map.hasLayer(layer)).to.equal(false);
  });

  it('should create features based on the current view of the map', function () {
    server.respondWith(
      'GET',
      'http://gis.example.com/mock/arcgis/rest/services/MockService/MockFeatureServer/0/query?returnGeometry=true&where=1%3D1&outSR=4326&outFields=*&inSR=4326&geometry=%7B%22xmin%22%3A-122.6953125%2C%22ymin%22%3A45.521743896993634%2C%22xmax%22%3A-122.6513671875%2C%22ymax%22%3A45.55252525134013%2C%22spatialReference%22%3A%7B%22wkid%22%3A4326%7D%7D&geometryType=esriGeometryEnvelope&spatialRel=esriSpatialRelIntersects&geometryPrecision=6&resultType=tile&f=json',
      JSON.stringify({
        fields: fields,
        features: [feature1, feature2],
        objectIdFieldName: 'OBJECTID'
      })
    );

    layer.addTo(map);

    server.respond();

    expect(layer.createLayers).to.have.been.calledWith([
      {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [-122.673342, 45.537161]
        },
        properties: {
          OBJECTID: 2,
          Name: 'Site 2',
          Type: 'Inactive',
          Time: new Date('January 15 2014 GMT-0800').valueOf()
        },
        id: 2
      },
      {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [-122.673339, 45.537134]
        },
        properties: {
          OBJECTID: 1,
          Name: 'Site 1',
          Type: 'Active',
          Time: new Date('January 1 2014 GMT-0800').valueOf()
        },
        id: 1
      }
    ]);
  });

  it('should fire a drawlimitexceeded event when there are more features then can be requested', function (done) {
    server.respondWith(
      'GET',
      'http://gis.example.com/mock/arcgis/rest/services/MockService/MockFeatureServer/0/query?returnGeometry=true&where=1%3D1&outSR=4326&outFields=*&inSR=4326&geometry=%7B%22xmin%22%3A-122.6953125%2C%22ymin%22%3A45.521743896993634%2C%22xmax%22%3A-122.6513671875%2C%22ymax%22%3A45.55252525134013%2C%22spatialReference%22%3A%7B%22wkid%22%3A4326%7D%7D&geometryType=esriGeometryEnvelope&spatialRel=esriSpatialRelIntersects&geometryPrecision=6&resultType=tile&f=json',
      JSON.stringify({
        fields: fields,
        features: [],
        objectIdFieldName: 'OBJECTID',
        exceededTransferLimit: true
      })
    );

    layer.addTo(map);

    layer.on('drawlimitexceeded', function (e) {
      expect(e.type).to.equal('drawlimitexceeded');
      done();
    });

    server.respond();
  });

  it('should filter existing features with a single time field', function () {
    server.respondWith(
      'GET',
      'http://gis.example.com/mock/arcgis/rest/services/MockService/MockFeatureServer/0/query?returnGeometry=true&where=1%3D1&outSR=4326&outFields=*&inSR=4326&geometry=%7B%22xmin%22%3A-122.6953125%2C%22ymin%22%3A45.521743896993634%2C%22xmax%22%3A-122.6513671875%2C%22ymax%22%3A45.55252525134013%2C%22spatialReference%22%3A%7B%22wkid%22%3A4326%7D%7D&geometryType=esriGeometryEnvelope&spatialRel=esriSpatialRelIntersects&geometryPrecision=6&resultType=tile&f=json',
      JSON.stringify({
        fields: fields,
        features: [feature2, feature3],
        objectIdFieldName: 'OBJECTID'
      })
    );

    layer.addTo(map);

    server.respond();

    layer.setTimeRange(
      new Date('January 11 2014 GMT-0800'),
      new Date('January 13 2014 GMT-0800')
    );

    expect(layer.removeLayers).to.have.been.calledWith([2]);
    expect(layer.addLayers).to.have.been.calledWith([3]);

    layer.setTimeRange(
      new Date('January 14 2014 GMT-0800'),
      new Date('January 16 2014 GMT-0800')
    );

    expect(layer.removeLayers).to.have.been.calledWith([3]);
    expect(layer.addLayers).to.have.been.calledWith([2]);
  });

  it('should warn if you call setTimeRange but have not set a TimeField', function () {
    var consoleWarnSpy = sinon.spy(console, 'warn');

    var basiclayer = new MockLayer({
      url: url
    });

    server.respondWith(
      'GET',
      'http://gis.example.com/mock/arcgis/rest/services/MockService/MockFeatureServer/0/query?returnGeometry=true&where=1%3D1&outSR=4326&outFields=*&inSR=4326&geometry=%7B%22xmin%22%3A-122.6953125%2C%22ymin%22%3A45.521743896993634%2C%22xmax%22%3A-122.6513671875%2C%22ymax%22%3A45.55252525134013%2C%22spatialReference%22%3A%7B%22wkid%22%3A4326%7D%7D&geometryType=esriGeometryEnvelope&spatialRel=esriSpatialRelIntersects&geometryPrecision=6&resultType=tile&f=json',
      JSON.stringify({
        fields: fields,
        features: [feature2, feature3],
        objectIdFieldName: 'OBJECTID'
      })
    );

    basiclayer.addTo(map);

    server.respond();

    basiclayer.setTimeRange(
      new Date('January 11 2014 GMT-0800'),
      new Date('January 13 2014 GMT-0800')
    );
    expect(consoleWarnSpy).to.have.been.calledWith(
      'You must set timeField in the layer constructor in order to manipulate the start and end time filter.'
    );
  });

  it('should load more features with a single time field', function () {
    server.respondWith(
      'GET',
      'http://gis.example.com/mock/arcgis/rest/services/MockService/MockFeatureServer/0/query?returnGeometry=true&where=1%3D1&outSR=4326&outFields=*&inSR=4326&geometry=%7B%22xmin%22%3A-122.6513671875%2C%22ymin%22%3A45.49094569262732%2C%22xmax%22%3A-122.607421875%2C%22ymax%22%3A45.521743896993634%2C%22spatialReference%22%3A%7B%22wkid%22%3A4326%7D%7D&geometryType=esriGeometryEnvelope&spatialRel=esriSpatialRelIntersects&geometryPrecision=6&resultType=tile&time=1385884800000%2C1389340800000&f=json',
      JSON.stringify({
        fields: fields,
        features: [feature1],
        objectIdFieldName: 'OBJECTID'
      })
    );

    layer.setTimeRange(
      new Date('Dec 1 2013 GMT-0800'),
      new Date('January 10 2014 GMT-0800')
    );

    layer.addTo(map);

    server.respond();
    // console.log(1, server.lastRequest.url);

    expect(layer.createLayers).to.have.been.calledWith([
      {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [-122.673339, 45.537134]
        },
        properties: {
          OBJECTID: 1,
          Name: 'Site 1',
          Type: 'Active',
          Time: new Date('January 1 2014 GMT-0800').valueOf()
        },
        id: 1
      }
    ]);

    server.respondWith(
      'GET',
      'http://gis.example.com/mock/arcgis/rest/services/MockService/MockFeatureServer/0/query?returnGeometry=true&where=1%3D1&outSR=4326&outFields=*&inSR=4326&geometry=%7B%22xmin%22%3A-122.6513671875%2C%22ymin%22%3A45.49094569262732%2C%22xmax%22%3A-122.607421875%2C%22ymax%22%3A45.521743896993634%2C%22spatialReference%22%3A%7B%22wkid%22%3A4326%7D%7D&geometryType=esriGeometryEnvelope&spatialRel=esriSpatialRelIntersects&geometryPrecision=6&resultType=tile&time=1389686400000%2C1389859200000&f=json',
      JSON.stringify({
        fields: fields,
        features: [feature2],
        objectIdFieldName: 'OBJECTID'
      })
    );

    layer.setTimeRange(
      new Date('January 14 2014 GMT-0800'),
      new Date('January 16 2014 GMT-0800')
    );

    server.respond();
    // console.log(2, server.lastRequest.url);
    expect(layer.removeLayers).to.have.been.calledWith([1]);

    expect(layer.createLayers).to.have.been.calledWith([
      {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [-122.673342, 45.537161]
        },
        properties: {
          OBJECTID: 2,
          Name: 'Site 2',
          Type: 'Inactive',
          Time: new Date('January 15 2014 GMT-0800').valueOf()
        },
        id: 2
      }
    ]);
  });

  it('should filter existing features with a start and end time field', function () {
    layer = new MockLayer({
      url: url,
      timeField: {
        start: 'StartTime',
        end: 'EndTime'
      }
    });

    server.respondWith(
      'GET',
      'http://gis.example.com/mock/arcgis/rest/services/MockService/MockFeatureServer/0/query?returnGeometry=true&where=1%3D1&outSR=4326&outFields=*&inSR=4326&geometry=%7B%22xmin%22%3A-122.6953125%2C%22ymin%22%3A45.521743896993634%2C%22xmax%22%3A-122.6513671875%2C%22ymax%22%3A45.55252525134013%2C%22spatialReference%22%3A%7B%22wkid%22%3A4326%7D%7D&geometryType=esriGeometryEnvelope&spatialRel=esriSpatialRelIntersects&geometryPrecision=6&resultType=tile&f=json',
      JSON.stringify({
        fields: fields,
        features: [feature4, feature5],
        objectIdFieldName: 'OBJECTID'
      })
    );

    layer.addTo(map);

    server.respond();

    layer.setTimeRange(
      new Date('January 9 2014 GMT-0800'),
      new Date('January 12 2014 GMT-0800')
    );

    expect(layer.removeLayers).to.have.been.calledWith([5]);
    expect(layer.addLayers).to.have.been.calledWith([4, 4]);

    layer.setTimeRange(
      new Date('January 13 2014 GMT-0800'),
      new Date('January 16 2014 GMT-0800')
    );

    expect(layer.removeLayers).to.have.been.calledWith([4, 4]);
    expect(layer.addLayers).to.have.been.calledWith([5, 5]);
  });

  it('should load more features with a start and end time field', function () {
    layer = new MockLayer({
      url: url,
      timeField: {
        start: 'StartTime',
        end: 'EndTime'
      }
    });

    server.respondWith(
      'GET',
      'http://gis.example.com/mock/arcgis/rest/services/MockService/MockFeatureServer/0/query?returnGeometry=true&where=1%3D1&outSR=4326&outFields=*&inSR=4326&geometry=%7B%22xmin%22%3A-122.6513671875%2C%22ymin%22%3A45.49094569262732%2C%22xmax%22%3A-122.607421875%2C%22ymax%22%3A45.521743896993634%2C%22spatialReference%22%3A%7B%22wkid%22%3A4326%7D%7D&geometryType=esriGeometryEnvelope&spatialRel=esriSpatialRelIntersects&geometryPrecision=6&resultType=tile&time=1389254400000%2C1389513600000&f=json',
      JSON.stringify({
        fields: fields,
        features: [feature4],
        objectIdFieldName: 'OBJECTID'
      })
    );

    layer.setTimeRange(
      new Date('January 9 2014 GMT-0800'),
      new Date('January 12 2014 GMT-0800')
    );
    layer.addTo(map);

    server.respond();
    expect(layer.createLayers).to.have.been.calledWith([
      {
        geometry: {
          type: 'Point',
          coordinates: [-122.673342, 45.537161]
        },
        id: 4,
        properties: {
          OBJECTID: 4,
          Name: 'Site 4',
          Type: 'Inactive',
          StartTime: new Date('January 10 2014 GMT-0800').valueOf(),
          EndTime: new Date('January 11 2014 GMT-0800').valueOf()
        },
        type: 'Feature'
      }
    ]);

    server.respondWith(
      'GET',
      'http://gis.example.com/mock/arcgis/rest/services/MockService/MockFeatureServer/0/query?returnGeometry=true&where=1%3D1&outSR=4326&outFields=*&inSR=4326&geometry=%7B%22xmin%22%3A-122.6513671875%2C%22ymin%22%3A45.49094569262732%2C%22xmax%22%3A-122.607421875%2C%22ymax%22%3A45.521743896993634%2C%22spatialReference%22%3A%7B%22wkid%22%3A4326%7D%7D&geometryType=esriGeometryEnvelope&spatialRel=esriSpatialRelIntersects&geometryPrecision=6&resultType=tile&time=1389600000000%2C1389859200000&f=json',
      JSON.stringify({
        fields: fields,
        features: [feature5],
        objectIdFieldName: 'OBJECTID'
      })
    );

    var callback = sinon.spy();

    layer.setTimeRange(
      new Date('January 13 2014 GMT-0800'),
      new Date('January 16 2014 GMT-0800'),
      callback
    );

    server.respond();
    expect(callback).to.have.been.called;
    expect(layer.removeLayers).to.have.been.calledWith([4, 4]);
    expect(layer.createLayers).to.have.been.calledWith([
      {
        geometry: {
          type: 'Point',
          coordinates: [-122.629394, 45.537134]
        },
        id: 5,
        properties: {
          OBJECTID: 5,
          Name: 'Site 5',
          Type: 'Active',
          StartTime: new Date('January 14 2014 GMT-0800').valueOf(),
          EndTime: new Date('January 15 2014 GMT-0800').valueOf()
        },
        type: 'Feature'
      }
    ]);
  });

  it('should filter features with a where parameter', function () {
    server.respondWith(
      'GET',
      /Type%3D'Active'/g,
      JSON.stringify({
        fields: fields,
        features: [feature1],
        objectIdFieldName: 'OBJECTID'
      })
    );

    server.respondWith(
      'GET',
      /Type%3D'Inactive'/g,
      JSON.stringify({
        fields: fields,
        features: [feature2],
        objectIdFieldName: 'OBJECTID'
      })
    );

    layer.setWhere("Type='Active'");

    layer.addTo(map);

    server.respond();

    expect(layer.createLayers).to.have.been.calledWith([
      {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [-122.673339, 45.537134]
        },
        properties: {
          OBJECTID: 1,
          Name: 'Site 1',
          Type: 'Active',
          Time: new Date('January 1 2014 GMT-0800').valueOf()
        },
        id: 1
      }
    ]);

    var callback = sinon.spy();

    layer.setWhere("Type='Inactive'", callback);

    server.respond();

    expect(callback).to.have.been.called;
    expect(layer.removeLayers.getCall(0).args[0][0]).to.equal(1);
    expect(layer.createLayers).to.have.been.calledWith([
      {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [-122.673342, 45.537161]
        },
        properties: {
          OBJECTID: 2,
          Name: 'Site 2',
          Type: 'Inactive',
          Time: new Date('January 15 2014 GMT-0800').valueOf()
        },
        id: 2
      }
    ]);
  });

  it('should return true for features with a single time field in the current time range', function () {
    layer.setTimeRange(
      new Date('Dec 1 2013 GMT-0800'),
      new Date('January 10 2014 GMT-0800')
    );

    expect(
      layer._featureWithinTimeRange({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [-122.673339, 45.537134]
        },
        properties: {
          OBJECTID: 1,
          Name: 'Site 1',
          Type: 'Active',
          Time: new Date('January 1 2014 GMT-0800').valueOf()
        },
        id: 1
      })
    ).to.equal(true);

    expect(
      layer._featureWithinTimeRange({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [-122.673342, 45.537161]
        },
        properties: {
          OBJECTID: 2,
          Name: 'Site 2',
          Type: 'Inactive',
          Time: new Date('January 15 2014 GMT-0800').valueOf()
        },
        id: 2
      })
    ).not.to.equal(true);
  });

  it('should return true for features with a single feature with start and end time fields in the current time range', function () {
    var layer = new L.esri.FeatureManager({
      url: url,
      from: new Date('Dec 1 2013 GMT-0800'),
      to: new Date('January 12 2014 GMT-0800'),
      timeField: {
        start: 'StartTime',
        end: 'EndTime'
      }
    });

    expect(
      layer._featureWithinTimeRange({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [-122.673339, 45.537134]
        },
        properties: {
          OBJECTID: 1,
          Name: 'Site 1',
          Type: 'Active',
          StartTime: new Date('January 10 2014 GMT-0800').valueOf(),
          EndTime: new Date('January 11 2014 GMT-0800').valueOf()
        },
        id: 1
      })
    ).to.equal(true);

    expect(
      layer._featureWithinTimeRange({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [-122.673342, 45.537161]
        },
        properties: {
          OBJECTID: 2,
          Name: 'Site 2',
          Type: 'Inactive',
          StartTime: new Date('January 14 2014 GMT-0800').valueOf(),
          EndTime: new Date('January 15 2014 GMT-0800').valueOf()
        },
        id: 2
      })
    ).to.equal(false);

    expect(
      layer._featureWithinTimeRange({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [-122.673345, 45.537188]
        },
        properties: {
          OBJECTID: 3,
          Name: 'Site 3',
          Type: 'Active',
          StartTime: new Date('November 29 2013 GMT-0800').valueOf(),
          EndTime: new Date('January 15 2014 GMT-0800').valueOf()
        },
        id: 3
      })
    ).to.equal(true);
  });

  it('should return false when no time range is set', function () {
    expect(
      layer._featureWithinTimeRange({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [-122.673339, 45.537134]
        },
        properties: {
          OBJECTID: 1,
          Name: 'Site 1',
          Type: 'Active',
          StartTime: new Date('January 10 2014 GMT-0800').valueOf(),
          EndTime: new Date('January 11 2014 GMT-0800').valueOf()
        },
        id: 1
      })
    ).to.equal(true);
  });

  it('should be able to get the time range', function () {
    layer.setTimeRange(
      new Date('January 13 2014 GMT-0800'),
      new Date('January 16 2014 GMT-0800')
    );
    expect(layer.getTimeRange()).to.deep.equal([
      new Date('January 13 2014 GMT-0800'),
      new Date('January 16 2014 GMT-0800')
    ]);
  });

  it('should be able to get the where', function () {
    expect(layer.getWhere()).to.equal('1=1');
  });

  it('should be able to reset the where', function () {
    layer.setWhere('Type="Active"');
    layer.setWhere();
    expect(layer.getWhere()).to.equal('1=1');
  });

  it('should expose the authenticate method on the underlying service', function () {
    var spy = sinon.spy(layer.service, 'authenticate');
    layer.authenticate('foo');
    expect(spy).to.have.been.calledWith('foo');
  });

  it('should expose the metadata method on the underlying service', function () {
    var spy = sinon.spy(layer.service, 'metadata');
    var callback = sinon.spy();
    layer.metadata(callback);
    expect(spy).to.have.been.calledWith(callback);
  });

  it('should expose the query method on the underlying service', function () {
    // var spy = sinon.spy(layer.service, 'query');
    var query = layer.query();
    expect(query).to.be.an.instanceof(L.esri.Query);
    expect(query._service).to.equal(layer.service);
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

  it('should wrap the updateFeature method on the underlying service and refresh', function (done) {
    server.respondWith(
      'POST',
      'http://gis.example.com/mock/arcgis/rest/services/MockService/MockFeatureServer/0/updateFeatures',
      JSON.stringify({
        updateResults: [
          {
            objectId: 1,
            success: true
          }
        ]
      })
    );

    layer.updateFeature(
      {
        type: 'Feature',
        id: 1,
        geometry: {
          type: 'Point',
          coordinates: [45, -121]
        },
        properties: {
          foo: 'bar'
        }
      },
      function (error, response) {
        expect(response).to.deep.equal({
          objectId: 1,
          success: true
        });
        done();
      }
    );

    server.respond();
  });

  it('should wrap the updateFeatures method on the underlying service and refresh', function (done) {
    server.respondWith(
      'POST',
      'http://gis.example.com/mock/arcgis/rest/services/MockService/MockFeatureServer/0/updateFeatures',
      JSON.stringify({
        updateResults: [
          {
            objectid: 1,
            success: true
          },
          {
            objectid: 2,
            success: true
          }
        ]
      })
    );

    layer.updateFeatures(
      {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            id: 1,
            properties: {
              foo: 'bar'
            },
            geometry: {
              type: 'Point',
              coordinates: [-121, 45]
            }
          },
          {
            type: 'Feature',
            id: 2,
            properties: {
              foo: 'bar'
            },
            geometry: {
              type: 'Point',
              coordinates: [-121, 45]
            }
          }
        ]
      },
      function (error, response) {
        expect(response).to.deep.equal([
          {
            objectid: 1,
            success: true
          },
          {
            objectid: 2,
            success: true
          }
        ]);
        done();
      }
    );

    server.respond();
  });

  it('should wrap the removeFeature method on the underlying service', function (done) {
    server.respondWith(
      'POST',
      'http://gis.example.com/mock/arcgis/rest/services/MockService/MockFeatureServer/0/deleteFeatures',
      JSON.stringify({
        deleteResults: [
          {
            objectId: 1,
            success: true
          }
        ]
      })
    );

    layer.deleteFeature(1, function (error, response) {
      expect(layer.removeLayers).to.have.been.calledWith([1]);
      expect(response).to.deep.equal({
        objectId: 1,
        success: true
      });
      done();
    });

    server.respond();
  });

  it('should wrap the removeFeatures method on the underlying service', function (done) {
    server.respondWith(
      'POST',
      'http://gis.example.com/mock/arcgis/rest/services/MockService/MockFeatureServer/0/deleteFeatures',
      JSON.stringify({
        deleteResults: [
          {
            objectId: 1,
            success: true
          },
          {
            objectId: 2,
            success: true
          }
        ]
      })
    );

    layer.deleteFeatures([1, 2], function (error, response) {
      expect(layer.removeLayers).to.have.been.calledWith([1]);
      expect(layer.removeLayers).to.have.been.calledWith([2]);
      expect(response[1]).to.deep.equal({
        objectId: 2,
        success: true
      });
      done();
    });

    server.respond();
  });

  it('should support generalizing geometries', function () {
    server.respondWith(
      'GET',
      'http://gis.example.com/mock/arcgis/rest/services/MockService/MockFeatureServer/0/query?returnGeometry=true&where=1%3D1&outSR=4326&outFields=*&inSR=4326&geometry=%7B%22xmin%22%3A-122.6953125%2C%22ymin%22%3A45.521743896993634%2C%22xmax%22%3A-122.6513671875%2C%22ymax%22%3A45.55252525134013%2C%22spatialReference%22%3A%7B%22wkid%22%3A4326%7D%7D&geometryType=esriGeometryEnvelope&spatialRel=esriSpatialRelIntersects&geometryPrecision=6&resultType=tile&maxAllowableOffset=0.00004291534423826704&f=json',
      JSON.stringify({
        fields: fields,
        features: [feature6],
        objectIdFieldName: 'OBJECTID'
      })
    );

    var layer = new MockLayer({
      url:
        'http://gis.example.com/mock/arcgis/rest/services/MockService/MockFeatureServer/0/',
      simplifyFactor: 0.5
    });

    layer.addTo(map);
    server.respond();

    expect(layer.createLayers).to.have.been.calledWith([
      {
        type: 'Feature',
        geometry: {
          type: 'Polygon',
          coordinates: [
            [
              [-109.02, 36.98],
              [-102.06, 37.01],
              [-102.06, 40.97],
              [-109.02, 40.97],
              [-109.02, 36.98]
            ]
          ]
        },
        properties: {
          OBJECTID: 6,
          Name: 'Site 6',
          Type: 'Active',
          StartTime: new Date('January 14 2014 GMT-0800').valueOf(),
          EndTime: new Date('January 15 2014 GMT-0800').valueOf()
        },
        id: 6
      }
    ]);
  });

  it('should propagate events from the service', function () {
    server.respondWith(
      'GET',
      new RegExp(/.*/),
      JSON.stringify({
        fields: fields,
        features: [],
        objectIdFieldName: 'OBJECTID',
        exceededTransferLimit: true
      })
    );

    var requeststartSpy = sinon.spy();
    var requestendSpy = sinon.spy();

    layer.on('requeststart', requeststartSpy);
    layer.on('requestend', requestendSpy);

    layer.addTo(map);

    server.respond();

    expect(requeststartSpy.callCount).to.be.above(0);
    expect(requestendSpy.callCount).to.be.above(0);
  });

  // no idea why this test fails in Chrome, it passed in phantomjs 1.x

  // it('should NOT draw layers when the zoom level is outside allowed range', function (done) {
  //   map.setZoom(14);

  //   server.respondWith('GET', 'http://services.arcgis.com/mock/arcgis/rest/services/MockService/MockFeatureServer/0/query?returnGeometry=true&where=1%3D1&outSR=4326&outFields=*&inSR=4326&geometry=%7B%22xmin%22%3A-122.6953125%2C%22ymin%22%3A45.521743896993634%2C%22xmax%22%3A-122.6513671875%2C%22ymax%22%3A45.55252525134013%2C%22spatialReference%22%3A%7B%22wkid%22%3A4326%7D%7D&geometryType=esriGeometryEnvelope&spatialRel=esriSpatialRelIntersects&geometryPrecision=6&f=json', JSON.stringify({
  //     fields: fields,
  //     features: [feature1, feature2],
  //     objectIdFieldName: 'OBJECTID'
  //   }));

  //   layer.addTo(map);

  //   map.once('zoomend', function () {
  //     this event is never fired
  //     server.respond();

  //     expect(layer._visibleZoom()).to.be.false;
  //     expect(layer._currentSnapshot.length).to.equal(0);
  //     done();
  //   });

  //   map.setZoom(17);
  // });

  // this test genuinely needs reworked
  // it('should create layers when the zoom level is inside allowed range', function (done) {
  //   map.setZoom(14);

  //   server.respondWith('GET', 'http://services.arcgis.com/mock/arcgis/rest/services/MockService/MockFeatureServer/0/query?returnGeometry=true&where=1%3D1&outSR=4326&outFields=*&inSR=4326&geometry=%7B%22xmin%22%3A-122.6953125%2C%22ymin%22%3A45.521743896993634%2C%22xmax%22%3A-122.6513671875%2C%22ymax%22%3A45.55252525134013%2C%22spatialReference%22%3A%7B%22wkid%22%3A4326%7D%7D&geometryType=esriGeometryEnvelope&spatialRel=esriSpatialRelIntersects&geometryPrecision=6&f=json', JSON.stringify({
  //     fields: fields,
  //     features: [feature1, feature2],
  //     objectIdFieldName: 'OBJECTID'
  //   }));

  //   layer.addTo(map);

  //   map.once('zoomend', function () {
  //     server.respond();

  //     expect(layer._visibleZoom()).to.be.true;

  //     // var requestSpy = sinon.spy();
  //     // layer.on('addfeature', requestSpy);
  //     // expect(requestSpy.callCount).to.be.above(0);
  //     done();
  //   });

  //   map.setZoom(11);
  // });

  it('should keep an accurate count of active requests even when they error', function () {
    var triggered = false;

    layer.on('load', function (ev) {
      triggered = true;
    });

    var southWest = L.latLng(29.53522956294847, -98.4375);
    var northEast = L.latLng(30.14512718337613, -97.734375);
    var bounds = L.latLngBounds(southWest, northEast);
    var point = L.point(200, 300);

    server.respondWith(
      'GET',
      new RegExp(/.*/),
      JSON.stringify({
        fields: fields
      })
    );

    layer._requestFeatures(bounds, point, function () {

    });

    server.respondWith(
      'GET',
      new RegExp(/.*/),
      JSON.stringify({
        fields: fields
      })
    );

    layer._requestFeatures(bounds, point, function () {

    });

    expect(layer._activeRequests).to.equal(2);

    server.respondWith('GET', new RegExp(/.*/), [
      500,
      { 'Content-Type': 'application/json' },
      ''
    ]);
    layer._requestFeatures(bounds, point, function () {

    });

    server.respond();
    server.respond();
    server.respond();

    expect(layer._activeRequests).to.equal(0);
    expect(triggered).to.be.true;
  });

  it('should fetch as geojson if "isModern" is true', function () {
    server.respondWith(
      'GET',
      'http://gis.example.com/mock/arcgis/rest/services/MockService/MockFeatureServer/0/query?returnGeometry=true&where=1%3D1&outSR=4326&outFields=*&inSR=4326&geometry=%7B%22xmin%22%3A-122.6513671875%2C%22ymin%22%3A45.49094569262732%2C%22xmax%22%3A-122.607421875%2C%22ymax%22%3A45.521743896993634%2C%22spatialReference%22%3A%7B%22wkid%22%3A4326%7D%7D&geometryType=esriGeometryEnvelope&spatialRel=esriSpatialRelIntersects&geometryPrecision=6&resultOffset=0&resultType=tile&f=geojson',
      JSON.stringify({
        type: 'FeatureCollection',
        features: [feature7] })
    );

    var layer = new MockLayer({
      url:
        'http://gis.example.com/mock/arcgis/rest/services/MockService/MockFeatureServer/0/',
      fetchAllFeatures: true,
      isModern: true
    });

    layer.addTo(map);
    server.respond();
    expect(layer.createLayers).to.have.been.calledWith([feature7]);
  });

  it('should fetch another request if limit exceeded', function () {
    server.respondWith(
      'GET',
      'http://gis.example.com/mock/arcgis/rest/services/MockService/MockFeatureServer/0/query?returnGeometry=true&where=1%3D1&outSR=4326&outFields=*&inSR=4326&geometry=%7B%22xmin%22%3A-122.6513671875%2C%22ymin%22%3A45.49094569262732%2C%22xmax%22%3A-122.607421875%2C%22ymax%22%3A45.521743896993634%2C%22spatialReference%22%3A%7B%22wkid%22%3A4326%7D%7D&geometryType=esriGeometryEnvelope&spatialRel=esriSpatialRelIntersects&geometryPrecision=6&resultOffset=0&resultType=tile&f=json',
      JSON.stringify({
        fields: fields,
        features: [feature6],
        objectIdFieldName: 'OBJECTID',
        exceededTransferLimit: true
      })
    );

    var layer = new MockLayer({
      url:
        'http://gis.example.com/mock/arcgis/rest/services/MockService/MockFeatureServer/0/',
      fetchAllFeatures: true
    });

    layer.addTo(map);
    server.respond();
    expect(layer.createLayers).to.have.been.calledWith([
      {
        type: 'Feature',
        geometry: {
          type: 'Polygon',
          coordinates: [
            [
              [-109.02, 36.98],
              [-102.06, 37.01],
              [-102.06, 40.97],
              [-109.02, 40.97],
              [-109.02, 36.98]
            ]
          ]
        },
        properties: {
          OBJECTID: 6,
          Name: 'Site 6',
          Type: 'Active',
          StartTime: new Date('January 14 2014 GMT-0800').valueOf(),
          EndTime: new Date('January 15 2014 GMT-0800').valueOf()
        },
        id: 6
      }
    ]);

    // second call due to fetchAllFeatures
    server.respondWith(
      'GET',
      'http://gis.example.com/mock/arcgis/rest/services/MockService/MockFeatureServer/0/query?returnGeometry=true&where=1%3D1&outSR=4326&outFields=*&inSR=4326&geometry=%7B%22xmin%22%3A-122.6513671875%2C%22ymin%22%3A45.49094569262732%2C%22xmax%22%3A-122.607421875%2C%22ymax%22%3A45.521743896993634%2C%22spatialReference%22%3A%7B%22wkid%22%3A4326%7D%7D&geometryType=esriGeometryEnvelope&spatialRel=esriSpatialRelIntersects&geometryPrecision=6&resultOffset=1&resultType=tile&f=json',
      JSON.stringify({
        fields: fields,
        features: [feature5],
        objectIdFieldName: 'OBJECTID'
      })
    );
    server.respond();
    expect(layer.createLayers).to.have.been.calledWith([
      {
        geometry: {
          type: 'Point',
          coordinates: [-122.629394, 45.537134]
        },
        id: 5,
        properties: {
          OBJECTID: 5,
          Name: 'Site 5',
          Type: 'Active',
          StartTime: new Date('January 14 2014 GMT-0800').valueOf(),
          EndTime: new Date('January 15 2014 GMT-0800').valueOf()
        },
        type: 'Feature'
      }
    ]);
  });

  it('should fetch another request if limit exceeded - geojson exceededTransferLimit', function () {
    server.respondWith(
      'GET',
      'http://gis.example.com/mock/arcgis/rest/services/MockService/MockFeatureServer/0/query?returnGeometry=true&where=1%3D1&outSR=4326&outFields=*&inSR=4326&geometry=%7B%22xmin%22%3A-122.6513671875%2C%22ymin%22%3A45.49094569262732%2C%22xmax%22%3A-122.607421875%2C%22ymax%22%3A45.521743896993634%2C%22spatialReference%22%3A%7B%22wkid%22%3A4326%7D%7D&geometryType=esriGeometryEnvelope&spatialRel=esriSpatialRelIntersects&geometryPrecision=6&resultOffset=0&resultType=tile&f=geojson',
      JSON.stringify({
        type: 'FeatureCollection',
        features: [feature7],
        exceededTransferLimit: true
      })
    );

    var layer = new MockLayer({
      url:
        'http://gis.example.com/mock/arcgis/rest/services/MockService/MockFeatureServer/0/',
      fetchAllFeatures: true,
      isModern: true
    });

    layer.addTo(map);
    server.respond();
    expect(layer.createLayers).to.have.been.calledWith([feature7]);

    // second call due to fetchAllFeatures
    server.respondWith(
      'GET',
      'http://gis.example.com/mock/arcgis/rest/services/MockService/MockFeatureServer/0/query?returnGeometry=true&where=1%3D1&outSR=4326&outFields=*&inSR=4326&geometry=%7B%22xmin%22%3A-122.6513671875%2C%22ymin%22%3A45.49094569262732%2C%22xmax%22%3A-122.607421875%2C%22ymax%22%3A45.521743896993634%2C%22spatialReference%22%3A%7B%22wkid%22%3A4326%7D%7D&geometryType=esriGeometryEnvelope&spatialRel=esriSpatialRelIntersects&geometryPrecision=6&resultOffset=1&resultType=tile&f=geojson',
      JSON.stringify({
        type: 'FeatureCollection',
        features: [feature8]
      })
    );
    server.respond();
    expect(layer.createLayers).to.have.been.calledWith([feature8]);
  });

  it('should fetch another request if limit exceeded - geojson properties.exceededTransferLimit', function () {
    server.respondWith(
      'GET',
      'http://gis.example.com/mock/arcgis/rest/services/MockService/MockFeatureServer/0/query?returnGeometry=true&where=1%3D1&outSR=4326&outFields=*&inSR=4326&geometry=%7B%22xmin%22%3A-122.6513671875%2C%22ymin%22%3A45.49094569262732%2C%22xmax%22%3A-122.607421875%2C%22ymax%22%3A45.521743896993634%2C%22spatialReference%22%3A%7B%22wkid%22%3A4326%7D%7D&geometryType=esriGeometryEnvelope&spatialRel=esriSpatialRelIntersects&geometryPrecision=6&resultOffset=0&resultType=tile&f=geojson',
      JSON.stringify({
        type: 'FeatureCollection',
        features: [feature7],
        properties: {
          exceededTransferLimit: true
        }
      })
    );

    var layer = new MockLayer({
      url:
        'http://gis.example.com/mock/arcgis/rest/services/MockService/MockFeatureServer/0/',
      fetchAllFeatures: true,
      isModern: true
    });

    layer.addTo(map);
    server.respond();
    expect(layer.createLayers).to.have.been.calledWith([feature7]);

    // second call due to fetchAllFeatures
    server.respondWith(
      'GET',
      'http://gis.example.com/mock/arcgis/rest/services/MockService/MockFeatureServer/0/query?returnGeometry=true&where=1%3D1&outSR=4326&outFields=*&inSR=4326&geometry=%7B%22xmin%22%3A-122.6513671875%2C%22ymin%22%3A45.49094569262732%2C%22xmax%22%3A-122.607421875%2C%22ymax%22%3A45.521743896993634%2C%22spatialReference%22%3A%7B%22wkid%22%3A4326%7D%7D&geometryType=esriGeometryEnvelope&spatialRel=esriSpatialRelIntersects&geometryPrecision=6&resultOffset=1&resultType=tile&f=geojson',
      JSON.stringify({
        type: 'FeatureCollection',
        features: [feature8]
      })
    );
    server.respond();
    expect(layer.createLayers).to.have.been.calledWith([feature8]);
  });

  it('should not fetch another request even if limit exceeded when no "fetchAllFeatures"', function () {
    server.respondWith(
      'GET',
      'http://gis.example.com/mock/arcgis/rest/services/MockService/MockFeatureServer/0/query?returnGeometry=true&where=1%3D1&outSR=4326&outFields=*&inSR=4326&geometry=%7B%22xmin%22%3A-122.6513671875%2C%22ymin%22%3A45.49094569262732%2C%22xmax%22%3A-122.607421875%2C%22ymax%22%3A45.521743896993634%2C%22spatialReference%22%3A%7B%22wkid%22%3A4326%7D%7D&geometryType=esriGeometryEnvelope&spatialRel=esriSpatialRelIntersects&geometryPrecision=6&resultType=tile&f=json',
      JSON.stringify({
        fields: fields,
        features: [feature6],
        objectIdFieldName: 'OBJECTID',
        exceededTransferLimit: true
      })
    );

    var layer = new MockLayer({
      url:
        'http://gis.example.com/mock/arcgis/rest/services/MockService/MockFeatureServer/0/'
    });

    layer.addTo(map);
    server.respond();
    expect(layer.createLayers).to.have.been.calledWith([
      {
        type: 'Feature',
        geometry: {
          type: 'Polygon',
          coordinates: [
            [
              [-109.02, 36.98],
              [-102.06, 37.01],
              [-102.06, 40.97],
              [-109.02, 40.97],
              [-109.02, 36.98]
            ]
          ]
        },
        properties: {
          OBJECTID: 6,
          Name: 'Site 6',
          Type: 'Active',
          StartTime: new Date('January 14 2014 GMT-0800').valueOf(),
          EndTime: new Date('January 15 2014 GMT-0800').valueOf()
        },
        id: 6
      }
    ]);

    // unexpected second call
    server.respondWith(
      'GET',
      'http://gis.example.com/mock/arcgis/rest/services/MockService/MockFeatureServer/0/query?returnGeometry=true&where=1%3D1&outSR=4326&outFields=*&inSR=4326&geometry=%7B%22xmin%22%3A-122.6513671875%2C%22ymin%22%3A45.49094569262732%2C%22xmax%22%3A-122.607421875%2C%22ymax%22%3A45.521743896993634%2C%22spatialReference%22%3A%7B%22wkid%22%3A4326%7D%7D&geometryType=esriGeometryEnvelope&spatialRel=esriSpatialRelIntersects&geometryPrecision=6&resultOffset=1&resultType=tile&f=json',
      JSON.stringify({
        fields: fields,
        features: [feature5],
        objectIdFieldName: 'OBJECTID'
      })
    );
    server.respond();
    expect(layer.createLayers).not.to.have.been.calledWith([
      {
        geometry: {
          type: 'Point',
          coordinates: [-122.629394, 45.537134]
        },
        id: 5,
        properties: {
          OBJECTID: 5,
          Name: 'Site 5',
          Type: 'Active',
          StartTime: new Date('January 14 2014 GMT-0800').valueOf(),
          EndTime: new Date('January 15 2014 GMT-0800').valueOf()
        },
        type: 'Feature'
      }
    ]);
  });
});
/* eslint-enable handle-callback-err */
