'use strict';

// server.js

// BASE SETUP
// =============================================================================
var app        = require('./app');

var config     = appRequire('config');
var utils      = appRequire('lib/utils');
var log        = appRequire('lib/logger');

var http       = require('http');
var server     = http.createServer(app);


server.listen(config.server.port, config.server.ip);
server.on('listening', function(){
  log.info('Server Listening at: http://' + config.server.ip + ':' + config.server.port);
});