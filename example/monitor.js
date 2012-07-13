var Redis = require('../')
  , client = new Redis(6379, 'localhost')

// stream monitor to stdout
var monitor = client.stream()
monitor.pipe(Redis.es.join('\r\n')).pipe(process.stdout)
monitor.write('monitor')
