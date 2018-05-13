var createError = require("http-errors");
var express = require("express");
let https = require("https");
let _ = require("lodash");
var moment = require("moment");

var app = express();

app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));

app.use("/:search?/:next?", function(req, res) {
  const search = req.params.search ? req.params.search : "all";
  const after =
    req.params.next !== undefined ? `?after=${req.params.next}` : "";
  let data = "";

  https.get(`https://www.reddit.com/r/${search}.json${after}`, response => {
    response.on("data", d => {
      data += d;
    });

    response.on("end", () => {
      if (!JSON.parse(data).error) {
        res.render("index", {
          moment: moment,
          url: req.baseUrl,
          search: search,
          data: _.get(JSON.parse(data), "data", "")
        });
      } else {
        res.render("empty", {});
      }
    });
  });
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

module.exports = app;
