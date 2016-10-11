var express = require('express');
var router = express.Router();
var passport = require('passport');

var Reserva = require('../models/reserva.js');
var User = require('../models/user.js');

router.get('/getAll',function(req,res){
	Reserva.obtenerReservas(function(err,data){
		if(err)
			res.status(500).json({
				status:'error interno del servidor'
			})

		console.log(data);
	});
	
	var q = User.find({username:'admin'});
	q.exec()
		.then(function(d){
			console.log('bien');
			console.log(d);
		})
		.catch(function(e){
			console.log('mal');
			console.log(e);
		});

	var r = User.find({username:'pepisho'});
	r.exec()
		.then(function(d){
			console.log('bien');
			console.log(d);
		})
		.catch(function(e){
			console.log('mal');
			console.log(e);
		});

});

module.exports = router;