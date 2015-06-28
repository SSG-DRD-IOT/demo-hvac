 var fs = require('fs');

  var data = fs.readFileSync('./config.json'),
      myObj;

  try {
    myObj = JSON.parse(data);
    console.dir(myObj);
    console.log(myObj.name);
  }
  catch (err) {
    console.log('There has been an error parsing your JSON.')
    console.log(err);
  }

