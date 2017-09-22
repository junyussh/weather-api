var app = require("express");
var User = require("../model/user.model.js");
var config = require("../config.json");
var crypto = require("crypto");
var uuid = require("uuid/v1");
var APIKey = function(callback) {
	var user = {};
    var idBinary = (new Buffer(uuid()));
    user.idBinary = idBinary.toString("utf8");
    user._id = idBinary.toString('hex').substr(0, 8);
    var keyBinary = new Buffer(uuid());
    user.keyBinary = keyBinary.toString("utf8");
    user.key = keyBinary.toString('base64').substr(0, 64);
    callback(user);
};

exports.vaildUser = (req, res) => {
	res.json("Developing");
}
exports.createUser = (req, res) => {
	APIKey((keys)=> {
		var info = {};
		info._id = keys._id;
		info.username = req.jsonBody.username;
		info.email = req.jsonBody.email;
		info.password = crypto.createHash('sha256').update(req.jsonBody.password).digest('base64');
		info.address = req.jsonBody.address;
		info.location = req.jsonBody.location;
		info.APIKey = keys.key;
		User.createUser(keys._id, info, (err, callback)=>{
			if (!err) {
				res.json({error: false, message: "User created"})
			} else {
				res.json({error: true, message: err});
			}
		})
	})
}