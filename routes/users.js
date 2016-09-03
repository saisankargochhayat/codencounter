var express = require('express');
var router = express.Router();

var User = require('../models/users');
var bcrypt = require('bcrypt');
var isauthenticated = function(req,res,next){
  if(req.session.user){
    next();
  }else {
    res.redirect('/');
  }
};
var minid =1;
var maxid = 100;
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
router.post('/signUp', function(req, res, next) {
  console.log("Sign up called");
  var newUser = new User({username:req.body.name , password:req.body.pass});
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
        res.redirect('/dashboard')
      }
      res.send(msg);
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
router.post('/')
module.exports = router;
