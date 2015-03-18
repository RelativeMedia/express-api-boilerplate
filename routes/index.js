'use strict';

// routes/index.js

// BOOTSTRAP & AUTOLOAD THE ROUTES
// =============================================================================
var path   = require('path');
var utils  = require('../utils');
var config = require('../config');
var log    = require('../logger');

function loadControllers(app){
  utils.bootstrap(__dirname).forEach(load);
  
  function load(file){
    var ctrl   = require(path.join(__dirname, file));
    var isObj  = typeof ctrl === "object" && ctrl !== null;
    if(Array.isArray(ctrl)){
      log.debug("Loading Route (array) " + config.server.prefix + ctrl[0]);
      app.use(config.server.prefix + ctrl[0], ctrl[1]);
      
    }else if(isObj){
      log.debug("Loading Route (object) " + config.server.prefix + ctrl.path);
      app.use(config.server.prefix + ctrl.path, ctrl.controller);
    }else{
      log.debug("Loading Route " + config.server.prefix + '/');
      app.use(config.server.prefix, ctrl);
    }
  }
  return app;
}
module.exports = loadControllers;