var express = require('express')
var concat = require('concat-stream');
var bodyParser = require('body-parser')
var app = express()
require('dotenv').config()
var Clarifai = require('clarifai')


// parse application/json
app.use(bodyParser.json());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse the raw data
app.use(bodyParser.raw());
// parse text
app.use(bodyParser.text());

var port = process.env.PORT || 3000


// instantiate a new Clarifai app passing in your clientId and clientSecret
var myApp = new Clarifai.App(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET
)

app.get('*', function (req, res) {
  let param = req.params['0']
  let result
  if (param === '/') {
    res.send('Server running')
  } else {
    // myApp.models.predict('e466caa0619f444ab97497640cefc4dc', '' + param.substring(1) + '').then(
    //   function (response) {
    //     console.log('success back end!!')
    //     result = response.outputs[0].data.regions[0].data.face.identity.concepts[0]
    //     // console.log(result)
    //     res.send(JSON.stringify({ result }))
    //   },
    //   function (err) {
    //     console.error(err)
    //   }
    // )
  }
})

app.post('/', function(req, res, next){
  let result='hello';
  req.pipe(concat(function(data){
    var image64 = data.toString('base64');
    myApp.models.predict('e466caa0619f444ab97497640cefc4dc', "https://samples.clarifai.com/celebrity.jpeg").then(
    // myApp.models.predict('e466caa0619f444ab97497640cefc4dc', {base64: "" + image64 +""}).then(
      function (response) {
        result = response.outputs[0].data.regions[0].data.face.identity.concepts[0]
        console.log('i am go through', result);
        res.end(JSON.stringify(result))
      },
      function (err) {
        console.error(err)
      }
    )
  }))
})

app.listen(port, function () {
  console.log('Example app listening on port: ' + port)
})
