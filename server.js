'use strict';

// server.js

// BASE SETUP
// =============================================================================
var express    = require('express');
var multer     = require('multer');
var bodyParser = require('body-parser');
var morgan     = require('morgan');
var path       = require('path');
var mongoose   = require('mongoose');
var jwt        = require('express-jwt');
var config     = require('./config');
var utils      = require('./utils');
var log        = require('./logger');
var app        = express();

mongoose.connect(config.db.uri, config.db.options, function(err) {
	if (err) {
		log.error('Could not connect to MongoDB!');
		log.error(err);
	}
});

mongoose.connection.on('error', function(err) {
  log.error('MongoDB connection error: ' + err);
  process.exit(-1);
});

// Globbing model files
utils.getGlobbedFiles('./models/**/*.js').forEach(function(modelPath) {
  require(path.resolve(modelPath));
});

app.disable('x-powered-by');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(multer());

var User = mongoose.model('User');
var passport   = require('passport');
var LocalStrategy = require('passport-local').Strategy;


passport.use(new LocalStrategy(function(username, password, done){
    User.findOne({ username: username }, function(err, user){
      
      if(err) return done(err);
      
      if(!user){
        return done(null, false, { message: 'Incorrect Username' });
      }
      
      if( !user.validPassword(password) ){
        return done(null, false, { message: 'Incorrect Password' });
      }else{
        return done(null, user); 
      }
      
    });
  }
));
app.use(passport.initialize());

// Setup JWT protection using express-jwt, add exceptions for /api/user/login
// =============================================================================
app.use(
  jwt({ secret: config.auth.token.secret }).unless({
  path: [
    '/api/user/login'
  ]
}));

app.use(function(err, req, res, next){
  
  if(err.name === "UnauthorizedError"){
    res.status(401).json(err);
    next(err);
  }else if(err){
    res.status(500).json(err);
    next(err);
  }
  
});

app = require('./routes')(app);
app.listen(config.server.port, config.server.ip, function(){
  log.info('Server Listening at: http://' + config.server.ip + ':' + config.server.port);
});