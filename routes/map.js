var express = require('express');
var router = express.Router();
var Map = require('../models/map');
var User = require('../models/users');
var bcrypt = require('bcrypt');
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
router.get('/:mapid/getmap',isauthenticated,function(req,res,next){
  Map.find({_id :req.params.mapid},function(err,map){
    if(err){
      console.log(err);
    }else{
      return map;
    }
  });
});
router.post('/:mapid/addnewconquer',function(req,res,next){
  var locationid = req.body.locationid;
  Map.find({_id:req.params.mapid},function(err,map){
    var possible = true;
    for(var i=0;i<map.conquered.length;i++){
      if(map.conquered[i].id === req.body.locationid){
        possible=false;break;
      }
    }
    if(possible){
      var obj = {};
      obj.id = locationid;
      obj.conquredby = req.session.id;

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
