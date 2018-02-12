var app = require("express");
var crypto = require("crypto");
var uuid = require("uuid/v1");
var Device = require("../model/device.model");
var config = require("../config.json");
var jwt = require("jsonwebtoken");

var CheckField = async function (field, value) {
    return await Device.ifDeviceFieldValueExist(field, value);
}
var DeviceID = async function () {
    var device = {};
    do {
        var idBinary = (new Buffer(uuid()));
        device.idBinary = idBinary.toString("utf8");
        device._id = idBinary.toString('hex').substr(0, 10);
    } while (await CheckField("id", device._id));
    return new Promise((resolve, reject) => {
        resolve(device);
    });
};

exports.createDevice = async function (req, res) {
    let result = {};

    // Vaild token
    // if the device name exist
    let exist = await CheckField('name', req.jsonBody.name);
    if (exist) {
        result.error = true;
        result.message = "Device name existed!";
    } else {
        let token = req.query.token;
        var decoded = jwt.verify(token, config.secret);
        console.log(decoded)
        // Generate device's information
        let device = await DeviceID();
        let meta = {
            location: req.jsonBody.location,
            name: req.jsonBody.name,
            DeviceID: device._id,
            UserID: decoded.userID,
            fields: req.jsonBody.fields
        };
        Device.createDevice(meta);
        result.error = false;
        result.message = "Device " + meta.name + " has created";
        result.DeviceID = meta.DeviceID;
    }
    res.json(result);
}

exports.saveData = function(req, res) {
    
}