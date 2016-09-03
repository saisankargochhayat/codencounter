var assert = require('assert');
var bcrypt = require('bcrypt');
var mongoose = require('mongoose');
SALT_WORK_FACTOR = 10;

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

  var quizSchema = mongoose.Schema({
    setno: Number,
    questions : Array
  });


module.exports = mongoose.model('Quiz', quizSchema);
