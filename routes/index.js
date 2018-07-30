var express = require('express');
var router = express.Router();

// 모듈화
var template = require('../lib/template.js');

router.get('/', function (req, res) {
  var description = 'Hello Node.js';

  var html = template.HTML('index', `<div class="full_height_wrap">
      <div class="logo_container container">
        <section class="logo_section">
          <div class="logo_box">
            <h1 class="logo txt-c" title="TrackingPKG">
              <a href="" class="logo_link"><img src="image/logo.png" class="logo_image" /></a>
            </h1>
          </div>
        </section>
      </div>

      <div class="search_container container">
        <form id="searchForm" action="/tracking/result" method="post">
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
      </div>`);

  res.send(html);
});

module.exports = router;
