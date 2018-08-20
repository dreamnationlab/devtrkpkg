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

  function removeDuplicatesArray(arr) {
        var tempArr = [];
        for (let i = 0, arrLength = arr.length; i < arrLength; i++) {
            if (tempArr.length === 0) {
                tempArr.push(arr[i]);
            } else {
                var isDuplicated = true;
                for (let j = 0, tempArrLength = tempArr.length; j < tempArrLength; j++) {
                    if (tempArr[j] === arr[i]) {
                        isDuplicated = false;
                        break;
                    }
                }
                if (isDuplicated) {
                    tempArr.push(arr[i]);
                }
            }
        }
        return tempArr;
  }

  var trim = function(trackingNums){
    for(let i = 0, length = trackingNums.length; i < length; i++ ) {
        trackingNums[i] = trackingNums[i].replace(/(^\s*)|(\s*$)/gi, "");
    }
  }
  //////////////////////////////////////////////////////////////////////////////

  //입력된 운송장번호 받는 부분
  var post = req.body;
  console.log(post);

  //운송장번호 파이프로 구분하여 자르기
  var trackingNums = post.trackingNums.split("|");
  console.log('after split',trackingNums);

  // 중복값 제거
  trackingNums = removeDuplicatesArray(trackingNums);
  console.log('After removeDuplicates', trackingNums);

  // 앞뒤 공백 제거
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
