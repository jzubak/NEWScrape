var cheerio = require("cheerio");
var axios = require("axios");
var mongojs = require("mongojs");
var express = require("express");
var mongoose = require("mongoose");

// var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
//     mongoose.connect(MONGODB_URI);

var db = require("./models");

var PORT = 3000;

var app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/NEWScrape", { useNewUrlParser: true });

// Routes
app.get("/scrape", function(req, res) {
  axios.get("https://www.newyorker.com/popular").then(function(response) {
    var $ = cheerio.load(response.data);
    console.log("data" + $);
    $("div.Card__mostPopularRiver___2N9m5 > div").each(function(i, element) {
      var result = {};

      result.title = $(this)
        .find("h3")
        .text();
      result.desc = $(this)
        .find("p")
        .text();
      result.link = $(this)
      .find("h3")
      .parent()
      .attr("href");
    console.log(result);

      db.Article.create(result)
        .then(function(dbArticle) {

          console.log(dbArticle);
        })
        .catch(function(err) {

          console.log(err);
        });
    });

    res.send("Scrape Complete");
  });
});

app.get("/articles", function(req, res) {
  db.Article.find({})
  .then(function(Articles){
    res.json(Articles)
  })
});

app.get("/articles/:id", function(req, res) {
  db.Article.findOne({
    _id: req.params.id})
  .populate("note")
  .then(function(artWiNote){
    res.json(artWiNote)
  })
  .catch(function(err){
    res.json(err)
  })
});

app.post("/articles/:id", function(req, res) {
  db.Note.create(req.body)
  .then(function(dbNote){
    return db.Article.findOneAndUpdate({_id: req.params.id}, {note: dbNote._id},{new: true})
  })
  .then(function(dbArticle){
    res.json(dbArticle)
  })
  db.Article.create()
});

// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
