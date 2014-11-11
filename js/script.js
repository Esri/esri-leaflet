var bgmap = L.map('background-map', {
    center: [68.41, -343.47],
    zoom: 10,
    scrollWheelZoom: false,
    doubleClickZoom: true,
    touchZoom: true,
    zoomControl: false,
    tap: false,
    attributionControl: false
});

L.esri.Layers.basemapLayer('Imagery', {
  hideLogo: true
}).addTo(bgmap);