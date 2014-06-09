console.log("hey there, sailor");

var map = L.map('homepage-map').setView([45.528, -122.680], 13);
L.esri.Layers.basemapLayer("Imagery").addTo(map);