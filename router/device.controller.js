var app = require("express");
var crypto = require("crypto");
var uuid = require("uuid/v1");
var Device = require("../model/device.model");
var User = require("../model/user.model");
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
    let token = req.query.token;
    var decoded = jwt.verify(token, config.secret);
    try {
        let user = await User.getUserInfo(decoded.userID);
    } catch(e) {
        result.error = true;
        result.message = e;
    }
    if (decoded.userID == user.userID) {
        // Vaild token
        // if the device name exist
        let exist = await CheckField('name', req.jsonBody.name);
        if (exist) {
            result.error = true;
            result.message = "Device name existed!";
        } else {
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
    }
    res.json(result);
}

exports.saveData = async function (req, res) {
    let result = {};
    if (req.jsonBody.key) {
        let DeviceID = req.params.id;
        let device = await Device.getDeviceInfos(DeviceID);
        let index = await User.getIndex("key", req.jsonBody.key);
        let userID = await User.getValue("id", index);
        let user = await User.getUserInfo(userID);
        let data = req.jsonBody;

        let token = req.query.token;
        var decoded = jwt.verify(token, config.secret);

        // Authenticate Device's User
        if (user.key == data.key && userID == device.UserID && decoded.userID == device.UserID) {
            let fields = await Device.getDeviceFields(req.params.id); // get device's fields

            data["created"] = new Date().toISOString(); // Created time
            Device.saveData(data, fields, DeviceID);

            result.error = false;
            result.message = "Data saved.";
        } else {
            result.error = true;
            result.message = "Permission denied!";
        }
    } else {
        result.error = true;
        result.message = "Key is required.";
    }

    res.json(result);
}

exports.getData = async function (req, res) {
    let result = {};
    let fields = await Device.getDeviceFields(req.params.id);
    let DeviceID = req.params.id;
    let device = await Device.getDeviceInfos(DeviceID);

    result.info = device;
    result.data = await Device.getData(req.query.size, fields, DeviceID);
    res.json(result);
}

exports.deleteDevice = async function (req, res) {
    let result = {};
    let DeviceID = req.params.id;

    if (await Device.ifDeviceFieldValueExist("id", DeviceID)) {
        let device = await Device.getDeviceInfos(DeviceID);
        let index = await Device.getDeviceValueIndex("id", DeviceID);
        var decoded = jwt.verify(req.query.token, config.secret);

        // Authenticate Device's User
        console.log(device)
        if (decoded.userID == device.UserID) {
            Device.deleteDevice(DeviceID);

            result.error = false;
            result.message = "Device's data has been cleaned.";
        } else {
            result.error = true;
            result.message = "Permission denied!";
        }
    } else {
        result.error = true;
        result.message = "Device id is not existed."
    }

    res.json(result);
}