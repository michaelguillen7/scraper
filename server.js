// require packages
var mongoose = require("mongoose")
var express = require("express")
var bodyParser = require("body-parser")
var hbars = require("express-handlebars")
var cheerio = require("cheerio")
var request = require("request")
// require models
var db = require("./models")
// instantiate app
var PORT = process.env.PORT || 3000
var app = express()
// configure middleware
app.use(express.static("public"))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(bodyParser.text())
app.use(bodyParser.json({
  type: "application/vnd.api+json"
}))

app.engine("handlebars", hbars({
  defaultLayout: "main"
}))
app.set("view engine", "handlebars")

// Database configuration with mongoose
const config = require('./config/database')
// Set mongoose to leverage built in JavaScript ES6 Promises
mongoose.Promise = Promise
mongoose
  .connect(config.database)
  .then(result => {
    console.log(`Connected to database '${result.connections[0].name}' on ${result.connections[0].host}:${result.connections[0].port}`)
  })
  .catch(err => console.log('There was an error with your connection:', err))

// require routes
// require("./routes/html-routes.js")(app)
require("./routes/api-routes.js")(app)

// listen
app.listen(PORT, function () {
  console.log("App is listening on port: " + PORT)
})