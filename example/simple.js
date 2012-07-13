var Redis = require('../')
  , client = new Redis(6379, 'localhost', 2) // select database 2
  , lpush = client.stream('lpush', 'mylist')

lpush.pipe(process.stdout)
lpush.write('value1')
lpush.write('value2')
lpush.end()
