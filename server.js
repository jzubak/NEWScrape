var cheerio = require("cheerio");
var axios = require("axios");
var mongojs = require("mongojs");
var app = express();

axios.get("http://www.cnn.com").then(function (response) {

    // Load the HTML into cheerio
    var $ = cheerio.load(response.data);

    // Make an empty array for saving our scraped info
    var results = [];


    var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

    mongoose.connect(MONGODB_URI);


    var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("./models");

var PORT = 3000;

// Initialize Express
var app = express();

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/unit18Populater", { useNewUrlParser: true });

// Routes

// A GET route for scraping the echoJS website
app.get("/scrape", function(req, res) {
  // First, we grab the body of the html with axios
  axios.get("http://www.echojs.com/").then(function(response) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(response.data);

    $("article h2").each(function(i, element) {
      var result = {};

      result.title = $(this)
        .children("a")
        .text();
      result.link = $(this)
        .children("a")
        .attr("href");


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

// Route for saving/updating an Article's associated Note
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
