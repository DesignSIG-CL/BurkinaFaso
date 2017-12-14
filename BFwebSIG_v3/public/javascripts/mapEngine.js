/* B. Corday et R. Lugrin
    This javascript's file is the main part of the client-side js.*/

console.log('mapEngine is running');

var map;

// Function to load data from the pimpable layers
function loadData(url, layerSrc, callback){
  var request = window.superagent;
  request
    .get(url)
    .end(function(err, res){
      if (err) {
        return callback(null, null, 'Erreur de connexion au serveur, ' + err.message);
      }
      if (res.status !== 200){
        console.log(res.status);
        return callback(null, null, res.text);
      }
      var olFeatures = [];
      var data = JSON.parse(res.text);
      for (i = 0; i < data.length; i++) {
        var reader = new ol.format.GeoJSON();
        var olFeature = reader.readFeature(data[i]);
        olFeature.model = data[i];
        olFeatures.push(olFeature);
      }
      return callback(layerSrc, olFeatures);
    });
};

var addFeaturesToSource = function(layerSrc, features, msg) {
  if (msg != null){
    console.log(msg);
  }
  else{
    layerSrc.addFeatures(features);
    console.log('Adding features to source');
  }
};

// This function generate and display the openlayer integration when the webpage is loaded
function init() {
// Creation of a new map with a OSM layer
map = new ol.Map({
  layers: [
    new ol.layer.Tile({
      source: new ol.source.OSM()
  })
  ],
  target: 'OurMap',
  renderer: 'canvas',
  view: new ol.View({
    center: [-2, 12.1],
    zoom: 7,
    projection: 'EPSG:4326',
  })
  });
  // Adding all the layers to the map we created
  map.addLayer(vectorlayerroad);
  map.addLayer(vectorlayerregion);
  map.addLayer(vectorRoutes);
  map.addLayer(vectorPistes);
  map.addLayer(vectorOuvrages);

  // The buttons below don't work out off the init function
  // Button for the edition mode
  document.getElementById("addButton").onclick = setMode;
  document.getElementById("modButton").onclick = setMode;
  document.getElementById("delButton").onclick = setMode;
  // Button to save the formular
  document.getElementById("saveButton").onclick = function(){saveFormular(onsaved)};
  document.getElementById("cancelButton").onclick = cancelFormular;
};

// Creating some layers with the "cosmetic" data
vectorlayerregion = new ol.layer.Vector({
    style: regionsStyle,
    source: new ol.source.Vector({
      url: '/data/static/limiteadminpolygon',
      format: new ol.format.GeoJSON(),
    })
  });

vectorlayerroad = new ol.layer.Vector({
    style: roadlinesStyle,
    source: new ol.source.Vector({
      url: '/data/static/roadlines',
      format: new ol.format.GeoJSON()
    })
  });

// Source for the pimpable data
var rSrc = new ol.source.Vector({
  format: new ol.format.GeoJSON(),
  loader: function(extent, resolution, projection){
    loadData('/data/routes', rSrc, function(layerSrc, features){addFeaturesToSource(layerSrc, features)})
  }
});

var pSrc = new ol.source.Vector({
  format: new ol.format.GeoJSON(),
  loader: function(extent, resolution, projection){
    loadData('/data/pistes', pSrc, function(layerSrc, features){addFeaturesToSource(layerSrc, features)})
  }
});

var oSrc = new ol.source.Vector({
  format: new ol.format.GeoJSON(),
  loader: function(extent, resolution, projection){
    loadData('/data/ouvrages', oSrc, function(layerSrc, features){addFeaturesToSource(layerSrc, features)})
  }
});

// Layer for the roads pimpable by the user
var vectorRoutes = new ol.layer.Vector({
  source: rSrc,
  name: 'routes',
  style: routesStyle,
  visible: true,
  projection: 'EPSG:4326'
});
//layers.push(vector);

// Layer for the tracks pimpable by the user
var vectorPistes = new ol.layer.Vector({
  source: pSrc,
  name: 'pistes',
  style: pistesStyle,
  visible: true,
  projection: 'EPSG:4326'
});
//layers.push(vector);

