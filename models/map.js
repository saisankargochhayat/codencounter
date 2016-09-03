var assert = require('assert');
var bcrypt = require('bcrypt');
var mongoose = require('mongoose');
SALT_WORK_FACTOR = 10;

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

  var mapSchema = mongoose.Schema({
    unconquered : Array,
    conquered : Array
  });


module.exports = mongoose.model('Map', mapSchema);
