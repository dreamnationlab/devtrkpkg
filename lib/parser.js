module.exports = {
  // calculate month
  month:function(month){
    switch(month) {
      case '01':
        return 'January';
      case '02':
        return 'February';
      case '03':
        return 'March';
      case '04':
        return 'April';
      case '05':
        return 'May';
      case '06':
        return 'June';
      case '07':
        return 'July';
      case '08':
        return 'August';
      case '09':
        return 'September';
      case '10':
        return 'October';
      case '11':
        return 'November';
      case '12':
        return 'December';
      default:
        return 'MONTH';
    }
  },
  getDay:function(setDate){
    //var d = new Date('August 17, 2018 21:43:00');
    var date = new Date(setDate);
    var weekday = new Array(7);
    weekday[0] = "Sunday";
    weekday[1] = "Monday";
    weekday[2] = "Tuesday";
    weekday[3] = "Wednesday";
    weekday[4] = "Thursday";
    weekday[5] = "Friday";
    weekday[6] = "Saturday";

    return weekday[date.getDay()];    
  },
  newCard:function(){
    return {
              "tracking_num":"",  //배송번호
              "success":"",
              "company":"",
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
                            "status":"",      //상태 사용 안함. 소스에서도 빼야함.
                            "place":"",       //장소
                            "description":""  //상태 설명
                          }
                        ],
              "event":"",  //IR,AP,IT,OD,DL :: 상태코드
              "eventnum":0 //상태숫자 :: (default:0, IR:1,AP:2,IT:3,OD:4,DL:5)
          }
  },
  // FEDEX //////////////////////////////////////////////////////////
  FEDEX:function(resJson, callback){
    console.dir(JSON.stringify(resJson));
  },
  // USPS //////////////////////////////////////////////////////////
  USPS:function(xml, callback){
    var xml2js = require('xml2js');
    var parser = new xml2js.Parser({explicitRoot:false, explicitArray:false});

    var resJson;
    parser.parseString(xml, function (err, res) {
      resJson = res;
    });
    console.dir(JSON.stringify(resJson));

    var card = this.newCard();

    // 운송장 번호 형식이 틀렸거나 정보가 없을 때
    // 나중에 확실한 에러 정보를 제공해줘야 함. 그 땐 card.success 를 이용해서 분기 처리
    if(resJson.TrackInfo.Error){
        card.success = resJson.TrackInfo.Error.Number;
        console.log('USPS ERROR -', card.success);
        callback(card);
        return;
    }

    // tracking_num
    //card.tracking_num = resJson.$.ID;
    // resJson.$.ID 를 못 읽어서 requestTracking.js 에서 값 넣어줌

    // success
    card.success = 'true';

    // exp_dv
    if(resJson.TrackInfo.ExpectedDeliveryDate){
      card.exp_dv.yy = resJson.TrackInfo.ExpectedDeliveryDate.substring(0,4);
      card.exp_dv.mm = resJson.TrackInfo.ExpectedDeliveryDate.substring(5,7);
      card.exp_dv.dd = resJson.TrackInfo.ExpectedDeliveryDate.substring(8,10);

      if(resJson.TrackInfo.ExpectedDeliveryTime){
        let ampm;
        if (resJson.TrackInfo.ExpectedDeliveryTime.substring(0,2) < 12) {
          ampm = 'AM';
        } else {
          ampm = 'PM';
        }
        card.exp_dv.time = resJson.TrackInfo.ExpectedDeliveryTime.substring(0,2) +
                          ':' +
                          resJson.TrackInfo.ExpectedDeliveryTime.substring(3,5) +
                          ' ' + ampm;
      }
    }

    // Summary
    if(resJson.TrackInfo.TrackSummary){
      var TRACKSUMMARY = resJson.TrackInfo.TrackSummary;

      card.summary.datetime = TRACKSUMMARY.EventDate +
                              ' at ' +
                              TRACKSUMMARY.EventTime;
      card.summary.status = TRACKSUMMARY.Event;
      if(TRACKSUMMARY.EventCity){
        card.summary.place = TRACKSUMMARY.EventCity;
        if(TRACKSUMMARY.EventState){
          card.summary.place += ', ' + TRACKSUMMARY.EventState;
        }
        if(TRACKSUMMARY.EventZIPCode){
          card.summary.place += ', ' + TRACKSUMMARY.EventZIPCode;
        }
        if(TRACKSUMMARY.EventCountry){
          card.summary.place += ', ' + TRACKSUMMARY.EventCountry;
        }
      }

      switch(TRACKSUMMARY.Event.substring(0,9)){
        case 'Pre-Shipm':
          card.event = "IR";
          card.eventnum = 1;
          break;
        case 'USPS in p':
          card.event = "AP";
          card.eventnum = 2;
        case 'Out for D':
          card.event = "OD";
          card.eventnum = 4;
          break;
        case 'Delivered':
          card.event = "DL";
          card.eventnum = 5;
          card.summary.status = 'Delivered';
          break;
        default:
          card.event = "IT";
          card.eventnum = 3;
      }
    }

    // 도착 완료인 경우 예상 도착 시간을 도착 완료 시간으로 갱신
    if(card.eventnum === 5){
        // 도착시간
        var splitTime = TRACKSUMMARY.EventDate.split(" ");
        card.exp_dv.yy = splitTime[2];
        card.exp_dv.mm = splitTime[0];
        card.exp_dv.dd = splitTime[1].substring(splitTime[1].length-1,0);
        card.exp_dv.time = TRACKSUMMARY.EventTime;
    }

    // history (summary 를 포함 시켜야함)
    if(resJson.TrackInfo.TrackDetail) {
      let TRACKDETAIL = resJson.TrackInfo.TrackDetail;
      let arr_history = [];

      // summary 를 history 가장 상단에 입력
      let summary = {
        "datetime":card.summary.datetime,
        "status":"",
        "place":card.summary.place,
        "description":card.summary.status
      };
      arr_history.push(summary);

      /////////////////////////////////////////////////////////////////////////
      for(let i=0, length=TRACKDETAIL.length; i < length ; i++) {
        let history = {
            "datetime":TRACKDETAIL[i].EventDate +
                       ' at ' +
                       TRACKDETAIL[i].EventTime,
            "status":"",         //상태
            "place":"",        //장소
            "description":TRACKDETAIL[i].Event  //상태 설명
          };

          // place
          if(TRACKDETAIL[i].EventCity){
            history.place = TRACKDETAIL[i].EventCity;
            if(TRACKDETAIL[i].EventState){
              history.place += ', ' + TRACKDETAIL[i].EventState;
            }
            if(TRACKDETAIL[i].EventZIPCode){
              history.place += ', ' + TRACKDETAIL[i].EventZIPCode;
            }
            if(TRACKDETAIL[i].EventCountry){
              history.place += ', ' + TRACKDETAIL[i].EventCountry;
            }
          }
          arr_history.push(history);
      }
      card.history = arr_history;
    }

    console.log(card);
    callback(card);

  },
  // DHL //////////////////////////////////////////////////////////
  DHL:function(xml, callback){
    var xml2js = require('xml2js');
    var parser = new xml2js.Parser({explicitRoot:false, explicitArray:false});

    var resJson;
    parser.parseString(xml, function (err, res) {
      resJson = res;
    });
    //console.dir(JSON.stringify(resJson));

    var card = this.newCard();

    // 운송장 번호 형식이 틀릴 때 (길이 등)
    if(resJson.Response.Status){
      if(resJson.Response.Status.ActionStatus === 'Failure'){
        card.success = 'false';
        console.log('DHL - Error Parsing incoming request XML');
        callback(card);
        return;
      }
    }

    // 운송장번호가 없거나 기타 등등의 이유로 에러
    if(resJson.AWBInfo.Status.ActionStatus != 'success'){
      //card.success = resJson.AWBInfo.Status.ActionStatus;
      card.success = 'false';
      console.log('DHL - No Shipments Found');
      callback(card);
      return;
    }

    // tracking_num
    card.tracking_num = resJson.AWBInfo.AWBNumber;

    // success
    card.success = 'true';

    // exp_dv
    if(resJson.AWBInfo.ShipmentInfo.EstDlvyDate){
      card.exp_dv.yy = resJson.AWBInfo.ShipmentInfo.EstDlvyDate.substring(0,4);
      card.exp_dv.mm = resJson.AWBInfo.ShipmentInfo.EstDlvyDate.substring(5,7);
      card.exp_dv.dd = resJson.AWBInfo.ShipmentInfo.EstDlvyDate.substring(8,10);

      let ampm;
      if (resJson.AWBInfo.ShipmentInfo.EstDlvyDate.substring(11,13) < 12) {
        ampm = 'AM';
      } else {
        ampm = 'PM';
      }
      card.exp_dv.time = resJson.AWBInfo.ShipmentInfo.EstDlvyDate.substring(11,13) +
                        ':' +
                        resJson.AWBInfo.ShipmentInfo.EstDlvyDate.substring(14,16) +
                        ' ' + ampm;
    }
    //  else {
    //   // 도착시간
    //   if(resJson.AWBInfo.ShipmentInfo.ShipmentEvent) {
    //     let SHIPMENTEVENT = resJson.AWBInfo.ShipmentInfo.ShipmentEvent;
    //     let LASTEVENT = SHIPMENTEVENT.length - 1;
    //     if (SHIPMENTEVENT[LASTEVENT].Time.substring(0,2) < 12)
    //     { ampm = 'AM'; } else { ampm = 'PM'; }
    //
    //     card.exp_dv.yy = SHIPMENTEVENT[LASTEVENT].Date.substring(0,4);
    //     card.exp_dv.mm = this.month(SHIPMENTEVENT[LASTEVENT].Date.substring(5,7));
    //     card.exp_dv.dd = SHIPMENTEVENT[LASTEVENT].Date.substring(8,10);
    //     card.exp_dv.time = SHIPMENTEVENT[LASTEVENT].Time.substring(0,2) +
    //                       ':' +
    //                       SHIPMENTEVENT[LASTEVENT].Time.substring(3,5) +
    //                       ' ' +
    //                       ampm;
    //   }
    // }

    // Summary
    if(resJson.AWBInfo.ShipmentInfo.ShipmentDate){
      if (resJson.AWBInfo.ShipmentInfo.ShipmentDate.substring(11,13) < 12) {
        ampm = 'AM';
      } else {
        ampm = 'PM';
      }
      card.summary.datetime = this.month(resJson.AWBInfo.ShipmentInfo.ShipmentDate.substring(5,7)) + ' ' +
                              resJson.AWBInfo.ShipmentInfo.ShipmentDate.substring(8,10) + ',' +
                              resJson.AWBInfo.ShipmentInfo.ShipmentDate.substring(0,4) + ' at ' +
                              resJson.AWBInfo.ShipmentInfo.ShipmentDate.substring(11,16) + ampm;
      card.summary.status = 'Shipment information received';
      card.summary.place = resJson.AWBInfo.ShipmentInfo.OriginServiceArea.Description;
      card.event = "IR";
      card.eventnum = 1;
    }

    // update summary & event, eventnum & history
    // summary
    if(resJson.AWBInfo.ShipmentInfo.ShipmentEvent) {
      let SHIPMENTEVENT = resJson.AWBInfo.ShipmentInfo.ShipmentEvent;
      // update summary
      let LASTEVENT = SHIPMENTEVENT.length - 1;
      if (SHIPMENTEVENT[LASTEVENT].Time.substring(0,2) < 12)
      { ampm = 'AM'; } else { ampm = 'PM'; }

      card.summary.datetime = this.month(SHIPMENTEVENT[LASTEVENT].Date.substring(5,7)) + ' ' + SHIPMENTEVENT[LASTEVENT].Date.substring(8,10) +
                              ', ' +
                              SHIPMENTEVENT[LASTEVENT].Date.substring(0,4) +
                              ' at ' +
                              SHIPMENTEVENT[LASTEVENT].Time.substring(0,2) +
                              ':' +
                              SHIPMENTEVENT[LASTEVENT].Time.substring(3,5) +
                              ' ' +
                              ampm;
      card.summary.status = SHIPMENTEVENT[LASTEVENT].ServiceEvent.Description;
      card.summary.place = SHIPMENTEVENT[LASTEVENT].ServiceArea.Description;
      if(SHIPMENTEVENT[LASTEVENT].ServiceEvent.EventCode === 'OK'){
          card.summary.status = 'Delivered';
      }
      // if(SHIPMENTEVENT[LASTEVENT].Signatory){
      //     card.summary.status += ' ' + SHIPMENTEVENT[LASTEVENT].Signatory;
      // }
      // event, eventnum
      switch (SHIPMENTEVENT[LASTEVENT].ServiceEvent.EventCode) {
        case 'PL' | 'DF':
          card.event = "AP";
          card.eventnum = 2;
          break
        case 'WC':``
          card.event = "OD";
          card.eventnum = 4;
          break
        case 'OK':
          card.event = "DL";
          card.eventnum = 5;
          break
        default:
          card.event = "IT";
          card.eventnum = 3;
      }

      // 도착 완료인 경우 예상 도착 시간을 도착 완료 시간으로 갱신
      if(card.eventnum === 5){
          // 도착시간
          if (SHIPMENTEVENT[LASTEVENT].Time.substring(0,2) < 12)
          { ampm = 'AM'; } else { ampm = 'PM'; }

          card.exp_dv.yy = SHIPMENTEVENT[LASTEVENT].Date.substring(0,4);
          card.exp_dv.mm = this.month(SHIPMENTEVENT[LASTEVENT].Date.substring(5,7));
          card.exp_dv.dd = SHIPMENTEVENT[LASTEVENT].Date.substring(8,10);
          card.exp_dv.time = SHIPMENTEVENT[LASTEVENT].Time.substring(0,2) +
                            ':' +
                            SHIPMENTEVENT[LASTEVENT].Time.substring(3,5) +
                            ' ' +
                            ampm;
      }

      // history
      let arr_history = [];
      for(i=LASTEVENT; i >= 0 ; i--) {
        if (SHIPMENTEVENT[i].Time.substring(0,2) < 12)
        { ampm = 'AM'; } else { ampm = 'PM'; }

        let history = {
            "datetime":this.month(SHIPMENTEVENT[i].Date.substring(5,7)) + ' ' + SHIPMENTEVENT[i].Date.substring(8,10) +
                      ', ' +
                      SHIPMENTEVENT[i].Date.substring(0,4) +
                      ' at ' +
                      SHIPMENTEVENT[i].Time.substring(0,2) +
                      ':' +
                      SHIPMENTEVENT[i].Time.substring(3,5) +
                      ' ' +
                      ampm,
            "status":SHIPMENTEVENT[i].ServiceEvent.EventCode,         //상태
            "place":SHIPMENTEVENT[i].ServiceArea.Description,        //장소
            "description":SHIPMENTEVENT[i].ServiceEvent.Description  //상태 설명
          };
          if(SHIPMENTEVENT[i].Signatory){
              history.description += ' ' + SHIPMENTEVENT[i].Signatory;
          }

          arr_history.push(history);
      }
      card.history = arr_history;
    }

    console.log(card);
    callback(card);
  },

  // UPS //////////////////////////////////////////////////////////
  // explicitArray:false 적용 하기 필요함, history 없을 때 summary 처리
  UPS:function(xml, callback){
    // xml2js
    var xml2js = require('xml2js');
    var parser = new xml2js.Parser();

    var resJson;
    parser.parseString(xml, function (err, res) {
      resJson = res;
    });
    //console.dir(JSON.stringify(resJson));

    var card = this.newCard();

    // 운송장번호가 없거나 기타 등등의 이유로 에러
    if(resJson.TrackResponse.Response[0].ResponseStatusDescription[0] != 'Success'){
      //card.success = resJson.AWBInfo.Status.ActionStatus;
      card.success = 'false';
      console.log('UPS - ', resJson.TrackResponse.Response[0].Error[0].ErrorDescription[0]);
      callback(card);
      return;
    }

    ////////////////////////////////////////////////////////////////////////////
    let SHIPMENT = resJson.TrackResponse.Shipment;

    // tracking_num
    if(SHIPMENT[0].ShipmentIdentificationNumber){
      card.tracking_num = SHIPMENT[0].ShipmentIdentificationNumber[0];
    }

    // success
    card.success = 'true';

    // exp_dv
    if(SHIPMENT[0].ScheduledDeliveryDate){
      card.exp_dv.yy = SHIPMENT[0].ScheduledDeliveryDate[0].substring(0,4);
      card.exp_dv.mm = this.month(SHIPMENT[0].ScheduledDeliveryDate[0].substring(4,6));
      card.exp_dv.dd = SHIPMENT[0].ScheduledDeliveryDate[0].substring(6,8);

      if(SHIPMENT[0].ScheduledDeliveryTime){
        let ampm;
        if (SHIPMENT[0].ScheduledDeliveryTime[0].substring(0,2) < 12) {
          ampm = 'AM';
        } else {
          ampm = 'PM';
        }
        card.exp_dv.time = SHIPMENT[0].ScheduledDeliveryTime[0].substring(0,2) +
                          ':' +
                          SHIPMENT[0].ScheduledDeliveryTime[0].substring(2,4) +
                          ' ' + ampm;
      }
    }
    // else {
    //   // 도착 시간
    //   if(SHIPMENT[0].Package[0].Activity){
    //     let ACTIVITY = SHIPMENT[0].Package[0].Activity;
    //     // April 21,2018 at 8:00 PM
    //     let ampm;
    //     if (ACTIVITY[0].Time[0].substring(0,2) < 12) {
    //       ampm = 'AM';
    //     } else {
    //       ampm = 'PM';
    //     }
    //
    //     card.exp_dv.yy = ACTIVITY[0].Date[0].substring(0,4);
    //     card.exp_dv.mm = this.month(ACTIVITY[0].Date[0].substring(4,6));
    //     card.exp_dv.dd = ACTIVITY[0].Date[0].substring(6,8);
    //     card.exp_dv.time = ACTIVITY[0].Time[0].substring(0,2) +
    //                       ':' +
    //                       ACTIVITY[0].Time[0].substring(2,4) +
    //                       ' ' +
    //                       ampm;
    //   }
    // }

    if(SHIPMENT[0].Package){
      // summary
      if(SHIPMENT[0].Package[0].Activity){
        let ACTIVITY = SHIPMENT[0].Package[0].Activity;
        // April 21,2018 at 8:00 PM
        let ampm;
        if (ACTIVITY[0].Time[0].substring(0,2) < 12) {
          ampm = 'AM';
        } else {
          ampm = 'PM';
        }

        card.summary.datetime = this.month(ACTIVITY[0].Date[0].substring(4,6)) + ' ' + ACTIVITY[0].Date[0].substring(6,8) +
                                ', ' +
                                ACTIVITY[0].Date[0].substring(0,4) +
                                ' at ' +
                                ACTIVITY[0].Time[0].substring(0,2) +
                                ':' +
                                ACTIVITY[0].Time[0].substring(2,4) +
                                ' ' +
                                ampm;

        card.summary.status = ACTIVITY[0].Status[0].StatusType[0].Description[0];
        card.summary.place = ACTIVITY[0].ActivityLocation[0].Address[0].City[0] +
                             ', ' +
                             ACTIVITY[0].ActivityLocation[0].Address[0].CountryCode[0];

        // event, eventnum
        switch (ACTIVITY[0].Status[0].StatusCode[0].Code[0]) {
          case 'MP':
            card.event = "IR";
            card.eventnum = 1;
            break
          case 'OR':
            card.event = "AP";
            card.eventnum = 2;
            break
          case 'DP' | 'AR' | 'OF' | 'YP':
            card.event = "IT";
            card.eventnum = 3;
            break
          case 'OT':
            card.event = "OD";
            card.eventnum = 4;
            break
          case 'KB':
            card.event = "DL";
            card.eventnum = 5;
            break
          default:
            card.event = "IT";
            card.eventnum = 3;
        }

        // 도착 완료인 경우 예상 도착 시간을 도착 완료 시간으로 갱신
        if(card.eventnum === 5){
            // 도착 시간
            // April 21,2018 at 8:00 PM
            let ampm;
            if (ACTIVITY[0].Time[0].substring(0,2) < 12) {
              ampm = 'AM';
            } else {
              ampm = 'PM';
            }

            card.exp_dv.yy = ACTIVITY[0].Date[0].substring(0,4);
            card.exp_dv.mm = this.month(ACTIVITY[0].Date[0].substring(4,6));
            card.exp_dv.dd = ACTIVITY[0].Date[0].substring(6,8);
            card.exp_dv.time = ACTIVITY[0].Time[0].substring(0,2) +
                              ':' +
                              ACTIVITY[0].Time[0].substring(2,4) +
                              ' ' +
                              ampm;
        }

        // history
        let arr_history = [];
        for(let i=0, length=ACTIVITY.length; i < length ; i++) {
          if (ACTIVITY[i].Time[0].substring(0,2) < 12) {
            ampm = 'AM';
          } else {
            ampm = 'PM';
          }
          let history = {
              "datetime":this.month(ACTIVITY[i].Date[0].substring(4,6)) + ' ' + ACTIVITY[i].Date[0].substring(6,8) +
                        ', ' +
                        ACTIVITY[i].Date[0].substring(0,4) +
                        ' at ' +
                        ACTIVITY[i].Time[0].substring(0,2) +
                        ':' +
                        ACTIVITY[i].Time[0].substring(2,4) +
                        ' ' +
                        ampm,
              "status":ACTIVITY[i].Status[0].StatusType[0].Description[0],      //상태
              "place":"",                                                       //장소
              "description":ACTIVITY[i].Status[0].StatusType[0].Description[0]  //상태 설명
            };

            // history.place
            if(ACTIVITY[i].ActivityLocation){
              let cityName = "";
              let stateProvinceCode = "";
              let countryCode = "";

              if(ACTIVITY[i].ActivityLocation[0].Address[0].City){
                cityName = ACTIVITY[i].ActivityLocation[0].Address[0].City[0] + ', ';
              }
              if(ACTIVITY[i].ActivityLocation[0].Address[0].StateProvinceCode){
                stateProvinceCode = ACTIVITY[i].ActivityLocation[0].Address[0].StateProvinceCode[0] + ', ';
              }
              if(ACTIVITY[i].ActivityLocation[0].Address[0].CountryCode){
                countryCode = ACTIVITY[i].ActivityLocation[0].Address[0].CountryCode[0];
              }
              history.place = cityName + stateProvinceCode + countryCode;
            }
            arr_history.push(history);
        }
        card.history = arr_history;
      }
    }
    console.log(card);
    callback(card);
  }
}
