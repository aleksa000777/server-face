var express = require('express')
var app = express()
require('dotenv').config()
var Clarifai = require('clarifai')
const formidable = require('express-formidable');

app.use(formidable());

var port = process.env.PORT || 3000

// instantiate a new Clarifai app passing in your clientId and clientSecret
var myApp = new Clarifai.App(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET
)

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('*', function (req, res) {
  let param = req.params['0']
  let result
  if (param === '/') {
    res.send('Server running')
  }
})

app.post('/', function(req, res, next){
  let apiV = req.query.v === "celebrity" ? 'e466caa0619f444ab97497640cefc4dc' : 'c0c0ac362b03416da06ab3fa36fb58e3'
  if(req.fields.csv.length){
    return myApp.models.predict(apiV, {base64: req.fields.csv }).then(
      function (response) {
        if(response.outputs){
          result = response.outputs[0].data.regions;
          res.end(JSON.stringify({ result }))
          next();
          return
        }
        else{
          res.end(JSON.stringify({ "result":{"name":"Not found"} }))
        }
      },
      function (err) {
        throw err
      }
    ).catch(function(err){
      res.end(JSON.stringify({ "result":{"name":"error"} }))
      next();
      return
    })
  }
  else{
    res.end(JSON.stringify({ "result":{"name":"error on server"} }))
  }
return
})

app.listen(port, function () {
  console.log('Example app listening on port: ' + port)
})
