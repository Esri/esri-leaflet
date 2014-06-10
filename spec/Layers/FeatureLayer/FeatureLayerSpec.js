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
  var features = [({
        type: 'Feature',
        id: 1,
        geometry: {
          type: 'LineString',
          coordinates: [[-122, 45], [-121, 40]]
        },
        properties: {
          time: new Date('January 1 2014').valueOf()
        }
      }),{
    type: 'Feature',
    id: 2,
    geometry: {
      type: 'LineString',
      coordinates: [[-123, 46], [-120, 45]]
    },
    properties: {
      time: new Date('Febuary 1 2014').valueOf()
    }
  }];

  beforeEach(function(){
    layer = L.esri.featureLayer('http://services.arcgis.com/mock/arcgis/rest/services/MockService/MockFeatureServer/0', {
      timeField: 'time',
      pointToLayer: function(feature, latlng){
        return L.circleMarker(latlng);
      }
    }).addTo(map);

    layer.createLayers(features);
  });

  it('should have an alias at L.esri.Layers.featureLayer', function(){
    var layer = L.esri.Layers.featureLayer('http://services.arcgis.com/mock/arcgis/rest/services/MockService/MockFeatureServer/0');
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

  it('should add features back to a map', function(){
    layer.removeLayers([1]);
    layer.addLayers([1]);
    expect(map.hasLayer(layer.getFeature(1))).to.equal(true);
    expect(map.hasLayer(layer.getFeature(2))).to.equal(true);
  });

  it('should readd features back to a map', function(){
    map.removeLayer(layer.getFeature(1));

    layer.createLayers([{
      type: 'Feature',
      id: 1,
      geometry: {
        type: 'LineString',
        coordinates: [[-122, 45], [-121, 40], [-121.5, 42.5]]
      },
      properties: {
        time: new Date('January 1 2014').valueOf()
      }
    }]);
    expect(map.hasLayer(layer.getFeature(1))).to.equal(true);
    expect(layer.getFeature(1).getLatLngs().length).to.equal(3);
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

  it('should unbind popups on features', function(){
    layer.bindPopup(function(feature){
      return 'ID: ' + feature.id;
    });
    layer.unbindPopup();
    expect(layer.getFeature(1)._popup).to.equal(null);
    expect(layer.getFeature(2)._popup).to.equal(null);
  });

  it('should iterate over each feature', function(){
    var spy = sinon.spy();
    layer.eachFeature(spy);
    expect(spy.callCount).to.equal(2);
  });

  it('should run a function against every feature', function(){
    var spy = sinon.spy();
    layer = L.esri.featureLayer('http://services.arcgis.com/mock/arcgis/rest/services/MockService/MockFeatureServer/0', {
      onEachFeature: spy
    }).addTo(map);
    layer.createLayers(features);
    expect(spy.callCount).to.equal(2);
  });

  it('should change styles on features with an object', function(){
    layer.setStyle({
      fill: 'red'
    });

    expect(layer.getFeature(1).options.fill).to.equal('red');
    expect(layer.getFeature(2).options.fill).to.equal('red');
  });

  it('should change styles on feautres with a function', function(){
    layer.setStyle(function(){
      return {
        fill: 'red'
      };
    });

    expect(layer.getFeature(1).options.fill).to.equal('red');
    expect(layer.getFeature(2).options.fill).to.equal('red');
  });

  it('should add features to the map when their cell enters the view', function(){
    layer._cache['1:1'] = [1];
    map.removeLayer(layer.getFeature(1));
    layer.cellEnter(null, L.point([1,1]));
    expect(map.hasLayer(layer.getFeature(1))).to.equal(true);
  });

  it('should remove features to the map when their cell leaves the view', function(){
    layer._cache['1:1'] = [1];
    layer.cellLeave(null, L.point([1,1]));
    expect(map.hasLayer(layer.getFeature(1))).to.equal(false);
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