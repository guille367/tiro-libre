
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Cancha = new Schema({
  nombre: String,
  cantJug: Number,
  pDiurno: Number,
  pNocturno: Number,
  techo: Boolean,
  luz: Boolean,
  piso: String,
  estado: String,
  color: String,
  horaIni: String,
  horaFin: String,
  foto: String
});


module.exports = mongoose.model('canchas', Cancha);
