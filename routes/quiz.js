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
  var no;
  Quiz.find().count(function(err,count){
    if (err) console.log(err);
    else{
      console.log(count);
      no = count+1;
      var quiz = new Quiz({setno: no, questions:[{ques:req.body.ques1,option1:req.body.option1,option2:req.body.option2,option3:req.body.option3,option4:req.body.option4,correct:req.body.correct1},{ques:req.body.ques2,option1:req.body.option5,option2:req.body.option6,option3:req.body.option7,option4:req.body.option8,correct:req.body.correct2},{ques:req.body.ques3,option1:req.body.option9,option2:req.body.option10,option3:req.body.option11,option4:req.body.option12,correct:req.body.correct3},{ques:req.body.ques4,option1:req.body.option13,option2:req.body.option14,option3:req.body.option15,option4:req.body.option16,correct:req.body.correct4},{ques:req.body.ques5,option1:req.body.option17,option2:req.body.option18,option3:req.body.option19,option4:req.body.option20,correct:req.body.correct5}]});
      quiz.save(function(err,quiz){
        if(err){
          console.log(err);
        }else{
          res.send(quiz);
        }
      });
    }
  });
});

// router.post('/:quizid/addquestion',function(req,res,next){
//   console.log(req.body);
//   var body = JSON.parse(req.body);
//   console.log(body);
//   Quiz.find({_id : mongoose.Types.ObjectId(req.params.quizid)},function(err,quiz){
//     if(err){
//       console.log(err);
//     }else{
//       console.log("Trying");
//       var question = {
//         description : body.description,
//         options : body.options,
//         answer : body.answer
//       };
//       console.log(question);
//       Quiz.update({_id : mongoose.Types.ObjectId(req.params.quizid)},{$addToSet:{"questions" : question}},function(err){
//         if(err){
//           console.log(err);
//         }else{
//           res.send("Done");
//         }
//       });
//     }
//   });
// });

router.get('/getquiz', function(req,res,next){
  var set = Math.floor(Math.random() * 5) + 1;
  req.session.set_no = set;
  Quiz.findOne({setno: set}, function(err,quiz){
    if (err) console.log(err);
    else res.send(quiz);
  });
});

router.post('/evaluatequiz', function(req,res,next){
  Quiz.findOne({setno:req.session.set_no},function(err,quiz){
      var ctr=0;
      if(quiz.questions[0].correct == req.body.correct1){
        ctr++;
      }
      if(quiz.questions[1].correct == req.body.correct2){
        ctr++;
      }
      if(quiz.questions[2].correct == req.body.correct3){
        ctr++;
      }
      if(quiz.questions[3].correct == req.body.correct4){
        ctr++;
      }
      if(quiz.questions[4].correct == req.body.correct5){
        ctr++;
      }
      req.session.score = ctr;
  });
});

module.exports = router;
