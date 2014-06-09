describe('L.esri.Layers.HeatmapFeatureLayer', function () {
  function createMap(){
    // create container
    var container = document.createElement('div');

    // give container a width/height
    container.setAttribute('style', 'width:500px; height: 500px;');

    // add contianer to body
    document.body.appendChild(container);

    return L.map(container).setView([45.51, -122.66], 16);
  }

  var layer;
  var map = createMap();

  beforeEach(function(){
    layer = L.esri.heatmapFeatureLayer('http://services.arcgis.com/mock/arcgis/rest/services/MockService/MockFeatureServer/0', {
      timeField: 'time'
    });

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

  it('should create features on a heatmap', function(){
    expect(layer.heat._latlngs).to.deep.equal([L.latLng(46,-123), L.latLng(45,-122)]);
  });

  it('should remove features on a heatmap', function(){
    layer.removeLayers([1]);
    expect(layer.heat._latlngs).to.deep.equal([L.latLng(46,-123)]);
  });

  it('should add features back to a heatmap', function(){
    layer.removeLayers([1]);
    layer.addLayers([1]);
    expect(layer.heat._latlngs).to.deep.equal([L.latLng(46,-123), L.latLng(45,-122)]);
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

    expect(layer.heat._latlngs).not.to.include(L.latLng( 47,-123));
  });

  it('should be able to add itself to a map', function(){
    layer.addTo(map);

    expect(map.hasLayer(layer)).to.equal(true);
    expect(map.hasLayer(layer.heat)).to.equal(true);
  });

  it('should be remove itself from a map', function(){
    layer.addTo(map);
    map.removeLayer(layer);

    expect(map.hasLayer(layer)).to.equal(false);
    expect(map.hasLayer(layer.heat)).to.equal(false);
  });
});