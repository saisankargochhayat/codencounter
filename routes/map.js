var express = require('express');
var router = express.Router();
var Map = require('../models/map');
var User = require('../models/users');
var bcrypt = require('bcryptjs');
var mongoose = require('mongoose');
var Challenge = require('../models/challenges');

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
    var id = getRandomInt(minid, maxid);
    User.find({
      conquered: {
        $elemMatch: id
      }
    }, function(err, users) {
      if (err) {
        reject(err);
      }
      if (users.length > 0) {

      } else {
        resolve(id);
      }
    });
  });
  return promise;
}

/* GET users listing. */
router.get('/getmap', function(req, res, next) {
  Map.findOne({}, function(err, map) {
    if (err) {} else {
      res.send(map);
    }
  });
});

router.get('/createnewmap', function(req, res, next) {
  var map = new Map({
    _id: mongoose.Types.ObjectId(1),
    locations: new Array()
  });
  for (var i = 0; i < 596; i++) {
    map.locations[i] = {
      color: "#0000ff",
      level: 1,
      conquered: false,
      conqueredBy: {}
    }
  }
  map.save(function(err, map) {
    if (err) {} else {
      res.send(map.id)
    }
  });
});

router.get('/changeconquer', function(req, res, next) {
  var locationid = req.session.locationid;
  Map.findOne({}, function(err, map) {
    var possible = true;
    if (err) {} else {
      var obj = {};
      obj.id = locationid;
      obj.conquredby = {};
      //Change it
      obj.conquredby.id = req.session.newuser.id;
      obj.conquredby.color = req.session.newuser.color;
      obj.conquredby.name = req.session.newuser.name;
      var locationmark1 = 'locations.' + locationid + '.conquered';
      //locationmark1 = "'"+locationmark1+"'";
      var locationmark2 = 'locations.' + locationid + '.conqueredBy';
      ///////////////////////////////////////////////////////////
      var updating = {
        [locationmark1]: true,
        [locationmark2]: obj.conquredby
      };
      Map.update({
        _id: mongoose.Types.ObjectId(map._id)
      }, {
        $set: updating
      }, function(err, data) {
        if (err) {} else {
          Challenge.remove({
            _id: mongoose.Types.ObjectId(req.session.challengeid)
          }, function(err) {
            if (err) {
              res.send(err);
            } else {
              res.redirect('/users/updatescoreother/' + 100);
            }
          });
        }
      });
    }
  });
});

router.get('/addnewconquer/:locationid', function(req, res, next) {
  var locationid = req.params.locationid;
  Map.findOne({}, function(err, map) {
    var possible = true;
    if (err) {
      res.send(err);
    }
    if (possible) {
      var obj = {};
      obj.id = locationid;
      obj.conquredby = {};
      //Change it
      obj.conquredby.id = req.session.user.id;
      obj.conquredby.color = req.session.user.color;
      obj.conquredby.name = req.session.user.name;
      var locationmark1 = 'locations.' + locationid + '.conquered';
      //locationmark1 = "'"+locationmark1+"'";
      var locationmark2 = 'locations.' + locationid + '.conqueredBy';
      ///////////////////////////////////////////////////////////
      var updating = {
        [locationmark1]: true,
        [locationmark2]: obj.conquredby
      };
      Map.update({
        _id: mongoose.Types.ObjectId(map._id)
      }, {
        $set: updating
      }, function(err, data) {
        if (err) {
          res.send(err);
        } else {
          res.redirect('/users/updatescore/' + 50);
        }
      });
    } else {
      res.send("Location already conquered !");
    }
  });
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
        res.redirect('/users/signin');
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
        res.redirect('/users/signin');
      }
    }
  });
});

module.exports = router;
