var app = require("express");
var crypto = require("crypto");
var uuid = require("uuid/v1");
var Device = require("../model/device.model");
var config = require("../config.json");
var jwt = require("jsonwebtoken");

var CheckField = async function (field, value) {
    return await Device.ifDeviceFieldValueExist(field, value);
    console.log("check field")
}
var DeviceID = async function () {
    var device = {};
    do {
        var idBinary = (new Buffer(uuid()));
        device.idBinary = idBinary.toString("utf8");
        device._id = idBinary.toString('hex').substr(0, 8);
    } while (await CheckField("id", device._id));
    return device;
};

exports.createDevice = async function (req, res) {
    let result = {};
    console.log("create device")
    // Vaild token
    let token = req.query.token;
    console.log("token: "+token)
    var decoded = jwt.verify(token, config.secret);
    console.log("decode: "+decoded)
    // if the device name exist
    let exist = await CheckField('name', req.jsonBody.name);
    console.log("exist"+exist);
    if (exist) {
        console.log("exist");
        result.error = true;
        result.message = "Device name existed!";
    } else {
        console.log("created");
        // Generate device's information
        let device = DeviceID();
        let meta = {
            location: req.jsonBody.location,
            name: req.jsonBody.name,
            DeviceID: device._id,
            UserID: decoded.UserID
        };
        Device.createDevice(meta);
        result.error = false;
        result.message = "Device " + meta.name + " has created";
        result.DeviceID = meta.DeviceID;
    }
    console.log("print")
    res.json(result);
}