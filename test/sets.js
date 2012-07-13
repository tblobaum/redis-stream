var test = require('tap').test
var Redis = require('../')
  , client = new Redis(6379, 'localhost')

var setName = 'testset'
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

var Set_sadd = client.stream('sadd', setName)
var Set_scard = client.stream('scard')
var Set_sismember = client.stream('sismember', setName)
var Set_smembers = client.stream('smembers')
var Set_spop = client.stream('spop')
var Set_srem = client.stream('srem', setName)

test('Set_sadd', function (t) {
  t.plan(values.length)
  Set_sadd.on('data', function (data) {
    t.strictEqual(Number(data), 1, 'value should be added to the set')
  })
  values.forEach(function (val) {
    Set_sadd.write(val)
  })
})

test('Set_scard', function (t) {
  t.plan(1)
  Set_scard.on('data', function (data) {
    t.strictEqual(Number(data), values.length, 'scard should return length')
  })
  Set_scard.write(setName)
})

test('Set_sismember', function (t) {
  t.plan(values.length)
  Set_sismember.on('data', function (data) {
    t.strictEqual(Number(data), 1, 'value should exist')
  })
  values.forEach(function (val) {
    Set_sismember.write(val)
  })
})

test('Set_smembers', function (t) {
  t.plan(values.length)
  Set_smembers.on('data', function (data) {
    t.ok(~values.indexOf(String(data)), 'values should be in the set')
  })
  Set_smembers.write(setName)
})

test('Set_spop', function (t) {
  t.plan(2)
  Set_spop.on('data', function (data) {
    var index = values.indexOf(String(data))
    values.splice(values.indexOf(String(data)), 1)
    t.ok(!!~index, 'a random value should be returned')
    t.ok(!~values.indexOf(String(data)), 'value should be removed from array')
  })
  Set_spop.write(setName)
})

test('Set_srem', function (t) {
  t.plan(values.length)
  Set_srem.on('data', function (data) {
    t.strictEqual(Number(data), 1, 'value should be removed')
  })
  values.forEach(function (val) {
    Set_srem.write(val)
  })
})

test('streams should all close', function (t) {
  Set_sadd.end()
  Set_scard.end()
  Set_sismember.end()
  Set_smembers.end()
  Set_spop.end()
  Set_srem.end()
  t.ok(true, 'streams should end')
  t.end()
})
