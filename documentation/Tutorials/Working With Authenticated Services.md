# Working With Authenticated Services

Esri Leaflet supports access to private services on ArcGIS Online and ArcGIS Server services that require authentication.

Handing authentication in Esri Leaflet is flexible and lightweight but makes serveral assumptions.

1. You (the developer) will handle obtaining and persisting tokens.
2. Esri Leaflet will use your tokens to access services.
3. Esri Leaflet will notify you when it recives an error while using your token and prompt you for a new one.
4. Esri Leaflet will continue to use the new token

An example of using Oauth 2 to access a private feature service on ArcGIS Online can be found [here](http://esri.github.io/esri-leaflet/privatefeaturelayer.html).

An example of authenticating with a username/password to a service hosted on ArcGIS Server can be found [here](http://esri.github.io/esri-leaflet/privatemapservice.html).

## Example

```js
// When you create a service if you have a token you can pass it in
var privateLayer = new L.esri.FeatureLayer(url, {
  token: "aToken"
}).addTo(map);

// listen to the authenticationrequired event to know when you should provide a new token
privateLayer.on('authenticationrequired', function(e){
  // do something to get a token that is valid for the service
  // after you call authenticate all pending requests will resume
  e.authenticate(newToken);
});
```