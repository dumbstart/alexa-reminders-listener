var reminders = require('alexa-reminders')
var express = require('express')
var ngrok = require('ngrok')
var bodyParser = require('body-parser')
var app = express()
const serverPort = 8091
var savedConfig = {}
var urlencodedParser = bodyParser.urlencoded({ extended: false })

AMAZON_USER=$(jq --raw-output ".amazon_login" $CONFIG_PATH)
AMAZON_PASS=$(jq --raw-output ".amazon_password" $CONFIG_PATH)
AMAZON_NAME=$(jq --raw-output ".alexa_device_name" $CONFIG_PATH)


reminders.login("$AMAZON_NAME", "$AMAZON_USER", "$AMAZON_PASS", function(error, response, config){
  savedConfig = config
  console.log(response)
})

app.post('/alexa-reminders', urlencodedParser, function (req, res) {
  var reminder = req.body.reminder;
  reminders.setReminder(reminder, null, savedConfig, function(error, response){
    res.send(response)
  })
})

app.listen(serverPort, function () {
  ngrok.connect(serverPort, function (err, url) {
    console.log('External endpoint:')
    console.log('curl -X POST -d "reminder=Reminder text" ' + url + '/alexa-reminders')
    console.log('Internal endpoint:')
    console.log('curl -X POST -d "reminder=Reminder text" ' + 'http://localhost:' + serverPort + '/alexa-reminders')
  })
})
