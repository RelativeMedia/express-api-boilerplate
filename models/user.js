'use strict';

// models/user.js

// USER MODEL
//==============================================================================
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt');
var config   = require('../config');
var log      = require('../logger');
var Schema   = mongoose.Schema;

var UserSchema = new Schema({
  username: {
    type: String,
    unique: 'Username already exists',
    required: 'Please fill in a username'
  },
  email: {
    type: String,
    trim: true,
		default: '',
		match: [/.+\@.+\..+/, 'Please fill a valid email address']
  },
  password: {
		type: String,
		default: '',
		required: 'Password is required'
  },
	updatedAt: {
		type: Date
	},
	createdAt: {
		type: Date,
		default: Date.now
	},
});

UserSchema.pre('save', function(next){
  var user = this;
  if(user.password && user.password.length >= config.auth.minPasswordLength){
    bcrypt.genSalt(config.auth.saltWorkFactor, function(err, salt){
      if(err){
        log.error("Error Generating Salt. " + err);
        return next(err);
      }
      bcrypt.hash(user.password, salt, function(err, hash){
        if(err) {
          log.error("Error Generating Hash. " + err);
          return next(err);
        }
        
        user.password = hash;
        next(null, user);
      });
    });
  }
  
});

UserSchema.methods.validPassword = function(password, cb){
  return bcrypt.compareSync(password, this.password);
}

mongoose.model('User', UserSchema);