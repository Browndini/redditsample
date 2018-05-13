var createError = require("http-errors");
var express = require("express");
let https = require("https");
let _ = require("lodash");
var moment = require("moment");
var path = require("path");

var indexRouter = require("./routes/index");

var app = express();

// view engine setup
// app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(express.static(path.join(__dirname, "public")));
app.use(express.static("public"));

app.use("/:search/:next?", function(req, res) {
  const search = req.params.search;
  const after =
    req.params.next !== undefined ? `?after=${req.params.next}` : "";
  console.log(after);
  let data = "";
  https.get(`https://www.reddit.com/r/${search}.json${after}`, response => {
    response.on("data", d => {
      data += d;
    });
    response.on("error", e => {
      console.log("errrrror");
    });
    response.on("end", () => {
      // const theData = JSON.parse(data);
      console.log("ddd ", JSON.parse(data).data.children);
      res.render("index", {
        moment: moment,
        url: req.baseUrl,
        search: req.params.search,
        data: _.get(JSON.parse(data), "data", ""),
        message: "Hello there!"
      });
    });
  });
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

module.exports = app;
