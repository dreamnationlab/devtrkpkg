module.exports = {
  HTML:function(page, body){
    return `
    <!doctype html>
    <html lang=en>
    <head>
      <meta charset=utf-8>
      <meta http-equiv=x-ua-compatible content="ie=edge">
      <title>TrackingPKG :: tracking your package </title>
      <meta name=description content="설명글">
      <meta name=viewport content="width=device-width, initial-scale=1">
      <meta property="og:url" content="http://www.trackingpkg.com/">
      <meta property="og:title" content="TrackingPKG :: tracking your package ">
      <meta property="og:description" content="설명글">
      <meta property="og:site_name" content=TrackingPKG>
      <meta property="og:image" content="https://www.digitalocean.com/assets/media/logo-a721c4a7.png">
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
      <link href="css/common.css" rel=stylesheet />
      <script src="https://code.jquery.com/jquery-3.3.1.slim.min.js"></script>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.3/umd/popper.min.js"></script>
      <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.1.2/js/bootstrap.min.js"></script>
      <script src="common.js"></script>
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
    </body>
    </html>`;
  },
  trackingJsonToHtml(data , callback){
    var data = data.data;
    var html = "";
    var copySummary = "";
    for (var i=0; i<data.length; i++) {
      if (data[i].success) {
        //검색 결과가 있을경우
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
                  <h3>Expected Delivery by</h3>
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
                <div class="package_icon_wrap ` + ((data[i].eventnum == 5) ? "show" : "") + `">
                  <img src="image/package_big.png" width="127" height="127" alt="" />
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
              <span class="trk_open_title">Tracking History</span>
              <a class="trk_open_arrow collapsed card-link" data-toggle="collapse" data-parent="#accordion" href="#trackingNo` + (i+1) + `"></a>
            </div>
            <div id="trackingNo` + (i+1) + `" class="collapse">
              <div class="history_container container">
              <div class="ad_mid_top"><img src="image/ad_mid_top.png" width="908" height="114" alt="" /></div>
                <ul class="tracking_history_list">`;
              //history list
              for (var j=0; j<data[i].history.length; j++) {
                html += `
                  <li>
                    <h5>` + data[i].history[j].datetime + `</h5>
                    <p>` + data[i].history[j].status + `<br />` + data[i].history[j].place + `<br />` + data[i].history[j].description + `</p>
                  </li>`;
              }

        html += `</ul>
                <div class="ad_mid_bottom"><img src="image/ad_mid_bottom.png" width="908" height="114" alt="" /></div>
              </div>

              <div class="btns">
                <div class="d-flex justify-content-center mb-3">
                  <button type="button" class="btn p-2 btn-info copy_btn" onclick="copyText('#trackingNo` + (i+1) + `Result')"> <img src="image/copy_result.png" width="20" height="24" alt="" style="margin:0 5px"  /> Copy Result</button>
                  <button type="button" class="btn p-2 btn-info copy_btn" onclick="copyText('#trackingNo` + (i+1) + `Link')"> <img src="image/copy_link.png" width="20" height="20" alt="" style="margin:0 5px"  /> Copy Link</button>
                  <input type="hidden" id="trackingNo` + (i+1) + `Result" value="copy result~~~" />
                  <input type="hidden" id="trackingNo` + (i+1) + `Link" value="http://www.trackingpkg.com:3000/tracking/` + data[i].tracking_num + `" />
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
            <h3>Sorry, Not Found...</h3>
            <p>Info unavailable, we can't identify your number yet.</p>
            <p>Is your carrier inside this list?</p>
          </div>
        </div>`;
      }
    }
    //console.log(html);
    $(".card_container #accordion").html(html);
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
  resultHTML:function(json, callback){
    var html = '';
    html += json;
    callback(html);
  }
}
