var path = require('path');
module.exports = function() {
  global.appRequire = function(name) {
    var file = path.join(__dirname, '../', name);
    return require(file);
  };
}();