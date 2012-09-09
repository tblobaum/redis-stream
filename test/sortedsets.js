var test = require('tap').test
var Redis = require('../')
  , client = new Redis(6379, 'localhost')

var setName = 'testsortedset'
var values = [ 
    'test-value-1'
  , 'test-value-2'
  , 'test-value-3' 
  , 'test-value-4' 
  , 'test-value-5' 
  , 'test-value-6' 
  , 'test-value-7' 
  , 'test-value-8' 
  , 'test-value-9' 
  , 'test-value-0' 
]

var Set_zadd = client.stream('zadd', setName)
var Set_zcard = client.stream('zcard')
var Set_zrangebyscore = client.stream('zrangebyscore', setName)
var Set_zrevrangebyscore = client.stream('zrevrangebyscore', setName)
var Set_zrem = client.stream('zrem', setName)

test('Set_zadd', function (t) {
  t.plan(values.length)
  Set_zadd.on('data', function (data) {
    t.strictEqual(Number(data), 1, 'value should be added to the set')
  })
  values.forEach(function (val, i) {
    Set_zadd.write([i,val])
  })
})

test('Set_zcard', function (t) {
  t.plan(1)
  Set_zcard.on('data', function (data) {
    t.strictEqual(Number(data), values.length, 'zcard should return length')
  })
  Set_zcard.write(setName)
})

test('Set_zrangebyscore', function (t) {
  t.plan(3)
  var expect = [
    'test-value-2'
    , 'test-value-3' 
    , 'test-value-4' 
  ]

  Set_zrangebyscore.on('data', function (data) {
    t.ok(expect.shift()+''==data, 'zrangebyscore should return results by score')
  })
  Set_zrangebyscore.write([1,3])
})

test('Set_zrevrangebyscore_with_scores', function (t) {
  t.plan(6)
  var expect = [
      'test-value-4' 
    , 3
    , 'test-value-3' 
    , 2
    , 'test-value-2'
    , 1
  ]

  Set_zrevrangebyscore.on('data', function (data) {
    t.ok(expect.shift()+''==data, 'zrangebyscore should return results by score')
  })
  Set_zrevrangebyscore.write([3,1,'WITHSCORES'])
})

test('Set_zrem', function (t) {
  t.plan(values.length)
  Set_zrem.on('data', function (data) {
    t.strictEqual(Number(data), 1, 'value should be removed')
  })
  values.forEach(function (val) {
    Set_zrem.write(val)
  })

})

test('streams should all close', function (t) {
  Set_zadd.end()
  Set_zcard.end()
  Set_zrangebyscore.end()
  Set_zrem.end()
  Set_zrevrangebyscore.end()
  t.ok(true, 'streams should end')
  t.end()
})

