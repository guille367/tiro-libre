
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Equipo = new Schema({
  nombreEq: String,
  usuarioResp: String,
  jugadores: Array,
  fechasImpagas: Number,
  saldo: Number,
  idTorneo:  { type: Schema.Types.ObjectId, ref: 'Torneos' },
  usuarioCreador : String
});

module.exports = mongoose.model('Equipos', Equipo);
