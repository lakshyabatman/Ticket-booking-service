const ExpressRedisCache = require('express-redis-cache')

const cache = ExpressRedisCache({
  port: process.env.REDIS_PORT,
  expire: 20,
})

module.exports = cache