var express = require('express')
var app = express()
require('dotenv').config()

var Clarifai = require('clarifai');

// instantiate a new Clarifai app passing in your clientId and clientSecret
var myApp = new Clarifai.App(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET
);




app.get('*', function (req, res) {
  let param = req.params["0"]
  let result
  if (param == '/'){
    res.send("Server running")
  }
  else{
    myApp.models.predict("e466caa0619f444ab97497640cefc4dc", ''+param.substring(1)+'').then(
      function(response) {
        console.log('success back end!!');
        console.log(response.outputs[0].data.regions[0].data.face.identity.concepts[0]);
        result = response.outputs[0].data.regions[0].data.face.identity.concepts[0];
        console.log(result);
        res.send(JSON.stringify({ result }))
      },
      function(err) {
        console.error(err);
      }
    )
  }

})



app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
