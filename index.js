var app = require("express")();
var redis = require("redis");
var port = "8080"; 
var router = require("./router/api.js";)
var redisClient = redis.createClient({host: "localhost", port: "6379"});
redisClient.on('ready',function() {
 console.log("Redis is ready");
});

redisClient.on('error',function() {
 console.log("Error in Redis");
});

app.get("/", function(req, res) {
    res.send("<h1>API</h1>");
});
app.use("/api", router);
app.listen(process.env.PORT || port);
console.log("APP started on port:"+port);
