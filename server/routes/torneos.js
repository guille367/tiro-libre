var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Torneo = require('../models/torneo.js');


router.post('/post', function(req, res) {
  Torneo.create(req.body, function(err, data){
    res.json(data);
	})
});

router.get('/get', function(req, res, next){
  Torneo.find()
        .populate('equipos')
      .exec(function(err,torneo){
          if(err)
            return res.status(500).json({err:err});

          res.json(torneo);
      });
});

router.get('/get:idtorneo',function(req,res){
  Torneo.findOne({_id:req.params.idtorneo})
    .populate('equipos')
      .exec(function(err,torneo){
          if(err)
            return res.status(500).json({err:err});

          res.json(torneo);
      });
});

router.delete('/delete:id', function(req, res, next) {
  Torneo.findByIdAndRemove(req.params.id, req.body.models, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

router.put('/anotarequipo:idtorneo',function(req,res){

  var idequipo = new mongoose.mongo.ObjectId(req.body._id);
  /*Torneo.findOne({_id:req.params.idtorneo}), {$push:{ "equipos": idequipo } }, 
      function(err,data){
        if(err)
          res.status(500).json({ err:err });

        res.json(data);
      });*/
      Torneo.findOne({_id:req.params.idtorneo},
          function(err,torneo){
            if(err)
              res.status(500).json({err:err});

              torneo.equipos.push(idequipo);
              
                torneo.save(function(err,data){
                    if(err)
                      res.status(500).json({err:err});

                    res.json(data);
                });
          });

});

router.put('/update:id', function(req, res, next) {
  Torneo.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});


module.exports = router;
