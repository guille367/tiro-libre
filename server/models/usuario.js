
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Usuario = new Schema({
  dni: String,
  usuario: String,
  contraseña: String,
  nombre: String,
  apellido: String,
  mail: String,
  telefono: String,
  cantIncumplim: Number,
  foto: String,
  fechaNac: Date,
  fechaAlta: Date,
  estado: String
});


module.exports = mongoose.model('usuarios', Usuario);
