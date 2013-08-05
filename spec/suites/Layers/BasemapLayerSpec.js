/* globals L describe it expect*/

describe('L.esri.BasemapLayer', function() {

    // Streets, Topographic, Gray, GrayLabels, Oceans, NationalGeographic, Imagery, ImageryLabels
    it('returns a valid object', function() {
        expect(L.esri.BasemapLayer).to.be.ok();
    });

    it('can return valid basemaps', function() {
        var testmaps = ['Streets', 'Topographic', 'Gray', 'GrayLabels', 'Oceans', 'NationalGeographic', 'Imagery', 'ImageryLabels'];
        for(var i = 0, len = testmaps.length; i < len; i++) {
            var name = testmaps[i];
            expect(L.esri.basemapLayer(name)).to.be.ok();
        }
    });

    it('will throw an error given invalid basemap name', function() {
        expect(function() {
            L.esri.basemapLayer('junk');
        }).to.throwException(/Invalid parameter/);
    });
});