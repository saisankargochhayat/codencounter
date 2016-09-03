var express = require('express');
var router = express.Router();

var User = require('../models/users');
var bcrypt = require('bcrypt');
var Map = require('../models/map');
var isauthenticated = function(req,res,next){
  if(req.session.user){
    next();
  }else {
    res.redirect('/');
  }
};
var minid =0;
var maxid = 595;
function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
var getrandomid = function(){
  var promise = new Promise(function(resolve,reject){
    Map.find({},function(err,map){
      if(err){
        console.log(err);
        reject(err);
      }else{
        var unconquered = [];
        for(var i=0;i<map.locations.length;i++){
          if(map.locations[i].conquered=false){
            unconquered.push(map.locations[i]);
            unconquered[i].id = i;
          }
        }
        var id = getRandomInt(0,unconquered.length);
        resolve(unconquered[id].id);
      }
    });
  });
  return promise;
}
/* GET users listing. */
router.post('/signUp', function(req, res, next) {
  console.log("Sign up called");
  var promise = getrandomid();
  promise.then(function(id){
    var newUser = new User({
      username:req.body.name,
      password:req.body.pass,
      color : req.body.color,
      conquered : new Array(),
      basearea : id
    });
    newUser.save(function (err, user) {
        var msg;
        if (err){
          console.log(err);
          res.status = 502;
          msg=err;
        }else{
          res.status = 200;
          req.session.user = {};
          req.session.user.id = user._id;
          req.session.user.name = user.name;
          req.session.user.color = user.color;
          res.redirect('/dashboard')
        }
        res.send(msg);
      });
  });
});
router.post('/signin',function(req,res,next){
  User.findOne({username:req.body.name},function(err,user){
    if(err){
      res.status=500;
      res.send(err);
    }else{
      if(user){
        console.log(user);
        bcrypt.compare(req.body.pass,user.password,function(err,result){
          if(err){
            res.status=500;
            res.send(err);
          }else{
            if(result){
              req.session.user = {};
              req.session.user.id = user._id;
              req.session.user.name = user.name;
              req.session.user.color = user.color;
              res.status=200;
              res.redirect('/dashboard')
            }else{
              res.send("Password doesn't match");
            }
          }
        });
      }else{
        res.status=200;
        res.send("Username doesnt exist");
      }
    }
  });
});

router.get('/signout',isauthenticated,function(req,res,next){
  delete req.session.user;
  res.status=200;
  res.redirect('/');
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
router.post('/getUsername',function(req,res,next){
  User.findById(req.session.user.id,function(err,user){
    if(err){
      res.status=500;
      res.send(err);
    }else{
      if(user){
        console.log(user);
        res.status=200;
        res.send(user.username);
      }else{
        res.redirect('/user/signin');
      }
    }
  });
});
module.exports = router;
