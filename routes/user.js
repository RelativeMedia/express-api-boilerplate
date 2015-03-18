'use strict';

var express  = require('express');
var Router   = express.Router();
var passport = require('passport');
var log      = require('../logger');
var mongoose = require('mongoose');
var User     = mongoose.model('User');
var JSONWebToken = require('jsonwebtoken');
var jwt      = require('express-jwt');
var config   = require('../config');


Router.post('/login', function(req, res, next){
  log.info('Logging User In');
  passport.authenticate('local', { sessions: false }, function(err, user, info){
    if(err || !user){
      return next(err);
    }
    //user has authenticated correctly thus we create a JWT token 
    var token = JSONWebToken.sign({
      user: {
        username: user.username,
        id: user.id,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    }, config.auth.token.secret, config.auth.token.options);
    res.json({ token : token });
    
  })(req, res, next);
  
});

Router.get('/', jwt({ secret: config.auth.token.secret }), function(req, res){
  User.find().exec(function(err, users){
    if(err) return res.status(500).json(err);
    res.json(users);
  });
});

Router.delete('/:id', jwt({ secret: config.auth.token.secret }), function(req, res){
  
  User.remove({ _id: req.params.id }, function(err){
    if(err) return res.send(500).json(err);
    res.json({ message: 'User Deleted' });
  });
  
});

Router.post('/register', function(req, res){
  console.log(req.body);
  var user = new User();
  user.username = req.body.username;
  user.password = req.body.password;
  user.email    = req.body.email;

  user.save(function(err, user){
    if(err) return res.status(500).json({ err: err, user: user });
    res.json({ message: "User Created", user: user});
  });
});

module.exports = ['/user', Router];