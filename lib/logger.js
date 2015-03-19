'use strict';

// logger.js

// SETUP LOGGING
// =============================================================================
var winston = require('winston');
var config  = appRequire('config');

var log = new winston.Logger({
  transports: [new winston.transports.Console(config.log)]
});

module.exports = log;