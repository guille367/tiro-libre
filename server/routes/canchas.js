var express = require('express');
var router = express.Router();

var Cancha = require('../models/cancha.js');


router.post('/', function(req, res) {
  Cancha.create(req.body, function(err, data){
    res.json(data);
	})
});

router.get('/', function(req, res, next){
	Cancha.find(function(err, data){
		if(err) return next(err);
		res.json(data);
	})
});


module.exports = router;