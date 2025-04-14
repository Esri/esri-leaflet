/* eslint-env mocha */

describe("L.esri.options", () => {
  function createMap() {
    // create container
    const container = document.createElement("div");

    // give container a width/height
    container.setAttribute("style", "width:500px; height: 500px;");

    // add container to body
    document.body.appendChild(container);

    return L.map(container).setView([37.75, -122.45], 5);
  }

  let map;

  beforeEach(() => {
    // remove all the stylesheets that have already been added to the document
    Array.prototype.forEach.call(
      document.querySelectorAll('style,[rel="stylesheet"],[type="text/css"]'),
      (element) => {
        try {
          element.parentNode.removeChild(element);
          // console.log('this gets called many times');
        } catch (err) {
          // intentionally empty
        }
      },
    );

    map = createMap();
  });

  afterEach(() => {
    map.remove();
  });

  it("should set a default attribution width constraint", () => {
    map = createMap();
    L.esri.basemapLayer("Gray").addTo(map);

    // hacky way to inspect the css rule itself
    expect(document.styleSheets[1].rules[0].style.maxWidth).to.equal("445px");
    expect(document.styleSheets[1].rules[0].selectorText).to.equal(
      ".esri-truncated-attribution",
    );
  });

  it("should allow for controlling attribution width", () => {
    L.esri.options.attributionWidthOffset = 200;
    map = createMap();

    L.esri.basemapLayer("Gray").addTo(map);

    // hacky way to inspect the css rule itself
    expect(document.styleSheets[1].rules[0].style.maxWidth).to.equal("300px");
    expect(document.styleSheets[1].rules[0].selectorText).to.equal(
      ".esri-truncated-attribution",
    );
  });
});
