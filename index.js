var net = require('net')
  , util = require('util')
  , es = require('event-stream')
  , formatString1 = '*%d\r\n'
  , formatString2 = '$%d\r\n%s\r\n'
  , replace1 = /^\$[0-9]+/
  , replace2 = /^\*[0-9]+|^\:|^\+|^\$|^\r\n$/

function Redis (port, host, db, auth) { 
  this.port = port || 6379
  this.host = host || 'localhost'
  this.db = String(db || 0)
  return this
}

// expose event-stream for convenience
Redis.es = es

Redis.prototype.createConnection = function () {
  return net.createConnection(this.port, this.host)
}

Redis.prototype.stream = function (cmd, key, curry /* moar? */) {
  var curry = Array.prototype.slice.call(arguments)
    , clip = 1
    , _redis = this.createConnection()
    , stream = es.pipe(
        es.pipe(
          es.map(function (data, fn) {
              var elems = [].concat(stream.curry)
                , str = data+''
              if (!str.length) return fn()
              else elems.push(str)
              // console.log('write', str)
              return Redis.parse(elems, fn)
            }), 
          _redis
        ), 
        es.pipe(
          es.split('\r\n'), 
          es.map(replyParser)
        )
      )
    ;
  stream.curry = curry 
  stream.redis = _redis
  stream.redis.write(Redis.parse([ 'select', this.db ]))
  return stream

  function replyParser (data, fn) {
    if (Redis.debug_mode) console.log('replyParser', data+'')
    var str = (data+'').replace(replace1, '').replace(replace2, '')
    if (!str.length) return fn()
    else if (clip) {
      clip--
      return fn()
    }
    else return fn(null, str)
  }
}

Redis.parse = function commandParser (elems, fn) {
  var retval = util.format(formatString1, elems.length)
  while (elems.length) retval += util.format(formatString2, Buffer.byteLength(elems[0]+''), elems.shift()+'')
  if (Redis.debug_mode) console.log('commandParser', retval)
  fn && fn(null, retval)
  return retval
}

Redis.parse.hgetall =
Redis.parse.hmget = function () {
  var hash = {}
    , fields = []
    , vals = []
    , len = 0

  return es.map(function (data, fn) {
    var retval = ''
    if (!(len++ % 2)) fields.push(data)
    else vals.push(String(data))
    if (vals.length === fields.length) {
      return fn(null, [ fields.pop(), vals.pop() ])
    }
    else {
      return fn()
    }
  })
}

module.exports = Redis
