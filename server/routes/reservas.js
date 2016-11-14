var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Reserva = require('../models/reserva.js');
var Usuario = require('../models/usuario.js');
var Cancha = require('../models/cancha.js');
var cron = require('node-schedule');
var moment = require('moment');
var UsuarioAut = require('../models/usuario.js');
var datausuarios = [];
var ReservaEliminar = require('../models/reserva.js');

var rule = new cron.RecurrenceRule();

rule.dayOfWeek = [0,1,2,3,4,5,6];
rule.hour = 03;
rule.minute = 01;
cron.scheduleJob(rule, function(){

    console.log("Verificacion de reservas vencidas")

    ReservaEliminar.find(function(err, data){
    if(err) return err;

    UsuarioAut.find(function(error, dataUsers){
    if(error) return error;
    datausuarios = dataUsers;

    var horaActual = moment().format();

    for (i = 0; i < data.length; i++) { 

      var horaReserva = moment(data[i]._doc.Start).format();
      var dif = moment(horaReserva).diff(moment(horaActual), 'hours');
      
      if (dif < 48 && dif >=0 && data[i]._doc.Saldo == data[i]._doc.PrecioTotal) {

          for (var x=0; x <datausuarios.length; x++) {

            if (datausuarios[x]._doc.username == data[i]._doc.Username) {

              //se incrementa en 1 incumplimiento al usuario
              UsuarioAut.findByIdAndUpdate(datausuarios[x]._doc._id.toString(), {$inc: {cantIncumplim:1}}, function (err, post) {
                if (err) return err;
                  console.log("Se incrementa en 1 el usuario: " + post);

                    if(post.cantIncumplim >= 2){
                      UsuarioAut.findByIdAndUpdate(datausuarios[x]._doc._id.toString(), {estado:"Lista Negra"}, function (err, post) {
                        if (err) return err;
                          console.log("Usuario agregado a lista negra");
                      });  
                    };

              });
              
              //se borra la reserva vencida
              Reserva.findByIdAndRemove(data[i]._doc._id.toString(),  function (err, post) {
                if (err) return err;
                console.log("Se elimino reserva vencida "); 
              });

              return;
              
            };

          };


        };


    }



    })

  })
    
});


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
  })
});

router.put('/completarpago:id', function(req, res, next) {
  Reserva.findByIdAndUpdate(req.params.id,{Saldo:0}, null, function (err, post) {
    if (err) 
        return res.status(500).json({ err: err.msg });
    
      return res.status(200).json({ msg: 'Reserva abonada.' });
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

router.delete('/eliminar', function(req, res, next) {
  Reserva.findByIdAndRemove(req.query._id,  function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

router.post('/nuevareserva',function(req,res){
  req.body._cancha = new mongoose.mongo.ObjectId(req.body.Cancha);
  
  Usuario.findOne({username:req.body.Username},function(err,usuario){

    if(err || !usuario)
      return res.status(500).json({err: 'Usuario no encontrado.'});
    if( usuario.cantIncumplim >= 3 )
      return res.status(500).json({err: 'No se encuentra habilitado para realizar una reserva.'});

    Cancha.findOne({_id:req.body._cancha},function(err,cancha){

      if(cancha.locked)
        return res.status(500).json({err: 'En este momento no se pueden realizar reservas. Intente mas tarde.'});
    
      Reserva.create(req.body, function(err, data){
      res.json(data);
      });
    })
  })
  
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
