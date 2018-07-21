module.exports = {
  USPS:function(trackingNum){
    let mRequest = require('request');
    let bodyXML = `http://stg-production.shippingapis.com/ShippingAPI.dll?API=TrackV2&XML=
        <?xml version="1.0" encoding="UTF-8"?>
        <TrackRequest USERID="581DREAM1066">
          <TrackID ID="${trackingNum}">
          </TrackID>
        </TrackRequest>`;

    console.log(bodyXML);

    let options = {
      headers:{
        'Content-Type':'application/xml'
      },
      url:bodyXML,
      port:443,
      //body:bodyXML,
      method:'POST'
    };

    console.log(options);

    mRequest.post(options, (err, res, body) => {
        console.log(body);d
    });
  },
  UPS:function(trackingNum){
    let mRequest = require('request');
    var bodyXML = `<?xml version="1.0"?>
        <AccessRequest xml:lang="en-US">
          <AccessLicenseNumber>FD49EDE1BFC0FF18</AccessLicenseNumber>
          <UserId>dreamnations</UserId>
          <Password>qkrtmxj0o)O</Password>
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
      url:'https://wwwcie.ups.com/ups.app/xml/Track',
      port:443,
      method:'POST',
      body:bodyXML
    };

    mRequest.post(options, (err, res, body) => {
        console.log(body);
    })
  },
  FEDEX:function(trackingNum){
    var parentKey = '0';
    var parentPasswd = '0';
    var userKey = 'VdDqb7NIO2P8xXXi';
    var userPasswd = 'qkrtmxj0o)O';
    var accountNumber = '510087500';
    var meterNumber = '119063058';
    var soap = require('soap');
    var url = '/fedex_wsdl/TrackService_v14.wsdl';
    var args = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                xmlns:v14="http://fedex.com/ws/track/v14">
                   <soapenv:Header/>
                     <soapenv:Body>
                      <v14:TrackRequest>
                        <v14:WebAuthenticationDetail>
                          <v14:ParentCredential>
                            <v14:Key>${parentKey}</v14:Key>
                            <v14:Password>${parentPasswd}</v14:Password>
                        </v14:ParentCredential>
                        <v14:UserCredential>
                          <v14:Key>${userKey}</v14:Key>
                          <v14:Password>${userPasswd}</v14:Password>
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
    soap.createClient(url, function(err, client) {
        client.MyFunction(args, function(err, result) {
            console.log(result);
        });
    });
  },
  DHL:function(trackingNum){

  }
}
