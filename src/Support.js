export const cors =
  window.XMLHttpRequest && "withCredentials" in new window.XMLHttpRequest();
export const pointerEvents =
  document.documentElement.style.pointerEvents === "";

export const Support = {
  cors,
  pointerEvents,
};

export default Support;
