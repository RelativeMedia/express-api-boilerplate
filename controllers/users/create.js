'use strict';

// controllers/user.js

// USER CONTROLLER
// =============================================================================
var mongoose     = require('mongoose');
var User         = mongoose.model('User');
var log          = appRequire('lib/logger');


module.exports = function(req, res){
    
  var user = new User();
  user.username = req.body.username;
  user.password = req.body.password;
  user.email    = req.body.email;

  user.save(function(err, user){
    if(err) return res.status(500).json({ err: err, user: user });
    
    res.json({
      message: "User Created",
      user: {
        username: user.username,
        _id: user._id,
        createdAt: user.createdAt,
        __v: user.__v
      }
    });
  });

};