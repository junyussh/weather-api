var redis = require("redis");
var config = require("../config.json");
var redisClient = redis.createClient({
    host: config.database.host,
    port: config.database.port
});
var User = require("./user.model");
let key = config.database.key;
exports.createDevice = async function (meta) {
    let userID = meta.userID;

    // save device's meta
    redisClient.hset([key + "." + userID + ".device." + meta.deviceID, "location", meta.location, "name", meta.name, "DeviceID", meta.DeviceID, "UserID", userID, "createTime", new Date().toISOString()]);
    // save user's devices id
    redisClient.rpush([key + "." + userID + "." + meta.deviceID, meta.deviceID]);
    // save the devices' owner
    redisClient.rpush([key + ".device.userID", userID]);
    // save all devices' id
    redisClient.rpush([key + ".device.id", meta.deviceID]);
}
exports.getAllDeviceID = function (callback) {
    redisClient.llen([key + ".device.id"], function (err, length) {
        redisClient.lrange([key + ".device.id", 0, length], callback);
    });
}
exports.getDeviceIndex = function(deviceID) {
    this.getAllDeviceID((err, _field) => {
        let index = _field.indexOf(deviceID);
        return new Promise(function(resolve, reject) {
            resolve(index);
        });
    });
}
exports.ifDeviceIDExist = function (deviceID) {
    let code;
    this.getDeviceIndex(deviceID)
    .then((response) => {
        code = response;
    });
    return new Promise(function (resolve, reject) {
        return code != -1; // true==exist
    });
}