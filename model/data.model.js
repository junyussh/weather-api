var redis = require("redis");
var config = require("../config.json");
var redisClient = redis.createClient({host: config.database.host, port: config.database.port});

var data = {
    savedata: function(requestData, field, callback) {
        redisClient.rpush([config.database.key+"."+field, requestData], callback);
    }
}

module.exports = data;
