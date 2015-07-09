export var cors = ((window.XMLHttpRequest && 'withCredentials' in new XMLHttpRequest()));
export var pointerEvents = document.documentElement.style.pointerEvents === '';;

export default {
  cors,
  pointerEvents
};
