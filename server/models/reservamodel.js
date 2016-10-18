var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Reserva = Schema.Schema({
    fechaInicio: Date,
    fechaFin: Date,
    descripcion: String,
    cancha: {type: Schema.Types.ObjectId, ref: 'canchas'},
    usuario: {type: Schema.Types.ObjectId, ref: 'usuarios'},
    periodica: Boolean,
    importePagado: Number
});


module.exports = mongoose.model('reservasmodel', Reserva);