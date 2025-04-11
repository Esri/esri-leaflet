/* eslint-env mocha */

describe("L.esri.RasterLayer", () => {
  it("should not error when calling setOpacity when _currentImage is null", () => {
    const layer = new L.esri.RasterLayer();
    layer._currentImage = null;
    expect(() => {
      layer.setOpacity(0.5);
    }).to.not.throw();
  });

  // Extend 'abstract' RasterLayer object and implement functionality required for tests
  const TestRasterLayer = L.esri.RasterLayer.extend({
    initialize(options) {
      L.setOptions(this, options);
      this.service = {
        metadata() {},
      };
    },

    _buildExportParams() {
      return "data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=="; // A blank image URL
    },

    _requestExport(uri, bounds) {
      this._renderImage(uri, bounds);
    },
  });

  describe("_renderImage", () => {
    let div, map, layer;

    // Set up things before each test run
    beforeEach(() => {
      div = document.createElement("div");
      div.style.width = "800px";
      div.style.height = "600px";
      div.style.visibility = "hidden";

      document.body.appendChild(div);
      map = new L.Map(div);
      map.setView([0, 0], 1); // view needs to be set so when layer is added it is initilized

      map.addLayer = sinon.spy(map.addLayer); // we want to spy layers being added and removed from the map
      map.removeLayer = sinon.spy(map.removeLayer);

      layer = new TestRasterLayer();
    });

    // Clean up after each test run
    afterEach(() => {
      document.body.removeChild(div);
    });

    describe("when error is raised when loading the ImageOverlay", () => {
      it("should raise an error", () => {
        const errorCallback = sinon.spy();
        layer.on("error", errorCallback);

        layer.addTo(map);

        const imageOverlay = map.addLayer.getCall(1).args[0]; // Get the ImageOverlay which is being added to the map
        imageOverlay.fire("error"); // And fire the error event on the layer

        expect(errorCallback.called).to.be.true;
      });

      it("should remove the ImageOverlay which is being loaded", () => {
        layer.addTo(map);

        const imageOverlay = map.addLayer.getCall(1).args[0];
        imageOverlay.fire("error");

        expect(map.removeLayer.calledWith(imageOverlay)).to.be.true;
      });

      it("should stop listening for the load event", () => {
        layer.addTo(map);

        const imageOverlay = map.addLayer.getCall(1).args[0];
        imageOverlay.off = sinon.spy(imageOverlay.off);
        imageOverlay.fire("error");

        expect(imageOverlay.off.calledWith("load", sinon.match.func, layer)).to
          .be.true;
      });
    });

    describe("when the ImageOverlay has loaded", () => {
      it("should stop listening for the error event", () => {
        layer.addTo(map);
        const imageOverlay = map.addLayer.getCall(1).args[0];
        imageOverlay.off = sinon.spy(imageOverlay.off);
        imageOverlay.fire("load");

        expect(imageOverlay.off.calledWith("error", sinon.match.func, layer)).to
          .be.true;
      });

      it("should send credentials", () => {
        const layer = new TestRasterLayer({ withCredentials: true });
        layer.addTo(map);
        const imageOverlay = map.addLayer.getCall(1).args[0];
        expect(imageOverlay._image.crossOrigin).to.be.equal("use-credentials");
      });
    });
  });
});
