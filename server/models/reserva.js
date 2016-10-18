
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Reserva = new Schema({
  TaskID: Number,
  Owner: String,
  Title: String,
  Description: String,
  StartTimeZone: String,
  Start: Date,
  End: Date,
  EndTimezone: String,
  RecurrenceRule: String,
  RecurrenceException: String,
  IsAllDay: Boolean
});


module.exports = mongoose.model('reservas', Reserva);