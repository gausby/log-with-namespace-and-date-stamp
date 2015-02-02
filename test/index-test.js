var test = require('tape')
var generateLogger = require('../')
var Writable = require('stream').Writable

function stripPrefix (message) {
  var prefixLength = 'YYYY-mm-dd hh:mm '.length
  return message.toString().substring(prefixLength)
}

test('empty messages', function (t) {
  var ws = new Writable()
  ws._write = function(chunk, enc, next) {
    t.equals(chunk.toString(), '\n', 'should return in empty message')
    t.end()
  }
  var log = generateLogger('foo', ws)

  log()
})

test('timestamp', function (t) {
  var ws = new Writable()
  ws._write = function(chunk, enc, next) {
    t.ok(/^\d{4}-\d{2}-\d{2} \d{2}\:\d{2} /.test(chunk.toString()), 'in the form YYYY-mm-dd hh:mm ')
    t.end()
  }
  var log = generateLogger('foo', ws)

  log('')
})

test('namespace', function (t) {
  var ws = new Writable()
  ws._write = function(chunk, enc, next) {
    t.equals(stripPrefix(chunk), '[foo]\n', 'in the form [namespace]')
    t.end()
  }
  var log = generateLogger('foo', ws)

  log('')
})

test('message', function (t) {
  var ws = new Writable()
  ws._write = function(chunk, enc, next) {
    t.equals(stripPrefix(chunk), '[foo] bar\n', 'message printed after namespace')
    t.end()
  }
  var log = generateLogger('foo', ws)

  log('bar')
})

test('multiple messages', function (t) {
  var ws = new Writable()
  ws._write = function(chunk, enc, next) {
    t.equals(stripPrefix(chunk), '[foo] bar baz\n', 'concatinate multiple strings')
    t.end()
  }
  var log = generateLogger('foo', ws)

  log('bar', 'baz')
})

test('tags', function (t) {
  var ws = new Writable()
  ws._write = function(chunk, enc, next) {
    t.equals(stripPrefix(chunk), '[foo] (qux) bar\n', 'print tags after namespace if last argument is an array')
    t.end()
  }
  var log = generateLogger('foo', ws)

  log('bar', ['qux'])
})

test('multiple tags', function (t) {
  var ws = new Writable()
  ws._write = function(chunk, enc, next) {
    t.equals(stripPrefix(chunk), '[foo] (qux, quun) bar\n', 'print multiple tags comma separated')
    t.end()
  }
  var log = generateLogger('foo', ws)

  log('bar', ['qux', 'quun'])
})
