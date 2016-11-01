var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Reserva = new Schema({
  _cancha: { type: Schema.Types.ObjectId, ref: 'canchas' },
  TaskID: String,
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
  PrecioTotal: Number,
  PrecioReserva: Number,
  Saldo: Number
});


module.exports = mongoose.model('reservas', Reserva);
