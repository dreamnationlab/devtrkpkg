var db = require('./db');

module.exports = {
  // USPS //////////////////////////////////////////////////////////
  USPS:function(trackingNum, callback){
    let mRequest = require('request');

    // DB
    db.query('SELECT url, userId FROM USPS', function(err, dbdata){
      if(err){
        console.log(err);
      }

      let url = dbdata[0].url;
      let userId = dbdata[0].userId;

      let bodyXML = `${url}
          <?xml version="1.0" encoding="UTF-8"?>
          <TrackRequest USERID='${userId}'>
            <TrackID ID='${trackingNum}'>
            </TrackID>
          </TrackRequest>`;
      //console.log(bodyXML);

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
          console.log(body);
          callback(body);
      });
    });
  },

  // UPS //////////////////////////////////////////////////////////
  UPS:function(trackingNum, callback){
    let mRequest = require('request');

    db.query('SELECT url, accessLicenseNumber, userId, password FROM UPS', function(err, dbdata){
      if(err){ console.log(err);}

      //let url = 'https://wwwcie.ups.com/ups.app/xml/Track'; //test
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

      mRequest.post(options, (err, res, body) => {
          console.log(body);
          callback(body);
      })
    });
  },

  // FEDEX //////////////////////////////////////////////////////////
  FEDEX:function(trackingNum, callback){
    var soap = require('soap');

    db.query('SELECT url, parentKey, parentPassword, userKey, userPassword, accountNumber, meterNumber FROM FEDEX', function(err, dbdata){
      if(err){ console.log(err);}

      // test
      // let parentKey = 'VdDqb7NlO2P8xXXi';
      // let parentPassword = 'MmskJYkbQaKrPQeIwJhHo2SU0';
      // let userKey = 'VdDqb7NlO2P8xXXi';
      // let userPassword = 'MmskJYkbQaKrPQeIwJhHo2SU0';
      // let accountNumber = 510087500;
      // let meterNumber = 119063058;

      // live
      let parentKey = "Ubg5Jik55Lfp2Cfd";
      let parentPassword = "SLxU0Ulg8zfreRf4wuXYT2G8Z";
      let userKey = "Ubg5Jik55Lfp2Cfd";
      let userPassword = "SLxU0Ulg8zfreRf4wuXYT2G8Z";
      let accountNumber = 932438097;
      let meterNumber = 113085725;

      let wsdlURL = dbdata[0].url;
      // let parentKey = dbdata[0].parentKey;
      // let parentPassword = dbdata[0].parentPassword;
      // let userKey = dbdata[0].userKey;
      // let userPassword = dbdata[0].userPassword;
      // let accountNumber = dbdata[0].accountNumber;
      // let meterNumber = dbdata[0].meterNumber;

      var args = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                  xmlns:v14="http://fedex.com/ws/track/v14">
                     <soapenv:Header/>
                       <soapenv:Body>
                        <v14:TrackRequest>
                          <v14:WebAuthenticationDetail>
                            <v14:ParentCredential>
                              <v14:Key>${parentKey}</v14:Key>
                              <v14:Password>${parentPassword}</v14:Password>
                            </v14:ParentCredential>
                            <v14:UserCredential>
                              <v14:Key>${userKey}</v14:Key>
                              <v14:Password>${userPassword}</v14:Password>
                            </v14:UserCredential>
                          </v14:WebAuthenticationDetail>
                          <v14:ClientDetail>
                            <v14:AccountNumber>${accountNumber}</v14:AccountNumber>
                            <v14:MeterNumber>${meterNumber}</v14:MeterNumber>
                          </v14:ClientDetail>
                          <v14:TransactionDetail>
                            <v14:CustomerTransactionId>Track By Number_v14</v14:CustomerTransactionId>
                            <v14:Localization>
                                <v14:LanguageCode>EN</v14:LanguageCode>
                                <v14:LocaleCode>US</v14:LocaleCode>
                            </v14:Localization>
                          </v14:TransactionDetail>
                         <v14:Version>
                           <v14:ServiceId>trck</v14:ServiceId>
                           <v14:Major>14</v14:Major>
                           <v14:Intermediate>0</v14:Intermediate>
                           <v14:Minor>0</v14:Minor>
                         </v14:Version>
                         <v14:SelectionDetails>
                            <v14:CarrierCode>FDXE</v14:CarrierCode>
                            <v14:PackageIdentifier>
                              <v14:Type>TRACKING_NUMBER_OR_DOORTAG</v14:Type>
                              <v14:Value>${trackingNum}</v14:Value>
                            </v14:PackageIdentifier>
                            <v14:ShipmentAccountNumber/>
                            <v14:SecureSpodAccount/>
                              <v14:Destination>
                              <v14:GeographicCoordinates>rates evertitque
                        aequora</v14:GeographicCoordinates>
                              </v14:Destination>
                         </v14:SelectionDetails>
                     </v14:TrackRequest>
                   </soapenv:Body>
                 </soapenv:Envelope>`;

                 console.log(args);

        soap.createClient(wsdlURL, function(err, client) {
          console.log(client.describe());
          console.log("-------- wating ---------");

          client.TrackService.TrackServicePort.track(args,function(err, result){
            console.log(result);
            callback(result);
          });
        });
      });
    },

    // DHL //////////////////////////////////////////////////////////
    DHL:function(trackingNum, callback){
      let mRequest = require('request');

      db.query('SELECT url, siteId, password FROM DHL', function(err, dbdata){
        if(err){ console.log(err);}

        let url = dbdata[0].url;
        let siteId = dbdata[0].siteId;
        let password = dbdata[0].password;
        // test : https://xmlpitest-ea.dhl.com/XMLShippingServlet
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
            console.log(body);
            callback(body);
        });
      });
    }
}
