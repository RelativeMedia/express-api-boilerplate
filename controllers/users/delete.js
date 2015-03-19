'use strict';

// controllers/user.js

// USER CONTROLLER
// =============================================================================
var mongoose     = require('mongoose');
var User         = mongoose.model('User');
var log          = appRequire('lib/logger');


module.exports = function(req, res){
  User.remove({ _id: req.params.id }, function(err){
    if(err) return res.status(500).json(err);
    res.json({ message: 'User Deleted' });
  });
};