module.exports = {
  HTML:function(title, page, body){
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
  list:function(filelist){
    var list ='<ul>';
    var i = 0;
    while(i < filelist.length){
      list += `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
      i += 1;
    }
    list = list + '</ul>';
    return list;
  }
}
