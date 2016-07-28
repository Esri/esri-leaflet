var bgmap = L.map('background-map', {
    center: [37.739, -117.986],
    zoom: 10,
    scrollWheelZoom: false,
    touchZoom: true,
    zoomControl: false,
    tap: false,
    attributionControl: false,
    layers: [L.esri.basemapLayer('Imagery')]
});

if (map) {
  map.scrollWheelZoom.disable();
  map.once("click", accidentalScroll, map);
}

function accidentalScroll() {
  map.scrollWheelZoom.enable();
}
