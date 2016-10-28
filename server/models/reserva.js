
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/* Agrego la referencia a usuarios y canchas.
 La propiedad ref recibe el nombre del documento (tabla) de la base.
 Si tienen ganas fijense en http://mongoosejs.com/docs/populate.html
 igualmente está implementado en los routes*/

var Reserva = new Schema({
  _usuario: { type: Schema.Types.ObjectId, ref: 'usuarios' }, 
  _cancha: { type: Schema.Types.ObjectId, ref: 'canchas' },
  TaskID: Number,
  Cancha: String,
  Username: String,
  Description: String,
  StartTimeZone: String,
  Start: Date,
  End: Date,
  EndTimezone: String,
  RecurrenceRule: String,
  RecurrenceException: String,
  IsAllDay: Boolean,
  PrecioTotal: String,
  PrecioReserva: String,
  PagoTotal: Boolean
});

/*
var Reserva = new Schema({
  TaskID: Number,
  Cancha: String,
  Username: String,
  Description: String,
  StartTimeZone: String,
  Start: Date,
  End: Date,
  EndTimezone: String,
  RecurrenceRule: String,
  RecurrenceID: String,
  RecurrenceException: String,
  IsAllDay: Boolean,
  PrecioTotal: String,
  PrecioReserva: String,
  PagoTotal: Boolean

});

*/

module.exports = mongoose.model('reservas', Reserva);