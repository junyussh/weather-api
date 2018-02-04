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
    console.log(meta);
    // save device's meta
    redisClient.hset([key + ".device." + meta.DeviceID, "location", meta.location, "name", meta.name, "DeviceID", meta.DeviceID, "UserID", userID, "createTime", new Date().toISOString()]);
    // save the device's name
    redisClient.rpush([key + ".device.name", meta.name]);
    // save the device's owner
    redisClient.rpush([key + ".device.userID", userID]);
    // save all device's id
    redisClient.rpush([key + ".device.id", meta.DeviceID]);
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