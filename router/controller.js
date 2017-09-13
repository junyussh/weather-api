var app = require("express");
var Data = require("../model/data.model.js");
var config = require("../config.json");
var require_field = ["tempature", "humidity", "light", "UV", "rainfall"];
var async = require("async");

function vaild_field(requestData, callback) {
    var result = [];
    for (var i = 0; i < require_field.length; i++) {
        if (typeof(eval("requestData." + require_field[i])) === "undefined") {
            result.push(require_field[i])
        }
    }
    callback(result);
}

exports.getAllData = (req, res) => {
    var value = {};
    Data.getAlldata(config.database.key + req.key + ".tempature", (err, callback) => {
        if (!err) {
            value.tempature = callback;
        } else {
            res.json(err);
        }
    });
    Data.getAlldata(config.database.key + req.key + ".humidity", (err, callback) => {
        if (!err) {
            value.humidity = callback;
        } else {
            res.json(err);
        }
    });
    Data.getAlldata(config.database.key + req.key + ".light", (err, callback) => {
        if (!err) {
            value.light = callback;
        } else {
            res.json(err);
        }
    });
    Data.getAlldata(config.database.key + req.key + ".UV", (err, callback) => {
        if (!err) {
            value.UV = callback;
        } else {
            res.json(err);
        }
    });
    Data.getAlldata(config.database.key + req.key + ".rainfall", (err, callback) => {
        if (!err) {
            value.rainfall = callback;
        } else {
            res.json(err);
        }
    });
    Data.getAlldata(config.database.key + req.key + ".time", (err, callback) => {
        if (!err) {
            value.time = callback;
        } else {
            res.json(err);
        }
    });
    Data.addVisit(config.database.key + req.key, (err, callback) => {
        if (!err) {
            value.request_times = callback;
        } else {
            res.json(err);
        }
    })
    setTimeout(() => {
        /* Generate Data */
        var result = {};

        if (req.key) {
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
    }, 10);
    /* Generate Data End */
};
exports.getData = (req, res) => {
    var value = {};
    Data.getData(config.database.key + req.key + ".tempature", req.query.size, (err, callback) => {
        if (!err) {
            value.tempature = callback;
        } else {
            res.json(err);
        }
    });
    Data.getData(config.database.key + req.key + ".humidity", req.query.size, (err, callback) => {
        if (!err) {
            value.humidity = callback;
        } else {
            res.json(err);
        }
    });
    Data.getData(config.database.key + req.key + ".light", req.query.size, (err, callback) => {
        if (!err) {
            value.light = callback;
        } else {
            res.json(err);
        }
    });
    Data.getData(config.database.key + req.key + ".UV", req.query.size, (err, callback) => {
        if (!err) {
            value.UV = callback;
        } else {
            res.json(err);
        }
    });
    Data.getData(config.database.key + req.key + ".rainfall", req.query.size, (err, callback) => {
        if (!err) {
            value.rainfall = callback;
        } else {
            res.json(err);
        }
    });
    Data.getData(config.database.key + req.key + ".time", req.query.size, (err, callback) => {
        if (!err) {
            value.time = callback;
        } else {
            res.json(err);
        }
    });
    Data.addVisit(config.database.key + req.key, (err, callback) => {
        if (!err) {
            value.request_times = callback;
        } else {
            res.json(err);
        }
    })
    setTimeout(() => {
        /* Generate Data */
        var result = {};

        if (req.key) {
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
    }, 10);
    /* Generate Data End */
}
exports.saveData = (req, res) => {
    vaild_field(req.jsonBody, function(vaild) {
        if (vaild.length === 0) {
            var time = new Date().toISOString();
            var result = {};
            Data.saveData(req.jsonBody.tempature, config.database.key + req.key + ".tempature", function(err, callback) {
                if (!err) {
                    result.tempature = true;
                } else {
                    result.tempature = false;
                }
            });
            Data.saveData(req.jsonBody.humidity, config.database.key + req.key + ".humidity", function(err, callback) {
                if (!err) {
                    result.humidity = true;
                } else {
                    result.humidity = false;
                }
            });
            Data.saveData(req.jsonBody.light, config.database.key + req.key + ".light", function(err, callback) {
                if (!err) {
                    result.light = true;
                } else {
                    result.light = false;
                }
            });
            Data.saveData(req.jsonBody.UV, config.database.key + req.key + ".UV", function(err, callback) {
                if (!err) {
                    result.UV = true;
                } else {
                    result.UV = false;
                }
            });
            Data.saveData(req.jsonBody.rainfall, config.database.key + req.key + ".rainfall", function(err, callback) {
                if (!err) {
                    result.rainfall = true;
                } else {
                    result.rainfall = false;
                }
            });
            Data.saveData(time, config.database.key + req.key + ".time", function(err, callback) {
                if (!err) {
                    result.time = true;
                    result.WriteTime = time;
                } else {
                    result.time = false;
                }
            });
            Data.getLength(config.database.key + req.key + ".tempature", (callback) => {
                result.record = callback;
            });

            setTimeout(() => {
                res.json(result);
            }, 10);

        } else {
            res.json({
                error: true,
                message: "Missing " + vaild + " fields."
            });
        }
    });
}
