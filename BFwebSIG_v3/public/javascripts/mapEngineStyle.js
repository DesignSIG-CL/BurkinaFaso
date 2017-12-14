/* B. Corday et R. Lugrin
    This javascript's file generate the style for each layer on the map.*/

// Styles of the GeoJSON static layers
var roadlinesStyle = new ol.style.Style({
    stroke: new ol.style.Stroke({ color: 'rgba(0,100,100,1)', width: 2.0 })
});

var regionsStyle = new ol.style.Style({
      fill: new ol.style.Fill({ color: 'rgba(100, 0, 0, 0.0)', width: 4 }),
      stroke: new ol.style.Stroke({ color: 'rgba(100,0,0,1)', width: 1 })
});

// Styles for pimpable data
var routesStyle = new ol.style.Style({
    stroke: new ol.style.Stroke({ color: 'rgba(0,255,255,1)', width: 2.0 })
});

var pistesStyle = new ol.style.Style({
    stroke: new ol.style.Stroke({ color: 'rgba(255,255,0,1)', width: 2.0 })
});

var ouvragesStyle = new ol.style.Style({
    stroke: new ol.style.Stroke({ color: 'rgba(255,0,255,1)', width: 2.0 })
});
