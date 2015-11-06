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

L.esri.basemapLayer('Imagery', {
  hideLogo: true
}).addTo(bgmap);

window.map = bgmap

bgmap.setView([68.41, -179], 10, {animate: true, pan: {duration: 100000}})

if (map) {
  map.scrollWheelZoom.disable();
  map.on("click", accidentalScroll);
}

function accidentalScroll() {
  map.scrollWheelZoom.enable();
  map.off("click", accidentalScroll);
}
