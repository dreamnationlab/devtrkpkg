var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');

// 모듈화
var template = require('./lib/template.js');
var path = require('path');
var sanitizeHtml = require('sanitize-html');

var reqTracking = require('./lib/requestTracking.js');

console.log('DevServer Start!');

var app = http.createServer(function(request,response){
    console.log('New visit');
    var _url = request.url
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;

    if(pathname === '/'){
      if(queryData.id === undefined){ 
        var title = 'welcome';
        var description = 'Hello Node.js';
        var html = template.HTML(title, `
          <form action="/tracking_process" method="post">
            <p><input type="text" name="trackingNum" placeholder="Tracking your package"></p>
            <p>
              <input type="submit">
            </p>
          </form>
          `);
        response.writeHead(200);
        response.end(html);
      }
    } else if(pathname === '/tracking_process'){
      //입력된 운송장번호 받는 부분
      var body = '';
      request.on('data', function(data){
        body += data;
      });
      request.on('end', function(){
        var post = qs.parse(body);

        //운송장번호
        var trackingNum = post.trackingNum;

        // 운송장 조회 함수 작업 필요
        reqTracking.USPS(trackingNum);
        //reqTracking.UPS(trackingNum);

        // redirection?
      });
      response.writeHead(200);
      response.end('ss');
    } else {
      response.writeHead(404);
      response.end('Not Found');
    }
});
app.listen(3000);
