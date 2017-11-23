console.log('mapEngine is running');

// Styles of the GeoJSON static layers
var roadlinesStyle = new ol.style.Style({
    stroke: new ol.style.Stroke({ color: 'rgba(0,100,100,1)', width: 2.0 })
});

var regionsStyle = new ol.style.Style({
      fill: new ol.style.Fill({ color: 'rgba(100, 0, 0, 0.2)', width: 4 }),
      stroke: new ol.style.Stroke({ color: 'rgba(100,0,0,1)', width: 1 })
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

document.getElementById("addButton").onclick = setMode;
document.getElementById("modButton").onclick = setMode;
document.getElementById("delButton").onclick = setMode;

}

vectorlayerregion = new ol.layer.Vector({
    style: regionsStyle,
    source: new ol.source.Vector({
      url: '/images/geoData/limiteadminpolygon.geojson',
      format: new ol.format.GeoJSON(),
    })
  });

vectorlayerroad = new ol.layer.Vector({
    style: roadlinesStyle,
    source: new ol.source.Vector({
      url: '/images/geoData/roadlines.geojson',
      format: new ol.format.GeoJSON()
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
      console.log('jysouis dans this ID 7 moawde yeah');

    if(mode == "add"){
      mode = "none";
      this.style.color = "black";
    }
    else {
      console.log('en mode add lard enfin');

      mode = "add";
      this.style.color = "red";
      draw.on('drawend', function(evt) {RoadAdded(evt)} );
      map.addInteraction(draw);
      map.addInteraction(snap);
    }
  }
  else if(this.id == "modButton") {
  }
  else if(this.id == "delButton") {
  }
};


// This initial defintion allows to use the layers out of the jQuery

var vector = new ol.layer.Vector();
var source = new ol.source.Vector();

// jQuery : This part is exectuted after the initialisation of the page
// It's necessary to allow cross origin references
//$(document).ready(function(){
/*  var map = new ol.Map({
    target: 'OurMap',
    view: new ol.View({
      center: ol.proj.fromLonLat([-2,12.1]),
      zoom:9,
    })
  });
  var osmlayer = new ol.layer.Tile({
    source: new ol.source.OSM()
  });
*/
  

// Definition of the layer for the interaction
  var source = new ol.source.Vector();
  var vector = new ol.layer.Vector({
        source: source,
        style: new ol.style.Style({
          fill: new ol.style.Fill({
            color: 'rgba(255, 255, 255, 0.2)'
          }),
          stroke: new ol.style.Stroke({
            color: '#ffcc33',
            width: 2
          }),
          image: new ol.style.Circle({
            radius: 7,
            fill: new ol.style.Fill({
              color: '#ffcc33'
            })
          })
        })
      });

/*
  map.addLayer(osmlayer);
  map.addLayer(vector);

  // Adding new vector elements on the map.
  var modify = new ol.interaction.Modify({source: source});
      map.addInteraction(modify);

      var draw, snap; // global so we can remove them later
      var typeSelect = document.getElementById('draw-type');

      function addInteractions() {
        draw = new ol.interaction.Draw({
          source: source,
     ////     type: /** @type {ol.geom.GeometryType} */ ////(typeSelect.value)
     ////   });

        // Adding an event at the end of the draw.
        function RoadAdded(evt) {
          console.log('And a new draw appears');
          //in evt you will get ol.feature
          // from ol.feature get the geometry and than get coordinates
          var coord = evt.feature.getGeometry().getCoordinates();
          document.getElementById("OurInteraction").style.visibility="visible";
          document.getElementById("OurInput").innerHTML = coord.toString() ;
        };
        // End of the event
        /*map.addInteraction(draw);
        snap = new ol.interaction.Snap({source: source});
        map.addInteraction(snap);

      }

      /**
       * Handle change event.
       */
//      typeSelect.onchange = function() {
//        map.removeInteraction(draw);
//        map.removeInteraction(snap);
//        addInteractions();
//      };

//      addInteractions();

//});

// Setting the visible layers
/*
function setVisibleLayers(){
  vectorlayerroad.setVisible(document.getElementById("roadlinesCheck").checked);
  vectorlayerregion.setVisible(document.getElementById("regionsCheck").checked);
  source.setVisible(document.getElementById("interactionsCheck").checked); // Doesn't work
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
}*/
