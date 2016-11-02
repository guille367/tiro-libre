var express = require('express');
var router = express.Router();
var passport = require('passport');

var Usuario = require('../models/usuario.js');


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
    Usuario.register(new Usuario(req.body),
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
  passport.authenticate('local', function(err, user, info) {
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
      console.log(user);
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



module.exports = router;