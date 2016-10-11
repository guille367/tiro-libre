// user model
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var Reserva = new Schema({
  inicio: Date,
  fin: Date,
  periodica: Boolean,
  cancha: String,
  idUsuario: Object // Maneja el ObjectId de mongo
});

Reserva.statics.obtenerReservas = function(){
	console.log("y bue");
}

module.exports = mongoose.model('reservas', Reserva);