var test = require('tap').test
var Redis = require('../')
  , client = new Redis(6379, 'localhost')

var set = client.stream('set', 'testkey')
var strlen = client.stream('strlen')
var getset = client.stream('getset', 'testkey')
var get = client.stream('get')
var incr = client.stream('incr')
var decr = client.stream('decr')
var append = client.stream('append', 'testkey')
var getrange = client.stream('getrange', 'testkey', 0)
var setrange = client.stream('setrange', 'testkey', 0)

test('set testkey testvalue', function (t) {
  t.plan(1)
  set.on('data', function (data) {
    t.strictEqual(String(data), 'OK', 'set should return OK')
  })
  set.write('testvalue')
})

test('strlen testkey', function (t) {
  t.plan(1)
  strlen.on('data', function (data) {
    t.strictEqual(Number(data), 9, 'strlen should return length 9')
  })
  strlen.write('testkey')
})

test('getset testkey 50', function (t) {
  t.plan(1)
  getset.on('data', function (data) {
    t.strictEqual(String(data), 'testvalue', 'should be testvalue')
  })
  getset.write('50')
})

test('get testkey', function (t) {
  t.plan(1)
  get.on('data', function (data) {
    t.strictEqual(Number(data), 50, 'should be 50')
  })
  get.write('testkey')
})

test('incr testkey', function (t) {
  t.plan(1)
  incr.on('data', function (data) {
    t.strictEqual(Number(data), 51, 'incr should return 51')
  })
  incr.write('testkey')
})

test('decr testkey', function (t) {
  t.plan(1)
  decr.on('data', function (data) {
    t.strictEqual(Number(data), 50, 'decr should return 50')
  })
  decr.write('testkey')
})

test('append testkey', function (t) {
  t.plan(1)
  append.on('data', function (data) {
    t.strictEqual(Number(data), 3, 'append should return length 3')
  })
  append.write('0')
})

test('getrange testkey', function (t) {
  t.plan(1)
  getrange.on('data', function (data) {
    t.strictEqual(Number(data), 50, 'getrange should return 50')
  })
  getrange.write(1)
})

test('setrange testkey', function (t) {
  t.plan(1)
  setrange.on('data', function (data) {
    t.strictEqual(Number(data), 5, 'setrange should return length 5')
  })
  setrange.write(50000)
})

test('streams should all close', function (t) {
  set.end()
  strlen.end()
  getset.end()
  get.end()
  incr.end()
  decr.end()
  append.end()
  getrange.end()
  setrange.end()
  t.ok(true, 'streams should end')
  t.end()
})
