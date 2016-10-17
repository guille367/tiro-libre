var express = require('express');
var router = express.Router();

var Config = require('../models/configuracion.js');


router.post('/post', function(req, res) {
  Config.create(req.body, function(err, data){
    res.json(data);
	})
});

router.get('/get', function(req, res, next){
	Config.find(function(err, data){
		if(err) return next(err);
		res.json(data);
	})
});


router.put('/update:id', function(req, res, next) {
  Config.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});


module.exports = router;