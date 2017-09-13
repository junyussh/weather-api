# Weather API Server

A pure and light Weather API server build with [Express](http://expressjs.com/) framwork, based on [Node.js](https://nodejs.org) and [Redis](https://redis.io/).

The application is under [Weather Station](https://github.com/oxygen-TW/Weather-Station) project.

## Requirment

 - Node.js
 - npm or [Yarn](https://yarnpkg.com)
 - Redis

## Installation

You can install this application in easy command.

```bash
git clone https://github.com/junyussh/weather-api.git
npm install # use npm
yarn install # use Yarn
```

## Configature

Edit ```config.json``` in root dictionary.

This is the ```config.json``` example.

```
{
    "info": { // you can add more details
        "location": "NHSH" // your location
    },
    "server": {
        "port": "8080" // Application Port
    },
    "database": {
        "key": "weather", // Redis database key name. Key name can't repeat with existed key name.
        "host": "127.0.0.1", // Redis database host
        "port": "6379"
    }
}
```

## Usage

### Basic 

```
GET <host>:<port>/api // get your data in json string
POST <host>:<port>/api // write data to the Redis database
```

### Params

#### size
The query string ```size``` can limit the number of records the API server get.

```
GET <host>:<port>/api?size=3 // return 3 records
```

## Reference

 - [Node.js and Redis tutorial - Installation and commands | Codeforgeek](https://codeforgeek.com/2016/06/node-js-redis-tutorial-installation-commands/) 
 - [利用 Nodejs & express4 製作 RESTful Web API  « 不務正業菸酒生](http://hzchirs-blog.logdown.com/posts/212065-build-restful-web-api-by-using-nodejs-and-express4)
 - [Build a RESTful API Using Node and Express 4 &#8213; Scotch](https://scotch.io/tutorials/build-a-restful-api-using-node-and-express-4)
 - [Redis 教程 | 菜鸟教程](http://www.runoob.com/redis/redis-tutorial.html)
 - [資料庫的好夥伴：Redis | TechBridge 技術共筆部落格](http://blog.techbridge.cc/2016/06/18/redis-introduction/)

## License

[BSD License](https://opensource.org/licenses/bsd-license.php)