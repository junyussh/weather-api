var app = require("express");
var router = app.Router();
var config = require("../config.json");
var Data = require("./controller");
var Device = require("./device.controller");
var User = require("./user.controller");
var jwt = require("jsonwebtoken");
var key;

router.use(function (req, res, next) {
    if (req.query.key) {
        key = "." + req.query.key;
        req.key = key;
    } else {
        key = "";
        req.key = key;
    }
    if (req.method == "POST") {
        var data = "";
        req.on('data', function (chunk) {
            data += chunk
        });
        req.on('end', function () {
            req.rawBody = data;
            req.jsonBody = JSON.parse(data);
            next();
        });
    } else {
        next();
    }
});
router.route("/")
    .get(function (req, res) {
        if (req.query.device && req.query.key) {
            if (req.query.size) {
                req.query.size = parseInt(req.query.size);
                Data.getData(req, res);
            } else {
                Data.getAllData(req, res);
            }
        } else {
            res.json({
                error: true,
                message: "URL/?device=[DeviceID]&key=[APIKey]"
            });
        }
    })
    .post(function (req, res) {
        Data.saveData(req, res);
    });
router.route("/user")
    .get(function (req, res) {
        console.log("test");
        res.json({
            message: "hello"
        });
    })
    .post(function (req, res) {
        User.createUser(req, res);
    });
router.route("/device")
    .post(function (req, res) {
        let token = req.query.token;
        console.log(token);
        try {
            console.log("JWT")
            var decoded = jwt.verify(token, config.secret);
            // Vaild token
            Device.createDevice(req, res);
        } catch (err) {
            // err
            console.log("err")
            let result = {};
            result.error = true;
            result.name = err.name;
            result.message = err.message;
            res.json(result);
        }
    });
router.route("/login")
    .post(function (req, res) {
        User.userLogin(req, res);
    })
    .get(function (req, res) {
        res.json({
            error: true,
            action: "login",
            message: "Use POST method to login"
        });
    });
module.exports = router;
