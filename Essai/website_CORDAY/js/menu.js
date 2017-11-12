var etat = 0;

function menu() {
    if (etat==0) {
      document.getElementById("menuOption").style.display="inline";
      document.getElementById("menuButton").value="-";
      etat = 1;
    } else {
      document.getElementById("menuOption").style.display="none";
      document.getElementById("menuButton").value="+";
      etat = 0;
    }

}
