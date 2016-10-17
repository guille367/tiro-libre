
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Configuracion = new Schema({
  horaApertura: String,
  horaCierre: String,
  horaNocturna: String,
  mail: String,
  telefono: String,
  direccion: String,
  porcReserva: Number
});

module.exports = mongoose.model('configuracion', Configuracion);