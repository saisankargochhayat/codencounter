var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/codencounter');

var routes = require('./routes/index');
var users = require('./routes/users');
var maps = require('./routes/map');
var quiz = require('./routes/quiz')
var session = require('express-session');
var app = express();
var fs = require('fs');
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
var isauthenticated = function(req,res,next){
  if(req.session.user){
    next();
  }else {
    res.redirect('/');
  }
};
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'king_in_the_north'
}))
app.use('/', routes);
app.use('/users', users);

app.use('/test',function(req,res,next){
  //var json = $.getJSON('/public/viz/in',function(json){
    //var fs = require('fs');
    var obj;
    fs.readFile('public/viz/indiaTopoJSON.json', 'utf8', function (err, data) {
      if (err) throw err;
      obj = JSON.parse(data);
      //console.log(obj);
      var c=0;
      for (var i=0;i<obj.objects.asasas.geometries.length;i++)
      { c++;
        delete obj.objects.asasas.geometries[i].properties.POPUNDER6;
        delete obj.objects.asasas.geometries[i].properties.POP_ILLITERATE;
        delete obj.objects.asasas.geometries[i].properties.POP_ST;
        delete obj.objects.asasas.geometries[i].properties.TOTAL_POPU;
        delete obj.objects.asasas.geometries[i].properties.STDTCODE;
        delete obj.objects.asasas.geometries[i].properties.POP_ST;
        delete obj.objects.asasas.geometries[i].properties.STATE_NAME;
        delete obj.objects.asasas.geometries[i].properties.HH_SIZE;
        delete obj.objects.asasas.geometries[i].properties.GENDER_GAP;
        delete obj.objects.asasas.geometries[i].properties.SEXRATIO;
        delete obj.objects.asasas.geometries[i].properties.DISTRICT_C;
        delete obj.objects.asasas.geometries[i].properties.STATE_NAME;
        delete obj.objects.asasas.geometries[i].properties.MAH_ph3;
        delete obj.objects.asasas.geometries[i].properties.MALE_LIT_PERCENT;
        delete obj.objects.asasas.geometries[i].properties.STDTCODE_1;
        delete obj.objects.asasas.geometries[i].properties.SEXRATIO_06;
        delete obj.objects.asasas.geometries[i].properties.SEXRATIO_SC;
        delete obj.objects.asasas.geometries[i].properties.POP_LITERATE;
        delete obj.objects.asasas.geometries[i].properties.SEXRATIO_ST;
        delete obj.objects.asasas.geometries[i].properties.TOTALMALE;
        delete obj.objects.asasas.geometries[i].properties.NAME;
        delete obj.objects.asasas.geometries[i].properties.FEMALE_LIT_PERCENT;
        delete obj.objects.asasas.geometries[i].properties.TOTALFEMALE;
        delete obj.objects.asasas.geometries[i].properties.SC_PERCENT;
        delete obj.objects.asasas.geometries[i].properties.ST_PERCENT;
        delete obj.objects.asasas.geometries[i].properties.STATE_CODE;
        obj.objects.asasas.geometries[i].properties.id=i;



      }
      console.log(c);
      fs.writeFile('public/viz/data.json', JSON.stringify(obj) , 'utf-8',function(){
        console.log("done");
      });
    });





});

app.use('/map',maps);
app.use('/quiz',quiz);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
