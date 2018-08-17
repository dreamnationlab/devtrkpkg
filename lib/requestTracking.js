var db = require('./db');
var parser = require('./parser');

module.exports = {
  byNums:async function (trackingNums, callback){
    var arr_nums = [];
    console.log('length - ', trackingNums.length);
    for(let iter = 0, length = trackingNums.length; iter < length; iter++){
      // 택배사 구분 함수 필요
      //
      var isContinue = '';
      //     await this.FEDEX(trackingNums[iter], function(result){
      //     //this.FEDEX('9612019733974263675927'); // Authentication Failed 상태(메일 문의)
      //     let isTrue = '';
      //     if(result != 'error'){
      //       isTrue = 'true';
      //     } else {
      //       isTrue = 'false';
      //       result = '<result>error</resut>';
      //     }
      //     parser.FEDEX(isTrue, result, function(result){
      //       arr_nums.push(result);
      //       if(arr_nums.length === length){
      //         callback(arr_nums);
      //       }
      //     });
      // });
      // console.log('FEDEX - isContinue : ',isContinue);
      // if(isContinue === 'true'){
      //   console.log('=============== Next Number ================');
      //   continue;
      // }
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
              console.log('DHL ----------');
              console.log(arr_nums.length);
              console.log(length);
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
      //trackingNum = '9361289681090397739347';
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

        //let url = 'https://wwwcie.ups.com/ups.app/xml/Track'; //test
        let url = dbdata[0].url; //live
        let accessLicenseNumber = dbdata[0].accessLicenseNumber;
        let userId = dbdata[0].userId;
        let password = dbdata[0].password;
        //trackingNum = "1Z30AV920403398996";
        //trackingNum = "1Z1A48T90315691657";

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
    var soap = require('soap');

    db.query('SELECT url, parentKey, parentPassword, userKey, userPassword, accountNumber, meterNumber FROM FEDEX', function(err, dbdata){
      if(err){
        callback("db_error");
        return;
      }

      //let wsdlURL = dbdata[0].url;

      //trackingNum = '9612019733974263675927'; // 테스트툥
      trackingNum ='782146633035';

      var key = dbdata[0].userKey;
      var pass = dbdata[0].userPassword;
      var acc = dbdata[0].accountNumber;
      var met = dbdata[0].meterNumber;

      var argXML = `
          <v16:TrackRequest>
             <v16:WebAuthenticationDetail>
                <v16:ParentCredential>
                   <v16:Key>'${key}'</v16:Key>
                   <v16:Password>'${pass}'</v16:Password>
                </v16:ParentCredential>
                <v16:UserCredential>
                   <v16:Key>'${key}'</v16:Key>
                   <v16:Password>'${pass}'</v16:Password>
                </v16:UserCredential>
             </v16:WebAuthenticationDetail>
             <v16:ClientDetail>
                <v16:AccountNumber>'${acc}'</v16:AccountNumber>
                <v16:MeterNumber>'${met}'</v16:MeterNumber>
             </v16:ClientDetail>
             <v16:TransactionDetail>
                <v16:CustomerTransactionId>Track By Number_v16</v16:CustomerTransactionId>
                <v16:Localization>
                   <v16:LanguageCode>EN</v16:LanguageCode>
                   <v16:LocaleCode>US</v16:LocaleCode>
                </v16:Localization>
             </v16:TransactionDetail>
             <v16:Version>
                <v16:ServiceId>trck</v16:ServiceId>
                <v16:Major>14</v16:Major>
                <v16:Intermediate>0</v16:Intermediate>
                <v16:Minor>0</v16:Minor>
             </v16:Version>
             <v16:SelectionDetails>
                <v16:CarrierCode>FDXE</v16:CarrierCode>
                <v16:PackageIdentifier>
                   <v16:Type>TRACKING_NUMBER_OR_DOORTAG</v16:Type>
                   <v16:Value>'${trackingNum}'</v16:Value>
                </v16:PackageIdentifier>
                <v16:ShipmentAccountNumber/>
                <v16:SecureSpodAccount/>
                  <v16:Destination>
                   <v16:GeographicCoordinates>rates evertitque aequora</v16:GeographicCoordinates>
                </v16:Destination>
             </v16:SelectionDetails>
          </v16:TrackRequest>
      `;


      // var args = {
      //               "WebAuthenticationDetail":{
      //                                           "ParentCredential":{
      //                                                                 "Key":dbdata[0].parentKey,
      //                                                                 "Password":dbdata[0].parentPassword
      //                                                              },
      //                                           "UserCredential":{
      //                                                               "Key":dbdata[0].userKey,
      //                                                               "Password":dbdata[0].userPassword
      //                                                            }
      //                                         },
      //               "ClientDetail":{
      //                                 "AccountNumber":dbdata[0].accountNumber,
      //                                 "MeterNumber":dbdata[0].meterNumber
      //                              },
      //               "TransactionDetail":{
      //                                     "CustomerTransactionId":"Track By Number_v16"
      //                                   },
      //               "Version":{
      //                           "ServiceId":"trck",
      //                           "Major":16,
      //                           "Intermediate":0,
      //                           "Minor":0
      //                         },
      //               "SelectionDetails":{
      //                                     "PackageIdentifier":{
      //                                                           "Type":"TRACKING_NUMBER_OR_DOORTAG",
      //                                                           "Value":trackingNum
      //                                                         }
      //                                  },
      //
      //             };

        soap.createClient(dbdata[0].url, function(err, client) {
          console.log(client.describe());
          console.log("-------- wating ---------");

          client.track(args,function(err, result){
            if(!err){
                callback(result);
            } else {
                callback("post_error");
            }
            console.log(result);
          });
        });
      });
    },

    // DHL //////////////////////////////////////////////////////////
    DHL:function(trackingNum, callback){
      return new Promise(function(resolve, reject){
        let mRequest = require('request');
        //trackingNum = "2398427905";
        db.query('SELECT url, siteId, password FROM DHL', function(err, dbdata){
          if(err){
            reject(err);
            callback("db_error");
            return;
          }

          let url = dbdata[0].url;
          let siteId = dbdata[0].siteId;
          let password = dbdata[0].password;

          // test
          // let url = "https://xmlpitest-ea.dhl.com/XMLShippingServlet";
          // let siteId = 'v62_aZHhSPLXzn';
          // let password = 'wBR08W1839';

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
                //console.log(body);
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
