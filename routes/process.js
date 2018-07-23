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
  //reqTracking.USPS(trackingNum);
  //reqTracking.UPS(trackingNum);
  //reqTracking.FEDEX(trackingNum);
  console.log(trackingNum);

  // redirection?
  res.send(trackingNum);
});

module.exports = router;
