console.log('hey there, sailor');

var map = L.map('background-map', {
    center: [54, 160],
    zoom: 9,
    scrollWheelZoom: false,
    doubleClickZoom: true,
    touchZoom: true,
    zoomControl: false,
    tap: false,
    attributionControl: false
});

L.esri.Layers.basemapLayer('Imagery').addTo(map);