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

  beforeEach(function(){
    layer = L.esri.featureLayer('http://services.arcgis.com/mock/arcgis/rest/services/MockService/MockFeatureServer/0', {
      timeField: 'time'
    }).addTo(map);

    layer.createLayers([{
      type: 'Feature',
      id: 1,
      geometry: {
        type: 'Point',
        coordinates: [-122, 45]
      },
      properties: {
        time: new Date('January 1 2014').valueOf()
      }
    },{
      type: 'Feature',
      id: 2,
      geometry: {
        type: 'Point',
        coordinates: [-123, 46]
      },
      properties: {
        time: new Date('Febuary 1 2014').valueOf()
      }
    }]);
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
});