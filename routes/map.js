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
  Map.findById(mongoose.Types.ObjectId(req.params.mapid),function(err,map){
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
    locations : new Array()
  });
  for(var i=0;i<596;i++){
    map.locations[i] = {
      color : "#0000ff",
      level : 1,
      conquered : false,
      conqueredBy : {}
    }
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
  console.log(locationid);
  Map.find({_id:mongoose.Types.ObjectId(req.params.mapid)},function(err,map){
    var possible = true;
    if(err){
      console.log(err);
    }
    if(possible){
      var obj = {};
      obj.id = locationid;
      obj.conquredby = {};
      //Change it
      obj.conquredby.id = 1;
      obj.conquredby.color = "#ff0000";
      obj.conquredby.name = "Rishi";
      var locationmark1 = 'locations.'+locationid+'.conquered';
      //locationmark1 = "'"+locationmark1+"'";
      console.log(locationmark1);
      var locationmark2 = 'locations.'+locationid+'.conqueredBy';
      ///////////////////////////////////////////////////////////
      var updating = {
        [locationmark1] : true,
        [locationmark2] : obj.conquredby
      };
      console.log(updating);
      Map.update({_id : mongoose.Types.ObjectId(req.params.mapid)},{$set :updating},function(err,data){
        if(err){
          console.log(err);
        }else{
          console.log(data);
          res.send("Done");
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
