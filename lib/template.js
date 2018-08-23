module.exports = {
  HTML:function(page, body){
    return `
    <!doctype html>
    <html lang=en>
    <head>
      <meta charset=utf-8>
      <meta http-equiv=x-ua-compatible content="ie=edge">
      <title>TrackingPKG :: Universal package tracking service</title>
      <meta name=description content="TrackingPKG is the most powerful and inclusive universal package tracking service. It enables to track postal carriers for registered mail, parcel, EMS and multiple express couriers such as DHL, Fedex, UPS, USPS. Just put the waybill number.">
      <meta name="keywords" content="parcel, EMS, postal, tracking, track, shipment, DHL, DHL Worldwide Express, UPS, united parcel service, FedEx, Federal Express, usps, united states postal service">
      <meta name=viewport content="width=device-width, initial-scale=1">
      <meta property="og:url" content="http://www.trackingpkg.com/">
      <meta property="og:title" content="TrackingPKG :: Universal package tracking service">
      <meta property="og:description" content="TrackingPKG is the most powerful and inclusive universal package tracking service. It enables to track postal carriers for registered mail, parcel, EMS and multiple express couriers such as DHL, Fedex, UPS, USPS. Just put the waybill number.">
      <meta property="og:site_name" content="TrackingPKG :: Universal package tracking service">
      <meta property="og:image" content="/image/logo.png">      
      <meta property="og:type" content=website>
      <meta name="twitter:card" content=summary>
      <meta name="twitter:site" content="@TrackingPKG">
      <meta name="twitter:creator" content="@TrackingPKG">
      <link rel=preconnect href="https://digitalocean.cdn.prismic.io">
      <link rel=preconnect href="https://hello.myfonts.net">
      <link rel=canonical href="http://www.trackingpkg.com">
      <link rel=manifest href="/manifest.webmanifest">
      <link rel=apple-touch-icon href="/apple-touch-icon.png">
      <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.2/css/bootstrap.min.css">
      <link href="/css/common.css" rel=stylesheet />
      <script type="text/javascript" src="/node_modules/jquery/dist/jquery.slim.js"></script>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.3/umd/popper.min.js"></script>
      <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.1.2/js/bootstrap.min.js"></script>
    </head>
    <body class=${page}>
      ${body}
      <div class="footer">
        <div class="footer_wrap">
          <span class="company_logo"><img src="/image/company_logo.png" alt="Dreamnation" width="145px" height="19px" /></span>
          <span class="contact">
            <span class="copy">ⓒ 2018 Tracking PKG</span>
            <span class="email"> | dreamnation.co.kr@gmail.com | </span>
          </span>
          <span class="socials">
            <ul class="social_list">
              <li><a id="facebook_icon" href="" onclick=""></a></li>
              <li><a id="twitter_icon" href="" onclick=""></a></li>
              <li><a id="google_icon" href="" onclick=""></a></li>
              <li><a id="mail_icon" href="" onclick=""></a></li>
            </ul>
          </span>
        </div>
      </div>
      <div id="load" style="display:none;">
      <img src="/image/loading_w.gif" alt="loading" />
      </div>

    <!-- Go to www.addthis.com/dashboard to customize your tools -->
    <script type="text/javascript" src="//s7.addthis.com/js/300/addthis_widget.js#pubid=ra-5a298314d4a3d294"></script>

    </body>
    <script src="/js/common.js" type="text/javascript"></script>
    </html>`;
  },
  trackingCardsToHTML(data , callback){
    var data = data.data;
    let html = "";
    var copySummary = "";
    for (var i=0; i<data.length; i++) {
      if (data[i].success === 'true') {
        //검색 결과가 있을경우
        let overtime = 0;
        let copySummary = "Number:" + data[i].tracking_num + "<br>Package status: " + data[i].summary.status + " (" + overtime + " days)<br><br>";
        html += `<div class="card">
          <div class="card-header">
            <div class="trk_top">
              <h2 class="trk_title_number">
                <span class="title">Tracking Number : </span>
                <span class="trk_num">` + data[i].tracking_num + `</span>
                <button type="button" class="close del_track_card" onclick="removeCard(this)">&times;</button>
              </h2>
            </div>
          </div>
          <div class="card-body">
            <div class="row">
              <div class="col">
                <div class="exp_dv_area">
                  <h3>` + ((data[i].eventnum > 4) ? "Delivered on" : "Expected Delivery on") + `</h3>
                  <div class="detail d-flex flex-row">
                    <div class="exp_dv_ymd p-2">
                      <span class="mm">` + data[i].exp_dv.mm + `</span>
                      <span class="dd">` + data[i].exp_dv.dd + `</span>
                      <span class="yy">` + data[i].exp_dv.yy + `</span>
                    </div>
                    <div class="exp_dv_time p-2">
                      <span class="days">` + data[i].exp_dv.days + `</span>
                      <span class="time">` + data[i].exp_dv.time + `</span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col package_status clearfix">
                <div>
                  <h3>Status</h3>
                  <div class="status_area">
                    <h4>` + data[i].summary.status + `</h4>
                    <div class="status_detail">
                      <span>` + data[i].summary.datetime + `</span>
                      <span>` + data[i].summary.status + `</span>
                      <span>` + data[i].summary.place + `</span>
                    </div>
                  </div>
                </div>
                <div class="package_icon_wrap show">
                  <img src="/image/package_big_` + data[i].company + `.png" width="127" height="127" alt="" />
                </div>
              </div>
            </div>
            <div class="status_bar_wrap d-flex">
              <div class="status_bar p-2 flex-fill"><span class="` + ((data[i].eventnum > 0) ? "status_o" : "") + `"></span></div>
              <div class="status_bar p-2 flex-fill"><span class="` + ((data[i].eventnum > 1) ? "status_o" : "") + `"></span></div>
              <div class="status_bar p-2 flex-fill"><span class="` + ((data[i].eventnum > 2) ? "status_o" : "") + `"></span></div>
              <div class="status_bar p-2 flex-fill"><span class="` + ((data[i].eventnum > 3) ? "status_o" : "") + `"></span></div>
              <div class="status_bar p-2 flex-fill"><span class="` + ((data[i].eventnum > 4) ? "status_o" : "") + `"></span></div>
            </div>
            <div class="status_bar_truck">
              <div class="status_bar track` + data[i].eventnum + ` hear"><span class="truck">` + data[i].summary.status + `</span></div>
            </div>
          </div>
          <div class="card-footer">
            <div class="trk_collapse_header clearfix">
              <span class="trk_icon"></span>
              <span class="trk_open_title"><a data-toggle="collapse" data-parent="#accordion" href="#trackingNo` + (i+1) + `">Tracking History</a></span>
              <a class="trk_open_arrow collapsed card-link" data-toggle="collapse" data-parent="#accordion" href="#trackingNo` + (i+1) + `"></a>
            </div>
            <div id="trackingNo` + (i+1) + `" class="collapse `+ (( data.length <= 1) ? "show" : "") +`">
              <div class="history_container container">
              <div class="ad_mid_top">
              <!-- <img src="/image/ad_mid_top.png" width="908" height="114" alt="" />-->
              <!-- 애드센스 링크광고 -->
              <script async src="//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
                <!-- 링크광고 -->
                <ins class="adsbygoogle"
                     style="display:block"
                     data-ad-client="ca-pub-5282970341948228"
                     data-ad-slot="6992981127"
                     data-ad-format="link"
                     data-full-width-responsive="true"></ins>
                <script>
                (adsbygoogle = window.adsbygoogle || []).push({});
              </script>
              </div>
                <ul class="tracking_history_list">`;
              //history list
              for (var j=0; j<data[i].history.length; j++) {
                str = (""+data[i].history[j].description).split("\n").join(' ');
                //str = strReplaceAll((""+data[i].history[j].description), "\n", " ");
                copySummary += data[i].history[j].datetime + " " + data[i].history[j].place + ", " + str + "<br>";
                html += `
                  <li>
                    <h5>` + data[i].history[j].datetime + `</h5>
                    <p>` + data[i].history[j].description + `<br />` + data[i].history[j].place + `</p>
                  </li>`;
              }
              //data[i].history[j].status + `<br />` +
        copySummary += "<br>======================================<br>Powered by www.trackingpkg.com";
        html += `</ul>
                <div class="ad_mid_bottom">
                <!-- img src="/image/ad_mid_bottom.png" width="908" height="114" alt="" /> -->
                <!-- 애드센스 반응형 광고 -->
                </div>
              </div>

              <div class="btns">
                <div class="d-flex justify-content-center mb-3">
                  <button type="button" class="btn p-2 btn-info copy_btn" onclick="copyText('` + copySummary + `')"> <img src="image/copy_result.png" width="20" height="24" alt="" style="margin:0 5px"  /> Copy Result</button>
                  <button type="button" class="btn p-2 btn-info copy_btn" onclick="copyText('http://www.trackingpkg.com/tracking/result/` + data[i].tracking_num + `')"> <img src="image/copy_link.png" width="20" height="20" alt="" style="margin:0 5px"  /> Copy Link</button>
                </div>
              </div>
            </div>
          </div>
        </div>`;
      } else {
        //검색 결과가 없을경우
        html += `<div class="card">
          <div class="card-header">
            <div class="trk_top">
              <h2 class="trk_title_number">
                <span class="title">Tracking Number : </span>
                <span class="trk_num">` + data[i].tracking_num + `</span>
                <button type="button" class="close del_track_card" onclick="removeCard(this)">&times;</button>
              </h2>
            </div>
          </div>
          <div class="card-body">
            <h3>Not Found</h3>
            <p>This number can't be found at this moment.</p>
            <p>you can guess these cases.</p>
            <p>1. Not available in the shipment carrier's system for now.</p>
            <p>2. shipment carrier doesn't have the tracking information yet.</p>
            <p>3. Wrong tracking number</p>
          </div>
        </div>`;
      }
    }
    //console.log(html);
    //$(".card_container #accordion").html(html);
    callback(html);
  },
  list:function(filelist){
    var list ='<ul>';
    var i = 0;
    while(i < filelist.length){
      list += `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
      i += 1;
    }
    list = list + '</ul>';
    return list;
  },
  resultBodyHTML:function(cards){
    return `
    <div class="ad_top_container">
      <div class="ad_top">
      <!-- 애드센스 상단 -->
      <script async src="//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
      <!-- TrackingPKG_반응형 -->
      <ins class="adsbygoogle"
           style="display:block"
           data-ad-client="ca-pub-5282970341948228"
           data-ad-slot="6657649528"
           data-ad-format="auto"
           data-full-width-responsive="true"></ins>
      <script>
      (adsbygoogle = window.adsbygoogle || []).push({});
      </script>
      </div>
    </div>

    <div class="wrapper">
        <div class="logo_container container">
          <section class="logo_section">
            <div class="logo_box">
              <h1 class="logo txt-c" title="TrackingPKG">
                <a href="/" class="logo_link"><img src="/image/logo.png" class="logo_image" /></a>
              </h1>
            </div>
          </section>
        </div>

        <div class="search_container container">
          <form id="searchForm" action="" method="post" onsubmit="return checkSearch();">
            <input type="hidden" id="trackingNums" name="trackingNums" value="" />
            <section class="search_section row">
              <div class="search_box col-sm-10">
                <div class="search_values">
                  <ul class="number_list">
                  <!-- 30개 제한 // 영어,숫자만(30) // 대문자변환 -->
                  <li><span class="numbering">1.</span><span class="tracking_num"><input type="text" class="" id="" name="trackingNum1" value="" placeholder="ENTER TRACKING NUMBER. ADD WITH SPACEBAR" onkeyup="addNum(this);"/></span><span class="del"><button type="button" onclick="deleteNum(this);">X</button></span></li>
                  </ul>
                </div>
              </div>
              <div class="button_box col-sm-2">
                <button class="btn" type="submit">Search</button>
              </div>
            </section>
          </form>
        </div>

        <div class="card_container container">
          <div id="accordion">
          ${cards}
          </div>
        </div>
    </div>

    <div class="ad_bottom_container">
      <div class="ad_bottom">

      <!-- 애드센스 하단 -->
      <script async src="//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
      <!-- TrackingPKG_반응형 -->
      <ins class="adsbygoogle"
           style="display:block"
           data-ad-client="ca-pub-5282970341948228"
           data-ad-slot="6657649528"
           data-ad-format="auto"
           data-full-width-responsive="true"></ins>
      <script>
      (adsbygoogle = window.adsbygoogle || []).push({});
      </script>

      </div>
    </div>
    `;
  }
}
