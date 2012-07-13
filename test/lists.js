var test = require('tap').test
var Redis = require('../')
  , client = new Redis(6379, 'localhost')

var listName = 'testlist'
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

var List_rpush = client.stream('rpush', listName)
var List_llen = client.stream('llen')
var List_lpop = client.stream('lpop')
var List_lindex = client.stream('lindex', listName)

test('List_rpush', function (t) {
  t.plan(values.length)
  List_rpush.on('data', function (data) {
    t.ok((Number(data) > 0), 'rpush should return length')
  })
  values.forEach(function (val) {
    List_rpush.write(val)
  })
})

test('List_llen', function (t) {
  t.plan(1)
  List_llen.on('data', function (data) {
    t.strictEqual(Number(data), values.length, 'llen should return length')
  })
  List_llen.write(listName)
})

test('List_lindex', function (t) {
  t.plan(values.length)
  List_lindex.on('data', function (data) {
    t.ok(!!~values.indexOf(String(data)), 'lindex, a value by index')
  })
  values.forEach(function (val, i) {
    List_lindex.write(i)
  })
})

test('List_lpop', function (t) {
  t.plan(values.length)
  List_lpop.on('data', function (data) {
    t.ok(!!~values.indexOf(String(data)), 'lpop should return a value')
  })
  values.forEach(function (val) {
    List_lpop.write(listName)
  })
})

test('streams should all close', function (t) {
  List_rpush.end()
  List_llen.end()
  List_lindex.end()
  List_lpop.end()
  t.ok(true, 'streams should end')
  t.end()
})
