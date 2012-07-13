var Redis = require('../')
  , client = new Redis(6379, 'localhost')

// stream monitor to all http requests
// curl http://0.0.0.0:3000/

require('http')
.createServer(function (request, response) {
  var redis = client.stream()
  redis.pipe(Redis.es.join('\r\n')).pipe(response)
  redis.write('monitor')
})
.listen(3000)

console.log('monitor streaming at 0.0.0.0:3000')
