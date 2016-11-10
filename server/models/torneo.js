var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Torneo = new Schema({
  nombre:String,
  tipo: String,
  cantEquipos: Number,
  jugTitulares: Number,
  jugSuplentes: Number,
  fechaInicio: Date,
  fechaFin: Date,
  fechaCierreInscripcion: Date,
  estado: String,
  valorInscripcion: Number,
  valorPorPartido: Number,
  cantFechas: Number,
  partidosPorFecha: Number,  
  foto: String,
  equipos: [{ type: Schema.Types.ObjectId, ref: 'Equipos' }]
});


module.exports = mongoose.model('Torneos', Torneo);
