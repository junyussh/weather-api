var redis = require("redis");
var config = require("../config.json");
var redisClient = redis.createClient({
    host: config.database.host,
    port: config.database.port
});

var data = {
    savedata: function(requestData, key, callback) {
        redisClient.rpush([key, requestData], callback);
    },
    getLength: function(key, callback) {
        redisClient.llen([key], function(err, reply) {
            if (!err) {
                return callback(reply);
            }
        });
    },
    getAlldata: function(key, callback) {
        this.getLength(key, (length) => {
            redisClient.lrange([key, 0, length], callback);
        });
    },
    addVisit: function(key, callback) {
        redisClient.incr([key + ":visit"], callback);
    }
}

module.exports = data;
