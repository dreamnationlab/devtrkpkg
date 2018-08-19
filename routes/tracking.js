var express = require('express');
var router = express.Router();
var path = require('path');

// 모듈화
var reqTracking = require('../lib/requestTracking.js');
var template = require('../lib/template.js');

router.post('/result', function(req, res){
  var fs = require('fs');

  // async function test(){
  //   await foo(function(res){
  //   });
  // }
  //
  // function foo(callback){
  //   return new Promise(function(resolve, reject){
  //     try{
  //       fs.readFile('./lib/test.txt', 'utf8', function(err,result){
  //             if(err){ reject(err); } else {  resolve(result);  }
  //              callback(result);
  //       });
  //     } catch(err){
  //       reject(err);
  //     }
  //   });
  // }
  // test();


  //입력된 운송장번호 받는 부분
  var post = req.body;
  console.log(post);

  //운송장번호
  var trackingNums = post.trackingNums.split("|");
  console.log('after split',trackingNums);

  var trim = function(trackingNums){
    for(let i = 0, length = trackingNums.length; i < length; i++ ) {
        trackingNums[i] = trackingNums[i].replace(/(^\s*)|(\s*$)/gi, "");
    }
  }
  trim(trackingNums);

  console.log('After trim', trackingNums);
  // 번호 순으로 검색 후 취합
  reqTracking.byNums(trackingNums, function(result){
    let parsingResult = {"data":result};
    template.trackingCardsToHTML(parsingResult, function(result){
        let bodyHTML = template.resultBodyHTML(result);
        let finalHTML = template.HTML('result', `${bodyHTML}`);
        res.send(finalHTML);
        console.log('Tracking completed');
    });
  });
});

// 중복코드 어쩔????
router.get('/result/:number', function(req,res){  
  var trackingNum = [];
  trackingNum.push(path.parse(req.params.number).base);
  // 번호 순으로 검색 후 취합
  reqTracking.byNums(trackingNum, function(result){
    let parsingResult = {"data":result};
    template.trackingCardsToHTML(parsingResult, function(result){
        let bodyHTML = template.resultBodyHTML(result);
        let finalHTML = template.HTML('result', `${bodyHTML}`);
        res.send(finalHTML);
        console.log('Tracking completed');
    });
  });
});


module.exports = router;
