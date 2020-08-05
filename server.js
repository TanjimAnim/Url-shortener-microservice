"use strict";

var express = require("express");
var mongo = require("mongodb");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var validUrl = require("valid-url");
var cors = require("cors");

var app = express();
var shortId = require("shortid");

// Basic Configuration
var port = process.env.PORT || 3000;


mongoose.connect(process.env.DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

app.use(cors());

var urlencodedParser = bodyParser.urlencoded({ extended: false });

app.use("/public", express.static(process.cwd() + "/public"));

app.get("/", function(req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

app.listen(port, function() {
  console.log("Node.js listening ...");
});

const shorturlSchema = mongoose.Schema({
  originalUrl: String,
  shortUrl: {
    type: String,
    default: shortId.generate
  }
});

const ShortUrl = mongoose.model("ShortUrl", shorturlSchema);

app.post("/api/shorturl/new", urlencodedParser, async (req, res) => {
  var url = req.body.url;
  if (!validUrl.isWebUri(url)) {
    res.json({ error: "invalid url" });
  } else {
    try{
      var existingUrl = await ShortUrl.findOne({ originalUrl: url });
      
    } catch(err){
      console.log(err)
      res.json("error occured")
    }
    console.log(existingUrl)
    if (existingUrl === null) {
      var newUrl = new ShortUrl({
        originalUrl: url
      });
      try {
        await newUrl.save();
      } catch (err) {
        console.log("error", err);
        return res.json({
          error: "failed to store in database"
        });
      }
      res.json({
        original_url: newUrl.originalUrl,
        short_url: newUrl.shortUrl
      });
    } else if (existingUrl.originalUrl === url) {
      res.json({
        "original Url": existingUrl.originalUrl,
        "short Url": existingUrl.shortUrl
      }); 
    }
  }
});

app.get("/api/shorturl/:short_url?", async (req, res) => {
  const smallUrl = req.params.short_url;
  if (smallUrl === undefined) res.json({ error: "undefined" });
  else {
    try {
      const actualUrl = await ShortUrl.findOne({ shortUrl: smallUrl });
      if (actualUrl === null) res.json({ error: "wrong short Url entered" });
      else res.redirect(actualUrl.originalUrl);
    } catch (error) {
      console.log("error", error);
      return res.json({
        error: "failed to get from database"
      });
    }
  }
});
