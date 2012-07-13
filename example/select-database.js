var Redis = require('../')
  , client = new Redis(6379, 'localhost')
  , sadd = client.stream('sadd', 'myset')

sadd.pipe(process.stdout)

sadd.on('error', function (err) {
  console.error('err:', err)
})

sadd.write('value1')
sadd.write('value2')
sadd.end()
