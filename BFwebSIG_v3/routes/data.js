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
  if(!error){console.log('Connect to database MongoDB')}
});

// Mongoose general Schema & model definition: mongoose.model(name, schema, collection)
var JsonSchema = new Schema({
  name : String,
  type : Schema.Types.Mixed
});
var Json = mongoose.model('JString',JsonSchema,'staticlayercollection')

// Schema for the formular ancien model
var obs = new Schema({
  IDobjet : String,
  ntravee : String,
  portee  : String,
  ltotale : String,
  lutile  : String,
  hauteur : String,
  gabarit : String,
  img     : String,
  geometry: {
    type: {type:String},
    coordinates: []
  }
});
var observation = mongoose.model('observation',obs,'observations')

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
    type: {String},
    coordinates: []
  }
});
var routes = mongoose.model('routes', routesSchema, 'routesLL');

var ouvragesSchema = new Schema({
  nom         : String,
  type        : String,
  date        : String,
  commentaire : String,
  photoid     : String,
  geometry    : {
    type: {type: String},
    coordinates: []
  }
});
var ouvrages = mongoose.model('ouvrages', ouvragesSchema, 'ouvrages')

/*GET GeoJSON data. */
router.get('/static/:name', function(req, res){
  console.log('Data requested in database MongoDB...')
  if(req.params.name){
    Json.findOne({name: req.params.name},{}, function(err,docs){
      res.json(docs);
    });
  }
});

router.get('/pistes', function(req,res9) {
  routes.find({}, function(err,docs){
    res.send(docs);
  });
});

router.get('/ouvrages', function(req,res) {
  pistes.find({}, function(err,docs){
    res.send(docs);
  });
});

/* POST formular data*/
router.post('/form', function(req,res){
  console.log(req.body);
  var newObs = new observation(req.body);
  newObs.save(function(err,newobj){
    if(err){
      res.send(err.message);
    }
    else{
      res.send(newobj);
    };
  });
});

module.exports = router;
