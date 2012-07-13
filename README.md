# redis-stream

[![Build Status](https://secure.travis-ci.org/tblobaum/redis-stream.png)](http://travis-ci.org/tblobaum/redis-stream)

# Example

In the `example` directory there are various streaming examples.

```js


```

# Methods

``` js
var Redis = require('redis-stream')
  , client = new Redis(6379, localhost, 0)
```

## new Redis([port] [, host] [, database])
Return an object that streams can be created from with the `port`, `host`, and `database` options -- `port` defaults to `6379`, `host` to `localhsot` and `database` to `0`.

## client.stream([arg1] [, arg2] [, argn])
Return a [node.js api compatible stream](http://nodejs.org/api/streams.html) that is readable, writeable, and can be piped. All calls to `write` on this stream will be prepended with the optional arguments passed to `client.stream`

Create a streaming instance of rpop:

``` js
var rpop = client.stream('rpop')
rpop.pipe(process.stdout)
rpop.write('my-list-key')
```

Which you can then pipe redis keys to, and they resulting elements will be piped to stdout.

## Redis.parse.hgetall()

Return a stream that can be piped to to transform an `hmget` or `hgetall` stream into valid json, with a little help from [JSONStream](https://github.com/dominictarr/JSONStream) we can turn this into a real object.

``` js
  hgetall = client.stream('hgetall')
  hgetall
    .pipe(Redis.parse.hgetall())
    .pipe(JSONStream.stringifyObject())
    .pipe(process.stdout)

  hgetall.write('my-hash-key-1')
```

## Redis.parse(array)
It's possible to interact directly with the command parser that transforms a stream into valid redis data stream

``` js
var Redis = require('../')
  , redis = new Redis(6379, 'localhost')
  , stream = redis.stream()

stream.pipe(Redis.es.join('\r\n')).pipe(process.stdout)

// interact with the redis network connection directly
// using `Redis.parse`, which is used internally
stream.redis.write(Redis.parse([ 'info' ]))
stream.redis.write(Redis.parse([ 'lpush', 'mylist', 'val' ]))
stream.end()
```

# Install

`npm install redis-stream`

# License

(The MIT License)

Copyright (c) 2012 Thomas Blobaum <tblobaum@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.