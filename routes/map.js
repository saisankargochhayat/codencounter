var express = require('express');
var router = express.Router();
var Map = require('../models/map');
var User = require('../models/users');
var bcrypt = require('bcrypt');
var mongoose = require('mongoose');
var isauthenticated = function(req,res,next){
  if(req.session.user){
    next();
  }else {
    res.redirect('/');
  }
};
function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
var getrandomid = function(){
  var promise = new Promise(function(resolve,reject){
    var id = getRandomInt(minid,maxid);
    User.find({conquered:{$elemMatch : id}},function(err,users){
      if(err){
        reject(err);
      }
      if(users.length>0){

      }else{
        resolve(id);
      }
    });
  });
  return promise;
}
/* GET users listing. */
router.get('/:mapid/getmap',function(req,res,next){
  Map.find({_id :mongoose.Types.ObjectId(req.params.mapid)},function(err,map){
    if(err){
      console.log(err);
    }else{
      res.send(map);
    }
  });
});
router.get('/createnewmap',function(req,res,next){
  var map = new Map({
    _id : mongoose.Types.ObjectId(1),
    conquered : [],
    unconquered : []
  });
  for(var i=0;i<100;i++){
    map.unconquered.push(i);
  }
  map.save(function(err,map){
    if(err){
      console.log(err);
    }else{
      res.send(map.id)
    }
  });
});
router.get('/:mapid/addnewconquer/:locationid',function(req,res,next){
  var locationid = req.params.locationid;
  Map.find({_id:mongoose.Types.ObjectId(req.params.mapid)},function(err,map){
    var possible = true;
    console.log(map);
    var length=0;
    if(map.conquered){
      length = map.conquered.length;
    }
    for(var i=0;i<length;i++){
      if(map.conquered[i].id === req.body.locationid){
        possible=false;break;
      }
    }
    if(possible){
      var obj = {};
      obj.id = locationid;
      obj.conquredby = {};
      //Change it
      obj.conquredby.id = 1;
      obj.conquredby.color = "Red";
      obj.conquredby.name = "Rishi";

      ///////////////////////////////////////////////////////////
      Map.update({_id : mongoose.Types.ObjectId(req.params.mapid)},{$addToSet : {"conquered" : obj}},function(err){
        if(err){
          console.log(err);
        }else{
          Map.update({_id : mongoose.Types.ObjectId(req.params.mapid)} , {$pull : {"unconquered" : locationid}},function(err){
            if(err){
              console.log(err);
            }else{
              //Update user collection here.
            }
          })
        }
      });
    }else{
      res.send("Location already conquered !");
    }
  });
});
router.get('/getconqueredlocations',function(req,res,next){
  User.findById(req.session.user.id,function(err,user){
    if(err){
      res.status=500;
      res.send(err);
    }else{
      if(user){
        console.log(user);
        res.status=200;
        res.send(user.conquered);
      }else{
        res.redirect('/user/signin');
      }
    }
  });
});
router.get('/getbasearea',function(req,res,next){
  User.findById(req.session.user.id,function(err,user){
    if(err){
      res.status=500;
      res.send(err);
    }else{
      if(user){
        console.log(user);
        res.status=200;
        res.send(user.baseArea);
      }else{
        res.redirect('/user/signin');
      }
    }
  });
});
router.post('/')
module.exports = router;
