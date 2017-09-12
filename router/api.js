var app = require("express");
var router = app.Router();
var Data = require("../model/data.model.js");
var config = require("../config.json");
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

function show_error(error) {
    res.json(error);
}
var key;
router.use(function(req, res, next) {
    if (req.query.key) {
        key = "." + req.query.key;
    } else {
        key = "";
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

        var value = {};
        Data.getAlldata(config.database.key + key + ".tempature", (err, callback) => {
            if (!err) {
                value.tempature = callback;
            } else {
                show_error(err);
            }
        });
        Data.getAlldata(config.database.key + key + ".humidity", (err, callback) => {
            if (!err) {
                value.humidity = callback;
            } else {
                show_error(err);
            }
        });
        Data.getAlldata(config.database.key + key + ".light", (err, callback) => {
            if (!err) {
                value.light = callback;
            } else {
                show_error(err);
            }
        });
        Data.getAlldata(config.database.key + key + ".UV", (err, callback) => {
            if (!err) {
                value.UV = callback;
            } else {
                show_error(err);
            }
        });
        Data.getAlldata(config.database.key + key + ".rainfall", (err, callback) => {
            if (!err) {
                value.rainfall = callback;
            } else {
                show_error(err);
            }
        });
        Data.getAlldata(config.database.key + key + ".time", (err, callback) => {
            if (!err) {
                value.time = callback;
            } else {
                show_error(err);
            }
        });
        Data.addVisit(config.database.key + key, (err, callback) => {
            if (!err) {
                value.request_times = callback;
            } else {
                show_error(err);
            }
        })
        setTimeout(() => {
            /* Generate Data */
            var result = {};

            if (key) {
                // future function
                result.info = config.info;
            } else {
                result.info = config.info;
            }
            
            result.data = [];
            result.request_times = value.request_times;
            for (var i = 0; i < value.tempature.length; i++) {
                result.data.push({
                    tempature: value.tempature[i],
                    humidity: value.humidity[i],
                    light: value.light[i],
                    UV: value.UV[i],
                    rainfall: value.rainfall[i],
                    time: value.time[i]
                });
            }
            res.json(result);
            /* Generate Data End */
        }, 10);

    })
    .post(function(req, res) {
        vaild_field(req.jsonBody, function(vaild) {
            if (vaild.length === 0) {
                var result = {},
                    temp;
                Data.savedata(req.jsonBody.tempature, config.database.key + key + ".tempature", function(err, callback) {
                    if (!err) {
                        result.tempature = true;
                        temp = 1;
                    } else {
                        result.tempature = false;
                    }
                });
                Data.savedata(req.jsonBody.humidity, config.database.key + key + ".humidity", function(err, callback) {
                    if (!err) {
                        result.humidity = true;
                    } else {
                        result.humidity = false;
                    }
                });
                Data.savedata(req.jsonBody.light, config.database.key + key + ".light", function(err, callback) {
                    if (!err) {
                        result.light = true;
                    } else {
                        result.light = false;
                    }
                });
                Data.savedata(req.jsonBody.UV, config.database.key + key + ".UV", function(err, callback) {
                    if (!err) {
                        result.UV = true;
                    } else {
                        result.UV = false;
                    }
                });
                Data.savedata(req.jsonBody.rainfall, config.database.key + key + ".rainfall", function(err, callback) {
                    if (!err) {
                        result.rainfall = true;
                    } else {
                        result.rainfall = false;
                    }
                });
                Data.savedata(new Date().toISOString(), config.database.key + key + ".time", function(err, callback) {
                    if (!err) {
                        result.time = true;
                    } else {
                        result.time = false;
                    }
                });
                setTimeout(() => {
                    res.json(result);
                }, 10);

            } else {
                callback({
                    error: true,
                    message: "Missing " + vaild + " fields."
                });
            }
        });
    });

module.exports = router;
