var Redis = require('../')
  , redis = new Redis(6379, 'localhost')
  , stream = redis.stream()

stream.pipe(Redis.es.join('\r\n')).pipe(process.stdout)

// interact with the redis network connection directly
// using `Redis.parse`, which is used internally
stream.redis.write(Redis.parse([ 'info' ]))
stream.redis.write(Redis.parse([ 'lpush', 'mylist', 'val' ]))
stream.end()
