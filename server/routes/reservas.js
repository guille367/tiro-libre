var express = require('express');
var router = express.Router();

var Reserva = require('../models/reserva.js');
var Cancha = require('../models/cancha.js');
var Usuario = require('../models/usuario.js');


router.post('/post', function(req, res) {
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

router.post('/newreserva',function(req,res){
   
    var o = req.body;
    
    Cancha.find()
        .where({'_id': new ObjectId(o._idCancha)},
            function(err,cancha){
                if(err)
                    return res.status(500).json({
                    err: err
                  });
                
        Usuario.find().where(
            {'_id': new ObjectId(o._idUsuario)},
        function(err,usuario){
            if(err)
                return res.status(500).json({
                err: err
            });

            Reserva.create(function(err,data){
                if(err)
                    return res.status(500).json({
                        err: err
                    });

                return res.status(200).json({
                    data: 'Reserva concretada'
                });
            });

        });
                
    });
    
});

router.get('/findbycancha',function(req,res){
    
    Cancha.find()
        .where({'_id':req.body._id},
               function(err,cancha){
                    if(err)
                        return res.status(500).json({err:err});
                    
                    Reserva.find()
                        .where({'_id':new ObjectId(cancha._id)},
                               function(err,r){
                                    if(err)
                                        return res.status(500).json({err: err})
                                        
                                        res.json(r);
                    })
    })
    
});

router.get('/findbyusuario',function(req,res){
    
    Reserva.find()
        .where({'usuario': new ObjectId(req.body._id)},
               function(err,reservas){
                if(err)
                    return res.status(500).json({
                        err: err
                    })
        
                res.json(reservas);
        });
    
});

module.exports = router;