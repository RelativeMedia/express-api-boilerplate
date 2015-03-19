'use strict';

// routes/auth.js

// USER ROUTE FOR AUTHENTICATION
// =============================================================================
var JSONWebToken = require('jsonwebtoken');
var mongoose     = require('mongoose');
var User         = mongoose.model('User');
var config       = appRequire('config');
var log          = appRequire('lib/logger');

module.exports = function(req, res, next){
  log.info(req.body.username);
  User.findOne({ username: req.body.username }).exec(function(err, user){
    
    if(err) {
      // res.status(500).json(errr);
      log.error(err);
      return next(err);
    }
    
    if(!user){
      log.error('Invalid username');
      return res.status(401).json({ 'message': 'Invalid Username' });
    }
    
    if(!user.validPassword(req.body.password) ){
      log.error('Invalid Password');
      return next({ message: 'Incorrect Password' });
    }else{
      var token = JSONWebToken.sign({
        user: {
          username: user.username,
          id: user.id,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        }
      }, config.auth.token.secret, config.auth.token.options);
      res.json({ token : token });
    }
  });
  
};