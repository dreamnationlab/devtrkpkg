var express = require('express');
var router = express.Router();

// 모듈화
var template = require('../lib/template.js');

router.get('/', function (req, res) {
  //var description = 'Hello Node.js';

  var html = template.HTML('index', `<div class="full_height_wrap">
      <div class="logo_container container">
        <section class="logo_section">
          <div class="logo_box">
            <h1 class="logo txt-c" title="TrackingPKG">
              <a href="" class="logo_link"><img src="/image/logo.png" class="logo_image" /></a>
            </h1>
          </div>
        </section>
      </div>

      <div class="search_container container">
        <form id="searchForm" action="/tracking/result" method="post" onsubmit="return checkSearch();">
          <input type="hidden" id="trackingNums" name="trackingNums" value="" />
          <section class="search_section row">
            <div class="search_box col-sm-10">
              <div class="search_values">
                <ul class="number_list">
                  <!-- 30개 제한 // 영어,숫자만(30) // 대문자변환 -->
                  <li><span class="numbering">1.</span><span class="tracking_num"><input type="text" class="" id="" name="trackingNum1" value="" maxlength="30" placeholder="ENTER TRACKING NUMBERS" onkeyup="addNum(this);"/></span><span class="del"><button type="button" onclick="deleteNum(this);">X</button></span></li>
                </ul>
              </div>
            </div>
            <div class="button_box col-sm-2">
              <button class="btn" type="submit">Search</button>
            </div>
          </section>
        </form>
      </div>

      <div class="description_container container">
        <section class="description_section">
          <p class="description">
            Now you can Track pakages for all shipments. For now we provide USPS<sup>®</sup> UPS<sup>®</sup>
            DHL<sup>®</sup> FedEx<sup>®</sup> tracking services. We're gonna provide more than now soon.
            If you have any inconvenience or opinion, let us know by email down below.<br>
            TrackingPKG<sup>®</sup> Universal package tracking service.
          </p>
        </section>

        <section class="carrier_section">
          <div class="carrier_box">
            <h2 class="title txt-c" title="Supported Carriers">
              <img src="/image/carrier_tit.png" class="carriers_image" alt="Supported Carriers" /></a>
            </h2>
            <ul>
              <li><img src="/image/package_big_ups.png" alt="UPS" /></li><!--
              --><li><img src="/image/package_big_fedex.png" alt="FedEx" /></li><!--
              --><li><img src="/image/package_big_dhl.png" alt="DHL" /></li><!--
              --><li><img src="/image/package_big_usps.png" alt="USPS" /></li>
            </ul>
          </div>
        </section>
      </div>

      `);

  res.send(html);
});

module.exports = router;
