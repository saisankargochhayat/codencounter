var express = require('express');
var router = express.Router();
var Map = require('../models/map');
var User = require('../models/users');
var bcrypt = require('bcrypt');
var mongoose = require('mongoose');
var Challenge = require('../models/challenges');
var path = require('path');
var isauthenticated = function(req,res,next){
  if(req.session.user){
    next();
  }else {
    res.redirect('/');
  }
};
/* GET users listing. */
router.get('/trynewchallenge/:locationid',function(req,res,next){
  var locationid = req.params.locationid;
  Map.findOne({},function(err,map){
    if(err){
      console.log(err);
      res.send(err);
    }else{
      console.log(map.locations[locationid]);
      if( map.locations[locationid].conquered){
        req.session.challenge = {};
        req.session.challenge.locationid = locationid;
        req.session.challenge.challenger = {
          id : req.session.user.id,
          name : req.session.user.name
        };
        req.session.challenge.challengedto = {
          id : map.locations[locationid].conqueredBy.id,
          name : map.locations[locationid].conqueredBy.name
        };
        console.log(req.session.challenge);
        res.sendFile(path.resolve(__dirname+'/../public/quiz.html'));
      }else{
        res.send("This place is not conquered by anyone yet.");
      }
    }
  });
});
router.get('/addnewchallenge',function(req,res,next){
  var newchallenge = new Challenge({
    locationid : req.session.challenge.locationid,
    challenger : {
      id : req.session.challenge.challenger.id,
      name : req.session.challenge.challenger.name
    },
    challengedto : {
      id : req.session.challenge.challengedto.id,
      name : req.session.challenge.challengedto.name
    },
    score : req.session.score
  });
  console.log(newchallenge);
  newchallenge.save(function(err,challenge){
    if(err){
      console.log(err);
      res.send(err);
    }else{
      console.log(challenge);
      res.send("Challenge added");
    }
  })
});
router.post('/getchallenges',function(req,res,next){
  Challenge.find({challengedto :{id : req.session.user.id}},function(err,challenges){
    if(err){
      console.log(err);
      res.send(err);
    }else{
      console.log(challenges);
      res.send(challenges);
    }
  });
});
router.get('/acceptchallenge/:challengeid',function(req,res,next){
  var id = req.params.challengeid;
  Challenge.findById(mongoose.Types.ObjectId(id),function(err,challenge){
    if(err){
      console.log(err);
      res.send(err);
    }else{
      console.log(challenge);
      req.session.acceptchallenge = {};
      req.session.acceptchallenge.id = challenge._id;
      res.sendFile(path.resolve(__dirname+'/../public/quiz.html'));
    }
  });
});
router.post('/completechallenge',function(req,res,next){
  var id = req.session.acceptchallenge.id;
  var score = req.body.score;
  Challenge.findById(mongoose.Type.ObjectId(id),function(err,challenge){
    if(err){
      console.log(err);
      res.send(err);
    }else{
      console.log(challenge);
      if(challenge.score>=score){
        //New route to update map
      }else{
        //Increase score of current user
      }
    }
  });
});
router.get('/tryunconquredarea/:locationid',function(req,res,next){
  var locationid = req.params.locationid;
  Map.findOne({},function(err,map){
    if(err){
      console.log(err);
      res.send(err);
    }else{
      if(map.locations[locationid].conquered){
        res.send("This place is conquered");
      }else{
        req.session.unconquered = {};
        req.session.unconquered.locationid = locationid;
        res.sendFile(path.resolve(__dirname+'/../public/quiz.html'));
        //Redirect it
      }
    }
  });
});
router.get('/getunconqueredarea',function(req,res,next){
  var locationid = req.session.unconquered.locationid;
  if(req.session.score >3){
    Map.findOne({},function(err,map){
      if(err){
        console.log(err);
        res.send(err);
      }else{
        console.log(map.locations[locationid]);
        res.redirect('/map/addnewconquer/'+locationid);
      }
    });
  }else{
    res.send("Too bad ! You did not do well !");
  }
});
module.exports = router;
