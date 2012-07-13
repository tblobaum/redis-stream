
var Redis = require('../')
  , client = new Redis(6379, 'localhost')
  , stream = client.stream()

var bootstrapData = [
    [ 'hmset', 'my-hash-key-1', 'field1', 'val1', 'field2', 'val2' ]
  , [ 'hmset', 'my-hash-key-2', 'field1', 'val1', 'field2', 'val2' ]
]
stream.redis.write(Redis.parse(bootstrapData[0]))
stream.redis.write(Redis.parse(bootstrapData[1]))
stream.on('close', function () {

  // 
  // Example
  // keys => hvals => sadd
  // 
  var keys = client.stream('keys')
  var hvals = client.stream('hvals')
  var sadd = client.stream('sadd', 'my-result-set')

  process.stdin
    .pipe(Redis.es.split())
    .pipe(keys)
    .pipe(hvals)
    .pipe(sadd)
    .pipe(process.stdout)

  process.stdout.write('Retrieve all keys of a given pattern, then \r\n')
  process.stdout.write('call HVALS on each of those keys, then \r\n')
  process.stdout.write('call SADD "my-result-set" on each of the values \r\n')
  process.stdout.write('-- \r\n')
  process.stdout.write('type a KEYS pattern, e.g. *-hash-key-* to \r\n')
  process.stdout.write('stream the result of the SADD command here \r\n')

})

stream.end()
