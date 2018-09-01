module.exports = {
  HTML:function(page, body){
    return `
    <!doctype html>
    <html lang=en>
    <head>
      <meta name="google-site-verification" content="0kf4tElqxLRXznvmgPeiy3U-ONPAOkcQttl_-a5En6U" />
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
      <meta property="og:image" content="/image/og_image.png">
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
      <script type="text/javascript">
        function stopRKey(evt) {
          var evt = (evt) ? evt : ((event) ? event : null);
          var node = (evt.target) ? evt.target : ((evt.srcElement) ? evt.srcElement : null);
          if ((evt.keyCode == 13) && (node.type=="text"))  {return false;}
        }
        document.onkeypress = stopRKey;
      </script>
    </head>
    <body class=${page}>
      ${body}
      <div class="footer">
        <div class="footer_wrap">
          <span class="company_logo"><img src="/image/company_logo.png" alt="Dreamnation" width="145px" height="19px" /></span>
          <span class="contact">
            <span class="copy">ⓒ 2018 TrackingPKG</span>
            <span class="email"> | dreamnation.co.kr@gmail.com | </span>
          </span>
          <!--<span class="socials">-->
          <!--  <ul class="social_list">-->
          <!--    <li><a id="facebook_icon" href="" onclick=""></a></li>-->
          <!--    <li><a id="twitter_icon" href="" onclick=""></a></li>-->
          <!--    <li><a id="google_icon" href="" onclick=""></a></li>-->
          <!--    <li><a id="mail_icon" href="" onclick=""></a></li>-->
          <!--  </ul>-->
          <!--</span>-->
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
        copySummary = "Number:" + data[i].tracking_num + "<br>Package status: " + data[i].summary.status + " (" + overtime + " days)<br><br>";
        html += "<div class=\"card\">";
        html +=  "<div class=\"card-header\">";
        html +=    "<div class=\"trk_top\">";
        html +=      "<h2 class=\"trk_title_number\">";
        html +=        "<span class=\"title\">Tracking Number : </span>";
        html +=        "<span class=\"trk_num\">" + data[i].tracking_num + "</span>";
        html +=        "<button type=\"button\" class=\"close del_track_card\" onclick=\"removeCard(this)\">&times;</button>";
        html +=      "</h2>";
        html +=    "</div>";
        html +=  "</div>";
        html +=  "<div class=\"card-body\">";
        html +=    "<div class=\"row\">";
        html +=      "<div class=\"col\">";
        html +=        "<div class=\"exp_dv_area\">";
        html +=          "<h3>" + ((data[i].eventnum > 4) ? "Delivered on" : "Expected Delivery on") + "</h3>";
        html +=          "<div class=\"detail d-flex flex-row\">";
        html +=            "<div class=\"exp_dv_ymd p-2\">";
        html +=              "<span class=\"mm\">" + data[i].exp_dv.mm + "</span>";
        html +=              "<span class=\"dd\">" + data[i].exp_dv.dd + "</span>";
        html +=              "<span class=\"yy\">" + data[i].exp_dv.yy + "</span>";
        html +=            "</div>";
        html +=            "<div class=\"exp_dv_time p-2\">";
        html +=              "<span class=\"days\">" + data[i].exp_dv.days + "</span>";
        html +=              "<span class=\"time\">" + data[i].exp_dv.time + "</span>";
        html +=            "</div>";
        html +=          "</div>";
        html +=        "</div>";
        html +=      "</div>";
        html +=      "<div class=\"col package_status clearfix\">";
        html +=        "<div>";
        html +=          "<h3>Status</h3>";
        html +=          "<div class=\"status_area\">";
        html +=            "<h4>" + data[i].summary.status +"</h4>";
        html +=            "<div class=\"status_detail\">";
        html +=              "<span>" + data[i].summary.datetime + "</span>";
        html +=              "<span>" + data[i].summary.status + "</span>";
        html +=              "<span>" + data[i].summary.place + "</span>";
        html +=            "</div>";
        html +=          "</div>";
        html +=        "</div>";
        html +=        "<div class=\"package_icon_wrap show\">";
        html +=          "<img src=\"/image/package_big_" + data[i].company + ".png\" width=\"127\" height=\"127\" alt=\"\" />";
        html +=        "</div>";
        html +=      "</div>";
        html +=    "</div>";
        html +=    "<div class=\"status_bar_wrap d-flex\">";
        html +=      "<div class=\"status_bar p-2 flex-fill\"><span class=\"" + ((data[i].eventnum > 0) ? "status_o" : "") + "\"></span></div>";
        html +=      "<div class=\"status_bar p-2 flex-fill\"><span class=\"" + ((data[i].eventnum > 1) ? "status_o" : "") + "\"></span></div>";
        html +=      "<div class=\"status_bar p-2 flex-fill\"><span class=\"" + ((data[i].eventnum > 2) ? "status_o" : "") + "\"></span></div>";
        html +=      "<div class=\"status_bar p-2 flex-fill\"><span class=\"" + ((data[i].eventnum > 3) ? "status_o" : "") + "\"></span></div>";
        html +=      "<div class=\"status_bar p-2 flex-fill\"><span class=\"" + ((data[i].eventnum > 4) ? "status_o" : "") + "\"></span></div>";
        html +=    "</div>";
        html +=    "<div class=\"status_bar_truck\">";
        html +=      "<div class=\"status_bar track" + data[i].eventnum + " hear\"><span class=\"truck\">" + data[i].summary.status + "</span></div>";
        html +=    "</div>";
        html +=  "</div>";
        html +=  "<div class=\"card-footer\">";
        html +=    "<div class=\"trk_collapse_header clearfix\">";
        html +=      "<span class=\"trk_icon\"></span>";
        html +=      "<span class=\"trk_open_title\"><a data-toggle=\"collapse\" data-parent=\"#accordion\" href=\"#trackingNo" + (i+1) + "\">Tracking History</a></span>";
        html +=      "<a class=\"trk_open_arrow collapsed card-link\" data-toggle=\"collapse\" data-parent=\"#accordion\" href=\"#trackingNo" + (i+1) + "\"></a>";
        html +=    "</div>";
        html +=    "<div id=\"trackingNo" + (i+1) + "\" class=\"collapse " + (( data.length <= 1) ? "show" : "") + "\">";
        html +=      "<div class=\"history_container container\">";

        html +=    "<div class=\"ad_mid_top\">";

        html +=    "<!-- TrackingPKG_728_90_Above_Link_Top -->";
        html +=    "<ins class=\"adsbygoogle\"";
        html +=    "     style=\"display:inline-block;width:728px;height:90px\"";
        html +=    "     data-ad-client=\"ca-pub-5282970341948228\"";
        html +=    "     data-ad-slot=\"7961946150\"></ins>";
        html +=    "<script>";
        html +=    "(adsbygoogle = window.adsbygoogle || []).push({});";
        html +=    "</script>";

        html +=    "<div class=\"ad_link\">";

        html +=    "<style type=\"text/css\">";
        html +=    ".adslot_1 { max-width: 800px; height: auto; margin:10px 0px; }";
        html +=    "@media (min-width:100px) { .adslot_1 { width:125px; height:125px; } } ";
        html +=    "@media (min-width:180px) { .adslot_1 { width:180px; height:150px; } } ";
        html +=    "@media (min-width:200px) { .adslot_1 { width:200px; height:200px; } } ";
        html +=    "@media (min-width:250px) { .adslot_1 { width:250px; height:250px; } } ";
        html +=    "@media (min-width:300px) { .adslot_1 { width:300px; height:600px; } } ";
        html +=    "@media (min-width:336px) { .adslot_1 { width:336px; height:280px; } } ";
        html +=    "@media (min-width:468px) { .adslot_1 { width:468px; height:60px; } } ";
        html +=    "@media (min-width:728px) { .adslot_1 { width:728px; height:90px; } }";
        html +=    "</style>";

        html +=    "<ins class=\"adsbygoogle adslot_1\"";
        html +=         "style=\"display:inline-block\"";
        html +=         "data-ad-client=\"ca-pub-5282970341948228\"";
        html +=         "data-ad-slot=\"1866096070\"";
        // html +=         "data-ad-format=\"link\"";
        // html +=         "data-full-width-responsive=\"true\">";
        html +=    "</ins>";
        html +=    "<script>";
        html +=    "  (adsbygoogle = window.adsbygoogle || []).push({});";
        html +=    "</script>";
        html +=    "</div>"; //ad_link
        html +=    "</div>"; //ad_mid_top

        html +=    "<ul class=\"tracking_history_list\">";

        //history list
        for (var j=0; j<data[i].history.length; j++) {
          let str = (""+data[i].history[j].description).split("\n").join(' ');
          copySummary += data[i].history[j].datetime + " " + data[i].history[j].place + ", " + str + "<br>";

          html += "<li><h5>" + data[i].history[j].datetime + "</h5>";
          html += "<p>" + data[i].history[j].description + "<br />" + data[i].history[j].place + "</p></li>";
        }

        copySummary += "<br>======================================<br>Powered by www.trackingpkg.com";

        html += "</ul>";

        html += "<div class=\"ad_mid_bottom\">";

        html +=    "<!-- TrackingPKG_728_90_Above_Link_Bottom -->";
        html +=    "<ins class=\"adsbygoogle\"";
        html +=    "     style=\"display:inline-block;width:728px;height:90px\"";
        html +=    "     data-ad-client=\"ca-pub-5282970341948228\"";
        html +=    "     data-ad-slot=\"5627426858\"></ins>";
        html +=    "<script>";
        html +=    "(adsbygoogle = window.adsbygoogle || []).push({});";
        html +=    "</script>";

        html +=    "<div class=\"ad_link\">";

        html +=    "<style type=\"text/css\">";
        html +=    ".adslot_1 { max-width: 800px; height: auto; margin:10px 0px; }";
        html +=    "@media (min-width:100px) { .adslot_1 { width:125px; height:125px; } } ";
        html +=    "@media (min-width:180px) { .adslot_1 { width:180px; height:150px; } } ";
        html +=    "@media (min-width:200px) { .adslot_1 { width:200px; height:200px; } } ";
        html +=    "@media (min-width:250px) { .adslot_1 { width:250px; height:250px; } } ";
        html +=    "@media (min-width:300px) { .adslot_1 { width:300px; height:600px; } } ";
        html +=    "@media (min-width:336px) { .adslot_1 { width:336px; height:280px; } } ";
        html +=    "@media (min-width:468px) { .adslot_1 { width:468px; height:60px; } } ";
        html +=    "@media (min-width:728px) { .adslot_1 { width:728px; height:90px; } }";
        html +=    "</style>";

        html +=    "<ins class=\"adsbygoogle adslot_1\"";
        html +=    "     style=\"display:inline-block\"";
        html +=    "     data-ad-client=\"ca-pub-5282970341948228\"";
        html +=    "     data-ad-slot=\"2709635382\"";
        // html +=    "     data-ad-format=\"link\"";
        // html +=    "     data-full-width-responsive=\"true\">";
        html +=    "</ins>";
        html +=    "<script>";
        html +=    "  (adsbygoogle = window.adsbygoogle || []).push({});";
        html +=    "</script>";
        html += "</div>"; //ad_link
        html += "</div>"; //ad_mid_bottom

        html += "</div>";

        html += "<div class=\"btns\">";
        html += "<div class=\"d-flex justify-content-center mb-3\">";
        html += "<button type=\"button\" class=\"btn p-2 btn-info copy_btn\" onclick=\"copyText('" + copySummary + "')\"> <img src=\"/image/copy_result.png\" width=\"20\" height=\"24\" alt=\"\" style=\"margin:0 5px\"  /> Copy Result</button>";
        html += "<button type=\"button\" class=\"btn p-2 btn-info copy_btn\" onclick=\"copyText('http://www.trackingpkg.com/tracking/result/" + data[i].tracking_num + "')\"> <img src=\"/image/copy_link.png\" width=\"20\" height=\"20\" alt=\"\" style=\"margin:0 5px\"  /> Copy Link</button>";
        html += "</div>";
        html += "</div>";
        html += "</div>";
        html += "</div>";
        html += "</div>";
      } else {
        //검색 결과가 없을경우
        html += "<div class=\"card\">";
        html += "<div class=\"card-header\">";
        html +=     "<div class=\"trk_top\">";
        html +=       "<h2 class=\"trk_title_number\">";
        html +=         "<span class=\"title\">Tracking Number : </span>";
        html +=         "<span class=\"trk_num\">" + data[i].tracking_num + "</span>";
        html +=         "<button type=\"button\" class=\"close del_track_card\" onclick=\"removeCard(this)\">&times;</button>";
        html +=       "</h2>";
        html +=     "</div>";
        html +=   "</div>";
        html +=  "<div class=\"card-body\">";
        html +=    "<h3>Not Found</h3>";
        html +=    "<p>This number can't be found at this moment.</p>";
        html +=    "<p>you can guess these cases.</p>";
        html +=    "<p>1. Not available in the shipment carrier's system for now.</p>";
        html +=    "<p>2. shipment carrier doesn't have the tracking information yet.</p>";
        html +=    "<p>3. Wrong tracking number</p>";
        html +=  "</div>";
        html += "</div>";
      }
    }
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
          <form id="searchForm" action="/tracking/result" method="post" onsubmit="return checkSearch();">
            <input type="hidden" id="trackingNums" name="trackingNums" value="" />
            <section class="search_section row">
              <div class="search_box col-sm-10">
                <div class="search_values">
                  <ul class="number_list">
                  <!-- 30개 제한 // 영어,숫자만(30) // 대문자변환 -->
                  <li><span class="numbering">1.</span><span class="tracking_num"><input type="text" class="" id="" name="trackingNum1" value="" placeholder="ENTER TRACKING NUMBERS" onkeyup="addNum(this);"/></span><span class="del"><button type="button" onclick="deleteNum(this);">X</button></span></li>
                  </ul>
                </div>
              </div>
              <div class="button_box col-sm-2">
                <button class="btn" type="submit">Search</button>
              </div>
            </section>
          </form>
        </div>

        <div class="ad_top_container">
          <script async src="//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
          <!-- TrackingPKG_970_90_Top -->
          <ins class="adsbygoogle"
             style="display:inline-block;width:970px;height:90px"
             data-ad-client="ca-pub-5282970341948228"
             data-ad-slot="5268388107"></ins>
          <script>
          (adsbygoogle = window.adsbygoogle || []).push({});
          </script>
        </div>

        <div class="card_container container">
          <div id="accordion">
          ${cards}
          </div>
        </div>
    </div>

    <div class="ad_bottom_container">
      <!-- TrackingPKG_970_250_Bottom -->
      <ins class="adsbygoogle"
         style="display:inline-block;width:970px;height:250px"
         data-ad-client="ca-pub-5282970341948228"
         data-ad-slot="9072735897"></ins>
      <script>
      (adsbygoogle = window.adsbygoogle || []).push({});
      </script>
    </div>
    `;
  }
}
