var redis = require("redis");
var config = require("../config.json");
var redisClient = redis.createClient({
    host: config.database.host,
    port: config.database.port,
    password: config.database.password
});
exports.createUser = async function (key, request, callback) {
    redisClient.rpush([config.database.key + ".user.id", request._id])
    redisClient.rpush([config.database.key + ".user.username", request.username]);
    redisClient.rpush([config.database.key + ".user.key", request.APIKey]);
    redisClient.rpush([config.database.key + ".user.email", request.email]);
    redisClient.hset([config.database.key + "." + key, "username", request.username, "password", request.password, "key", request.APIKey, "email", request.email], callback);
}
exports.getAllUserField = async function (field, callback) {
    redisClient.llen([config.database.key + ".user." + field], function (err, length) {
        redisClient.lrange([config.database.key + ".user." + field, 0, length], callback);
    });
}
exports.ifUserFieldExist = async function (_field, _content, callback) {
    this.getAllUserField(_field, async (err, field) => {
        let code = field.indexOf(_content) != -1;
        callback(code);
    });
}
