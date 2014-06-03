describe('L.esri.Request', function () {
  var server;

  beforeEach(function(){
    server = sinon.fakeServer.create();
  });

  afterEach(function(){
    server.restore();
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

  it('should be able to make a GET request with CORS', function(){
    server.respondWith('GET', 'http://services.arcgisonline.com/ArcGIS/rest/info?f=json', JSON.stringify(sampleResponse));

    L.esri.Request.get.CORS('http://services.arcgisonline.com/ArcGIS/rest/info', {}, function(error, response){
      expect(error).to.equal(undefined);
      expect(this.foo).to.equal('bar');
      expect(response).to.deep.equal(sampleResponse);
    }, {
      foo: 'bar'
    });

    L.esri.Request.get.CORS('http://services.arcgisonline.com/ArcGIS/rest/info', {}, function(error, response){
      expect(error).to.equal(undefined);
      expect(response).to.deep.equal(sampleResponse);
    });

    server.respond();
  });

  it('should be able to make a GET request with JSONP', function(done){
    var id = L.esri.Request.get.JSONP('http://example.com/foo', {}, function(error, response){
      expect(error).to.equal(undefined);
      expect(this.foo).to.equal('bar');
      expect(response).to.deep.equal(sampleResponse);
      done();
    }, {
      foo: 'bar'
    });

    L.esri._callback[id](sampleResponse);
  });

  it('should callback with an error on non-JSON reponses', function(done){
    var id = L.esri.Request.get.JSONP('http://example.com/foo', {}, function(error, response){
      expect(response).to.equal(null);
      expect(error).to.deep.equal({
        error: {
          code: 500,
          message: 'Expected array or object as JSONP response'
        }
      });
      done();
    });

    L.esri._callback[id]('foo');
  });

  it('should callback with an error when an error is recived from the server', function(done){
    var id = L.esri.Request.get.JSONP('http://example.com/foo', {}, function(error, response){
      expect(response).to.equal(null);
      expect(error).to.deep.equal(sampleError);
      done();
    });

    L.esri._callback[id](sampleError);
  });

  it('should be able to make a POST request with CORS', function(){
    server.respondWith('POST', 'http://services.arcgisonline.com/ArcGIS/rest/info?f=json', JSON.stringify(sampleResponse));

    L.esri.Request.post.XMLHTTP('http://services.arcgisonline.com/ArcGIS/rest/info', {}, function(error, response){
      expect(error).to.equal(undefined);
      expect(this.foo).to.equal('bar');
      expect(response).to.deep.equal(sampleResponse);
    }, {
      foo: 'bar'
    });

    L.esri.Request.post.XMLHTTP('http://services.arcgisonline.com/ArcGIS/rest/info', {}, function(error, response){
      expect(error).to.equal(undefined);
      expect(response).to.deep.equal(sampleResponse);
    });

    server.respond();
  });

  it('should serialize Arrays as JSON', function(){
    server.respondWith('GET', 'http://services.arcgisonline.com/ArcGIS/rest/info?f=json&array=["foo","bar"]', JSON.stringify("Not JSON"));
    L.esri.Request.get.CORS('http://services.arcgisonline.com/ArcGIS/rest/info', {
      array: ['foo', 'bar']
    }, function(error, response){
      expect(response).to.equal(null);
      expect(error).to.deep.equal(sampleResponse);
    });
  });

  it('should serialize Objects as JSON', function(){
    server.respondWith('GET', 'http://services.arcgisonline.com/ArcGIS/rest/info?f=json&object={"foo":"bar"}', JSON.stringify("Not JSON"));
    L.esri.Request.get.CORS('http://services.arcgisonline.com/ArcGIS/rest/info', {
      object: {
        foo:'bar'
      }
    }, function(error, response){
      expect(response).to.equal(null);
      expect(error).to.deep.equal(sampleResponse);
    });
  });

  it('should serialize Dates as seconds', function(){
    var now = new Date();
    var stamp = now.valueOf();

    server.respondWith('GET', 'http://services.arcgisonline.com/ArcGIS/rest/info?f=json&time=' + stamp, JSON.stringify("Not JSON"));

    L.esri.Request.get.CORS('http://services.arcgisonline.com/ArcGIS/rest/info', {
      time: now
    }, function(error, response){
      expect(response).to.equal(null);
      expect(error).to.deep.equal(sampleResponse);
    });
  });

  it('should throw errors when response is not a JSON objects for GET and POST', function(){
    server.respondWith('GET', 'http://services.arcgisonline.com/ArcGIS/rest/info?f=json', JSON.stringify("Not JSON"));
    server.respondWith('POST', 'http://services.arcgisonline.com/ArcGIS/rest/info?f=json', JSON.stringify("Not JSON"));

    L.esri.Request.post.XMLHTTP('http://services.arcgisonline.com/ArcGIS/rest/info', {}, function(error, response){
      expect(response).to.equal(null);
      expect(error).to.deep.equal({
        error: 'Could not parse response as JSON.',
        code: 500
      });
    });

    L.esri.Request.get.CORS('http://services.arcgisonline.com/ArcGIS/rest/info', {}, function(error, response){
      expect(response).to.equal(null);
      expect(error).to.deep.equal({
        error: 'Could not parse response as JSON.',
        code: 500
      });
    });

    server.respond();
  });

  it('should throw errors when response is not a JSON objects for GET and POST', function(){
    server.respondWith('GET', 'http://services.arcgisonline.com/ArcGIS/rest/info?f=json', JSON.stringify(sampleError));
    server.respondWith('POST', 'http://services.arcgisonline.com/ArcGIS/rest/info?f=json', JSON.stringify(sampleError));

    L.esri.Request.post.XMLHTTP('http://services.arcgisonline.com/ArcGIS/rest/info', {}, function(error, response){
      expect(response).to.equal(null);
      expect(error).to.deep.equal(sampleError);
    });

    L.esri.Request.get.CORS('http://services.arcgisonline.com/ArcGIS/rest/info', {}, function(error, response){
      expect(response).to.equal(null);
      expect(error).to.deep.equal(sampleError);
    });

    server.respond();
  });

  it('should callback with an error when an XMLHttpRequest error is encountered', function(done){
    server.respondWith('GET', 'http://services.arcgisonline.com/ArcGIS/rest/info?f=json', JSON.stringify(sampleResponse));

    var request = L.esri.Request.post.XMLHTTP('http://services.arcgisonline.com/ArcGIS/rest/info', {}, function(error, response){
      expect(response).to.equal(null);
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