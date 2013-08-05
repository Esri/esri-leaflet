/* globals L:true describe:true it:true expect:true*/

describe('L.esri.FeatureLayer', function() {
    var map,
        url = 'http://services.arcgis.com/rOo16HdIMeOBI4Mb/arcgis/rest/services/stops/FeatureServer/0/';
    beforeEach(function () {
        map = L.map(document.createElement('div'));
        map.setView([37.75,-122.45], 12);
    });

    describe('#constructor', function() {
        describe('when a FeatureLayer is first created', function() {
            it('will have an index defined by Terraformer', function() {
                var featLayer = L.esri.featureLayer(url);
                expect(featLayer.index).to.be.ok();
            });
        });
    });

    describe('#onAdd, #onRemove, #updateFeatures', function() {
        describe('when a FeatureLayer is added to the map', function() {
            it('will call its own updateFeatures', function() {
                var featLayer = L.esri.featureLayer(url);
                featLayer.updateFeatures = sinon.spy();
                featLayer.onAdd(map);
                expect(featLayer.updateFeatures.called).to.be.ok();
            });

            it('will have updateFeatures draw the features on the map', function(done) {
                var featLayer = L.esri.featureLayer(url);
                map.on = sinon.spy();
                featLayer.onAdd(map);
                setTimeout(function() {
                    expect(map.on.called).to.be.ok();
                    done();
                }, 1000);
            });

            it('will search the Terraformer index', function(done) {
                var featLayer = L.esri.featureLayer(url);
                map.on = sinon.spy();
                featLayer.index.search = sinon.stub().returns({
                    then: function(){}
                });
                featLayer.onAdd(map);
                setTimeout(function() {
                    expect(map.on.called).to.be.ok();
                    expect(featLayer.index.search.called).to.be.ok();
                    done();
                }, 1000);
            });

            it('will query map service for features in envelope', function(done) {
                var featLayer = L.esri.featureLayer(url);
                map.on = sinon.spy();
                featLayer.index.search = sinon.stub().returns({
                    then: function(){}
                });
                L.esri.get = sinon.spy();
                featLayer.onAdd(map);
                setTimeout(function() {
                    expect(map.on.called).to.be.ok();
                    expect(featLayer.index.search.called).to.be.ok();
                    expect(L.esri.get.called).to.be.ok();
                    done();
                }, 1000);
            });
        });
        describe('when a FeatureLayer is removed from the map', function() {
            it('will remove associated events from the map', function() {
                var featLayer = L.esri.featureLayer(url);
                map.off = sinon.spy();
                featLayer.onRemove(map);
                expect(map.off.calledOnce).to.be.ok();
            });
        });
    });
    describe('#getLayerId', function() {
        describe('when asked for a layer id', function() {
            it('will return the FeatureLayer id for layer it is given', function() {
                var featLayer = L.esri.featureLayer(url);
                expect(featLayer.getLayerId({ feature: { id: 'LAYERID' } })).to.eql('LAYERID');
            });
        });
    });
});