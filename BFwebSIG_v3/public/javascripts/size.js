function size() {
    var h = ""
    h += window.innerHeight-160;
    h +="px"
    document.getElementById("content").style.height = h;
    document.getElementById("map").style.height = h;
    document.getElementById("menuOption").style.height = h;
}
