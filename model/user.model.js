var redis = require("redis");
var config = require("../config.json");
var redisClient = redis.createClient({
    host: config.database.host,
    port: config.database.port,
    password: config.database.password
});

var user = {
	createUser: function(request, key, callback) {
		redisClient.hset([key, "username", request.username, "password", request.password, "key", request.key, "location": request.location], callback);
	}
}