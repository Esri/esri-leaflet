/* globals L, describe, beforeEach, afterEach, it, expect, Terraformer*/

describe('L.esri.FeatureLayer', function () {
  var map,
    sandbox,
    url = 'http://services.arcgis.com/rOo16HdIMeOBI4Mb/arcgis/rest/services/stops/FeatureServer/0/';
  beforeEach(function () {
    map = L.map(document.createElement('div'));
    map.setView([37.75, -122.45], 12);
    sandbox = sinon.sandbox.create();
  });
  afterEach(function () {
    sandbox.restore();
  });

  describe('#constructor', function () {
    describe('when a FeatureLayer is first created', function () {
      it('will have an index defined by Terraformer', function () {
        var rtreeSpy = sandbox.spy(Terraformer, 'RTree'),
          featLayer = L.esri.featureLayer(url);
        expect(rtreeSpy.called).to.be.ok();
        expect(featLayer.index).to.be.ok();
      });
    });
  });

  describe('#onAdd, #onRemove, #updateFeatures', function () {
    describe('when a FeatureLayer is added to the map', function () {
      it('will call its own updateFeatures', function () {
        var featLayer = L.esri.featureLayer(url),
          updateFeaturesSpy = sandbox.spy(featLayer, 'updateFeatures');
        featLayer.onAdd(map);
        expect(updateFeaturesSpy.calledWith(map)).to.be.ok();
      });

      it('will have updateFeatures draw the features on the map', function (done) {
        var featLayer = L.esri.featureLayer(url),
          onSpy = sandbox.spy(map, 'on');
        featLayer.onAdd(map);
        setTimeout(function () {
          expect(onSpy.calledWith('viewreset moveend')).to.be.ok();
          done();
        }, 1000);
      });

      it('will search the Terraformer index', function (done) {
        var featLayer = L.esri.featureLayer(url),
          onSpy = sandbox.spy(map, 'on'),
          searchStub = sandbox.stub(featLayer.index, 'search').returns({
            then: function () {
            }
          });
        featLayer.onAdd(map);
        setTimeout(function () {
          expect(onSpy.calledWith('viewreset moveend')).to.be.ok();
          expect(searchStub.calledOnce).to.be.ok();
          done();
        }, 1000);
      });

      it('will query map service for features in envelope', function (done) {
        var featLayer = L.esri.featureLayer(url),
          onSpy = sandbox.spy(map, 'on'),
          searchStub = sandbox.stub(featLayer.index, 'search').returns({
            then: function () {
            }
          }),
          getSpy = sandbox.spy(L.esri, 'get');
        featLayer.onAdd(map);
        setTimeout(function () {
          expect(onSpy.calledWith('viewreset moveend')).to.be.ok();
          expect(searchStub.calledOnce).to.be.ok();
          expect(getSpy.calledOnce).to.be.ok();
          done();
        }, 1000);
      });
    });
    describe('when a FeatureLayer is removed from the map', function () {
      it('will remove associated events from the map', function () {
        var featLayer = L.esri.featureLayer(url),
          offSpy = sandbox.spy(map, 'off');
        featLayer.onRemove(map);
        expect(offSpy.calledOnce).to.be.ok();
      });
    });
  });
  describe('#getLayerId', function () {
    describe('when asked for a layer id', function () {
      it('will return the FeatureLayer id for layer it is given', function () {
        var featLayer = L.esri.featureLayer(url);
        expect(featLayer.getLayerId({ feature: { id: 'LAYERID' } })).to.eql('LAYERID');
      });
    });
  });
});