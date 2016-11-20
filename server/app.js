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
var localStrategy = require('passport-local').Strategy;
var cors = require('cors');
var multer  = require('multer');
var http = require('http');
var bodyParser = require('body-parser');
var nodemailer = require('nodemailer');
var passportLocalMongoose = require('passport-local-mongoose');
var smtpTransport = require("nodemailer-smtp-transport")


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
var Torneo = require('./models/torneo.js');
var Equipo = require('./models/equipo.js');

// create instance of express
var app = express();

// require routes
var routes = require('./routes/users.js');
var canchasRoutes = require('./routes/canchas.js');
var reservasRoutes = require('./routes/reservas.js');
var configuracionRoutes = require('./routes/configuracion.js');
var usuariosRoutes = require('./routes/usuarios.js');
var torneosRoutes = require('./routes/torneos.js');
var equipoRoutes = require('./routes/equipos.js');



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
passport.use('user',new localStrategy(User.authenticate({
  usernameField: 'username',
  passwordField: 'password'
})));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

passport.use('usuario',Usuario.createStrategy({
  usernameField: 'username',
  passwordField: 'password',
}));
passport.serializeUser(Usuario.serializeUser());
passport.deserializeUser(Usuario.deserializeUser());


// routes
app.use('/user/', routes);
app.use('/cancha/', canchasRoutes);
app.use('/reserva/', reservasRoutes);
app.use('/configuracion/', configuracionRoutes);
app.use('/usuario/', usuariosRoutes);
app.use('/torneo/', torneosRoutes);
app.use('/equipo/', equipoRoutes);

app.get('/', function(req, res) {
  console.log(passport)
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
    res.json("Se cargo correctamente");
  });
});


var smtpTransport = nodemailer.createTransport(smtpTransport({
    host : "smtp.gmail.com",
    secureConnection : false,
    port: 587,
    auth : {
        user : "ppsfutbol2016@gmail.com",
        pass : "pps2016*"
    }
}));

app.post('/enviarmail', function(req,res){
    console.log('req.body');
    console.log(req.body.foto);
    var fs = require('fs');

    if (req.body.foto == "") {
      var mailOptions={
        from : req.body.mail,
        to : req.body.mail,
        subject : req.body.asunto,
        text : req.body.texto,
        html: req.body.texto + '<img src="cid:unique@kreata.ee"/>'
      }

    }else{
      var mailOptions={
        from : req.body.mail,
        to : req.body.mail,
        subject : req.body.asunto,
        text : req.body.texto,
        html: req.body.texto + '<img src="cid:unique@kreata.ee"/>',
        attachments: [{ filename: req.body.foto,
        path: path.join(__dirname, '../administrador/client/img/', req.body.foto),
        cid: 'unique@kreata.ee'
        }]
      }

    }

    smtpTransport.sendMail(mailOptions, function(error, response){
        if(error){
            console.log(error);
            res.end("error");
        }else{
            console.log(response.response.toString());
            console.log("Message sent: " + response.message);
            res.end("sent");
        }
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
