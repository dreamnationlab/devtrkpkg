var express = require('express');
var app = express();
var sm = require('sitemap');
var bodyParser = require('body-parser');
var compression = require('compression');
var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
var path = require('path');
var sanitizeHtml = require('sanitize-html');
var favicon = require('serve-favicon');
// For security
var helmet = require('helmet');
// require routes
var indexRouter = require('./routes/index');
var trackingRouter = require('./routes/tracking');

// favicon
app.use(favicon(__dirname + '/public/image/favicon.png'));

// For security
app.use(helmet());
// compression
app.use(compression());

// static files
app.use(express.static('public'));
app.use('/node_modules', express.static(path.join(__dirname, '/node_modules')));

// body-parser
app.use(bodyParser.urlencoded({ extended: false }));

// file list
// app.get('*', function(req, res, next){
//   fs.readdir('./data', function(error, filelist){
//     req.list = filelist;
//     next();
//   });
// });

// use routes
app.use('/', indexRouter);
app.use('/tracking', trackingRouter);

// sitemap
var sitemap = sm.createSitemap ({
    hostname: 'http://www.trackingpkg.com',
    cacheTime: 600000,        // 600 sec - cache purge period
    urls: [
      { url: '/',                 changefreq: 'daily', priority: 0.7 },
      { url: '/tracking/result',  changefreq: 'always', priority: 0.3 }
    ]
  });
app.get('/sitemap.xml', function(req, res) {
  res.header('Content-Type', 'application/xml');
  res.send( sitemap.toString() );
});

// 404
app.use(function(req, res, next) {
  res.status(404).send('sorry cant find that!')
});

app.listen(3000, function () {
  console.log('TrackingPkg.com Engine Start!');
});
