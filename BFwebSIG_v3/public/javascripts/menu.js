var etat = 0;

function menu() {
    if (etat==0) {
      document.getElementById("OurLegend").style.display="inline";
      document.getElementById("OurButtonLegend").style.backgroundColor="rgb(230,230,230)";
      etat = 1;
    } else {
      document.getElementById("OurLegend").style.display="none";
      document.getElementById("OurButtonLegend").style.backgroundColor="rgb(0,100,100)";
      etat = 0;
    }

}
