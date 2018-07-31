var express = require('express');
var router = express.Router();
var parser = require('../lib/parser');

// 모듈화
var reqTracking = require('../lib/requestTracking.js');
var template = require('../lib/template.js');

router.post('/result', function(req, res){
  // 최종 결과 페이지
  var html = '';
  //입력된 운송장번호 받는 부분
  var post = req.body;
  //운송장번호
  var trackingNums = post.trackingNums;
  // var trackingNums = post.trackingNums.split("|");

  //for(var iter = 0; iter < trackingNums.length; iter++){
    // 택배사 구분 함수 필요

    // reqTracking.USPS('9361289681090397739347', function(result){
    //     console.log(result);
    //
    //     //파싱 함수 호출
    //     //ex : common.uspsParser(result, function(resValue){ });
    //
    //     var html = template.HTML('index', `여기에 바디코드`);
    //     res.send(html);
    // });

    // reqTracking.FEDEX('039813852990618', function(result){
    //     //reqTracking.FEDEX('9612019733974263675927'); // Authentication Failed 상태(메일 문의)
    //       console.log(result);
    // });

    // reqTracking.DHL('2398427905', function(result){
    //       console.log(result);
    //
    //       //파싱 함수 호출
    //
    //       // var html = template.HTML('index', `여기에 바디코드`);
    //       // res.send(html);
    // });


    reqTracking.UPS('1Z4861WWE194914215', function(result){
    //     파싱 필요 test : 1Z4861WWE194914215 , live : 1Z0W37Y80301393976
          // console.log(result);
          // if(result){};

          //파싱 함수 호출
          parser.UPS(result, function(result){
            template.trackingJsonToHtml(result, function(result){
              html += result;
            });
          });
    });

  // var finalHTML = template.HTML('result', `${html}`);
  // res.send(finalHTML);

});

module.exports = router;
