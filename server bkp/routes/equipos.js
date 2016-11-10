var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Equipo = require('../models/equipo.js');


router.post('/post', function(req, res) {
  req.body.idTorneo = new mongoose.mongo.ObjectId(req.body.idTorneo);
  Equipo.create(req.body, function(err, equipo){
    if(err)
      res.status(500).json({err:err})
    
    res.json(equipo);
	})
});

router.get('/get', function(req, res, next){
	Equipo.find(function(err, data){
		if(err) return next(err);
		res.json(data);
	})
});

router.delete('/delete:id', function(req, res, next) {
  Equipo.findByIdAndRemove(req.params.id, req.body.models, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

router.put('/update:id', function(req, res, next) {
  Equipo.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});


module.exports = router;