'use strict';

// config/index.js

// BOOTSTRAP & AUTOLOAD CONFIGS
// =============================================================================
var fs          = require('fs');
var config      = {};
var localConfig = {};
var utils       = appRequire('lib/utils');

fs.readdirSync(__dirname)
  .filter(function(file){
    return( (file.indexOf('.') !== 0) && (file !=='index.js') && (file.slice(-3) === '.js'));
  })
  .forEach(function(file){
    var name = file.substr(0, file.indexOf('.'));
    config[name] = require('./' + name);
  });
  
fs.readdirSync(__dirname + '/local')
  .filter(function(file){
    return( (file.indexOf('.') !== 0) && (file !=='index.js') && (file.slice(-3) === '.js'));
  })
  .forEach(function(file){
    var name = file.substr(0, file.indexOf('.'));
    localConfig[name] = require('./local/' + name);
  });  

utils._.merge(config, localConfig);
module.exports = config;