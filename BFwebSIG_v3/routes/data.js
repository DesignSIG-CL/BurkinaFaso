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
/** Setting up storage using multer-gridfs-storage */
    /*var storage = GridFsStorage({
        gfs : gfs,
        filename: function (req, file, cb) {
            var datetimestamp = Date.now();
            cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1]);
        },
        // With gridfs we can store aditional meta-data along with the file
        metadata: function(req, file, cb) {
            cb(null, { originalname: file.originalname });
        },
        root: 'filesUploaded' //root name for collection to store files into
    });
    var upload = multer({ //multer settings for single upload
        storage: storage
    }).single('file');
    // API path that will upload the files
    app.post('/upload', function(req, res) {
        upload(req,res,function(err){
            if(err){
                 res.json({error_code:1,err_desc:err});
                 return;
            }
             res.json({error_code:0,err_desc:null});
        });
    });
    app.get('/file/:filename', function(req, res){
        gfs.collection('ctFiles'); //set collection name to lookup into
        // First check if file exists
        gfs.files.find({filename: req.params.filename}).toArray(function(err, files){
            if(!files || files.length === 0){
                return res.status(404).json({
                    responseCode: 1,
                    responseMessage: "error"
                });
            }
            // create read stream
            var readstream = gfs.createReadStream({
                filename: files[0].filename,
                root: "filesUploaded"
            });
            // set the proper content type
            res.set('Content-Type', files[0].contentType)
            // return response
            return readstream.pipe(res);
        });
    });*/
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
    id          : {type : String},
    nom         : {type : String},
    dateC   : {type : String},
    dateM   : {type : String},
    nTrav   : {type : String},
    lOuve   : {type : String},
    porte   : {type : String},
    haute   : {type : String},
    lRoul   : {type : String},
    gabar   : {type : String},
    cmntr   : {type : String},
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
