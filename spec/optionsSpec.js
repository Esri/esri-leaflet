/* eslint-env mocha */
/* eslint-disable handle-callback-err */
describe('L.esri.options', function () {
  function createMap () {
    // create container
    var container = document.createElement('div');

    // give container a width/height
    container.setAttribute('style', 'width:500px; height: 500px;');

    // add container to body
    document.body.appendChild(container);

    return L.map(container).setView([37.75, -122.45], 5);
  }

  var map;

  beforeEach(function () {
    // remove all the stylesheets that have already been added to the document
    Array.prototype.forEach.call(document.querySelectorAll('style,[rel="stylesheet"],[type="text/css"]'), function (element) {
      try {
        element.parentNode.removeChild(element);
        // console.log('this gets called many times');
      } catch (err) {}
    });

    map = createMap();
  });

  afterEach(function () {
    map.remove();
  });

  it('should set a default attribution width constraint', function () {
    map = createMap();
    L.esri.basemapLayer('Gray').addTo(map);

    // hacky way to inspect the css rule itself
    expect(document.styleSheets[1].rules[0].style.maxWidth).to.equal('445px');
    expect(document.styleSheets[1].rules[0].selectorText).to.equal('.esri-truncated-attribution');
  });

  it('should allow for controlling attribution width', function () {
    L.esri.options.attributionWidthOffset = 200;
    map = createMap();

    L.esri.basemapLayer('Gray').addTo(map);

    // hacky way to inspect the css rule itself
    expect(document.styleSheets[1].rules[0].style.maxWidth).to.equal('300px');
    expect(document.styleSheets[1].rules[0].selectorText).to.equal('.esri-truncated-attribution');
  });
});
/* eslint-enable handle-callback-err */
