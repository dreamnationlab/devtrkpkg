var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var compression = require('compression');
var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
var path = require('path');
var sanitizeHtml = require('sanitize-html');

// For security
var helmet = require('helmet');
app.use(helmet());
// compression
app.use(compression());
// require routes
var indexRouter = require('./routes/index');
var processRouter = require('./routes/process');
// static files
app.use(express.static('public'));
// body-parser
app.use(bodyParser.urlencoded({ extended: false }));
// file list
app.get('*', function(req, res, next){
  fs.readdir('./data', function(error, filelist){
    req.list = filelist;
    next();
  });
});

// use routes
app.use('/', indexRouter);
app.use('/process', processRouter);


// 404
app.use(function(req, res, next) {
  res.status(404).send('sorry cant find that!')
});

app.listen(3000, function () {
  console.log('TrackingPkg.com Engine Start!');
});
