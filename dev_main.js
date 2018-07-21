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
        var dirname = __dirname;
        console.log(dirname);

        var html = template.HTML(title, 'index', `<div class="full_height_wrap">
            <div class="logo_container container">
              <section class="logo_section">
                <div class="logo_box">
                  <h1 class="logo txt-c" title="TrackingPKG">
                    <a href="" class="logo_link"><img src="${dirname}/image/logo.png" class="logo_image" /></a>
                  </h1>
                </div>
              </section>
            </div>

            <div class="search_container container">
              <form id="searchForm" method="post">
                <section class="search_section row">
                  <div class="search_box col-sm-10">
                    <div class="search_values">
                      <ul class="number_list">
                        <li><span class="numbering">1.</span><span class="tracking_num"><input type="text" class="" id="" name="trackingNum" value="9361289681090397739347" placeholder="Enter your Tranking Numbers" readonly /></span><span class="del"><button type="button" onclick="deleteNum(this);">X</button></span></li>
                        <!--<li><span class="numbering">2.</span><span class="tracking_num"><input type="text" class="" id="" name="" value="9361289681090397739347" placeholder="Enter your Tranking Numbers" readonly /></span><span class="del"><button type="button" onclick="deleteNum(this);">X</button></span></li>
                        <li><span class="numbering">3.</span><span class="tracking_num"><input type="text" class="" id="" name="" value="9361289681090397739347" placeholder="Enter your Tranking Numbers" readonly /></span><span class="del"><button type="button" onclick="deleteNum(this);">X</button></span></li>
                        <li><span class="numbering">4.</span><span class="tracking_num"><input type="text" class="" id="" name="" value="9361289681090397739347" placeholder="Enter your Tranking Numbers" readonly /></span><span class="del"><button type="button" onclick="deleteNum(this);">X</button></span></li>
                        <li><span class="numbering">5.</span><span class="tracking_num"><input type="text" class="" id="" name="" value="9361289681090397739347" placeholder="Enter your Tranking Numbers" readonly /></span><span class="del"><button type="button" onclick="deleteNum(this);">X</button></span></li>
                        <li><span class="numbering">6.</span><span class="tracking_num"><input type="text" class="" id="" name="" value="" placeholder="Enter your Tranking Numbers" /></span><span class="del"><button type="button" onclick="deleteNum(this);">X</button></span></li>-->
                      </ul>
                    </div>
                  </div>
                  <div class="button_box col-sm-2">
                    <button class="btn" type="button" onclick="location.href='result.html'">Search</button>
                  </div>
                </section>
              </form>
            </div>

            <div class="description_container container">
              <section class="description_section">
                <p class="description">
                  Now you can preview images* of your mail and manage your incoming packages on
      one dashboard without entering tracking numbers. From the Informed Delivery ®
      dashboard you can also sign up for text or email notifications, schedule delivery ale
      rts, request redelivery, enter USPS Delivery Instructions™, and more.
                </p>
              </section>
            </div>
        </div>
          `);

        // var html = template.HTML(title, `
        //   <form action="/tracking_process" method="post">
        //     <p><input type="text" name="trackingNum" placeholder="Tracking your package"></p>
        //     <p>
        //       <input type="submit">
        //     </p>
        //   </form>
        //   `);
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
        //reqTracking.USPS(trackingNum);
        //reqTracking.UPS(trackingNum);
        reqTracking.FEDEX(trackingNum);

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
