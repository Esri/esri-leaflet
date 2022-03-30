/* eslint-env mocha */
/* eslint-disable no-unused-expressions */
describe('L.esri.Util', function () {
  var sampleExtent = {
    xmin: -122.70,
    ymin: 45.50,
    xmax: -122.64,
    ymax: 45.52,
    spatialReference: { wkid: 4326 }
  };

  var sampleBounds = new L.LatLngBounds([
    [45.50, -122.70], // sw lat, lng
    [45.52, -122.64] // ne lat lng
  ]);

  var hostedFeatureServiceUrl = 'http://services.arcgis.com/rOo.../arcgis/rest/services/RawsomeServiceName/FeatureServer/0';
  var otherServiceUrl = 'http://demographics4.arcgis.com/arcgis/rest/services/USA_Demographics_and_Boundaries_2014/MapServer/9';
  var normalFeatureServiceUrl = 'http://oneofoursampleservers.arcgisonline.com/arcgis/rest/services/WorldTimeZones/MapServer/2';

  var knownIdFieldTestCases = ['OBJECTID', 'FID', 'OID', 'ID', 'objectid', 'fid', 'oid', 'id'];

  it('should return a L.LatLngBounds object from extentToBounds', function () {
    var bounds = L.esri.Util.extentToBounds(sampleExtent);
    expect(bounds).to.be.an.instanceof(L.LatLngBounds);
    expect(bounds.isValid()).to.be.true;
    expect(bounds.getSouthWest().lng).to.equal(sampleExtent.xmin);
    expect(bounds.getSouthWest().lat).to.equal(sampleExtent.ymin);
    expect(bounds.getNorthEast().lng).to.equal(sampleExtent.xmax);
    expect(bounds.getNorthEast().lat).to.equal(sampleExtent.ymax);
  });

  it('should convert a L.LatLngBounds object to an extent object', function () {
    var extent = L.esri.Util.boundsToExtent(sampleBounds);
    expect(extent.xmin).to.equal(sampleBounds.getSouthWest().lng);
    expect(extent.ymin).to.equal(sampleBounds.getSouthWest().lat);
    expect(extent.xmax).to.equal(sampleBounds.getNorthEast().lng);
    expect(extent.ymax).to.equal(sampleBounds.getNorthEast().lat);
  });

  it('should trim whitespace from urls with cleanUrl', function () {
    var url = L.esri.Util.cleanUrl('  http://arcgis.com/  ');
    expect(url).to.equal('http://arcgis.com/');
  });

  it('should store in requestParams option, additional parameters passed in url', function () {
    var options = {
      url: 'http://services.arcgisonline.com/ArcGIS/rest/services/USA_Topo_Maps/MapServer?foo=bar',
      maxZoom: 15
    };
    options = L.esri.Util.getUrlParams(options);

    expect(options.url).to.equal('http://services.arcgisonline.com/ArcGIS/rest/services/USA_Topo_Maps/MapServer/');
    expect(options.requestParams).to.deep.equal({ foo: 'bar' });
  });

  it('should add a trailing slash to the url with cleanUrl', function () {
    var url = L.esri.Util.cleanUrl('http://arcgis.com');
    expect(url).to.equal('http://arcgis.com/');
  });

  it('shouldnt trim spaces in the middle', function () {
    var url = L.esri.Util.cleanUrl('   http://arcgis.com/cool folder/anotherfolder ');
    expect(url).to.equal('http://arcgis.com/cool folder/anotherfolder/');
  });

  it('should know the difference between a hosted feature service and everything else', function () {
    expect(L.esri.Util.isArcgisOnline(hostedFeatureServiceUrl)).to.be.true;
    expect(L.esri.Util.isArcgisOnline(otherServiceUrl)).to.be.false;
    expect(L.esri.Util.isArcgisOnline(normalFeatureServiceUrl)).to.be.false;
  });

  describe('_findIdAttributeFromFeature', function () {
    for (var caseId = 0; caseId < knownIdFieldTestCases.length; caseId++) {
      var testCase = knownIdFieldTestCases[caseId];

      it('should return the correct key when a item has ' + testCase + ' attribute', function () {
        var feature = {
          attributes: {
            someAttribute: 123,
            aTestAttribute: 345,
            aTestAttributeId: 412,
            ourAttributeGetsAdded: 'hello'
          }
        };
        feature.attributes[testCase] = 'set up our id field amongst others here';

        var result = L.esri.Util._findIdAttributeFromFeature(feature);

        expect(result).to.equal(testCase);
      });
    }
  });

  describe('_findIdAttributeFromResponse', function () {
    it('should return the value of objectIdFieldName if response contains objectIdFieldName', function () {
      var response = {
        objectIdFieldName: 'ilikeunittests'
      };

      var result = L.esri.Util._findIdAttributeFromResponse(response);

      expect(result).to.equal('ilikeunittests');
    });

    it('should return the name from the field which has the type of esriFieldTypeOID', function () {
      var response = {
        fields: [
          { name: 'a field', type: 'something' },
          { name: 'another field', type: 'something else' },
          { name: 'theIdField', type: 'esriFieldTypeOID' }
        ]
      };

      var result = L.esri.Util._findIdAttributeFromResponse(response);

      expect(result).to.equal('theIdField');
    });

    for (var caseId = 0; caseId < knownIdFieldTestCases.length; caseId++) {
      var testCase = knownIdFieldTestCases[caseId];

      it('should return ' + testCase + ' if found in fields', function () {
        var response = {
          fields: [
            { name: 'a field', type: 'something' },
            { name: 'another field', type: 'something else' },
            { name: 'yetanotherfield', type: 'yetanotherfield' }
          ]
        };
        response.fields.push({ name: testCase, type: 'somethingunimportant' });

        var result = L.esri.Util._findIdAttributeFromResponse(response);

        expect(result).to.equal(testCase);
      });
    }
  });

  describe('warn', function () {
    it('should setup an alias for L.esri.Util.warn', function () {
      expect(L.esri.Util.warn).to.be.a('function');
    });
  });
});
