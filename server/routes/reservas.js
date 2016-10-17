var express = require('express');
var router = express.Router();

var Reserva = require('../models/reserva.js');



router.post('/post', function(req, res) {
  Reserva.create(req.body.models, function(err, data){
    res.json(data);
	})
});

router.get('/read', function(req, res, next){
	Reserva.find(function(err, data){
		if(err) return next(err);
		res.json(data);
	})
});

router.put('/update:id', function(req, res, next) {
  Reserva.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

router.delete('/delete:id', function(req, res, next) {
  Reserva.findByIdAndRemove(req.params.id, req.body.models, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});



module.exports = router;