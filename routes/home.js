'use strict';

// routes/home.js

// HOME ROUTE
// =============================================================================
var express = require('express');
var Router  = express.Router();

Router.route('/')
.get(function(req, res){
  res.send({ message: 'Hello World!' });
});

module.exports = ['/', Router];