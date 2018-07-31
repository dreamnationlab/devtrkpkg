module.exports = {
  // USPS //////////////////////////////////////////////////////////
  USPS:function(xml, callback){

  },

  // UPS //////////////////////////////////////////////////////////
  UPS:function(xml, callback){
    // xml2js
    // json parsing
    var trackingNums = "9361289681090397739347|9361289681090397739347|9361289681090397739347|9361289681090397739347"; //넘어온 파라미터 값
    var trackingNumArr = trackingNums.split("|");
    var result;
    var arr_nums = new Array;

    for (var i=0; i<trackingNumArr.length; i++) {
      //tracking결과값 JSON
      var obj = {
                  "tracking_num":trackingNumArr[i],  //배송번호
                  "success":false,
                  "exp_dv":{
                            "yy":"",              //예상도착_년도 :: yyyy(4자리)
                            "mm":"",              //예상도착_월 :: 영문명
                            "dd":"",              //예상도착_일 :: dd(2자리)
                            "days":"",            //예상도착_요일 :: 3자리 약어 MON,TUE,...
                            "time":""             //예상도착_시간 :: hh:mm AM/PM
                           },
                  "summary":{
                              "datetime":"",      //상태요약_요일시간 :: April 21,2018 at 8:00 PM
                              "status":"",        //상태요약_배송상태 :: Delivered
                              "place":""          //상태요약_장소 :: New CASTKE, DE 19720
                            },
                  "history":[
                              {
                                "datetime":"",    //일시
                                "status":"",      //상태
                                "place":"",       //장소
                                "description":""  //상태 설명
                              }
                            ],
                  "event":"",  //IR,AP,IT,OD,DL :: 상태코드
                  "eventnum":0 //상태숫자 :: (default:0, IR:1,AP:2,IT:3,OD:4,DL:5)
                };
      arr_nums.push(obj);
    }

    result = {"data":arr_nums};
    
    var text = '{ "employees" : [' +
    '{ "firstName":"John" , "lastName":"Doe" },' +
    '{ "firstName":"Anna" , "lastName":"Smith" },' +
    '{ "firstName":"Peter" , "lastName":"Jones" } ]}';

    var jsonObj = JSON.parse(text);
    callback(jsonObj);
  },

  // FEDEX //////////////////////////////////////////////////////////
  FEDEX:function(xml, callback){

  },

  // DHL //////////////////////////////////////////////////////////
  DHL:function(xml, callback){

  }
}
