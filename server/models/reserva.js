var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Reserva = new Schema({
  _cancha: { type: Schema.Types.ObjectId, ref: 'canchas' },
  _usuario: { type: Schema.Types.ObjectId, ref: 'usuarios' },
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


module.exports = mongoose.model('reservas', Reserva);