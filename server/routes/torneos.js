var express = require('express');
var router = express.Router();

var Torneo = require('../models/torneo.js');


router.post('/post', function(req, res) {
  Torneo.create(req.body, function(err, data){
    res.json(data);
	})
});

router.get('/get', function(req, res, next){
	Torneo.find(function(err, data){
		if(err) return next(err);
		res.json(data);
	})
});

router.delete('/delete:id', function(req, res, next) {
  Torneo.findByIdAndRemove(req.params.id, req.body.models, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

router.put('/update:id', function(req, res, next) {
  Torneo.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});


module.exports = router;