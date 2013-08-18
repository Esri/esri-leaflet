/* globals L, describe, it, expect, beforeEach*/

describe('L.esri.DynamicMapLayer', function () {
  var map,
    sandbox,
    url = 'http://tmservices1.esri.com/arcgis/rest/services/LiveFeeds/Hurricane_Recent/MapServer';
  beforeEach(function () {
    map = L.map(document.createElement('div'));
    map.setView([37.75, -122.45], 12);
    sandbox = sinon.sandbox.create();
  });
  afterEach(function () {
    sandbox.restore();
  });

  describe('#constructor', function () {
    describe('when a DynamicMapLayer is first created', function () {
      it('has some default parameters', function () {
        var setOptionsSpy = sandbox.spy(L.Util, 'setOptions'),
          dynLayer = L.esri.dynamicMapLayer(url),
          defaultParams = {
            format: 'png8',
            transparent: true,
            f: 'image',
            bboxSR: 102100,
            imageSR: 102100,
            layers: '',
            opacity: 1
          };
        expect(dynLayer.defaultParams).to.eql(defaultParams);
        expect(setOptionsSpy.calledOnce).to.be.ok();
      });
      it('can be assigned some default/non-default parameters', function () {
        var defaultParams = {
          format: 'jpg',
          transparent: true,
          f: 'image',
          bboxSR: 102100,
          imageSR: 102100,
          layers: '',
          opacity: 0.5,
          myname: 'johndoe',
          token: 'I am a token'
        };
        var dynLayer = L.esri.dynamicMapLayer(url, defaultParams);
        expect(dynLayer._layerParams.format).to.eql(defaultParams.format);
        expect(dynLayer._layerParams.myname).to.eql(defaultParams.myname);
        expect(dynLayer._layerParams.token).not.to.be.ok();
      });
      it('will not set opacity when transparent parameter is false', function () {
        var defaultParams = {
          transparent: false,
          opacity: 0.5
        };
        var dynLayer = L.esri.dynamicMapLayer(url, defaultParams);

        expect(dynLayer._layerParams.transparent).to.eql(defaultParams.transparent);
        expect(dynLayer._layerParams.opacity).not.to.eql(defaultParams.opacity);
        expect(dynLayer._layerParams.opacity).to.eql(1);
      });
    });
  });

  describe('#onAdd, #onRemove', function () {
    describe('when added to map', function () {
      it('will set map#on method and reset layer', function () {
        map._panes = { overlayPane: { appendChild: function () {
        } } };
        var dynLayer = L.esri.dynamicMapLayer(url),
          onSpy = sandbox.spy(map, 'on'),
          resetSpy = sandbox.spy(dynLayer, '_reset'),
          appendSpy = sandbox.spy(map._panes.overlayPane, 'appendChild')
        dynLayer._image = {};
        dynLayer.onAdd(map);
        expect(onSpy.called).to.be.ok();
        expect(resetSpy.called).to.be.ok();
        expect(appendSpy.calledWith(dynLayer._image)).to.be.ok();
      });
    });
    describe('when removed from map', function () {
      it('will call remove functions on map when onRemove called', function () {
        var dynLayer = L.esri.dynamicMapLayer(url),
          getPanesStub = sandbox.stub(map, 'getPanes').returns({
            overlayPane: {
              removeChild: function () {
              }
            }
          }),
          offSpy = sandbox.spy(map, 'off');
        map.addLayer(dynLayer);
        dynLayer.onRemove(map);
        expect(getPanesStub.calledOnce).to.be.ok();
        expect(offSpy.called).to.be.ok();
      });
    });
  });
});