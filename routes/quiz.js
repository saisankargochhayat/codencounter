var express = require('express');
var router = express.Router();




var Quiz = require('../models/quiz');
var bcrypt = require('bcrypt');
var mongoose = require('mongoose');
var isauthenticated = function(req,res,next){
  if(req.session.user){
    next();
  }else {
    res.redirect('/');
  }
};
router.post('/addquiz',function(req,res,next){
  var quiz = new Quiz();
  quiz.save(function(err,quiz){
    if(err){
      console.log(err);
    }else{
      res.send(quiz);
    }
  });
});
router.post('/:quizid/addquestion',function(req,res,next){
  console.log(req.body);
  var body = JSON.parse(req.body);
  console.log(body);
  Quiz.find({_id : mongoose.Types.ObjectId(req.params.quizid)},function(err,quiz){
    if(err){
      console.log(err);
    }else{
      console.log("Trying");
      var question = {
        description : body.description,
        options : body.options,
        answer : body.answer
      };
      console.log(question);
      Quiz.update({_id : mongoose.Types.ObjectId(req.params.quizid)},{$addToSet:{"questions" : question}},function(err){
        if(err){
          console.log(err);
        }else{
          res.send("Done");
        }
      });
    }
  });
});
module.exports = router;
