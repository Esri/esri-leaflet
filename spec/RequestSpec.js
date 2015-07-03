describe('L.esri.Request', function () {
  var xhr;
  var requests = [];

  beforeEach(function(){
    xhr = sinon.useFakeXMLHttpRequest();
    requests = [];

    xhr.onCreate = function (xhr) {
      requests.push(xhr);
    };
  });

  afterEach(function(){
    requests = [];
  });

  var sampleResponse = {
    currentVersion: 10.2,
    fullVersion: '10.2.0',
    soapUrl: 'http://services.arcgisonline.com/arcgis/services',
    secureSoapUrl: 'https://services.arcgisonline.com/arcgis/services',
    authInfo: {
      'isTokenBasedSecurity': 'false'
    }
  };

  var sampleError = {
    error: {
      code: 500,
      message: 'Error'
    }
  };

  it('should be able to make a GET request with CORS', function(done){
    L.esri.Request.get.CORS('http://services.arcgisonline.com/ArcGIS/rest/info', {}, function(error, response){
      expect(this.foo).to.equal('bar');
      expect(response).to.deep.equal(sampleResponse);
      done();
    }, {
      foo: 'bar'
    });

    expect(requests[0].url).to.equal('http://services.arcgisonline.com/ArcGIS/rest/info?f=json');
    expect(requests[0].method).to.equal('GET');
    requests[0].respond(200, { 'Content-Type': 'text/plain; charset=utf-8' }, JSON.stringify(sampleResponse));
  });

  it('should be able to make a GET request with JSONP', function(done){
    var request = L.esri.Request.get.JSONP('http://example.com/foo', {}, function(error, response){
      expect(this.foo).to.equal('bar');
      expect(response).to.deep.equal(sampleResponse);
      done();
    }, {
      foo: 'bar'
    });

    window._EsriLeafletCallbacks[request.id](sampleResponse);
  });

  it('should callback with an error on non-JSON reponses', function(done){
    var request = L.esri.Request.get.JSONP('http://example.com/foo', {}, function(error){
      expect(error).to.deep.equal({
        error: {
          code: 500,
          message: 'Expected array or object as JSONP response'
        }
      });
      done();
    });

    window._EsriLeafletCallbacks[request.id]('foo');
  });

  it('should callback with an error when an error is recived from the server', function(done){
    var request = L.esri.Request.get.JSONP('http://example.com/foo', {}, function(error){
      expect(error).to.deep.equal(sampleError);
      done();
    });

    window._EsriLeafletCallbacks[request.id](sampleError);
  });

  it('should be able to make a POST request with CORS', function(done){
    L.esri.Request.post.XMLHTTP('http://services.arcgisonline.com/ArcGIS/rest/info', {}, function(error, response){
      expect(response).to.deep.equal(sampleResponse);
      done();
    });

    expect(requests[0].requestBody).to.equal('f=json');
    requests[0].respond(200, { 'Content-Type': 'text/plain; charset=utf-8' }, JSON.stringify(sampleResponse));
  });

  it('should serialize arrays of objects as JSON', function(done){
    L.esri.Request.get.CORS('http://services.arcgisonline.com/ArcGIS/rest/info', {
      object: [{foo:'bar'}]
    }, function(error, response){
      expect(response).to.deep.equal(sampleResponse);
      done();
    });

    expect(requests[0].url).to.equal('http://services.arcgisonline.com/ArcGIS/rest/info?object=%5B%7B%22foo%22%3A%22bar%22%7D%5D&f=json');
    expect(requests[0].method).to.equal('GET');
    requests[0].respond(200, { 'Content-Type': 'text/plain; charset=utf-8' }, JSON.stringify(sampleResponse));
  });

  it('should serialize arrays of non objects as comma seperated strings', function(done){
    L.esri.Request.get.CORS('http://services.arcgisonline.com/ArcGIS/rest/info', {
      array: ['foo', 'bar']
    }, function(error, response){
      expect(response).to.deep.equal(sampleResponse);
      done();
    });

    expect(requests[0].url).to.equal('http://services.arcgisonline.com/ArcGIS/rest/info?array=foo%2Cbar&f=json');
    expect(requests[0].method).to.equal('GET');
    requests[0].respond(200, { 'Content-Type': 'text/plain; charset=utf-8' }, JSON.stringify(sampleResponse));
  });

  it('should serialize Objects as JSON', function(done){
    L.esri.Request.get.CORS('http://services.arcgisonline.com/ArcGIS/rest/info', {
      object: {
        foo:'bar'
      }
    }, function(error, response){
      expect(response).to.deep.equal(sampleResponse);
      done();
    });

    expect(requests[0].url).to.equal('http://services.arcgisonline.com/ArcGIS/rest/info?object=%7B%22foo%22%3A%22bar%22%7D&f=json');
    expect(requests[0].method).to.equal('GET');
    requests[0].respond(200, { 'Content-Type': 'text/plain; charset=utf-8' }, JSON.stringify(sampleResponse));
  });

  it('should serialize Dates as seconds', function(done){
    var now = new Date();
    var stamp = now.valueOf();

    L.esri.Request.get.CORS('http://services.arcgisonline.com/ArcGIS/rest/info', {
      time: now
    }, function(error, response){
      expect(response).to.deep.equal(sampleResponse);
      done();
    });

    expect(requests[0].url).to.equal('http://services.arcgisonline.com/ArcGIS/rest/info?time=' + stamp + '&f=json');
    expect(requests[0].method).to.equal('GET');
    requests[0].respond(200, { 'Content-Type': 'text/plain; charset=utf-8' }, JSON.stringify(sampleResponse));
  });

  it('should throw errors when response is not a JSON object', function(done){
    L.esri.Request.get.CORS('http://services.arcgisonline.com/ArcGIS/rest/info', {}, function(error){
      expect(error).to.deep.equal({
        message: 'Could not parse response as JSON. This could also be caused by a CORS or XMLHttpRequest error.',
        code: 500
      });
      done();
    });

    expect(requests[0].url).to.equal('http://services.arcgisonline.com/ArcGIS/rest/info?f=json');
    expect(requests[0].method).to.equal('GET');
    requests[0].respond(200, { 'Content-Type': 'text/plain; charset=utf-8' }, 'foo');
  });

  it('should callback with an error when an XMLHttpRequest error is encountered', function(done){
    var request = L.esri.Request.post.XMLHTTP('http://services.arcgisonline.com/ArcGIS/rest/info', {}, function(error, response){
      expect(error).to.deep.equal({
        error: {
          message: 'XMLHttpRequest error',
          code: 500
        }
      });
      done();
    });

    request.onerror();
  });

  it('should setup an alias for L.esri.get', function(){
    expect(L.esri.get).to.be.a('function');
  });

  it('should setup an alias for L.esri.post', function(){
    expect(L.esri.post).to.be.a('function');
  });
});