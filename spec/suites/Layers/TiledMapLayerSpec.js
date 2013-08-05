/* globals L:true describe:true it:true expect:true*/

describe('L.esri.TiledMapLayer', function() {

    var map,
        url = 'http://services.arcgisonline.com/ArcGIS/rest/services/Demographics';
    beforeEach(function () {
        map = L.map(document.createElement('div'));
        map.setView([37.75,-122.45], 12);
    });

    describe('#constructor', function() {
        describe('when a TiledMapLayer is first created', function() {
            it('will assign a serviceUrl', function() {
                var tiledLayer = L.esri.tiledMapLayer(url);
                expect(tiledLayer.serviceUrl).to.contain(url);
            });
            it('will assign a tile scheme to the url', function() {
                var tiledLayer = L.esri.tiledMapLayer(url);
                expect(tiledLayer.tileUrl).to.contain('tile/{z}/{y}/{x}');
            });
            it('will modify url of tile.arcgis.com', function() {
                var tiledLayer = L.esri.tiledMapLayer('http://tiles.arcgis.com/ArcGIS/rest/services/Demographics');
                expect(tiledLayer.tileUrl).to.contain('://tiles{s}.arcgis.com');
            });
        });
    });

});