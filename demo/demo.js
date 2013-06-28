function showControls() {
  var b = document.getElementById("toggle");
  var e = document.getElementById("controlContainer"); 
  if (e .className == "control-container") {
    b.className = "toggle close"
    e.className = "control-container hide";
  } else {
    b.className = "toggle open"
    e.className = "control-container";
  }
}