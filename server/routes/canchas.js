var express = require('express');
var router = express.Router();

var Cancha = require('../models/cancha.js');
var Reserva = require('../models/reserva.js');

router.post('/post', function(req, res) {
  Cancha.create(req.body, function(err, data){
    res.json(data);
	})
});

router.get('/get', function(req, res, next){
	Cancha.find(function(err, data){
		if(err) return next(err);
		res.json(data);
	})
});

router.delete('/delete:id', function(req, res, next) {
  Cancha.findByIdAndRemove(req.params.id, req.body.models, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

router.put('/update:id', function(req, res, next) {
  Cancha.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

// Obtengo las reservas que tiene la cancha
router.get('/getreservas:id', function(req,res){
    Reserva.find({_cancha:req.param.id},function(err,reservas){
        if(err)
            return res.status(500).json({err:err})
        
        res.status(200).json(reservas);
    });
});


module.exports = router;