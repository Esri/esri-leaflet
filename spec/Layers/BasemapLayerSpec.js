/* eslint-env mocha */
describe('L.esri.BasemapLayer', function () {
  function createMap () {
    // create container
    var container = document.createElement('div');

    // give container a width/height
    container.setAttribute('style', 'width:500px; height: 500px;');

    // add container to body
    document.body.appendChild(container);

    return L.map(container).setView([37.75, -122.45], 5);
  }

  var map;
  var server;
  var clock;
  var mockAttributions = {
    contributors: [
      {
        attribution: 'SkyNet',
        coverageAreas: [
          {
            zoomMax: 19,
            zoomMin: 0,
            score: 50,
            bbox: [-84.94, -179.66, 84.94, 179.66]
          }
        ]
      },
      {
        attribution: 'City & County of San Francisco',
        coverageAreas: [
          {
            zoomMax: 19,
            zoomMin: 16,
            score: 100,
            bbox: [37.71, -122.51, 37.83, -122.36]
          }
        ]
      }
    ]
  };

  beforeEach(function () {
    clock = sinon.useFakeTimers();
    server = sinon.fakeServer.create();
    server.respondWith('GET', new RegExp(/.*/), JSON.stringify(mockAttributions));
    map = createMap();
  });

  afterEach(function () {
    clock.restore();
    server.restore();
    map.remove();
  });

  it('can return valid basemaps', function () {
    var testmaps = ['Streets', 'Topographic', 'NationalGeographic', 'Oceans', 'OceansLabels', 'DarkGray', 'DarkGrayLabels', 'Gray', 'GrayLabels', 'Imagery', 'ImageryLabels', 'ImageryTransportation', 'ShadedRelief', 'ShadedReliefLabels', 'Terrain', 'TerrainLabels', 'USATopo', 'ImageryClarity', 'ImageryFirefly', 'Physical'];

    for (var i = 0, len = testmaps.length; i < len; i++) {
      var name = testmaps[i];
      expect(L.esri.basemapLayer(name)).to.be.instanceof(L.esri.BasemapLayer);
      expect(L.esri.basemapLayer(name)._url).to.equal(L.esri.BasemapLayer.TILES[name].urlTemplate);
    }
  });

  it('can survive adding/removing basemaps w/ labels', function () {
    var moremaps = ['Oceans', 'DarkGray', 'Gray', 'Imagery', 'ShadedRelief', 'Terrain'];
    for (var i = 0, len = moremaps.length; i < len; i++) {
      var layer = L.esri.basemapLayer(moremaps[i]).addTo(map);
      var layerWithLabels = L.esri.basemapLayer(moremaps[i] + 'Labels').addTo(map);
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

  it('will append tokens when fetching tiles if necessary', function () {
    var baseLayer = L.esri.basemapLayer('Streets', { token: 'bogus' });
    map.addLayer(baseLayer);
    expect(baseLayer._url).to.contain('token=bogus');
  });

  it('will prepend proxy when fetching tiles if necessary', function () {
    var proxyURL = 'http://example.proxy';
    var baseLayer = L.esri.basemapLayer('Streets', { proxy: proxyURL });
    map.addLayer(baseLayer);
    expect(baseLayer._url).to.contain(proxyURL);
  });

  it('will throw an error given invalid basemap name', function () {
    expect(function () {
      L.esri.basemapLayer('junk');
    }).to.throw(/Invalid parameter/);
  });

  it('should have an L.esri.basemapLayer alias', function () {
    expect(L.esri.basemapLayer('Topographic')).to.be.instanceof(L.esri.BasemapLayer);
  });

  // /*
  // need to figure out how to wire up the mockAttributions to
  // test display when map is panned beyond the dateline
  //
  // i dont understand how to spoof http responses for inner logic private function calls
  // like the jsonp request made inside L.esri.Util._getAttributionData();
  // */
  // it('can display attribution when panned beyond the dateline', function () {
  //   var baseLayer = L.esri.basemapLayer('Streets');
  //   map.addLayer(baseLayer);
  //   // L.esri.Util._getAttributionData(baseLayer.options.attributionUrl, map);
  //   // map.setView([ 37.30, 360], 10);
  //   clock.tick(151);
  //
  //   var check = false;
  //   for(var prop in map.attributionControl._attributions) {
  //       // console.log(prop);
  //       if (prop.match(/SkyNet/i) != null) {
  //         test = true;
  //       };
  //   }
  //
  //   expect(check).to.equal(true);
  // });
});
