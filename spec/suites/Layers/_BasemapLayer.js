/* globals L, describe, it, expect, beforeEach*/

describe('L.esri.BasemapLayer', function () {

  var map;
  beforeEach(function () {
    map = L.map(document.createElement('div'));
    map.setView([37.75, -122.45], 12);
  });

  describe('#constructor', function () {
    describe('when a BasemapLayer is first created', function () {
      it('can return valid basemaps', function () {
        var testmaps = ['Streets', 'Topographic', 'Gray', 'GrayLabels', 'Oceans', 'NationalGeographic', 'Imagery', 'ImageryLabels'];
        for (var i = 0, len = testmaps.length; i < len; i++) {
          var name = testmaps[i];
          expect(L.esri.basemapLayer(name)).to.be.ok();
          expect(L.esri.basemapLayer(name)._url).to.eql(L.esri.BasemapLayer.TILES[name].urlTemplate);
        }
      });

      it('can be added to the map as normal', function () {
        var baseLayer = L.esri.basemapLayer('Streets');
        map.addLayer(baseLayer);
        expect(map.hasLayer(baseLayer)).to.be.ok();
      });

      it('will throw an error given invalid basemap name', function () {
        expect(function () {
          L.esri.basemapLayer('junk');
        }).to.throwException(/Invalid parameter/);
      });
    });
  });
});