// Layer for the ouvrages d'art pimpable by the user
var vectorOuvrages = new ol.layer.Vector({
  source: oSrc,
  name: 'ouvrages',
  style: ouvragesStyle,
  visible: true,
  projection: 'EPSG:4326'
});
//layers.push(vector);

// We select a type of elements to update on the map
var selectedSrc = oSrc;
var selectedType = 'Point'; // We want to edit the ouvrages d'art as point elements
var mode = "none";

var draw = new ol.interaction.Draw({
  source: selectedSrc,
  type: selectedType
  });
var snap = new ol.interaction.Snap({source: selectedSrc});

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
      draw.on('drawend', function(evt) {newObjectAdded(evt)} );
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

// Adding an event at the end of the draw. // TO BE UPDATED
function newObjectAdded(evt) {
  console.log('And a new draw appears');
  // Creating a temporary feature with a Json structure // TO BE UPDATED
  var tFeature ={
    'type': 'Feature',
    'properties': {
      'oNom': '',
      'oType':'',
      'oDate':'',
      'oCommentaire':'',
      'oPhoto':'',
    },
    'geometry': {
      'type': 'LineString',
      'coordinates': evt.feature.getGeometry().getCoordinates()
    }
  };
  // Putting the temporary feature in a geoJSON object
  var reader = new ol.format.GeoJSON();
  tempFeature = reader.readFeature(tFeature);
  vectorOuvrages.getSource().addFeature(tempFeature);
  // Setting the value of the element in formular to the default values
  document.getElementById('oNom').value = tFeature.properties.oNom;
  document.getElementById('oType').value = tFeature.properties.oType;
  document.getElementById('oDate').value = tFeature.properties.oDate;
  document.getElementById('oCommentaire').value = tFeature.properties.oCommentaire;
  document.getElementById('oCoordonnees').value = tFeature.geometry.coordinates;
  document.getElementById('oPhoto').value = tFeature.properties.oPhoto;
  // ADDING HERE SOME ELEMENTS WITH GEOMETRY if user does upgrade it
  // Setting the visibility of the formular to visible on the webpage
  document.getElementById("OurInteraction").style.visibility="visible";
};

// Action executed when the button save is pressed
function saveFormular(callback){ // TO BE CONTINUED
  saveData(callback);
};

// Action exectuted when the button cancel is pressed
function cancelFormular(){
  onsaved(null,'Annulation'); // TO BE CONTINUED
};

// Action executed to save the data
function saveData(callback){ // TO BE UPDATED
  console.log('Saving the data')
  var request = window.superagent;

  var newObjectOnTheMap = {
  'properties':{
    'oNom'         : document.getElementById('oNom').value,
    'oType'        : document.getElementById('oType').value,
    'oDate'        : document.getElementById('oDate').value,
    'oCommentaire' : document.getElementById('oCommentaire').value,
    'oPhoto'       : document.getElementById('oPhoto').value,
  },
  'geometry': {
    'type'         : 'LineString',
    'coordinates'  : document.getElementById('oCoordonnees').value,
    }
  };
  if(mode =='add'){ // TO BE UPDATED
    request
      .post('/data/ouvrages')
      .send(newObjectOnTheMap)
      .end(function(err,res){
        if(err){
          return callback(null, 'Erreur de connexion au serveur, ' + err.message);
        }
        if(res.statut !== 200){
          return callback(null, res.text);
        }
        var jsonResp = JSON.parse(res.text);
        callback(jsonResp);
      });
  }
};

// Action exetuted when the data are saved in the MongoDB or cancelled
function onsaved(org,msg){ // TO BE UPDATED

};

// Setting the visible layers, this function is for the legend, no link with database or data edition
function setVisibleLayers(){
  vectorlayerroad.setVisible(document.getElementById("roadlinesCheck").checked);
  vectorlayerregion.setVisible(document.getElementById("regionsCheck").checked);
  //RoadLayer.setVisible(document.getElementById("interactionsCheck").checked); // TO BE UPDATED
  console.log('Changing the layers visibility.');
}
