// Requiring our Note and Article models
var db = require("../models")
// Our scraping tools
var request = require("request")
var cheerio = require("cheerio")


module.exports = function (app) {

  app.get("/scrape", function (req, res) {
    request("https://lifehacker.com/tag/programming", function (error, response, body) {
      var $ = cheerio.load(response.body)

      $("article").each(function (i, element) {
        var result = {}
        result.title = $(element)
          .find("header > h1 > a")
          .text()
        result.link = $(element)
          .find("header > h1 > a")
          .attr("href")
        result.body = $(element)
          .find("div > div > p")
          .text()
        // console.log(result)
        db.Article
          .create(result)
          .then(function (dbArticle) {
            console.log(dbArticle)
          })
          .catch(function (err) {
            return res.json(err)
          })
      })
      console.log("scrape complete")
      res.send("Scrape Complete")
    })

  })

  app.get("/", function (req, res) {
    db.Article.find({})
      .then(function (dbArticle) {
        var obj = {
          article: dbArticle
        }
        res.render("index", obj)
      })
      .catch(function (err) {
        res.json(err)
      })
  })

  app.get("/articles/:id", function (req, res) {
    db.Article.findOne({
        _id: req.params.id
      })
      .populate("note")
      .then(function (dbArticle) {
        res.json(dbArticle)
      })
      .catch(function (err) {
        res.json(err)
      })
  })

  app.post("/articles/:id", function (req, res) {
    db.Note
      .create(req.body)
      .then(function (dbNote) {
        return db.Article.findOneAndUpdate({
          _id: req.params.id
        }, {
          note: dbNote._id
        }, {
          new: true
        })
      })
      .then(function (dbArticle) {
        res.json(dbArticle)
      })
      .catch(function (err) {
        res.json(err)
      })
  })
  app.delete("/delete", function (req, res) {
    db.Article.remove({}, function (err) {
      if (err) {
        console.log(err)
      }
    })
    db.Note.remove({}, function (err) {
      if (err) {
        console.log(err)
      }
    })
    res.end()
  })


}