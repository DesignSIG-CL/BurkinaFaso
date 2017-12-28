function size() {
    var h = ""
    h += window.innerHeight-160;
    h +="px"
    document.getElementById("content").style.height = h;
    document.getElementById("OurMap").style.height = h;
    // document.getElementById("OurLegend").style.height = h;
}
