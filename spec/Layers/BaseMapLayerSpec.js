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
      expect(L.esri.basemapLayer(name)._url).to.equal(L.esri.BasemapLayer.TILES[name].urlTemplate);
    }
  });

  it('can survive adding/removing basemaps w/ labels', function () {
    var moremaps = ['Oceans', 'DarkGray', 'Gray', 'Imagery', 'ShadedRelief', 'Terrain'];
    for (var i = 0, len = moremaps.length; i < len; i++) {
      var layer = L.esri.basemapLayer(moremaps[i]).addTo(map);
      var layerWithLabels = L.esri.basemapLayer(moremaps[i] +'Labels').addTo(map);
      expect(map.hasLayer(layer)).to.equal(true);
      expect(map.hasLayer(layerWithLabels)).to.equal(true);

      map.removeLayer(layer);
      map.removeLayer(layerWithLabels);
      expect(map.hasLayer(layer)).to.equal(false);
      expect(map.hasLayer(layerWithLabels)).to.equal(false);
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
});