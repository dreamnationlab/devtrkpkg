var express = require('express');
var router = express.Router();

// 모듈화
var reqTracking = require('../lib/requestTracking.js');

router.post('/tracking', function(req, res){
  //입력된 운송장번호 받는 부분
  var post = req.body;
  //운송장번호
  var trackingNum = post.trackingNum;
  // 운송장 조회 함수 작업 필요
  //reqTracking.USPS('9361289681090397739347'); // 파싱 필요
  //reqTracking.UPS('1Z4861WWE194914215'); // 파싱 필요 test : 1Z4861WWE194914215 , live : 1Z0W37Y80301393976
  //reqTracking.FEDEX('039813852990618');
  //reqTracking.FEDEX('9612019733974263675927'); // Authentication Failed 상태(메일 문의)
  //reqTracking.DHL('2398427905'); // 라이브 적용 필요
  console.log(trackingNum);

  // redirection?
  res.send(trackingNum);
});

module.exports = router;
