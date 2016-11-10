// user model
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var User = new Schema({
  username: String,
  password: String,
  name: String,
  mail: String,
  superAdmin: Boolean
});

User.plugin(passportLocalMongoose);


module.exports = mongoose.model('users', User);