describe('L.esri.Layers.BasemapLayer', function () {

  var map;
  var server;
  var clock;
  var mockAttributions = {
    'contributors': [
      {
        'attribution': 'Esri',
        'coverageAreas': [
          {
            'zoomMax': 19,
            'zoomMin': 0,
            'score': 50,
            'bbox': [-84.94,-179.66,84.94,179.66]
          }
        ]
      },
      {
        'attribution': 'City & County of San Francisco',
        'coverageAreas': [
          {
            'zoomMax': 19,
            'zoomMin': 16,
            'score': 100,
            'bbox': [37.71,-122.51,37.83,-122.36]
          }
        ]
      }
    ]
  };

  beforeEach(function () {
    clock = sinon.useFakeTimers();
    server = sinon.fakeServer.create();
    server.respondWith('GET', new RegExp(/.*/), JSON.stringify(mockAttributions));
    map = L.map(document.createElement('div'));
    map.setView([37.75, -122.45], 5);
  });

  afterEach(function(){
    clock.restore();
    server.restore();
    map.remove();
  });

  it('can return valid basemaps', function () {
    var testmaps = ['Streets', 'Topographic', 'NationalGeographic', 'Oceans', 'OceansLabels','DarkGray', 'DarkGrayLabels', 'Gray', 'GrayLabels', 'Imagery', 'ImageryLabels', 'ImageryTransportation', 'ShadedRelief', 'ShadedReliefLabels', 'Terrain', 'TerrainLabels'];
    for (var i = 0, len = testmaps.length; i < len; i++) {
      var name = testmaps[i];
      expect(L.esri.basemapLayer(name)).to.be.instanceof(L.esri.Layers.BasemapLayer);
      expect(L.esri.basemapLayer(name)._url).to.eql(L.esri.BasemapLayer.TILES[name].urlTemplate);
    }
  });

  it('can be added to the map as normal', function () {
    var baseLayer = L.esri.basemapLayer('Streets');
    map.addLayer(baseLayer);
    expect(map.hasLayer(baseLayer)).to.equal(true);
  });

  it('will throw an error given invalid basemap name', function () {
    expect(function () {
      L.esri.basemapLayer('junk');
    }).to.throw(/Invalid parameter/);
  });

  it('should have a L.esri.Layers.basemapLayer alias', function(){
    expect(L.esri.Layers.basemapLayer('Topographic')).to.be.instanceof(L.esri.Layers.BasemapLayer);
  });

  it('should dynamically update tile attribution', function(){
    var spy = sinon.spy();
    var layer = new L.esri.Layers.BasemapLayer('Topographic');
    layer.on('attributionupdated', spy);
    layer.addTo(map);
    server.respond();

    map.setView([37.75, -122.45], 17);

    clock.tick(1000);

    expect(spy).to.have.been.calledWith({
      type: 'attributionupdated',
      target: layer,
      attribution: 'Esri'
    });
    expect(spy).to.have.been.calledWith({
      type: 'attributionupdated',
      target: layer,
      attribution: 'City & County of San Francisco, Esri'
    });
  });
});