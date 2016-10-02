
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Cancha = new Schema({
  nombre: String,
  cantJugadores: Number,
  pDiurno: Number,
  pNocturno: Number,
  techada: Boolean,
  luz: Boolean,
  piso: String,
  estado: String,
  color: String,
  horaApertura: String,
  horaClausura: String,
  imagen: String
});


module.exports = mongoose.model('canchas', Cancha);
