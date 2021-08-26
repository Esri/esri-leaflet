L.map('background-map', {
  center: [37.739, -117.986],
  zoom: 10,
  scrollWheelZoom: false,
  touchZoom: true,
  zoomControl: false,
  tap: false,
  attributionControl: false,
  layers: [L.esri.basemapLayer('Topographic')]
});

var map;

if (map) {
  map.scrollWheelZoom.disable();
  map.once('click', accidentalScroll, map);
}

function accidentalScroll () {
  map.scrollWheelZoom.enable();
}

// Automatically generate links on the heading elements on a page (if they have an `id` node attribute)
var pageHeadings = document.querySelectorAll('h2[id], h3[id], h4[id], h5[id], h6[id]');
for (var i = 0; i < pageHeadings.length; ++i) {
  pageHeadings[i].addEventListener('click', function () {
    window.location.hash = this.id;
  });
}

// First we check if you support touch, otherwise it's click:
var touchEvent = 'ontouchstart' in window ? 'touchstart' : 'click';

// Mobile nav logic
document.addEventListener(touchEvent, function (e) {
  if (e.target.className !== 'mobileMenuButton') return;
  e.preventDefault();

  var menu = document.querySelector('#site-nav-wrapper'); // Using a class instead, see note below.
  menu.classList.toggle('show');
}, false);

var pathnameParts = window.location.pathname.split('/');
var pathnameEnd = pathnameParts[pathnameParts.length - 1];

var activeBorderBottom = '2px solid #79BD8F';
var activeFontWeight = 'bold';
// attempt to style the active page's corresponding sidebar link
var sidebarActiveLinkElement = document.querySelector(`.sidebar a[href$="${pathnameEnd}"]`);
if (sidebarActiveLinkElement) {
  sidebarActiveLinkElement.style.borderBottom = activeBorderBottom;
  sidebarActiveLinkElement.style.fontWeight = activeFontWeight;
} else if (pathnameParts.indexOf('examples') > -1 && pathnameEnd === '') {
  // attempt to style the "Quickstart" 1st menu link which has a different href structure
  var quickstartSidebarActiveLinkElement = document.querySelector('.sidebar a');
  if (quickstartSidebarActiveLinkElement) {
    quickstartSidebarActiveLinkElement.style.borderBottom = activeBorderBottom;
    quickstartSidebarActiveLinkElement.style.fontWeight = activeFontWeight;
  }
}

// attempt to style the active page's corresponding sidebar link in the mobile menu
var mobileMenuActiveLinkElement = document.querySelector(`.mobile-menu .sidebar a[href$="${pathnameEnd}"]`);
if (mobileMenuActiveLinkElement) {
  mobileMenuActiveLinkElement.style.borderBottom = activeBorderBottom;
  mobileMenuActiveLinkElement.style.fontWeight = activeFontWeight;
} else if (pathnameParts.indexOf('examples') > -1 && pathnameEnd === '') {
  // attempt to style the "Quickstart" 1st menu link which has a different href structure
  var quickstartMobileActiveLinkElement = document.querySelector('.mobile-menu .sidebar a');
  if (quickstartMobileActiveLinkElement) {
    quickstartMobileActiveLinkElement.style.borderBottom = activeBorderBottom;
    quickstartMobileActiveLinkElement.style.fontWeight = activeFontWeight;
  }
}
