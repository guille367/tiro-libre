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

router.put('/update', function(req, res, next) {
  Reserva.findByIdAndUpdate(req.body.id, req.body.models[0], {new: true}, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

router.delete('/delete', function(req, res, next) {
  Reserva.findByIdAndRemove(req.body.id,  function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});



module.exports = router;