/* eslint-env mocha */
/* eslint-disable handle-callback-err */
/* eslint-disable no-unused-expressions */
describe('L.esri.RasterLayer', function () {
  it('should not error when calling setOpacity when _currentImage is null', function () {
    var layer = new L.esri.RasterLayer();
    layer._currentImage = null;
    expect(function () { layer.setOpacity(0.5); }).to.not.throw();
  });

  // Extend 'abstract' RasterLayer object and implement functionality required for tests
  var TestRasterLayer = L.esri.RasterLayer.extend({
    initialize: function (options) {
      L.setOptions(this, options);
      this.service = {
        metadata: function () {}
      };
    },

    _buildExportParams: function () {
      return 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=='; // A blank image URL
    },

    _requestExport: function (uri, bounds) {
      this._renderImage(uri, bounds);
    }
  });

  describe('_renderImage', function () {
    var div, map, layer;

    // Set up things before each test run
    beforeEach(function () {
      div = document.createElement('div');
      div.style.width = '800px';
      div.style.height = '600px';
      div.style.visibility = 'hidden';

      document.body.appendChild(div);
      map = new L.Map(div);
      map.setView([0, 0], 1); // view needs to be set so when layer is added it is initilized

      map.addLayer = sinon.spy(map.addLayer); // we want to spy layers being added and removed from the map
      map.removeLayer = sinon.spy(map.removeLayer);

      layer = new TestRasterLayer();
    });

    // Clean up after each test run
    afterEach(function () {
      document.body.removeChild(div);
    });

    describe('when error is raised when loading the ImageOverlay', function () {
      it('should raise an error', function () {
        var errorCallback = sinon.spy();
        layer.on('error', errorCallback);

        layer.addTo(map);

        var imageOverlay = map.addLayer.getCall(1).args[0]; // Get the ImageOverlay which is being added to the map
        imageOverlay.fire('error'); // And fire the error event on the layer

        expect(errorCallback.called).to.be.true;
      });

      it('should remove the ImageOverlay which is being loaded', function () {
        layer.addTo(map);

        var imageOverlay = map.addLayer.getCall(1).args[0];
        imageOverlay.fire('error');

        expect(map.removeLayer.calledWith(imageOverlay)).to.be.true;
      });

      it('should stop listening for the load event', function () {
        layer.addTo(map);

        var imageOverlay = map.addLayer.getCall(1).args[0];
        imageOverlay.off = sinon.spy(imageOverlay.off);
        imageOverlay.fire('error');

        expect(imageOverlay.off.calledWith('load', sinon.match.func, layer)).to.be.true;
      });
    });

    describe('when the ImageOverlay has loaded', function () {
      it('should stop listening for the error event', function () {
        layer.addTo(map);
        var imageOverlay = map.addLayer.getCall(1).args[0];
        imageOverlay.off = sinon.spy(imageOverlay.off);
        imageOverlay.fire('load');

        expect(imageOverlay.off.calledWith('error', sinon.match.func, layer)).to.be.true;
      });

      it('should send credentials', function () {
        var layer = new TestRasterLayer({ withCredentials: true });
        layer.addTo(map);
        var imageOverlay = map.addLayer.getCall(1).args[0];
        expect(imageOverlay._image.crossOrigin).to.be.equal('use-credentials');
      });
    });
  });
});
