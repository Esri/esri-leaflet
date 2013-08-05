/* globals L:true describe:true it:true expect:true*/

describe('L.esri.BasemapLayer', function() {

    var map;
    beforeEach(function () {
        map = L.map(document.createElement('div'));
    });

    describe('#constructor', function() {
        describe('when a BasemapLayer is first created', function() {
            it('can return valid basemaps', function() {
                var testmaps = ['Streets', 'Topographic', 'Gray', 'GrayLabels', 'Oceans', 'NationalGeographic', 'Imagery', 'ImageryLabels'];
                for(var i = 0, len = testmaps.length; i < len; i++) {
                    var name = testmaps[i];
                    expect(L.esri.basemapLayer(name)).to.be.ok();
                }
            });

            it('can be added to the map as normal', function() {
                var baseLayer = L.esri.basemapLayer('Streets');
                map.addLayer(baseLayer);
                expect(map.hasLayer(baseLayer)).to.be.ok();
            });

            it('will throw an error given invalid basemap name', function() {
                expect(function() {
                    L.esri.basemapLayer('junk');
                }).to.throwException(/Invalid parameter/);
            });
        });
    });

});