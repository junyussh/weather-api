var redis = require("redis");
var config = require("../config.json");
var redisClient = redis.createClient({
    host: config.database.host,
    port: config.database.port,
    password: config.database.password
});

var user = {
    createUser: function(key, request, callback) {
        redisClient.hset([config.database.key + "." + key, "username", request.username, "password", request.password, "key", request.key, "email", request.email, "address", request.address, "location", request.location], callback);
    }
}
module.exports = user;
