/* B. Corday et R. Lugrin
    This javascript's file is the main part of the client-side js.*/

console.log('mapEngine is running');

// All the global variables
var map;
var osm;
var DigitalGlobe;
var coordinatesTemp = ''; // Global variable to store the coordinates temporary
var featureTemp = null; // Global variable to store the feature temporary
var featureBackup = ''; // Globale variable to backup featureTemp
var idTemp = ''; // Global variable to store the id of the temporary feature
var newObjectOnTheMap = '';  // Global variable to store object to send to Mongo
// Popup elements (bridge)
var container;
var content;
var closer;
// Create an overlay to anchor the popup to the map.
var overlay;

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
// To add features to a layer
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
  osm = new ol.layer.Tile({
    title: 'OSM',
    source: new ol.source.OSM()
  });
  DigitalGlobe = new ol.layer.Tile({
          title: 'DigitalGlobe',
          //title: 'DigitalGlobe Maps API: Recent Imagery',
          source: new ol.source.XYZ({
              url: 'http://api.tiles.mapbox.com/v4/digitalglobe.92ee07af/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiZGlnaXRhbGdsb2JlIiwiYSI6ImNqNTVpcXdiNzA3NTczM3RnYnRqb2g2anEifQ.DziD_BPlGaeFqp3VXMqMvQ', // You will need to replace the 'access_token' and 'Map ID' values with your own. http://developer.digitalglobe.com/docs/maps-api
              attribution: "© DigitalGlobe, Inc"
          }),
          visible: false,
      }),

  overlay = new ol.Overlay({
      element: container,
      autoPan: true,
      autoPanAnimation: {
        duration: 250
        }
    });


    map = new ol.Map({
      layers: [osm, DigitalGlobe],
      target: 'OurMap',
      renderer: 'canvas',
      view: new ol.View({
        center: [-2, 12.1],
        zoom: 7,
        projection: 'EPSG:4326',
      }),
    overlays: [overlay],
    });

// Adding all the layers to the map we created (first = back layer, last = front layer)
  map.addLayer(vectorlayerpays);
  map.addLayer(vectorlayerregions);
  map.addLayer(vectorlayerprovinces);
  map.addLayer(vectorlayerlocalites);
  map.addLayer(vectorlayerwaterareas);
  map.addLayer(vectorlayerwaterlines);
  map.addLayer(vectorlayerroad);
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

  container = document.getElementById('popup');
  content = document.getElementById('popup-content');
  closer = document.getElementById('popup-closer');

// Add a click handler to hide the popup. @return {boolean} Don't follow the href.
  closer.onclick = function() {
    overlay.setPosition(undefined);
    closer.blur();
    return false;
  };

};

