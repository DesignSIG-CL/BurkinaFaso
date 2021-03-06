var express = require('express');
var router = express.Router();
var request = require('superagent');

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var GridFsStorage = require('multer-gridfs-storage');
var Grid = require('gridfs-stream');
var fs = require('fs');
var multer = require('multer');
var upload = multer({dest: 'uploads/'});

// Mongoose connection to MongoDB
mongoose.connect('mongodb://localhost:27017/burkina', {
  useMongoClient : true,
  promiseLibrary: require('bluebird'),
},
function(error){
  if(error){console.log('IS THE SERVER RUNNING ?');console.log(error)}
  if(!error){
    console.log('Connect to database MongoDB, some usefull info :');
    console.log('200 = Data are transmitted');
    console.log('304 = Data already in cache')
  }
});

// Files upload on the mongo SERVER
//to allow writting and reading of multipart objects in Mongo DB

var conn = mongoose.connection;
Grid.mongo = mongoose.mongo;
conn.once('open', function () {
  var gfs = Grid(conn.db);

  //save images on the node side
  router.post('/file', upload.single('fileToUpload'),function(req, res, next){
    if (!req.file){
      return next(new ServerError('Wrong file post request: file not found in request',
        {context: 'files route', status: 403}));
    }
    var writestream = gfs.createWriteStream({
      mode: 'w',
      content_type: req.file.mimetype,
      filename: req.file.originalname
    });
    fs.createReadStream(req.file.path).pipe(writestream);
    console.log('last step');
    writestream.on('close', function(newFile){
      return res.status(200).json({_id: newFile._id});
    });
  });

  router.get('/getFile/:fileId', function(req,res,next){
    if(!req.params || !req.params.fileId){
      return next(new ServerError('Pas de ID spécifié.',{context:'files route', status: 403}));
    }
    var id = gfs.tryParseObjectId(req.params.fileId);
    if(!id){
      return next(new ServerError('Pas de fichier correspondant à ID spécifié.',{context:'files route', status: 403}));
    }
    gfs.files.find({_id : id}).toArray(function(err,files){
      if(err || !files || files.length !==1){
        return next(new ServerError('Impossible de lire les informations du fichier ' + req.params.fileId + ' error ' + err, {context:'files route', status: 403}));
      }
      var fileInfo = files[0];
      var readstream = gfs.createReadStream({
        _id: req.params.fileId
      });
      readstream.on('error',function(err){
        return next(new ServerError('Impossible de lire le fichier ' + req.params.fileId + ' error ' + err, {context:'files route', status: 403}));
      });
      if(fileInfo.contentType){
        res.setHeader('Content-type', fileInfo.contentType);
      }
      res.setHeader('Content-disposition', 'filename='+fileInfo.filename);
      return readstream.pipe(res);
    });
  });
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
    id      : {type : String},
    nom     : {type : String},
    dateC   : {type : String},
    dateM   : {type : String},
    nTrav   : {type : String},
    lOuve   : {type : String},
    porte   : {type : String},
    haute   : {type : String},
    lRoul   : {type : String},
    gabar   : {type : String},
    cmntr   : {type : String},
    photoid : {type : String}
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

router.post('/oFormAdd', function(req, res){
  console.log(req.body);
  var newObjectOnTheMap = new ouvrages(req.body);
  newObjectOnTheMap.save(function(err,savedObjectOnTheMap){
    if(err){
      res.send(err.message);
    }
    else {
      res.send(savedObjectOnTheMap);
    };
  });
});

router.put('/oFormUpdate', function(req, res){
  console.log(req.body.id);
  var idPerso = req.body.properties.id, body = req.body
  ouvrages.findOneAndUpdate(
    {'properties.id':idPerso},
    body,
    {upsert:true},
    function(err,updatedObjectOnTheMap){
    if(err){
      res.send(err.message);
    }
    else {
      res.send(updatedObjectOnTheMap);
    };
  });
});

//MyModel.findOneAndRemove({field: 'newValue'}, function(err){...});
router.put('/oFormDelete', function(req, res){
  console.log(req.body.id);
  var idPerso = req.body.properties.id, body = req.body
  ouvrages.findOneAndRemove(
    {'properties.id':idPerso},
    function(err,deletedObjectOnTheMap){
    if(err){
      res.send(err.message);
    }
    else {
      res.send(deletedObjectOnTheMap);
    };
  });
});

module.exports = router;
