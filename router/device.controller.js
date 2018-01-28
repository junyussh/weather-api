var app = require("express");
var crypto = require("crypto");
var uuid = require("uuid/v1");
var Device = require("../model/device.model");
var config = require("../config.json");
var jwt = require("jsonwebtoken");

var CheckField = async function (id) {
    return await Device.ifDeviceIDExist(id);
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

exports.createDevice = function (req, res) {
    let result = {};
    try {
        // Vaild token
        let token = req.query.token;
        var decoded = jwt.verify(token, config.secret);
        // Generate device's information
        let device = DeviceID();
        let meta = {
            location: req.jsonBody.location,
            name: req.jsonBody.name,
            DeviceID: device._id,
            UserID: decode.UserID
        };
        Device.createDevice(meta);
        result.error = false;
        result.message = "Device "+DeviceID+ " has created";
    } catch (err) {
        // err
        result.error = true;
        result.message = "Invaild token.";
    }

    res.json(result);
}