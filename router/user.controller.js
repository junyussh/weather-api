var app = require("express");
var User = require("../model/user.model.js");
var config = require("../config.json");
var crypto = require("crypto");
var uuid = require("uuid/v1");
var jwt = require("jsonwebtoken");

var CheckField = async function (field, value) {
    return await User.ifUserFieldExist(field, value);
}
var getIndex = async function (field, value) {
    return await User.getIndex(field, value);
}
var getValue = async function (field, index) {
    return await User.getValue(field, index);
}

var APIKey = async function () {
    var user = {};
    do {
        var idBinary = (new Buffer(uuid()));
        user.idBinary = idBinary.toString("utf8");
        user._id = idBinary.toString('hex').substr(0, 8);
    } while (await CheckField("id", user._id));
    do {
        var keyBinary = new Buffer(uuid());
        user.keyBinary = keyBinary.toString("utf8");
        user.key = keyBinary.toString('base64').substr(0, 64);
    } while (await CheckField("key", user._key))
    return new Promise((resolve, reject) => {
        resolve(user);
    });
};

exports.vaildUser = (req, res) => {
    res.json("Developing");
}
exports.createUser = async function (req, res) {
    var result = {};
    var info = {};
    // Generate Keys
    /*
    APIKey().then(async (keys) => {
        info._id = keys._id;
        info.username = req.jsonBody.username;
        info.email = req.jsonBody.email;
        info.password = crypto.createHash('sha256').update(req.jsonBody.password).digest('base64');
        info.APIKey = keys.key;
    })
        .then(async function () {
            CheckField("username", info.username).then((username) => {
                console.log("user:"+username);
                if (username == true) {
                    result.error = true;
                    result.message = "Username existed!"
                }
            });
            CheckField("email", info.email).then((email) => {
                if (email == true) {
                    console.log("email");
                    result.error = true;
                    result.message = "Email existed!"
                }
            });
        }).then(()=> {

        });
        */
    let keys = await APIKey();
    info._id = keys._id;
    info.username = req.jsonBody.username;
    info.email = req.jsonBody.email;
    info.password = crypto.createHash('sha256').update(req.jsonBody.password).digest('base64');
    info.APIKey = keys.key;

    let username = await CheckField("username", info.username);
    let email = await CheckField("email", info.email);
    if (username) {
        result.error = true;
        result.message = "Username existed!"
    } else if (email) {
        result.error = true;
        result.message = "Email existed!"
    } else if (!result.error) {
        /*
        User.createUser(info._id, info, (err, callback) => {
            if (!err) {
                console.log("created")
                result.error = false;
                result.message = "User created";
                result.key = info.APIKey;
            } else {
                result.error = true;
                result.message = err;
            }
        });
        */
        User.createUser(info._id, info);
        result.error = false;
        result.message = "User created";
        result.APIKey = info.APIKey;
    }
    res.json(result);
}

exports.checkUser = async (username, password) => {
    let pass = crypto.createHash('sha256').update(password).digest('base64');
    let index = await getIndex("username", username);
    let _password = await getValue("password", index);
    
    return new Promise((resolve, reject) => {
        console.log(_password)
        console.log(password)
        console.log(pass == _password);
        if (pass == _password) {
            resolve(true);
        } else {
            resolve(false);
        }
    })
}

exports.userLogin = async function (req, res) {
    var result = {};

    let username = req.jsonBody.username;
    let password = crypto.createHash('sha256').update(req.jsonBody.password).digest('base64');
    let index = await getIndex("username", username);
    let pass = await getValue("password", index);

    if (pass == password) {
        let userID = await getValue("id", index);
        let payload = {
            username: username,
            password: password,
            userID: userID,
            loginTime: new Date().toISOString()
        }
        let secret = config.secret;
        result.error = false;
        result.message = "Enjoy your token.";
        result.token = jwt.sign(payload, secret, { expiresIn: '24h' });
    } else {
        result.error = true;
        result.message = "Invaild username or password."
    }
    res.json(result);
}