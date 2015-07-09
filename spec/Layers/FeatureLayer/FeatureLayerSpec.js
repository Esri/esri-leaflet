describe('L.esri.Layers.FeatureLayer', function () {
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
    }).setView([45.51, -122.66], 5);
  }

  var layer;
  var map = createMap();
  var features = [{
        type: 'Feature',
        id: 1,
        geometry: {
          type: 'LineString',
          coordinates: [[-122, 45], [-121, 40]]
        },
        properties: {
          time: new Date('January 1 2014').valueOf(),
          type: 'good'
        }
      },{
    type: 'Feature',
    id: 2,
    geometry: {
      type: 'LineString',
      coordinates: [[-123, 46], [-120, 45]]
    },
    properties: {
      time: new Date('Febuary 1 2014').valueOf(),
      type: 'bad'
    }
  }];

  var pointFeatures = [({
        type: 'Feature',
        id: 1,
        geometry: {
          type: 'Point',
          coordinates: [-122, 45]
        },
        properties: {
          time: new Date('January 1 2014').valueOf(),
          type: 'good'
        }
      }),{
    type: 'Feature',
    id: 2,
    geometry: {
      type: 'Point',
      coordinates: [-123, 46]
    },
    properties: {
      time: new Date('Febuary 1 2014').valueOf(),
      type: 'bad'
    }
  }];

  var multiPolygon = [({
      type : 'Feature',
      id: 1,
      geometry: {
        type: 'MultiPolygon',
        coordinates: [[[[-95, 43], [-95, 50], [-90, 50], [-91, 42], [-95, 43]]], [[[-89, 42], [-89, 50], [-80, 50], [-80, 42]]]]
      },
      properties: {
        time: new Date('Febuary 1 2014').valueOf()
      }
  })];

  var point = [({
      type : 'Feature',
      id: 1,
      geometry: {
        type: 'Point',
        coordinates: [-95, 43]
      },
      properties: {
        time: new Date('Febuary 1 2014').valueOf()
      }
  })];

  beforeEach(function(){
    layer = L.esri.featureLayer({
      url: 'http://gis.example.com/mock/arcgis/rest/services/MockService/MockFeatureServer/0',
      timeField: 'time',
      pointToLayer: function(feature, latlng){
        return L.circleMarker(latlng, {
          color: 'green'
        });
      }
    }).addTo(map);

    layer.createLayers(features);
  });

  it('should fire a createfeature event', function(done){
    layer = L.esri.featureLayer({
      url: 'http://gis.example.com/mock/arcgis/rest/services/MockService/MockFeatureServer/0',
      timeField: 'time',
      pointToLayer: function(feature, latlng){
        return L.circleMarker(latlng);
      }
    }).addTo(map);

    layer.on('createfeature', function(e){
      expect(e.feature.id).to.equal(2);
      done();
    });

    layer.createLayers(features);
  });

  it('should have an alias at L.esri.Layers.featureLayer', function(){
    var layer = L.esri.Layers.featureLayer({
      url: 'http://gis.example.com/mock/arcgis/rest/services/MockService/MockFeatureServer/0'
    });
    expect(layer).to.be.an.instanceof(L.esri.Layers.FeatureLayer);
  });

  it('should create features on a map', function(){
    expect(map.hasLayer(layer.getFeature(1))).to.equal(true);
    expect(map.hasLayer(layer.getFeature(2))).to.equal(true);
  });

  it('should remove features on a map', function(){
    layer.removeLayers([1]);
    expect(map.hasLayer(layer.getFeature(1))).to.equal(false);
    expect(map.hasLayer(layer.getFeature(2))).to.equal(true);
  });

  it('should fire a removefeature event', function(){
    layer.on('removefeature', function(e){
      expect(e.feature.id).to.equal(1);
    });
    layer.removeLayers([1]);
  });

  it('should add features back to a map', function(){
    layer.removeLayers([1]);
    layer.addLayers([1]);
    expect(map.hasLayer(layer.getFeature(1))).to.equal(true);
    expect(map.hasLayer(layer.getFeature(2))).to.equal(true);
  });

  it('should fire a addfeature event', function(){
    layer.on('addfeature', function(e){
      expect(e.feature.id).to.equal(1);
    });
    layer.removeLayers([1]);
    layer.addLayers([1]);
  });

  it('should not add features outside the time range', function(){
    layer.setTimeRange(new Date('January 1 2014'), new Date('Febuary 1 2014'));

    layer.createLayers([{
      type: 'Feature',
      id: 3,
      geometry: {
        type: 'Point',
        coordinates: [-123, 47]
      },
      properties: {
        time: new Date('March 1 2014').valueOf()
      }
    }]);

    expect(map.hasLayer(layer.getFeature(1))).to.equal(true);
    expect(map.hasLayer(layer.getFeature(2))).to.equal(true);
    expect(map.hasLayer(layer.getFeature(3))).to.equal(false);
  });

  it('should be able to add itself to a map', function(){
    layer.addTo(map);

    expect(map.hasLayer(layer)).to.equal(true);
  });

  it('should be remove itself from a map', function(){
    layer.addTo(map);
    map.removeLayer(layer);

    expect(map.hasLayer(layer)).to.equal(false);
  });

  it('should bind popups to existing features', function(){
    layer.bindPopup(function(feature){
      return 'ID: ' + feature.id;
    });
    expect(layer.getFeature(1)._popup.getContent()).to.equal('ID: 1');
    expect(layer.getFeature(2)._popup.getContent()).to.equal('ID: 2');
  });

  it('should bind popups to new features', function(){
    layer.bindPopup(function(feature){
      return 'ID: ' + feature.id;
    });

    layer.createLayers([{
      type: 'Feature',
      id: 3,
      geometry: {
        type: 'Point',
        coordinates: [-123, 46]
      },
      properties: {
        time: new Date('Febuary 24 2014').valueOf()
      }
    }]);

    expect(layer.getFeature(3)._popup.getContent()).to.equal('ID: 3');
  });

  it('should preserve popup options when binding popup to new or existing features', function(){
    layer.bindPopup(function(feature){
      return 'ID: ' + feature.id;
    }, {minWidth: 500});

    layer.createLayers([{
      type: 'Feature',
      id: 3,
      geometry: {
        type: 'Point',
        coordinates: [-123, 46]
      },
      properties: {
        time: new Date('Febuary 24 2014').valueOf()
      }
    }]);

    expect(layer.getFeature(1)._popup.options.minWidth).to.equal(500);
    expect(layer.getFeature(2)._popup.options.minWidth).to.equal(500);
    expect(layer.getFeature(3)._popup.options.minWidth).to.equal(500);
  });

  it('should style L.circleMarker features appropriately', function(){
    layer = L.esri.featureLayer({
      url: 'http://gis.example.com/mock/arcgis/rest/services/MockService/MockFeatureServer/0',
      timeField: 'time',
      pointToLayer: function(feature, latlng){
        return L.circleMarker(latlng, {
          color: 'green'
        });
      }
    }).addTo(map);

    layer.createLayers(point);
    expect(layer.getFeature(1).options.color).to.equal('green');
  });

  it('should unbind popups on features', function(){
    layer.bindPopup(function(feature){
      return 'ID: ' + feature.id;
    });
    layer.unbindPopup();
    expect(layer.getFeature(1)._popup).to.equal(null);
    expect(layer.getFeature(2)._popup).to.equal(null);
  });

  it('should unbind popups on multi polygon features', function(){
    layer = L.esri.featureLayer({
      url: 'http://gis.example.com/mock/arcgis/rest/services/MockService/MockFeatureServer/0',
      timeField: 'time'
    }).addTo(map);

    layer.createLayers(multiPolygon);

    layer.bindPopup(function(feature){
      return 'ID: ' + feature.id;
    });
    layer.unbindPopup();
    expect(layer.getFeature(1).getLayers()[0]._popup).to.equal(null);
    expect(layer.getFeature(1).getLayers()[1]._popup).to.equal(null);
  });

  it('should reset style on multi polygon features', function(){
    layer = L.esri.featureLayer({
      url: 'http://gis.example.com/mock/arcgis/rest/services/MockService/MockFeatureServer/0',
      style: {
        color: 'black'
      }
    }).addTo(map);

    layer.createLayers(multiPolygon);

    expect(layer.getFeature(1).getLayers()[0].options.color).to.equal('black');

    layer.setFeatureStyle(1, {
      color: 'red'
    });

    expect(layer.getFeature(1).getLayers()[0].options.color).to.equal('red');

    layer.resetStyle(1);

    expect(layer.getFeature(1).getLayers()[0].options.color).to.equal('black');
  });

  it('should reset L.circleMarker style', function(){
    layer = L.esri.featureLayer({
      url: 'http://gis.example.com/mock/arcgis/rest/services/MockService/MockFeatureServer/0',
      pointToLayer: function(feature, latlng){
        return L.circleMarker(latlng, {
          color: 'green'
        });
      }
    }).addTo(map);

    layer.createLayers(point);
    expect(layer.getFeature(1).options.color).to.equal('green');

    layer.setStyle({
      color: 'red'
    });
    expect(layer.getFeature(1).options.color).to.equal('red');

    layer.resetStyle(1);
    expect(layer.getFeature(1).options.color).to.equal('green');
  });

  it('should reset to default style on multi polygon features', function(){
    layer = L.esri.featureLayer({
      url: 'http://gis.example.com/mock/arcgis/rest/services/MockService/MockFeatureServer/0'
    }).addTo(map);

    layer.createLayers(multiPolygon);

    layer.setFeatureStyle(1, {
      color: 'red'
    });

    expect(layer.getFeature(1).getLayers()[0].options.color).to.equal('red');

    layer.resetStyle(1);

    expect(layer.getFeature(1).getLayers()[0].options.color).to.equal('#0033ff');
  });

  it('should draw multi polygon features with a fill', function(){
    layer = L.esri.featureLayer({
      url: 'http://services.arcgis.com/mock/arcgis/rest/services/MockService/MockFeatureServer/0'
    }).addTo(map);

    layer.createLayers(multiPolygon);

    expect(layer.getFeature(1).getLayers()[0].options.fill).to.equal(true);

    layer.resetStyle(1);

    expect(layer.getFeature(1).getLayers()[0].options.color).to.equal('#0033ff');
  });

  it('should iterate over each feature', function(){
    var spy = sinon.spy();
    layer.eachFeature(spy);
    expect(spy.callCount).to.equal(2);
  });

  it('should run a function against every feature', function(){
    var spy = sinon.spy();
    layer = L.esri.featureLayer({
      url: 'http://gis.example.com/mock/arcgis/rest/services/MockService/MockFeatureServer/0',
      onEachFeature: spy
    }).addTo(map);
    layer.createLayers(features);
    expect(spy.callCount).to.equal(2);
  });

  it('should change styles on features with an object', function(){
    layer.setStyle({
      color: 'red'
    });

    expect(layer.getFeature(1).options.color).to.equal('red');
    expect(layer.getFeature(2).options.color).to.equal('red');

    layer.createLayers([{
      type: 'Feature',
      id: 3,
      geometry: {
        type: 'LineString',
        coordinates: [[-122, 45], [-121, 40]]
      },
      properties: {
        time: new Date('Febuary 24 2014').valueOf()
      }
    }]);

    expect(layer.getFeature(3).options.color).to.equal('red');
  });

  it('should change styles on features with a function', function(){
    layer.setStyle(function(){
      return {
        color: 'red'
      };
    });

    expect(layer.getFeature(1).options.color).to.equal('red');
    expect(layer.getFeature(2).options.color).to.equal('red');

    layer.createLayers([{
      type: 'Feature',
      id: 3,
      geometry: {
        type: 'LineString',
        coordinates: [[-122, 45], [-121, 40]]
      },
      properties: {
        time: new Date('Febuary 24 2014').valueOf()
      }
    }]);

    expect(layer.getFeature(3).options.color).to.equal('red');
  });

  it('should propagate events from individual features', function(){
    var spy = sinon.spy();
    layer.on('click', spy);

    layer.getFeature(1).fire('click', {
      foo: 'bar'
    });

    expect(spy.getCall(0).args[0].foo).to.equal('bar');
    expect(spy.getCall(0).args[0].type).to.equal('click');
  });
});
