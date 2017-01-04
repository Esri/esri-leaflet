/* eslint-env mocha */
/* eslint-disable handle-callback-err */
describe('L.esri.RasterLayer', function () {
  it('should not error when calling setOpacity when _currentImage is null', function () {
    var layer = new L.esri.RasterLayer();
    layer._currentImage = null;
    expect(function () { layer.setOpacity(0.5); }).to.not.throw();
  });
});
