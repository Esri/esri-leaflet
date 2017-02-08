var map;
var bgmap = L.map('background-map', {
    center: [37.739, -117.986],
    zoom: 10,
    scrollWheelZoom: false,
    touchZoom: true,
    zoomControl: false,
    tap: false,
    attributionControl: false,
    layers: [L.esri.basemapLayer('Topographic')]
});

bgmap.setView([68.41, -179], 10, {animate: true, pan: {duration: 100000}})

if (map) {
  map.scrollWheelZoom.disable();
  map.once("click", accidentalScroll, map);
}

function accidentalScroll() {
  map.scrollWheelZoom.enable();
}

// Automatically generate links on the heading elements on a page
var pageHeadings = document.querySelectorAll("h2, h3, h4, h5, h6")
for (i = 0; i < pageHeadings.length; ++i) {
  pageHeadings[i].addEventListener("click", function(){
    window.location.hash = this.id;
  });
}
