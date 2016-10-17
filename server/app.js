// dependencies
var express = require('express');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressSession = require('express-session');
var mongoose = require('mongoose');
var hash = require('bcrypt-nodejs');
var path = require('path');
var passport = require('passport');
var localStrategy = require('passport-local' ).Strategy;
var cors = require('cors');
var multer  = require('multer');

var storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, '../administrador/client/img');
  },
  filename: function (req, file, callback) {
    callback(null, file.originalname);
  }
});

var upload = multer({ storage : storage}).single('input-1');

// mongoose
mongoose.connect('mongodb://admin:admin@ds049466.mlab.com:49466/tirolibredb');

// user schema/model
var User = require('./models/user.js');
// cancha schema/model
var Cancha = require('./models/cancha.js');
var Reserva = require('./models/reserva.js');
var Configuracion = require('./models/configuracion.js');
var Usuario = require('./models/usuario.js');

// create instance of express
var app = express();

// require routes
var routes = require('./routes/users.js');
var canchasRoutes = require('./routes/canchas.js');
var reservasRoutes = require('./routes/reservas.js');
var configuracionRoutes = require('./routes/configuracion.js');
var usuariosRoutes = require('./routes/usuarios.js');



app.use(cors());


// define middleware
app.use(express.static(path.join(__dirname, '../administrador/client')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(require('express-session')({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

// configure passport
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// routes
app.use('/user/', routes);
app.use('/cancha/', canchasRoutes);
app.use('/reserva/', reservasRoutes);
app.use('/configuracion/', configuracionRoutes);
app.use('/usuario/', usuariosRoutes);

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '../administrador/client', 'index.html'));
});

app.post('/api/photo',function(req,res){
  upload(req,res,function(err) {
    console.log(req.file);
  console.log(req.body);
  console.log(req.files);
    if(err) {
      return res.end("Error uploading file.");
    }
    res.end("File is uploaded");
  });
});

// error hndlers
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use(function(err, req, res) {
  res.status(err.status || 500);
  res.end(JSON.stringify({
    message: err.message,
    error: {}
  }));
});

module.exports = app;
