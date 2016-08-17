var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');


var ueditor = require("ueditor");

var home = require('./app/routes/index');
var admin = require('./app/routes/admin');

var mongoose = require('mongoose');
var mongoStore = require('connect-mongo')(session);
var dbUrl = 'mongodb://localhost/cdkls';
mongoose.connect(dbUrl);

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'app/views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  secret: 'tenney',
  store: new mongoStore({
    url: dbUrl,
    collection: 'sessions'
  })
}));
app.use(express.static(path.join(__dirname, 'public')));



app.use("/libs/ueditor/ue", ueditor(path.join(__dirname, 'public'), function(req, res, next) {  
    // ueditor 客户发起上传图片请求  
    if(req.query.action === 'uploadimage'){  
        var foo = req.ueditor;  
        var date = new Date();  
        var imgname = req.ueditor.filename;  
  
        var img_url = '/upload/ueditor/';  
        res.ue_up(img_url); //你只要输入要保存的地址 。保存操作交给ueditor来做  
    }  
    //  客户端发起图片列表请求  
    else if (req.query.action === 'listimage'){  
        var dir_url = '/upload/ueditor/';
        res.ue_list(dir_url);  // 客户端会列出 dir_url 目录下的所有图片  
    }  
    // 客户端发起其它请求  
    else {
        res.setHeader('Content-Type', 'application/json');  
        res.redirect('/libs/ueditor/nodejs/config.json');
    }
}));

app.use('/', home);
app.use('/admin', admin);

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
