
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var Usuario = new Schema({
  username: String,
  password: String,
  dni: Number,
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

Usuario.plugin(passportLocalMongoose);

module.exports = mongoose.model('usuarios', Usuario);
