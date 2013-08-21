function showControls() {
  var t = document.getElementById("title");
  var c = document.getElementById("controlContainer"); 
  if (c .className == "control-container") {
    t.className = "title expand"
    c.className = "control-container hide";
  } else {
    t.className = "title contract"
    c.className = "control-container";
  }
}