var express = require('express');
var router = express.Router();
var passport = require('passport');
var Usuario = require('../models/usuario.js');
// Dependencias para recuperar contrasena
var async = require('async');
var nodemailer = require('nodemailer');
var bcrypt = require('bcrypt-nodejs');
var crypto = require('crypto');
var smtpTransport = require("nodemailer-smtp-transport");


router.post('/post', function(req, res) {
  Usuario.create(req.body, function(err, data){
    res.json(data);
  })
});

router.get('/get', function(req, res, next){
  Usuario.find(function(err, data){
    if(err) return next(err);
    res.json(data);
  })
});   


router.post('/register', function(req, res) {
    var u = req.body;
    Usuario.register(new Usuario(u),
    u.password, function(err, user) {
          if (err) {
            return res.status(500).json({
              err: err
            });
          }
        
          return res.status(200).json({
              usuario: user
          });

    });
  });


router.post('/login', function(req, res, next) {
  passport.authenticate('usuario', function(err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({
        err: info
      });
    }
    req.logIn(user, function(err) {
      if (err) {
        return res.status(500).json({
          err: 'Could not log in user'
        });
      }
      res.status(200).json({
        status: 'Login successful!',
        user: user
      });
    });
  })(req, res, next);
});

router.get('/logout', function(req, res) {
  req.logout();
  res.status(200).json({
    status: 'Bye!'
  });
});

router.delete('/delete:id', function(req, res, next) {
  Usuario.findByIdAndRemove(req.params.id, req.body.models, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

router.put('/update:id', function(req, res, next) {
  Usuario.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

router.put('/update/incumplimiento', function(req, res, next) {
  Usuario.findByIdAndUpdate(req.body._id, {$inc: {cantIncumplim:1}}, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

router.post('/recover:username',function(req,res){  
    async.waterfall([
    function(done) {
      crypto.randomBytes(20, function(err, buf) {
        var token = buf.toString('hex');
        done(err, token);
      });
    },
    function(token, done) {
      Usuario.findOne({ username: req.params.username }, function(err, user) {
        if (!user) {
          return res.status(500).json({err:'No se encontro el usuario.'});
        }

        user.tokenPwReset = token;
        user.resetPwVencimiento = Date.now() + 3600000; // 1 hour

        user.save(function(err) {
          //done(err, token, user);
            if(err)
                return res.status(500).json({err:err});
                
                done(err, token, user);
        });
      });
    },
    function(token, user, done) {
      var transporter = nodemailer.createTransport(smtpTransport({
            host : "smtp.gmail.com",
            secureConnection : false,
            port: 587,
            auth : {
                user : "ppsfutbol2016@gmail.com",
                pass : "pps2016*"
            }
        }));
        user.mail = user.mail;
      var mailOptions = {
        to: user.mail,
        from: 'ppsfutbol2016@gmail.com',
        subject: 'TiroLibre - Recuperar password',
        text: 'Usted ha pedido el reestablecimiento de la contraseña.\n\n' +
          'Por favor clickee en el link para continuar con el proceso:\n\n' +
          'http://' + req.headers.host + '#/recover/usuario/' + token + '\n\n' +
          'Muchas gracias!'
      };
        
      transporter.sendMail(mailOptions, function(err) {
        console.log('Mail enviado a ' + user.mail);
        done(err, 'done');
      });
    }
    ], function(err, data) {
        if (err) return next(err);
          return res.status(200).json(data);
    });
    
});

router.put('/recover:token', function(req, res) {

  Usuario.findOne({ tokenPwReset: req.params.token, resetPwVencimiento: { $gt: Date.now() } }, function(err, user) {
        if (!user) {
          return res.status(500).json({err:'El token es invalido o expiro.'});
        }

        user.setPassword(req.body.password,function(err,user){
            if(err)
                res.send(err);
            
            user.tokenPwReset = undefined;
            user.resetPwVencimiento = undefined;
            
            user.save(function(err,user){
                if(err)
                    return res.status(500).json({err:err});
              
              return res.status(200).json({msg: 'Password reestablecida'});
            });
        });

  });

});

module.exports = router;
