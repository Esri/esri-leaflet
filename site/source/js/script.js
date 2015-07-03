var map;
var bgmap = L.map('background-map', {
    center: [68.41, 16.53],
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

if (map) {
  map.scrollWheelZoom.disable();
  map.on("click", accidentalScroll);
}

function accidentalScroll() {
  map.scrollWheelZoom.enable();
  map.off("click", accidentalScroll);
}
