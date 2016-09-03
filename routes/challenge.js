var express = require('express');
var router = express.Router();
var Map = require('../models/map');
var User = require('../models/users');
var bcrypt = require('bcrypt');
var mongoose = require('mongoose');
var Challenge = require('../models/challenges');
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
      if( map.locations[locationid].conqured){
        req.session.challenge = {};
        req.session.challenge = locationid;
        req.session.challenger = {
          id : req.session.user.id,
          name : req.session.user.name
        };
        req.session.challengedto = {
          id : map.locations[locationid].conquredby.id,
          name : map.locations[locationid].conquredby.name
        };
        res.send("Done");
      }else{
        res.send("This place is not conquered by anyone yet.");
      }
    }
  });
});
router.post('/addnewchallenge',function(req,res,next){
  console.log(req.body);
  var newchallenge = new Challenge({
    locationid : req.session.challenge.locationid,
    challenger : req.session.challenge.challenger,
    challengedto : req.session.challenge.challengedto,
    score : req.body.score
  });
  newchallenge.save(function(err,challenge){
    if(err){
      console.log(err);
      res.send(err);
    }else{
      console.log(challenge);
      res.send("Challenged added");
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
      res.send("Done");
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
        res.send("Done");
        //Redirect it
      }
    }
  });
});
router.post('/getunconqueredarea',function(req,res,next){
  var locationid = req.session.unconquered.locationid;
  if(req.body.score >3){
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
