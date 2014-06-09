console.log('hey there, sailor');

var map = L.map('homepage-map').setView([54, 160], 9);
L.esri.Layers.basemapLayer('Imagery').addTo(map);