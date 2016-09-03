var assert = require('assert');
var bcrypt = require('bcrypt');
var mongoose = require('mongoose');
SALT_WORK_FACTOR = 10;

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

  var challengeSchema = mongoose.Schema({
    locationid: {type:Number, required:true},
    challenger : {
      id : {type:String,required:true},
      name : {type:String,required:true}
    },
    challengedto : {
      id : {type:String,required:true},
      name : {type:String,required:true}
    },
    score : {type:Number,required:true}
  });

module.exports = mongoose.model('Challenges', challengeSchema);
