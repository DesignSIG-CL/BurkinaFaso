var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Mongoose connection to MongoDB
mongoose.connect('mongodb://localhost:27017/test', {
  useMongoClient : true,
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

/*GET GeoJSON data. */
router.get('/:name', function(req, res){
  console.log('Data requested in database MongoDB...')
  if(req.params.name){
    Json.findOne({name: req.params.name},{}, function(err,docs){
      res.json(docs);
    });
  }
});

module.exports = router;
