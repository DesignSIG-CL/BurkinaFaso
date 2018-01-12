/* interfaceEngine.js
-----------------------------------------
--Projet pour le cours "Design de SIG" --
----Par Benoît CORDAY et René LUGRIN ----
-----------------------------------------
------- Apparitions/Disparitions---------
-----------------------------------------
*/

var etatLegend = 1;
var etatEditor = 0;
var osmORdigital = 0;

function menu() {
    if (etatLegend==0) {
      // We want to display the legend
      document.getElementById("OurLegend").style.display="block";
      document.getElementById("OurButtonLegend").style.backgroundColor="rgb(230,230,230)";
      document.getElementById("OurInteraction").style.top = '31em';
      console.log('Display menu')
      etatLegend = 1;

    } else {
      // We want to hide the legend
      document.getElementById("OurLegend").style.display="none";
      document.getElementById("OurButtonLegend").style.backgroundColor="rgb(255,230,230)";
      document.getElementById("OurInteraction").style.top = '10.5em';
      console.log('Hide menu')
      etatLegend = 0;
    }
};

function edit() {
    if (etatEditor==0) {
      // We want to display the editor options
      document.getElementById("EditorOption").style.display="block";
      document.getElementById("OurButtonEdit").style.backgroundColor="rgb(230,230,230)";
      console.log('Display editor')
      etatEditor = 1;

    } else {
      // We want to hide the editor options
      document.getElementById("EditorOption").style.display="none";
      document.getElementById("OurButtonEdit").style.backgroundColor="rgb(255,230,230)";
      console.log('Hide editor')
      etatEditor = 0;
    }
};

function popupInteraction(msg,state){
  document.getElementById('OurPopup').innerHTML=msg;
  if(state==1){
    document.getElementById('OurPopup').style.backgroundColor='rgba(0,100,100,1.0)';
  }
  else{
    document.getElementById('OurPopup').style.backgroundColor='rgba(200,0,0,1.0)';
  }
  document.getElementById('OurPopup').style.visibility='visible';
  setTimeout(popupEnd, 5000)

};

function popupEnd(){
  document.getElementById('OurPopup').style.visibility='collapse';
};

function baseLayerChange(){
  if (osmORdigital==0) {
    osmORdigital = 1;
    DigitalGlobe.setVisible(true);
    osm.setVisible(false);
  } else {
    osmORdigital = 0;
    DigitalGlobe.setVisible(false);
    osm.setVisible(true);
  }
};

function dateFr(dateString)
{
  if(dateString != ''){
    console.log(dateString);
    var msec = Date.parse(dateString);
    var date = new Date(msec);
    // les noms de mois
    var mois = new Array("janvier", "fevrier", "mars", "avril", "mai", "juin", "juillet", "aout", "septembre", "octobre", "novembre", "decembre");
    // on construit le message
    var message = date.getDate() + " ";   // numero du jour
    message += mois[date.getMonth()] + " ";   // mois
    message += date.getFullYear();
    return message;
  }
  else{
    return 'Non définie.'
  }

}
