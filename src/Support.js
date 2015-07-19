export var cors = ((window.XMLHttpRequest && 'withCredentials' in new window.XMLHttpRequest()));
export var pointerEvents = document.documentElement.style.pointerEvents === '';

export var Support = {
  cors: cors,
  pointerEvents: pointerEvents
};

export default Support;
