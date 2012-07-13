var Redis = require('../')
  , client = new Redis(6379, 'localhost', 2) // select database 2
  , sadd = client.stream('sadd', 'myset')

sadd.pipe(process.stdout)
sadd.write('value1')
sadd.write('value2')
sadd.end()
