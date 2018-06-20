var redis = require("redis");
var config = require("../config.json");
var redisClient = redis.createClient({
    host: config.database.host,
    port: config.database.port,
    password: config.database.password
});
exports.createUser = function (key, request, callback) {
    redisClient.rpush([config.database.key + ".user.id", request._id])
    redisClient.rpush([config.database.key + ".user.username", request.username]);
    redisClient.rpush([config.database.key + ".user.key", request.APIKey]);
    redisClient.rpush([config.database.key + ".user.email", request.email]);
    redisClient.rpush([config.database.key + ".user.password", request.password]);
    redisClient.hmset([config.database.key + ".user." + key, "username", request.username, "password", request.password, "key", request.APIKey, "email", request.email], callback);
}
exports.getUserInfo = function (userID) {
    return new Promise((resolve) => {
        redisClient.hgetall([config.database.key + ".user." + userID], (err, value) => {
            resolve(value);
        });
    });
}
exports.getAllUserField = function (field, callback) {
    redisClient.llen([config.database.key + ".user." + field], function (err, length) {
        redisClient.lrange([config.database.key + ".user." + field, 0, length], callback);
    });
}
exports.getIndex = async function (field, value) {
    return new Promise((resolve, reject) => {
        this.getAllUserField(field, (err, _field) => {
            let index = _field.indexOf(value);
            resolve(index);
        });
    });
}
exports.getValue = async function (key, index) {
    return new Promise((resolve, reject) => {
        redisClient.lindex([config.database.key + ".user." + key, index], function (err, value) {
            resolve(value);
        });
    });
}
exports.getFieldValue = function (field, value) {
    this.getAllUserField(field, (err, _field) => {
        let index = _field.indexOf(value);
        return new Promise(function (resolve, reject) {
            resolve(_field(index));
        });
    });
}
exports.ifUserFieldExist = function (_field, _content) {
    var code;
    this.getAllUserField(_field, (err, field) => {
        code = field.indexOf(_content) != -1;
    });
    return new Promise(function (resolve, reject) {
        setTimeout(() => {
            resolve(code);
        }, 50);
    });
}
