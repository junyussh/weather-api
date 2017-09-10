var app = require("express");
var router = app.Router();
var Data = require("../model/data.model.js");

var require_field = ["tempature", "humidity", "light", "UV", "rainfall"];

function vaild_field(requestData, callback) {
    var result = [];
    for (var i = 0; i < require_field.length; i++) {
        if (typeof(eval("requestData." + require_field[i])) === "undefined") {
            result.push(require_field[i])
        }
    }
    callback(result);
}
router.use(function(req, res, next) {
    var query = req.query.key;
    var data = "";
    req.on('data', function(chunk) {
        data += chunk
    });
    req.on('end', function() {
        req.rawBody = data;
        req.jsonBody = JSON.parse(data);
        next();
    });
});
router.route("/")
    .get(function(req, res) {
        res.json({
            message: "Welcome to API"
        });
    })
    .post(function(req, res) {
        vaild_field(req.jsonBody, function(vaild) {
            if (vaild.length === 0) {
                var result = {},
                    temp;
                Data.savedata(req.jsonBody.tempature, "tempature", function(err, callback) {
                    if (!err) {
                        result.tempature = true;
                        temp = 1;
                    } else {
                        result.tempature = false;
                    }
                });
                Data.savedata(req.jsonBody.humidity, "humidity", function(err, callback) {
                    if (!err) {
                        result.humidity = true;
                    } else {
                        result.humidity = false;
                    }
                });
                Data.savedata(req.jsonBody.light, "light", function(err, callback) {
                    if (!err) {
                        result.light = true;
                    } else {
                        result.light = false;
                    }
                });
                Data.savedata(req.jsonBody.UV, "UV", function(err, callback) {
                    if (!err) {
                        result.UV = true;
                    } else {
                        result.UV = false;
                    }
                });
                Data.savedata(req.jsonBody.rainfall, "rainfall", function(err, callback) {
                    if (!err) {
                        result.rainfall = true;
                    } else {
                        result.rainfall = false;
                    }
                });
                setTimeout(() => {
                    console.log("wait");
                    res.json(result);
                }, 10);
                
            } else {
                res.json({
                    error: true,
                    message: "Missing " + vaild + " fields."
                });
            }
        });
    });

module.exports = router;
