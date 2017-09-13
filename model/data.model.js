var redis = require("redis");
var config = require("../config.json");
var redisClient = redis.createClient({
    host: config.database.host,
    port: config.database.port
});

var data = {
    saveData: function(requestData, key, callback) {
        redisClient.rpush([key, requestData], callback);
    },
    getLength: function(key, callback) {
        redisClient.llen([key], function(err, reply) {
            if (!err) {
                return callback(reply);
            }
        });
    },
    getData: function(key, number, callback) {
        this.getLength(key, (length) => {
        	if (number > length) {
        		number = length;
        	}
            redisClient.lrange([key, length - number, length], callback);
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
