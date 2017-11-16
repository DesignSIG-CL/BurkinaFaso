console.log('mapEngine is running');

//--
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

  map.addLayer(osmlayer);
  map.addLayer(vectorlayerroad);
  map.addLayer(vectorlayerregion);

});

function setVisibleLayers(){
  vectorlayerroad.setVisible(document.getElementById("roadlinesCheck").checked);
  vectorlayerregion.setVisible(document.getElementById("regionsCheck").checked);
  console.log('Changing the layers visibility.');
}
