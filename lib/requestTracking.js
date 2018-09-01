var db = require('./db');
var parser = require('./parser');

module.exports = {
  byNums:async function (trackingNums, callback){
    var arr_nums = [];
    console.log('length =', trackingNums.length);
    for(let iter = 0, length = trackingNums.length; iter < length; iter++){
      // 택배사 구분 함수 필요
      //
      var isContinue = '';
      var isCon = false;

      // 아무 값도 아닌데 들어오는 경우
      if(trackingNums[iter] === ''){
        let result = parser.newCard();
        result.success = 'false';
        arr_nums.push(result);
        // 마지막 번호인지 확인
        if(arr_nums.length === length){
          callback(arr_nums);
          return;
        }
        continue;
      }

      await this.FEDEX(trackingNums[iter], function(result){
        if(result != 'db_error' && result != 'post_error'){
          parser.FEDEX(result, function(result){
            //트랙킹 정상일 때 push, 무슨 이유간에 에러는 false 로 받음(추후 디테일 처리)
            if(result.success === 'true'){
              result.company = 'fedex';
              arr_nums.push(result);
              isContinue = 'true';

              // 마지막 번호인지 확인
              if(arr_nums.length === length){
                console.log("FEDEX - This is Last Number");
                callback(arr_nums);
                return;
              }
            } else {
              isContinue = 'false';
            }
          });
        } else { //db_error or post_error
          console.log(result);
        }
      });

      console.log('FEDEX - isContinue : ',isContinue);
      if(isContinue === 'true'){
        console.log('=============== Next Number ================');
        continue;
      }
      //
      await this.USPS(trackingNums[iter], function(result){
        if(result != 'db_error' && result != 'post_error'){
          parser.USPS(result, function(result){
            //트랙킹 정상일 때 push, 무슨 이유간에 에러는 false 로 받음(추후 디테일 처리)
            if(result.success === 'true'){
              result.tracking_num = trackingNums[iter];
              result.company = 'usps';
              arr_nums.push(result);
              isContinue = 'true';

              // 마지막 번호인지 확인
              if(arr_nums.length === length){
                console.log("USPS - This is Last Number");
                callback(arr_nums);
                return;
              }
            } else {
              isContinue = 'false';
            }
          });
        } else {// db_error or post_error
          console.log(result);
        }
      });

      console.log('USPS - isContinue : ',isContinue);
      if(isContinue === 'true'){
        console.log('=============== Next Number ================');
        continue;
      }
      // // // /////////////////////////////////////////////////////////////////////////
      await this.UPS(trackingNums[iter], function(result){
        if(result != 'db_error' && result != 'post_error'){
          parser.UPS(result, function(result){
            //트랙킹 정상일 때 push, 무슨 이유간에 에러는 false 로 받음(추후 디테일 처리)
            if(result.success === 'true'){
              result.company = 'ups';
              arr_nums.push(result);
              isContinue = 'true';

              // 마지막 번호인지 확인
              if(arr_nums.length === length){
                console.log("UPS - This is Last Number");
                callback(arr_nums);
                return;
              }
            } else {
              isContinue = 'false';
            }
          });
        } else {// db_error or post_error
          console.log(result);
        }
      });

      console.log('UPS - isContinue : ',isContinue);
      if(isContinue === 'true'){
        console.log('=============== Next Number ================');
        continue;
      }
      /////////////////////////////////////////////////////////////////////////
      await this.DHL(trackingNums[iter], function(result){
        if(result != 'db_error' && result != 'post_error'){
          parser.DHL(result, function(result){
            //트랙킹 정상일 때 push, 무슨 이유간에 에러는 false 로 받음(추후 디테일 처리)
            if(result.success === 'true'){
              result.company = 'dhl';
              arr_nums.push(result);

              // 마지막 번호인지 확인
              if(arr_nums.length === length){
                console.log("DHL - This is Last Number");
                callback(arr_nums);
                return;
              }
            } else {
              //여기까지 왔다는 건, 유효한 데이터가 없음, 올바른 운송장 번호가 아니거나....
              // 이 부분을 DHL 에서 빼는 작업이 필요 할 듯
              // dhl 끝나는 부분에 iscontinue 검사 하고
              // 그 밑에 아래 코드 넣으면 될 듯?
              result.tracking_num = trackingNums[iter];
              arr_nums.push(result);
              console.log('Data not Founded - ', trackingNums[iter]);
              // 마지막 번호인지 확인
              if(arr_nums.length === length){
                callback(arr_nums);
              }
            }
          });
        } else { // db_error or post_error
          console.log(result);
        }
      }); // this.DHL
    }// for문
  },
  // USPS //////////////////////////////////////////////////////////
  USPS:function(trackingNum, callback){
    return new Promise(function(resolve, reject){
      let mRequest = require('request');
      // DB
      db.query('SELECT url, userId FROM USPS', function(err, dbdata){
        if(err){
          reject(err);
          callback("db_error");
          return;
        }

        let url = dbdata[0].url;
        let userId = dbdata[0].userId;

        let bodyXML = `${url}
            <?xml version="1.0" encoding="UTF-8"?>
            <TrackFieldRequest USERID='${userId}'>
              <TrackID ID='${trackingNum}'/>
            </TrackFieldRequest>`;

        // 예상 도착일, 요약 문장 정보 추가 됨
        // var interfaces = require('os').networkInterfaces();
        // let serverIp;
        // for (var devName in interfaces) {
        //   var iface = interfaces[devName];  
        //   for (var i = 0; i < iface.length; i++) { 
        //     var alias = iface[i];
        //     if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) 
        //     serverIp = alias.address;
        //   }
        // }
        // console.log(url);
        //
        // let bodyXML = `${url}
        //               <?xml version="1.0" encoding="UTF-8"?>
        //               <TrackFieldRequest USERID='${userId}'>
        //                 <Revision>1</Revision>
        //                 <ClientIp>${serverIp}</ClientIp>
        //                 <SourceId>>DreamNation</SourceId>
        //                 <TrackID ID='${trackingNum}'/>
        //               </TrackFieldRequest>`;

        let options = {
          headers:{
            'Content-Type':'application/xml'
          },
          url:bodyXML,
          port:443,
          //body:bodyXML, 사용안함
          method:'POST'
        };

        mRequest.post(options, (err, res, body) => {
          if(!err){
              resolve(body);
              callback(body);
          } else {
              reject(err);
              callback("post_error");
          }
        });
      });
    });
  },

  // UPS //////////////////////////////////////////////////////////
  UPS:function(trackingNum, callback){
    return new Promise(function(resolve, reject){
      let mRequest = require('request');
      //try?
      db.query('SELECT url, accessLicenseNumber, userId, password FROM UPS', function(err, dbdata){
        if(err){
          reject(err);
          callback("db_error");
          return;
        }

        let url = dbdata[0].url; //live
        let accessLicenseNumber = dbdata[0].accessLicenseNumber;
        let userId = dbdata[0].userId;
        let password = dbdata[0].password;

        var bodyXML = `<?xml version="1.0"?>
            <AccessRequest xml:lang="en-US">
              <AccessLicenseNumber>${accessLicenseNumber}</AccessLicenseNumber>
              <UserId>'${userId}'</UserId>
              <Password>'${password}'</Password>
            </AccessRequest>
            <?xml version="1.0"?>
            <TrackRequest xml:lang="en-US">
              <Request>
                <TransactionReference>
                  <CustomerContext>Your Test Case Summary Description</CustomerContext>
                </TransactionReference>
                <RequestAction>Track</RequestAction>
                <RequestOption>activity</RequestOption>
              </Request>
              <TrackingNumber>${trackingNum}</TrackingNumber>
            </TrackRequest>`;

        let options = {
          headers:{
            'Content-Type':'application/xml',
            'Access-Control-Allow-Origin':'*',
            'Access-Control-Allow-Methods':'POST',
            'Access-Control-Allow-Headers':'Origin, X-Requested-With, Content-Type, Accept'
          },
          url:url,
          port:443,
          method:'POST',
          body:bodyXML
        };

        //console.log(options);

        mRequest.post(options, (err, res, body) => {
            if(!err){
                resolve(body);
                callback(body);
            } else {
                reject(err);
                callback("post_error");
            }
        })
      });
    });
  },

  // FEDEX //////////////////////////////////////////////////////////
  FEDEX:function(trackingNum, callback){
    return new Promise(function(resolve, reject){
      var soap = require('soap');

      db.query('SELECT url, parentKey, parentPassword, userKey, userPassword, accountNumber, meterNumber FROM FEDEX', function(err, dbdata){
        if(err){
          reject(err);
          callback("db_error");
          return;
        }

        var key = dbdata[0].userKey;
        var pass = dbdata[0].userPassword;
        var acc = dbdata[0].accountNumber;
        var met = dbdata[0].meterNumber;

        var args = {
                      "WebAuthenticationDetail":{
                                                  "ParentCredential":{
                                                                        "Key":dbdata[0].parentKey,
                                                                        "Password":dbdata[0].parentPassword
                                                                     },
                                                  "UserCredential":{
                                                                      "Key":dbdata[0].userKey,
                                                                      "Password":dbdata[0].userPassword
                                                                   }
                                                },
                      "ClientDetail":{
                                        "AccountNumber":dbdata[0].accountNumber,
                                        "MeterNumber":dbdata[0].meterNumber
                                     },
                      "TransactionDetail":{
                                            "CustomerTransactionId":"Track By Number_v16"
                                          },
                      "Version":{
                                  "ServiceId":"trck",
                                  "Major":16,
                                  "Intermediate":0,
                                  "Minor":0
                                },
                      "SelectionDetails":{
                                            "CarrierCode":"FDXE",
                                            "PackageIdentifier":{
                                                                  "Type":"TRACKING_NUMBER_OR_DOORTAG",
                                                                  "Value":trackingNum
                                                                }
                                         },
                      "ProcessingOptions":"INCLUDE_DETAILED_SCANS"
                    };

          soap.createClient(dbdata[0].url, function(err, client) {
            // console.log(client.describe());
            // console.log("-------- wating ---------");
            client.track(args,function(err, result){
              if(!err){
                resolve(result);
                callback(result);
              } else {
                reject(err);
                callback("post_error");
              }
            });
          });
        });
    });
  },

    // DHL //////////////////////////////////////////////////////////
    DHL:function(trackingNum, callback){
      return new Promise(function(resolve, reject){
        let mRequest = require('request');

        db.query('SELECT url, siteId, password FROM DHL', function(err, dbdata){
          if(err){
            reject(err);
            callback("db_error");
            return;
          }

          let url = dbdata[0].url;
          let siteId = dbdata[0].siteId;
          let password = dbdata[0].password;

          var bodyXML = `<?xml version="1.0" encoding="UTF-8"?>
          <req:KnownTrackingRequest xmlns:req="http://www.dhl.com" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.dhl.com TrackingRequestKnown.xsd" schemaVersion="1.0">
          	<Request>
          		<ServiceHeader>
          			<MessageTime>2002-06-25T11:28:56-08:00</MessageTime>
          			<MessageReference>TrackingRequest_Single_AWB__</MessageReference>
          			<SiteID>${siteId}</SiteID>
          			<Password>${password}</Password>
          		</ServiceHeader>
          	</Request>
          	<LanguageCode>en</LanguageCode>
          	<AWBNumber>${trackingNum}</AWBNumber>
          	<LevelOfDetails>ALL_CHECK_POINTS</LevelOfDetails>
          </req:KnownTrackingRequest>`;

          let options = {
            headers:{
              'Content-Type':'application/xml',
              'Access-Control-Allow-Origin':'*',
              'Access-Control-Allow-Methods':'POST',
              'Access-Control-Allow-Headers':'Origin, X-Requested-With, Content-Type, Accept'
            },
            url:url,
            port:443,
            method:'POST',
            body:bodyXML
          };

          mRequest.post(options, (err, res, body) => {
            if(!err){
                resolve(body);
                callback(body);
            } else {
                reject(err);
                callback("post_error");
            }
          });
        });
      });
    }
}
