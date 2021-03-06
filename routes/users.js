var express = require('express');
var router = express.Router();
var User = require('../models/users');
var bcrypt = require('bcryptjs');
var Map = require('../models/map');
var mongoose = require('mongoose');

var isauthenticated = function(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    res.redirect('/');
  }
};

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

var getrandomid = function() {
  var promise = new Promise(function(resolve, reject) {
    Map.findOne({}, function(err, map) {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        var unconquered = [];
        for (var i = 0; i < map.locations.length; i++) {
          if (map.locations[i].conquered == false) {
            unconquered.push(map.locations[i]);
            unconquered[unconquered.length - 1].id = i;
          }
        }
        var id = getRandomInt(0, unconquered.length);
        resolve(unconquered[id].id);
      }
    });
  });
  return promise;
}

/* GET users listing. */
router.post('/signUp', function(req, res, next) {
  var promise = getrandomid();
  promise.then(function(id) {
    var newUser = new User({
      username: req.body.name,
      password: req.body.pass,
      color: '#' + req.body.color,
      conquered: new Array(),
      basearea: id,
      score: 100
    });
    newUser.conquered.push(id);
    newUser.save(function(err, user) {
      if (err) {
        res.status = 502;
        res.send(err);
      } else {
        req.session.user = {};
        req.session.user.id = user.id;
        req.session.user.name = user.username;
        req.session.user.color = user.color;
        res.redirect('/map/addnewconquer/' + user.basearea);
      }
    });
  });
});

router.post('/signin', function(req, res, next) {
  User.findOne({
    username: req.body.name
  }, function(err, user) {
    if (err) {
      res.status = 500;
      res.send(err);
    } else {
      if (user) {
        bcrypt.compare(req.body.pass, user.password, function(err, result) {
          if (err) {
            res.status = 500;
            res.send(err);
          } else {
            if (result) {
              req.session.user = {};
              req.session.user.id = user._id;
              req.session.user.name = user.username;
              req.session.user.color = user.color;
              res.status = 200;
              res.redirect('/dashboard')
            } else {
              res.send("Password doesn't match");
            }
          }
        });
      } else {
        res.status = 200;
        res.send("Username doesnt exist");
      }
    }
  });
});

router.get('/signout', isauthenticated, function(req, res, next) {
  delete req.session.user;
  res.status = 200;
  res.redirect('/');
});

router.get('/getconqueredlocations', function(req, res, next) {
  User.findById(req.session.user.id, function(err, user) {
    if (err) {
      res.status = 500;
      res.send(err);
    } else {
      if (user) {
        res.status = 200;
        res.send(user.conquered);
      } else {
        res.redirect('/user/signin');
      }
    }
  });
});

router.get('/getbasearea', function(req, res, next) {
  User.findById(req.session.user.id, function(err, user) {
    if (err) {
      res.status = 500;
      res.send(err);
    } else {
      if (user) {
        res.status = 200;
        res.send(user.baseArea);
      } else {
        res.redirect('/user/signin');
      }
    }
  });
});

router.post('/getUsername', function(req, res, next) {
  User.findById(req.session.user.id, function(err, user) {
    if (err) {
      res.status = 500;
      res.send(err);
    } else {
      if (user) {
        res.status = 200;
        res.send(user.username);
      } else {
        res.redirect('/user/signin');
      }
    }
  });
});

router.get('/updatescore/:scorechange', function(req, res, next) {
  User.update({
    _id: mongoose.Types.ObjectId(req.session.user.id)
  }, {
    $inc: {
      score: req.params.scorechange
    }
  }, function(err, data) {
    if (err) {
      res.send(err);
    } else {
      res.redirect('/dashboard?msg=' + "You just received " + req.params.scorechange + " Bounty Gold");
    }
  })
});

router.get('/updatescoreother/:scorechange', function(req, res, next) {
  User.update({
    _id: mongoose.Types.ObjectId(req.session.newuser.id)
  }, {
    $inc: {
      score: req.params.scorechange
    }
  }, function(err, data) {
    if (err) {
      res.send(err);
    } else {
      res.redirect('/dashboard?msg=' + "You were not able to defend your region");
    }
  })
});

router.get('/getrank', function(req, res, next) {
  User.find().sort({
    "score": -1
  }).exec(function(err, users) {
    if (err) {
      res.send(err);
    } else {
      var rank = 1;
      for (var i = 0; i < users.length; i++) {
        if (users[i]._id == req.session.user.id) {
          break;
        } else {
          rank++;
        }
      }
      res.status = 200;
      res.send({
        rank: rank
      });
    }
  });
});

router.get('/leaderboards', function(req, res, next) {
  User.find().limit(10).sort({
    "score": -1
  }).exec(function(err, users) {
    if (err) {
      res.send(err);
    } else {
      res.send(users);
    }
  });
});

module.exports = router;
