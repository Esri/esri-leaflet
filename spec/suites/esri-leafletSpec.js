/* globals L describe it expect*/

describe('L.esri', function () {
  var sandbox,
      url = 'http://services.arcgisonline.com/ArcGIS/rest/services/Demographics',
      extent = {
        xmin: 10,
        xmax: 20,
        ymin: 10,
        ymax: 20,
        spatialReference: { wkid: 4326 }
      };
  beforeEach(function () {
    sandbox = sinon.sandbox.create();
  });
  afterEach(function () {
    sandbox.restore();
  });

  describe('#get', function () {
    it("should be able to get JSON from a server", function(done){
      L.esri.get("http://static.arcgis.com/attribution/World_Street_Map", {}, function(response){
        expect(response.contributors.length).to.be.greaterThan(1);
        done();
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
        expect(L.esri.Util.indexOf(arr, second)).to.eql(1);
        expect(L.esri.Util.indexOf(arr, third)).to.eql(2);
        expect(L.esri.Util.indexOf(arr, first, 1)).to.eql(-1);
        expect(L.esri.Util.indexOf(arr, {})).to.eql(-1);
        expect(L.esri.Util.indexOf(arr, 1)).to.eql(-1);
        expect(L.esri.Util.indexOf(arr, '')).to.eql(-1);
        expect(L.esri.Util.indexOf(arr, null)).to.eql(-1);
        expect(L.esri.Util.indexOf(arr, undefined)).to.eql(-1);
      });
    });
    describe('when using #extentToBounds', function () {
      it('will create Leaflet compatible bounds', function () {
        var bounds = L.esri.Util.extentToBounds(extent);
        expect(bounds.isValid()).to.be.ok();
        expect(bounds.getSouthWest().lng).to.eql(extent.xmin);
        expect(bounds.getSouthWest().lat).to.eql(extent.ymin);
        expect(bounds.getNorthEast().lng).to.eql(extent.xmax);
        expect(bounds.getNorthEast().lat).to.eql(extent.ymax);
      });
    });
    describe('when using #boundsToExtent', function () {
      it('will create an extent from Leaflet bounds', function () {
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
        var bounds = { name: 'test' },
          boundsToExtentStub = sandbox.stub(L.esri.Util, 'boundsToExtent').returns(extent);
        var envelope = L.esri.Util.boundsToEnvelope(bounds);
        expect(boundsToExtentStub.calledWith(bounds)).to.be.ok();
        expect(envelope.x).to.eql(extent.xmin);
        expect(envelope.y).to.eql(extent.ymin);
      });
    });
  });
});