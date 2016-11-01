var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Reserva = require('../models/reserva.js');

router.post('/post', function(req, res) {
  req.body.models[0]._cancha = new mongoose.mongo.ObjectId(req.body.models[0].Cancha);
  Reserva.create(req.body.models, function(err, data){
    res.json(data);
  });
});

router.get('/read', function(req, res, next){
	Reserva.find(function(err, data){
		if(err) return next(err);
		res.json(data);
	});
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

router.post('/nuevareserva',function(req,res){
  req.body._cancha = new mongoose.mongo.ObjectId(req.body.Cancha);
  Reserva.create(req.body, function(err, data){
    res.json(data);
  });
});

// Obtengo las reservas y con el populate lleno el objeto cancha
router.get('/read/:username',function(req,res){
    Reserva.find({Username:req.params.username})
        .populate('_cancha')
            .exec(function(err,reservas){
                if(err)
                    return res.status(500).json({err: err});
                
                if(!reservas)
                    return res.status(404).json({
                        msg: 'No se encontraron reservas'
                    });
        
                res.status(200).json(reservas);
    })
});

module.exports = router;
