var express = require('express');
var router = express.Router();
var User = require('./users');
var path=require('path');
var isauthenticated = function(req,res,next){
  if(req.session.user){
    next();
  }else {
    res.redirect('/');
  }
};
/* GET home page. */

router.get('/dashboard',isauthenticated,function(req,res,next){
  if(req.session.user){
    res.sendFile(path.resolve(__dirname+'/../public/dashboard.html'));
  }else{
    res.redirect('/');
  }
});
router.get('/', function(req, res, next) {
  res.sendFile(__dirname+'../public/index.html');
});
module.exports = router;
