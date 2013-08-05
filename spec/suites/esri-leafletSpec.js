/* globals L describe it expect*/

describe('L.esri', function () {
    var map,
        url = 'http://services.arcgisonline.com/ArcGIS/rest/services/Demographics',
        extent = {
            xmin: 10,
            xmax: 20,
            ymin: 10,
            ymax: 20,
            spatialReference: { wkid: 4326 }
        };
    beforeEach(function () {
        map = L.map(document.createElement('div'));
        map.setView([37.75, -122.45], 12);
    });

    describe('#get', function () {
        describe('when the get method is used', function () {
            it('will append script tags to document', function () {
                document.body.appendChild = sinon.spy();
                L.esri.get(url, { 'name': 'test' }, function () {
                });
                expect(document.body.appendChild.calledOnce).to.be.ok();
            });
        });
    });

    describe('#Util', function () {
        describe('when using #indexOf', function () {
            it('will find correct index of object in array', function () {
                var first = { name: '1st' },
                    second = { name: '2nd' },
                    third = { name: '3rd' },
                    arr = [ first, second, third ];
                expect(L.esri.Util.indexOf(arr, first)).to.eql(0);
                expect(L.esri.Util.indexOf(arr, third)).to.eql(2);
                expect(L.esri.Util.indexOf(arr, first, 1)).to.eql(-1);
                expect(L.esri.Util.indexOf(arr, {})).to.eql(-1);
                expect(L.esri.Util.indexOf(arr, 1)).to.eql(-1);
                expect(L.esri.Util.indexOf(arr, null)).to.eql(-1);
            });
        });
        describe('when using #extentToBounds', function () {
            it('will create Leaflet compatible bounds', function () {
                expect(L.esri.Util.extentToBounds(extent).isValid()).to.be.ok();
            });
        });
        describe('when using #boundsToExtent', function () {
            xit('will create an extent from Leaflet bounds', function () {
                var bounds = L.esri.Util.extentToBounds(extent),
                    testExtent = L.esri.Util.boundsToExtent(bounds);
                expect(testExtent.xmin).to.eql(extent.xmin);
                expect(testExtent.xmax).to.eql(extent.xmax);
                expect(testExtent.ymin).to.eql(extent.ymin);
                expect(testExtent.ymax).to.eql(extent.ymax);
            });
        });
        describe('when using #boundsToEnvelope', function () {
            it('will create an envelope using L.esri.Util.boundsToExtent', function () {
                var bounds = { name: 'test' };
                L.esri.Util.boundsToExtent = sinon.stub().returns(extent);
                var envelope = L.esri.Util.boundsToEnvelope(bounds);
                expect(L.esri.Util.boundsToExtent.calledWith(bounds)).to.be.ok();
                expect(envelope.x).to.eql(extent.xmin);
                expect(envelope.y).to.eql(extent.ymin);
            });
        });
    });
});