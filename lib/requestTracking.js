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
        console.log(body);
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

  },
  DHL:function(trackingNum){

  }
}
