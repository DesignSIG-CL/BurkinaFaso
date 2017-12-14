/* B. Corday et R. Lugrin
    This javascript's file generate the style for each layer on the map.*/

// Styles of the GeoJSON static layers
var roadlinesStyle = new ol.style.Style({
    stroke: new ol.style.Stroke({ color: 'rgba(0,255,100,1)', width: 2.0 })
});

var waterareasStyle = new ol.style.Style({
      fill: new ol.style.Fill({ color: 'rgba(0, 0, 255, 1)', width: 4 }),
      stroke: new ol.style.Stroke({ color: 'rgba(0,,255,1)', width: 2.0 })
});

var waterlinesStyle = new ol.style.Style({
      fill: new ol.style.Fill({ color: 'rgba(0, 0, 255, 1)', width: 4 }),
      stroke: new ol.style.Stroke({ color: 'rgba(0,0,255,1)', width: 1 })
});

var paysStyle = new ol.style.Style({
      fill: new ol.style.Fill({ color: 'rgba(255, 0, 0, 0.1)', width: 4 }),
      stroke: new ol.style.Stroke({ color: 'rgba(255,0,0,1)', width: 1 })
});

var regionsStyle = new ol.style.Style({
      fill: new ol.style.Fill({ color: 'rgba(200, 50, 50, 0.1)', width: 4 }),
      stroke: new ol.style.Stroke({ color: 'rgba(200,50,50,1)', width: 1 })
});

var provincesStyle = new ol.style.Style({
      fill: new ol.style.Fill({ color: 'rgba(150, 100, 100, 0.1)', width: 4 }),
      stroke: new ol.style.Stroke({ color: 'rgba(150,100,100,1)', width: 1 })
});

var localitesStyle = new ol.style.Style({
      fill: new ol.style.Fill({ color: 'rgba(100, 100, 100, 0.1)', width: 4 }),
      stroke: new ol.style.Stroke({ color: 'rgba(100,100,100,1)', width: 1 })
});



// Styles for pimpable data
var routesStyle = new ol.style.Style({
    stroke: new ol.style.Stroke({ color: 'rgba(0,255,255,1)', width: 2.0 })
});

var pistesStyle = new ol.style.Style({
    stroke: new ol.style.Stroke({ color: 'rgba(255,255,0,1)', width: 2.0 })
});

var ouvragesStyle = new ol.style.Style({
  image: new ol.style.Circle({
    radius: 6,
    stroke: new ol.style.Stroke({
      color: 'white',
      width: 2
    }),
    fill: new ol.style.Fill({
      color: 'green'
    })
  })
});

var ouvragesStyleTemp = new ol.style.Style({
  image: new ol.style.Circle({
    radius: 6,
    stroke: new ol.style.Stroke({
      color: 'white',
      width: 2
    }),
    fill: new ol.style.Fill({
      color: 'red'
    })
  })
});
