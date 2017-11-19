console.log('mapEngine is running');

//-- https://openlayers.org/en/latest/examples/snap.html?q=interactions
var roadlinesStyle = new ol.style.Style({
    stroke: new ol.style.Stroke({ color: 'rgba(0,100,100,1)', width: 2.0 })
});

var regionsStyle = new ol.style.Style({
      fill: new ol.style.Fill({ color: 'rgba(100, 0, 0, 0.2)', width: 4 }),
      stroke: new ol.style.Stroke({ color: 'rgba(100,0,0,1)', width: 1 })
});
//--

var vectorlayerroad = new ol.layer.Vector();
var vectorlayerregion = new ol.layer.Vector();
var vector = new ol.layer.Vector();
var source = new ol.layer.Vector();

$(document).ready(function(){
  var map = new ol.Map({
    target: 'OurMap',
    view: new ol.View({
      center: ol.proj.fromLonLat([-2,12.1]),
      zoom:9,
    })
  });
  var osmlayer = new ol.layer.Tile({
    source: new ol.source.OSM()
  });

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


  map.addLayer(osmlayer);
  map.addLayer(vectorlayerroad);
  map.addLayer(vectorlayerregion);
  map.addLayer(vector);

  // Adding new vector elements on the map.
  var modify = new ol.interaction.Modify({source: source});
      map.addInteraction(modify);

      var draw, snap; // global so we can remove them later
      var typeSelect = document.getElementById('draw-type');

      function addInteractions() {
        draw = new ol.interaction.Draw({
          source: source,
          type: /** @type {ol.geom.GeometryType} */ (typeSelect.value)
        });
        // Adding an event at the end of the draw.
        draw.on('drawend', function(evt){
          console.log('And one draw appears');
          //in evt you will get ol.feature
          // from ol.feature get the geometry and than get coordinates
          var coord = evt.feature.getGeometry().getCoordinates();
          document.getElementById("OurInteraction").style.visibility="visible";
          document.getElementById("OurInput").innerHTML = coord.toString() ;
        });
        // End of the event
        map.addInteraction(draw);
        snap = new ol.interaction.Snap({source: source});
        map.addInteraction(snap);

      }

      /**
       * Handle change event.
       */
      typeSelect.onchange = function() {
        map.removeInteraction(draw);
        map.removeInteraction(snap);
        addInteractions();
      };

      addInteractions();

});

// Setting the visible layers

function setVisibleLayers(){
  vectorlayerroad.setVisible(document.getElementById("roadlinesCheck").checked);
  vectorlayerregion.setVisible(document.getElementById("regionsCheck").checked);
  source.setVisible(document.getElementById("interactionsCheck").checked); // Doesn't work
  console.log('Changing the layers visibility.');
}

function cancelAndCloseInterraction(){
  document.getElementById("OurInteraction").style.visibility="hidden";
}

function saveAndCloseInterraction(){
  alert("I'm not implemented.");
  document.getElementById("OurInteraction").style.visibility="hidden";
}
