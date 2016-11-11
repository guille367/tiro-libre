var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user.js');

// Dependencias para recuperar contrasena
var async = require('async');
var nodemailer = require('nodemailer');
var bcrypt = require('bcrypt-nodejs');
var crypto = require('crypto');
var smtpTransport = require('nodemailer-smtp-transport');


router.post('/register', function(req, res) {
  User.register(new User({ username: req.body.username, name: req.body.name, mail: req.body.mail, superAdmin: req.body.superAdmin}),
    req.body.password, function(err, account) {
    if (err) {
      return res.status(500).json({
        err: err
      });
    }
    passport.authenticate('user')(req, res, function () {
      return res.status(200).json({
        status: 'Registration successful!'
      });
    });
  });
});

router.post('/login', function(req, res, next) {
  passport.authenticate('user', function(err, user, info) {
      
    if (err) {
        
      console.log('err authenticate');
      console.log(err);
      return res.json({err:err});
    }
    if (!user) {
        console.log("nono")
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

router.get('/get', function(req, res, next){
  User.find(function(err, data){
    if(err) return next(err);
    res.json(data);
  })
});

router.get('/status', function(req, res) {
  if (!req.isAuthenticated()) {
    return res.status(200).json({
      status: false
    });
  }
  res.status(200).json({
    status: true,
  });
});

router.put('/update:id', function(req, res, next) {
  User.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

router.delete('/delete:id', function(req, res, next) {
  User.findByIdAndRemove(req.params.id, req.body.models, function (err, post) {
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
      User.findOne({ username: req.params.username }, function(err, user) {
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
          'http://' + req.headers.host + '#/recover/admin/' + token + '\n\n' +
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

  User.findOne({ tokenPwReset: req.params.token, resetPwVencimiento: { $gt: Date.now() } }, function(err, user) {
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
