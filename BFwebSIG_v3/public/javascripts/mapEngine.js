console.log('mapEngine is running');

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

  vectorlayerroad = new ol.layer.Vector({
    source: new ol.source.Vector({
      url: '/images/geoData/roadlines.geojson',
      format: new ol.format.GeoJSON()
    })
  });

  vectorlayerregion = new ol.layer.Vector({
    source: new ol.source.Vector({
      url: '/images/geoData/limiteadminpolygon.geojson',
      format: new ol.format.GeoJSON(),
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
