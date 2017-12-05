console.log('mapEngine is running');

// Styles of the GeoJSON static layers
var roadlinesStyle = new ol.style.Style({
    stroke: new ol.style.Stroke({ color: 'rgba(0,100,100,1)', width: 2.0 })
});

var regionsStyle = new ol.style.Style({
      fill: new ol.style.Fill({ color: 'rgba(100, 0, 0, 0.0)', width: 4 }),
      stroke: new ol.style.Stroke({ color: 'rgba(100,0,0,1)', width: 1 })
});

var observationsStyle = new ol.style.Style({
    stroke: new ol.style.Stroke({ color: 'rgba(100,100,0,1)', width: 3.0 })
});

var map;
var vectorlayerroad = new ol.layer.Vector();
var vectorlayerregion = new ol.layer.Vector();



function init() {
// Crée la carte Lat/Lon avec une couche de fond OpenStreetMap

map = new ol.Map({
  layers: [
    new ol.layer.Tile({
      source: new ol.source.OSM()
  })
  ],
  target: 'OurMap',
  renderer: 'canvas',
  view: new ol.View({
    center: ol.proj.transform([-2, 12.1], 'EPSG:4326', 'EPSG:3857'),
    zoom: 7
  })
});
map.addLayer(vectorlayerroad);
map.addLayer(vectorlayerregion);
map.addLayer(vectorlayerobservation);

document.getElementById("addButton").onclick = setMode;
document.getElementById("modButton").onclick = setMode;
document.getElementById("delButton").onclick = setMode;

}

vectorlayerregion = new ol.layer.Vector({
    style: regionsStyle,
    source: new ol.source.Vector({
      url: '/data/limiteadminpolygon',
      format: new ol.format.GeoJSON(),
    })
  });

vectorlayerroad = new ol.layer.Vector({
    style: roadlinesStyle,
    source: new ol.source.Vector({
      url: '/data/roadlines',
      format: new ol.format.GeoJSON()
    })
  });

vectorlayerobservation = new ol.layer.Vector({
    style: observationsStyle,
    source: new ol.source.Vector({
      format: new ol.format.GeoJSON(),
      projection: 'EPSG 4326'
    })
  });

var RoadStyle = new ol.style.Style({
  stroke: new ol.style.Stroke({ color: 'rgba(50,100,0,1)', width:1.5})
});

var RoadSource = new ol.source.Vector();
var RoadLayer = new ol.layer.Vector({
  style: RoadStyle,
  source: RoadSource
});
// ajouter les couches Pistes, Ouvrages, Ponts

var mode = "none";

var draw = new ol.interaction.Draw({
  source: RoadSource,
  type: "LineString"
  });
var snap = new ol.interaction.Snap({source: RoadSource});

//var modifier à ajouter et delete

function setMode() {
  console.log(this.id);

  if(this.id == "addButton"){
    if(mode == "add"){
      console.log('Leaving the add mode');
      mode = "none";
      this.style.color = "black";
      map.removeInteraction(draw);
      map.removeInteraction(snap);
    }
    else {
      console.log('Entering into the add mode');
      mode = "add";
      this.style.color = "green";
      draw.on('drawend', function(evt) {RoadAdded(evt)} );
      map.addInteraction(draw);
      map.addInteraction(snap);
    }
  }
  else if(this.id == "modButton") {
    if(mode == "mod"){
      console.log('Leaving the modify mode');
      mode = "none";
      this.style.color = "black";
      // ...
    }
    else {
      console.log('Entering into the modify mode');
      mode = "mod";
      this.style.color = "green";
      // ...
    }
  }
  else if(this.id == "delButton") {
    if(mode == "del"){
      console.log('Leaving the delete mode');
      mode = "none";
      this.style.color = "black";
      // ...
    }
    else {
      console.log('Entering into the delete mode');
      mode = "del";
      this.style.color = "green";
      // ...
    }
  }
};


// Adding an event at the end of the draw.
function RoadAdded(evt) {
  console.log('And a new draw appears');
  // Creating a temporary feature with a Json structure
  var tFeature ={
    'type': 'Feature',
    'properties': {
      'IDinput': '0',
      'ntra':'0',
      'port':'0',
      'ltot':'0',
      'luti':'0',
      'haut':'0',
      'gaba':'0',
      'img':'',
    },
    'geometry': {
      'type': 'LineString',
      'coordinates': evt.feature.getGeometry().getCoordinates()
    }
  };
  // Putting the temporary feature in a geoJSON object
  var reader = new ol.format.GeoJSON();
  tempFeature = reader.readFeature(tFeature);
  vectorlayerobservation.getSource().addFeature(tempFeature);
  // Setting the visibility of the formular to visible on the webpage
  document.getElementById("OurInteraction").style.visibility="visible";
  // Setting the value of the element in formular to the default values
  document.getElementById('IDinput').value = tFeature.properties.IDinput;
  // CONTINUER ICI !
  document.getElementById('').value = tFeature.properties.;
};


// Setting the visible layers

function setVisibleLayers(){
  vectorlayerroad.setVisible(document.getElementById("roadlinesCheck").checked);
  vectorlayerregion.setVisible(document.getElementById("regionsCheck").checked);
  RoadLayer.setVisible(document.getElementById("interactionsCheck").checked); // Doesn't work
  console.log('Changing the layers visibility.');
}

function cancelAndCloseInterraction(){
  document.getElementById("OurInteraction").style.visibility="hidden";
  document.getElementById("BridgeInput").reset();
}

function saveAndCloseInterraction(){
  document.getElementById("OurInteraction").style.visibility="hidden";
  var x = document.getElementById("BridgeInput");
  var text = "";
  var i;
  for (i = 0; i < x.length ;i++) {
      text += x.elements[i].value + "<br>";
  }
  alert("Les données que vous avez saisies ne sont pas enregistrées pour le moment ! Elles sont dans la console (F12).");
  console.log(text);
  x.reset();
}
