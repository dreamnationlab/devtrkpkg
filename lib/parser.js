module.exports = {
  // USPS //////////////////////////////////////////////////////////
  USPS:function(xml, callback){

  },

  // UPS //////////////////////////////////////////////////////////
  UPS:function(xml, callback){
    // xml2js
    // json parsing
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
