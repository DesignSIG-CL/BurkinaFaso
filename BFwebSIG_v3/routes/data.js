var express = require('express');
var router = express.Router();
var request = require('superagent');

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Mongoose connection to MongoDB
mongoose.connect('mongodb://localhost:27017/burkina', {
  useMongoClient : true,
  promiseLibrary: require('bluebird'),
},
function(error){
  if(error){console.log('IS THE SERVER RUNNING ?');console.log(error)}
  if(!error){
    console.log('Connect to database MongoDB, some usefull info :');
    console.log('200 = Data are transmitted, no error');
    console.log('304 = Data already in cache, no error')
  }
});

// Mongoose general Schema & model definition: mongoose.model(name, schema, collection)
var JsonSchema = new Schema({
  name : String,
  type : Schema.Types.Mixed
});
var Json = mongoose.model('JString',JsonSchema,'staticlayercollection')

// Schema for roads
var routesSchema = new Schema({
  Route       : String,
  Origine     : String,
  Fin         : String,
  Code        : String,
  Longueur    : String,
  Classe      : String,
  Type        : String,
  geometry    : {
    type: { type: String},
    coordinates: []
  }
});
var routes = mongoose.model('routes', routesSchema, 'routesLL');

var pistesSchema = new Schema({
  Piste       : String,
  Origine     : String,
  Fin         : String,
  Longueur    : String,
  Type        : String,
  Etat        : String,
  AnneeCons   : String,
  BureauEtud  : String,
  Entreprise  : String,
  Observation : String,
  geometry    : {
    type: {type : String},
    coordinates : []
  }
});
var pistes = mongoose.model('pistes', pistesSchema, 'pistesLL');

var ouvragesSchema = new Schema({
  type : String,
  properties : {
    nom         : {type : String},
    type        : {type : String},
    date        : {type : String},
    commentaire : {type : String},
    photoid     : {type : String},
  },
  geometry    : {
    type: {type: String},
    coordinates: []
  }
});
var ouvrages = mongoose.model('ouvrages', ouvragesSchema, 'ouvragesLL')

/*GET GeoJSON data. */
router.get('/static/:name', function(req, res){
  console.log('Data requested in database MongoDB...')
  if(req.params.name){
    Json.findOne({name: req.params.name},{}, function(err,docs){
      res.json(docs);
    });
  }
});

router.get('/routes', function(req,res) {
  routes.find({}, function(err,docs){
    res.send(docs);
  });
});

router.get('/pistes', function(req,res) {
  pistes.find({}, function(err,docs){
    res.send(docs);
  });
});

router.get('/ouvrages', function(req,res) {
  ouvrages.find({}, function(err,docs){
    res.send(docs);
  });
});

router.post('/oForm', function(req, res){
  console.log(req.body);
  var newObjectOnTheMap = new ouvrages(req.body);
  newObjectOnTheMap.save(function(err,newObjectOnTheMap){
    if(err){
      res.send(err.message);
    }
    else {
      res.send(newObjectOnTheMap);
    };
  });
});

module.exports = router;
