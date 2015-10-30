
module.exports = {

  // Generates a unique row key
  // Code Resource: http://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
  generateRowKey : function() {
    var rndstr = function() {
      return ((0x10000*(Math.random()+1))|0).toString(16).substring(1);
    };
    return (rndstr()+rndstr()+"-"+rndstr()+"-"+rndstr()+"-"+rndstr()+"-"+rndstr()+rndstr()+rndstr());
  }
  
};
