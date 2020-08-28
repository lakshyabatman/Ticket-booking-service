const ExpressRedisCache = require('express-redis-cache')

const cache = ExpressRedisCache({
  port: process.env.REDIS_PORT,
  expire: 10, // optional: expire every 10 seconds
})

module.exports = cache