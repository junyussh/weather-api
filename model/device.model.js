var redis = require("redis");
var config = require("../config.json");
var redisClient = redis.createClient({
    host: config.database.host,
    port: config.database.port
});
var User = require("./user.model");
let key = config.database.key;
exports.createDevice = async function (meta) {
    let userID = meta.UserID;
    // save device's meta
    redisClient.hset([key + ".device." + meta.DeviceID, "location", meta.location, "name", meta.name, "DeviceID", meta.DeviceID, "UserID", userID, "createTime", new Date().toISOString()]);
    // save the device's name
    redisClient.rpush([key + ".device.name", meta.name]);
    // save the device's owner
    redisClient.rpush([key + ".device.userID", userID]);
    // save all device's id
    redisClient.rpush([key + ".device.id", meta.DeviceID]);
    // save the device's fields
    var multi = redisClient.multi();
    meta.fields.push("created");
    meta.fields.forEach((fields) => {
        multi.rpush(key + ".device." + meta.DeviceID + ".field", fields);
    });
    multi.exec();
}
exports.getAllDeviceID = function (callback) {
    redisClient.llen([key + ".device.id"], function (err, length) {
        redisClient.lrange([key + ".device.id", 0, length], callback);
    });
}
exports.getAllDeviceFieldValue = function (field) {
    return new Promise((resolve, reject) => {
        redisClient.llen([key + ".device." + field], function (err, length) {
            redisClient.lrange([key + ".device." + field, 0, length], function (err, list) {
                resolve(list);
            });
        })
    });
}

exports.getDeviceValueIndex = function (field, value) {
    return new Promise((resolve, reject) => {
        this.getAllDeviceFieldValue(field)
            .then((list) => {
                let index = list.indexOf(value);
                resolve(index);
            });
    });
}
exports.ifDeviceFieldValueExist = async function (field, value) {
    let code = await this.getDeviceValueIndex(field, value);
    return new Promise(function (resolve, reject) {
        resolve(code != -1); // true==exist
    });
}

exports.getDeviceFields = function (DeviceID) {
    return new Promise(async (resolve_out) => {
        // get fields length
        let length = async function () {
            return new Promise((resolve) => {
                redisClient.llen([key + ".device." + DeviceID + ".field"], (err, callback) => {
                    resolve(callback);
                })
            })
        };
        // get fields content
        let fields = async function () {
            return new Promise(async (resolve) => {
                redisClient.lrange([key + ".device." + DeviceID + ".field", 0, await length()], (err, callback) => {
                    resolve(callback);
                })
            })
        };
        resolve_out(await fields());
    })
}

exports.getDeviceInfos = function (DeviceID) {
    return new Promise((resolve) => {
        redisClient.hgetall([key + ".device." + DeviceID], (err, value) => {
            resolve(value);
        });
    });
}

exports.saveData = function (data, fields, DeviceID) {
    fields.map((obj) => {
        redisClient.rpush([key + ".device." + DeviceID + "." + obj, data[obj]]);
    })
}

exports.getData = async function (size, fields, DeviceID) {
    return new Promise(async (resolve) => {
        let data = [], start;
        let length = async function () {
            return new Promise((resolve) => {
                redisClient.llen([key + ".device." + DeviceID + ".created"], (err, callback) => {
                    resolve(callback);
                })
            })
        };

        // define the number of data
        let len = await length();
        if (size) {
            start = len - size;
        } else {
            start = 0;
        }
        let counter = 1;

        for (let i = 0; i < len-start; i++) data[i] = {}; // create object in array

        fields.map(async (obj) => { // push value to array
            redisClient.lrange([key + ".device." + DeviceID + "." + obj, start, len], (err, callback) => {
                let k = 0;
                callback.map((value) => {
                    data[k][obj] = value; // push value to data array in object
                    k++;
                });
                counter++;
                if (counter == obj.length) { // if loop ends, return data
                    resolve(data);
                }
            });
        });
    })
}