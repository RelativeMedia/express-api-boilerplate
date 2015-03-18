'use strict';

// config/auth.js

// AUTH CONFIGURATION
// =============================================================================
var authConfigs = {
  minPasswordLength: 6,
  saltWorkFactor: 8,
  token: {
    secret: 'ApplesAnd0ranges',
    expiresInMinutes: 60
  }
};  

module.exports = authConfigs;