// Link to "cosmetic" layers
  // Roads
    vectorlayerroad = new ol.layer.Vector({
        style: roadlinesStyle,
        source: new ol.source.Vector({
          url: '/data/static/roadlines',
          format: new ol.format.GeoJSON()
        })
      });
  // Lakes
    vectorlayerwaterareas = new ol.layer.Vector({
        style: waterareasStyle,
        source: new ol.source.Vector({
          url: '/data/static/waterareas',
          format: new ol.format.GeoJSON(),
        })
      });
  // Rivers
    vectorlayerwaterlines = new ol.layer.Vector({
        style: waterlinesStyle,
        source: new ol.source.Vector({
          url: '/data/static/waterlines',
          format: new ol.format.GeoJSON(),
        })
      });
  // Burkina, limits of country
    vectorlayerpays = new ol.layer.Vector({
        style: paysStyle,
        source: new ol.source.Vector({
          url: '/data/static/pays',
          format: new ol.format.GeoJSON(),
        })
      });
  // Burkina, limits of regions
    vectorlayerregions = new ol.layer.Vector({
        style: regionsStyle,
        source: new ol.source.Vector({
          url: '/data/static/regions',
          format: new ol.format.GeoJSON(),
        })
      });
  // Burkina, limits of provinces
    vectorlayerprovinces = new ol.layer.Vector({
        style: provincesStyle,
        source: new ol.source.Vector({
          url: '/data/static/provinces',
          format: new ol.format.GeoJSON(),
        })
      });
  // Burkina, limits of localities
    vectorlayerlocalites = new ol.layer.Vector({
        style: localitesStyle,
        source: new ol.source.Vector({
          url: '/data/static/limiteadminpolygon',
          format: new ol.format.GeoJSON(),
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

// Supplementary interactions
  var select = new ol.interaction.Select({
      wrapX: false,
      layers: [vectorOuvrages]
  });
  var modify = new ol.interaction.Modify({
      features: select.getFeatures(),
      layers: [vectorOuvrages]
  });

/*/ Add a click handler to the map to render the popup.
map.on('singleclick', function(evt) {
  var coordinate = evt.coordinate;
  var hdms = ol.coordinate.toStringHDMS(ol.proj.transform(coordinate, 'EPSG:3857', 'EPSG:4326'));
    content.innerHTML = '<p>You clicked here:</p><code>' + hdms + '</code>';
    overlay.setPosition(coordinate);
});*/

// Buttons to set the editing mode: add/modify/delete
function setMode(buttonId) {
    if(this.id != null){ //this condition allow to call setMode when we close the form.
    id = this.id;
  }
  else{
    id = buttonId;
  };
  console.log(id)
// Add mode
  if(id == "addButton"){
    if(mode == "add"){
      console.log('Leaving the add mode');
      mode = "none";
      // Operations on the interface
      document.getElementById('modButton').disabled = false;
      document.getElementById('delButton').disabled = false;
      document.getElementById(id).style.color = "black";
      // Interactions
      map.removeInteraction(draw);
      map.removeInteraction(snap);
      if(featureTemp !== null){
        vectorOuvrages.getSource().removeFeature(featureTemp)
      }
      onsaved(null,'Annulation');
    }
    else {
      console.log('Entering into the add mode');
      mode = "add";
      // Operations on the interface
      document.getElementById('modButton').disabled = true;
      document.getElementById('delButton').disabled = true;
      document.getElementById(id).style.color = "green";
      // Interactions
      draw.on('drawend', function(evt) {newObjectAdded(evt)} );
      map.addInteraction(draw);
      map.addInteraction(snap);
    }
  }
// Modify mode
  else if(id == "modButton") {
    if(mode == "mod"){
      console.log('Leaving the modify mode');
      mode = "none";
      // Operations on the interface
      document.getElementById('addButton').disabled = false;
      document.getElementById('delButton').disabled = false;
      document.getElementById(id).style.color = "black";
      // Interactions
      select.getFeatures().clear(); // To clear the selection
      map.removeInteraction(select);
      map.removeInteraction(modify);
      onsaved(null,'Annulation');
    }
    else {
      console.log('Entering into the modify mode');
      mode = "mod";
      // Operations on the interface
      document.getElementById('addButton').disabled = true;
      document.getElementById('delButton').disabled = true;
      document.getElementById(id).style.color = "green";
      // Interactions
      map.addInteraction(select);
      map.addInteraction(modify);
      select.on('select', function(evt) {objectSelected(evt)});
      modify.on('modifyend',function(evt){objectModified(evt)});
    }
  }
// Delete mode
  else if(id == "delButton") {
    if(mode == "del"){
      console.log('Leaving the delete mode');
      mode = "none";
      // Operations on the interface
      document.getElementById('modButton').disabled = false;
      document.getElementById('addButton').disabled = false;
      document.getElementById(id).style.color = "black";
      // Adapting the interaction to delete the object
      document.getElementById("saveButton").innerHTML = 'Sauver';
      document.getElementById('saveButton').style.color = "black";
      // Removing interaction select
      select.getFeatures().clear(); // To clear the selection
      map.removeInteraction(select);
      onsaved(null,'Annulation');
    }
    else {
      console.log('Entering into the delete mode');
      mode = "del";
      // Operations on the interface
      document.getElementById('modButton').disabled = true;
      document.getElementById('addButton').disabled = true;
      document.getElementById(id).style.color = "green";
      // Adapting the interaction to delete the object
      document.getElementById("saveButton").innerHTML = 'Supprimer';
      document.getElementById('saveButton').style.color = "red";
      // Adding interaction select
      map.addInteraction(select);
      select.on('select', function(evt) {objectDeleted(evt)});
    }
  }
  else if(id == "infoButton") {
    if(mode == "inf"){
      console.log('Leaving the info mode');
      mode = "none";
      // Operations on the interface
      document.getElementById('addButton').disabled = false;
      document.getElementById('delButton').disabled = false;
      document.getElementById(id).style.color = "black";
      // Interactions
      select.getFeatures().clear(); // To clear the selection
      map.removeInteraction(select);
      onsaved(null,'Annulation');
    }
    else {
      console.log('Entering into the modify mode');
      mode = "inf";
      // Operations on the interface
      document.getElementById('addButton').disabled = true;
      document.getElementById('delButton').disabled = true;
      document.getElementById(id).style.color = "green";
      // Interactions
      map.addInteraction(select);
      select.on('select', function(evt) {objectInfo(evt)});
    }
  }
};

// Action executed when the button save is pressed
  function saveFormular(callback){
    saveData(callback);
  };

// Action exectuted when the button cancel is pressed
  function cancelFormular(){
    if(mode == 'add'){
        vectorOuvrages.getSource().removeFeature(featureTemp)
        setMode('addButton');
        popupInteraction('Ajout annulé',0)
    }
    if(mode == 'mod'){
      setMode('setButton');
      popupInteraction('Modifications annulées',0)
    }
    if(mode == 'del'){
      setMode('delButton');
      popupInteraction('Suppression annulée',0)
    }
    onsaved(null,'Annulation');
    featureTemp = null;
  };

// Adding an event at the end of the draw.
  function newObjectAdded(evt) {
    console.log('Un point a été dessiné.');
    map.removeInteraction(draw);
    map.removeInteraction(snap);
    // Temporary saving the coordinates in a variable
    coordinatesTemp = evt.feature.getGeometry().getCoordinates();
    featureTemp = evt.feature;
    dateNow = new Date();
    idTemp = 'id-' + dateNow.toISOString() + '-' + Math.random().toString(36).substr(2, 4);
    // Setting the value of the element in formular to the default values
    document.getElementById('oNomPon').value = '';
    document.getElementById('oDateCo').value = '';
    document.getElementById('oDateMa').value = '';
    document.getElementById('oNtrave').value = '';
    document.getElementById('oLoOuve').value = '';
    document.getElementById('oPortee').value = '';
    document.getElementById('oHauteu').value = '';
    document.getElementById('oLaRoul').value = '';
    document.getElementById('oGabari').value = '';
    document.getElementById('oCommen').value = '';
    // Setting the visibility of the formular to visible on the webpage
    document.getElementById("OurInteraction").style.display="block";
  };

// Action executed when an object is selected on the map
  function objectSelected(evt) {
    featureTemp = evt.selected[0]; // The feature is in at the array's first position
    console.log('Un point a été sélectionné.');
    featureTempPr = featureTemp.getProperties();
    coordinatesTemp = featureTemp.getGeometry().getCoordinates();
    idTemp = featureTempPr.id;
    document.getElementById('oNomPon').value = featureTempPr.nom;
    document.getElementById('oDateCo').value = featureTempPr.dateC;
    document.getElementById('oDateMa').value = featureTempPr.dateM;
    document.getElementById('oNtrave').value = featureTempPr.nTrav;
    document.getElementById('oLoOuve').value = featureTempPr.lOuve;
    document.getElementById('oPortee').value = featureTempPr.porte;
    document.getElementById('oHauteu').value = featureTempPr.haute;
    document.getElementById('oLaRoul').value = featureTempPr.lRoul;
    document.getElementById('oGabari').value = featureTempPr.gabar;
    document.getElementById('oCommen').value = featureTempPr.cmntr;
    // Setting the visibility of the formular to visible on the webpage
    document.getElementById("OurInteraction").style.display="block";
  };

// This function update the position after we change it on the map.
  function objectModified(evt){
      if (confirm("Voulez-vous vraiment déplacer cet élément ?") == true) {
        coordinatesTemp = featureTemp.getGeometry().getCoordinates();
        popupInteraction('Le point est déplacé',1)
        console.log('Le point est déplacé.')
      } else {
        console.log('Le point reste à sa position initiale.')
        window.alert('La page va être rechargée pour annuler votre modification')
        window.location.reload()
      }
  };

// Action exectuted when an object has to be deleted on the map
  function objectDeleted(evt) {
    featureTemp = evt.selected[0]; // The feature is in at the array's first position
    console.log('Un point a été sélectionné.');
    featureTempPr = featureTemp.getProperties();
    coordinatesTemp = featureTemp.getGeometry().getCoordinates();
    idTemp = featureTempPr.id;
    document.getElementById('oNomPon').value = featureTempPr.nom;
    document.getElementById('oDateCo').value = featureTempPr.dateC;
    document.getElementById('oDateMa').value = featureTempPr.dateM;
    document.getElementById('oNtrave').value = featureTempPr.nTrav;
    document.getElementById('oLoOuve').value = featureTempPr.lOuve;
    document.getElementById('oPortee').value = featureTempPr.porte;
    document.getElementById('oHauteu').value = featureTempPr.haute;
    document.getElementById('oLaRoul').value = featureTempPr.lRoul;
    document.getElementById('oGabari').value = featureTempPr.gabar;
    document.getElementById('oCommen').value = featureTempPr.cmntr;
    // Setting the visibility of the formular to visible on the webpage
    document.getElementById("OurInteraction").style.display="block";
  };

// Action exectuted when informations are requested
  function objectInfo(evt){
    featurePop = evt.selected[0]; // The feature is in at the array's first position
    console.log('Un point a été sélectionné pour des informations.');
    featurePopPr = featureTemp.getProperties();
    coordinatesPop = featureTemp.getGeometry().getCoordinates();
    idTemp = featureTempPr.id;
    document.getElementById('popNomPon').value = featurePopPr.nom;
    document.getElementById('popDateCo').value = featurePopPr.dateC;
    document.getElementById('popDateMa').value = featurePopPr.dateM;
    document.getElementById('popCommen').value = featurePopPr.cmntr;
    // Setting the visibility of the formular to visible on the webpage
    overlay.setPosition(coordinatesPop);
  };

// Action executed to save the data
  function saveData(callback){ // TO BE UPDATED
    console.log('Saving the data')
    var request = window.superagent;
    newObjectOnTheMap = {
    'type' : 'Feature', // comme dans les éléments de base
    'properties':{
      'id'      : idTemp,
      'nom'     : document.getElementById('oNomPon').value,
      'dateC'   : document.getElementById('oDateCo').value,
      'dateM'   : document.getElementById('oDateMa').value,
      'nTrav'   : document.getElementById('oNtrave').value,
      'lOuve'   : document.getElementById('oLoOuve').value,
      'porte'   : document.getElementById('oPortee').value,
      'haute'   : document.getElementById('oHauteu').value,
      'lRoul'   : document.getElementById('oLaRoul').value,
      'gabar'   : document.getElementById('oGabari').value,
      'cmntr'   : document.getElementById('oCommen').value,
    },
    'geometry': {
      'type'         : 'Point',
      'coordinates'  : coordinatesTemp,
      },
    };
    if(mode =='add'){
      request
        .post('/data/oFormAdd')
        .send(newObjectOnTheMap)
        .end(function(err,res){
          console.log('Statut de la requête : ' + res.status)
          if(err){
            popupInteraction('Erreur ! --> F12',0)
            return callback(null, 'Erreur de connexion au serveur, ' + err.message);
          }
          if(res.status !== 200){
            popupInteraction('Erreur ! --> F12',0)
            return callback(null, res.text);
          }
          var jsonResp = JSON.parse(res.text);
          callback(jsonResp);
        });
    }
    if(mode == 'mod'){
      request
        .put('/data/oFormUpdate')
        .send(newObjectOnTheMap)
        .end(function(err,res){
          console.log('Statut de la requête : ' + res.status)
          if(err){
            popupInteraction('Erreur ! --> F12',0)
            return callback(null, 'Erreur de connexion au serveur, ' + err.message);
          }
          if(res.status !== 200){
            popupInteraction('Erreur ! --> F12',0)
            return callback(null, res.text);
          }
          var jsonResp = JSON.parse(res.text);
          callback(jsonResp); // /!\ PAS comme sur exemple
        });
    }
    if(mode =='del'){
      if (confirm("Voulez-vous vraiment supprimer cet élément ?") == true) {
        request
          .put('/data/oFormDelete')
          .send(newObjectOnTheMap)
          .end(function(err,res){
            console.log('Statut de la requête : ' + res.status)
            if(err){
              popupInteraction('Erreur ! --> F12',0)
              return callback(null, 'Erreur de connexion au serveur, ' + err.message);
            }
            if(res.status !== 200){
              popupInteraction('Erreur ! --> F12',0)
              return callback(null, res.text);
            }
            var jsonResp = JSON.parse(res.text);
            callback(jsonResp); // /!\ PAS comme sur exemple
          });
      } else {
        console.log('Le point reste à sa position initiale.')
        cancelFormular()
      }
    }
  };

// Action exetuted when the data are saved in the MongoDB or cancelled
  function onsaved(arg,msg){
    if(arg == null){
      popupInteraction(msg,0);
    }
    else{
      if(mode == 'add'){
        setMode('addButton');
        console.log('Données enregistrées avec succès.');
        popupInteraction('Enregistrement réussi !',1)
        featureTemp.setProperties(arg.properties);
        featureTemp._id = arg._id;
        vectorOuvrages.getSource().addFeature(featureTemp);
        featureTemp = null;
      }
      if(mode == 'mod'){
        setMode('modButton');
        console.log('Données mises à jour avec succès.');
        popupInteraction('Mise à jour réussie !',1)
        featureTemp.setProperties(newObjectOnTheMap.properties);
        featureTemp = null;
      }
      if(mode == 'del'){
        setMode('delButton');
        console.log('Données supprimées avec succès.');
        popupInteraction('Données supprimées !',0);
        vectorOuvrages.getSource().removeFeature(featureTemp);
        featureTemp = null;
      }
    };
    document.getElementById('OurInteraction').style.display = 'none';
  };

// Setting the visible layers, this function is for the legend, no link with database or data edition
  function setVisibleLayers(){
    vectorlayerroad.setVisible(document.getElementById("roadlinesCheck").checked);
    vectorlayerwaterareas.setVisible(document.getElementById("waterareasCheck").checked);
    vectorlayerwaterlines.setVisible(document.getElementById("waterlinesCheck").checked);
    vectorlayerpays.setVisible(document.getElementById("paysCheck").checked);
    vectorlayerregions.setVisible(document.getElementById("regionsCheck").checked);
    vectorlayerprovinces.setVisible(document.getElementById("provincesCheck").checked);
    vectorlayerlocalites.setVisible(document.getElementById("localitesCheck").checked);
    vectorRoutes.setVisible(document.getElementById("routesCheck").checked);
    vectorPistes.setVisible(document.getElementById("pistesCheck").checked);
    vectorOuvrages.setVisible(document.getElementById("ouvragesCheck").checked);

//RoadLayer.setVisible(document.getElementById("interactionsCheck").checked); // TO BE UPDATED
    console.log('Changing the layers visibility.');
};

// To download images (facultative part)
/*function onFileSelected(event){
  var selectedFile = event.target.files[0];
  var reader = new FileReadElementById("imgElement");
  imgtag.title= selectedFile.name;
  reader.onload = function(event){
    imgtag.src = event.target.result;
  };
  reader.readAsDataURL(selectedFile);
};
function saveform(callback){
  var files = document.getElementById("fileinput").files;
  var request = window.superagent;
  request
    .post('/file')
    .attach('fileToUpload',file,file.name)
    .end(function(err, res){
      if (res.status !== 200){
        return callback(null, res.text);
      }
      else {
        savedata(callback);
      }
    });
};
*/
