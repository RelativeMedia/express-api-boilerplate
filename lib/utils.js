'use strict';

// utils.js

// UTILITIES
// =============================================================================
var _    = require('lodash');
var fs   = require('fs');
var glob = require('glob');
var path = require('path');

function isNotIndexFile(file) {
  return path.basename(file).toLowerCase() !== "index.js";
}
function isJsFile(file) {
  return path.extname(file).toLowerCase() === ".js";
}
module.exports = {
  _: _,
  isJsFile: isJsFile,
  isNotIndexFile: isNotIndexFile,
  bootstrap: function(dir){
    var files = fs
      .readdirSync(dir)
      .filter(isJsFile)
      .filter(isNotIndexFile);
    return files
  },
  getGlobbedFiles: function(globPatterns, removeRoot) {
  	// For context switching
  	var _this = this;

  	// URL paths regex
  	var urlRegex = new RegExp('^(?:[a-z]+:)?\/\/', 'i');

  	// The output array
  	var output = [];

  	// If glob pattern is array so we use each pattern in a recursive way, otherwise we use glob
  	if (_.isArray(globPatterns)) {

  		globPatterns.forEach(function(globPattern) {
  			output = _.union(output, _this.getGlobbedFiles(globPattern, removeRoot));
  		});
  	} else if (_.isString(globPatterns)) {
  		if (urlRegex.test(globPatterns)) {
  			output.push(globPatterns);
  		} else {
  			glob(globPatterns, {
  				sync: true
  			}, function(err, files) {
  				if (removeRoot) {
  					files = files.map(function(file) {
  						return file.replace(removeRoot, '');
  					});
  				}

  				output = _.union(output, files);
  			});
  		}
  	}

  	return output;
  }
};