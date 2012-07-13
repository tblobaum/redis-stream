
var Redis = require('../')
  , JSONStream = require('JSONStream')
  , parser = JSONStream.parse([ true ])
  , client = new Redis(6379, 'localhost')
  , stream = client.stream()
  , hgetall

var bootstrapData = [ [ 'hmset', 'my-hash-key-1', 'field1', 'val1', 'field2', 'val2' ] ]

stream.redis.write(Redis.parse(bootstrapData[0]))
stream.on('close', function () {

  // 
  // parse the streaming output of HGETALL to JSON
  // 
  hgetall = client.stream('hgetall')
  hgetall
    .pipe(Redis.parse.hgetall())
    .pipe(JSONStream.stringifyObject())
    .pipe(process.stdout)

  hgetall.write('my-hash-key-1')
  hgetall.on('data', function (data) {
    hgetall.end()
  })
})

stream.end()
