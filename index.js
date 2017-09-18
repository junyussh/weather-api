var app = require("express")();
var redis = require("redis");
var assert = require("assert");
var config = require("./config.json");
var port = config.server.port;
var router = require("./router/api.js");
var redisClient = redis.createClient({
    host: config.database.host,
    port: config.database.port,
    password: config.database.password
});

redisClient.on('ready', function() {
    console.log("Redis is ready");
    redisClient.exists(config.database.key, function(err, reply) {
        if (!err) {
            if (reply === 1) {
                assert(reply === 1, "The key " + config.database.key + " exists, please modifiy the key in config.json");
            }
        }
    });
});

redisClient.on('error', function() {
    console.log("Error in Redis");
});
app.all("/", function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
});
app.get("/", function(req, res) {
    res.send("<h1>Welcome to use API server</h1>");
});
app.use("/api", router);
app.listen(process.env.PORT || port);
console.log("APP started on port:" + port);