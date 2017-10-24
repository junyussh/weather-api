var app = require("express");
var User = require("../model/user.model.js");
var config = require("../config.json");
var crypto = require("crypto");
var uuid = require("uuid/v1");
var APIKey = async function(callback) {
    var user = {};
    do {
        var idBinary = (new Buffer(uuid()));
        user.idBinary = idBinary.toString("utf8");
        user._id = idBinary.toString('hex').substr(0, 8);
    } while (await User.ifUserFieldExist("id", user._id));
    do {
        var keyBinary = new Buffer(uuid());
        user.keyBinary = keyBinary.toString("utf8");
        user.key = keyBinary.toString('base64').substr(0, 64);
    } while (await User.ifUserFieldExist("key", user._key))
    callback(user);
};

exports.vaildUser = (req, res) => {
    res.json("Developing");
}
exports.createUser = async function(req, res) {
    	var result = {};
        var info = {};
        // Generate Keys
        APIKey((keys) => {
            info._id = keys._id;
            info.username = req.jsonBody.username;
            info.email = req.jsonBody.email;
            info.password = crypto.createHash('sha256').update(req.jsonBody.password).digest('base64');
            info.APIKey = keys.key;
        });
        let code = await User.ifUserFieldExist("username", info.username);
        console.log("code: "+code);
        if (await User.ifUserFieldExist("username", info.username)) {
        	console.log("username");
            result.error = true;
            result.message = "Username existed!"
        } else if (await User.ifUserFieldExist("email", info.email)) {
        	console.log("email");
            result.error = true;
            result.message = "Email existed!"
        }
        setTimeout(() => {
            if (!result.error) {
                User.createUser(info._id, info, (err, callback) => {
                    if (!err) {
                        result.error = false;
                        result.message = "User created";
                    } else {
                        result.error = true;
                        result.message = err;
                    }
                })
            }
        }, 10);
        setTimeout(() => {
            res.json(result);
        }, 30);
}
