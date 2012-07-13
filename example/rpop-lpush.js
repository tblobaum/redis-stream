var Redis = require('../')
  , client = new Redis(6379, 'localhost')
  , rpush
  , rpop

// add some data to `mylist` first
rpush = client.stream('rpush', 'mylist')
rpush.pipe(process.stdout)
rpush.write('val1')
rpush.write('val2')
rpush.on('end', function () {

  // reimplementation of rpoplpush with redis-stream
  // http://redis.io/commands/rpoplpush
  rpop = client.stream('rpop')
  rpop
    .pipe(client.stream('lpush', 'myotherlist'))
    .pipe(process.stdout)

  rpop.write('mylist')
  rpop.end()

})
rpush.end()
