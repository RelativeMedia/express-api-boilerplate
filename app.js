'use strict';

// app.js

// APP STARTUP
// =============================================================================
require('./lib/app_require');

var express    = require('express');
var enrouten   = require('express-enrouten');
var multer     = require('multer');
var bodyParser = require('body-parser');
var morgan     = require('morgan');
var path       = require('path');
var mongoose   = require('mongoose');
var jwt        = require('express-jwt');
    
var config     = appRequire('config');
var utils      = appRequire('lib/utils');
var log        = appRequire('lib/logger');

var app = module.exports = express();

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

function errorHandler(err, req, res, next){
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json(err);
  }else if(err){
    return res.status(500).json(err);
  }else{
    next();
  }
}

app.use('/api', 
  enrouten({
    routes: [
      // Log a user in
      { path: '/auth/login', method: 'POST', handler: require('./controllers/auth/login') },
      // create a new user
      { path: '/users', method: 'POST', handler: require('./controllers/users/create') },
      // Show all users
      { path: '/users', method: 'GET', handler: require('./controllers/users/list'), middleware: [ jwt({ secret: config.auth.token.secret }), errorHandler ] },
      // show a single user
      { path: '/users/:id', method: 'GET', handler: require('./controllers/users/index'), middleware: [ jwt({ secret: config.auth.token.secret }), errorHandler ] },
      // delete a single user
      { path: '/users/:id', method: 'DELETE', handler: require('./controllers/users/delete'), middleware: [ jwt({ secret: config.auth.token.secret }), errorHandler ] },
    ]
  })
);