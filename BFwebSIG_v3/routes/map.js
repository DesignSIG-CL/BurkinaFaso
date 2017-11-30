var express = require('express');
var router = express.Router();

/* GET map's page. */
router.get('/', function(req, res, next) {
  console.log('Loading the webpage with the map.');
  res.render('map', { title: 'WEBSIG B-F' });
});

module.exports = router;
