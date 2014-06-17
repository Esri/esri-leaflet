L.esri = {
  VERSION: '0.0.1-beta.5',
  Layers: {},
  Services: {},
  Controls: {},
  Tasks: {},
  Util: {},
  Support: {
    CORS: !!(window.XMLHttpRequest && 'withCredentials' in new XMLHttpRequest()),
    pointerEvents: document.documentElement.style.pointerEvents === ''
  }
};