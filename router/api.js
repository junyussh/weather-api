var app = require("express");
var router = app.Router();
var config = require("../config.json");
var async = require("async");
var Data = require("./controller");

var key;
router.use(function(req, res, next) {
    if (req.query.key) {
        key = "." + req.query.key;
        req.key = key;
    } else {
        key = "";
        req.key = key;
    }
    if (req.method == "POST") {
        var data = "";
        req.on('data', function(chunk) {
            data += chunk
        });
        req.on('end', function() {
            req.rawBody = data;
            req.jsonBody = JSON.parse(data);
            next();
        });
    } else {
        next();
    }
});
router.route("/")
    .get(function(req, res) {
        if (req.query.size) {
            req.query.size = parseInt(req.query.size);
            Data.getData(req, res);
        } else {
            Data.getAllData(req, res);
        }
    })
    .post(function(req, res) {
        Data.saveData(req, res);
    });

module.exports = router;
