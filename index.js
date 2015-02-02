var Readable = require('stream').Readable

function zeropad (number) {
  return number < 10 ? '0' + number : number
}

function formattedDate () {
  var d = new Date()

  return [
    [d.getFullYear(), zeropad(d.getMonth() + 1), zeropad(d.getDate())].join('-'),
    [zeropad(d.getHours()), zeropad(d.getMinutes())].join(':')
  ].join(' ')
}

function generateLogger (namespace, writableStream) {
  var stream = new Readable()
  namespace = '[' + namespace + ']'

  stream._read = function () {}
  stream.on('error', function onError (err) {
    console.error(err.stack)
  })
  stream.pipe(writableStream || process.stdout)

  return function (message) {
    var args = arguments
    var tags
    if (Array.isArray(args[args.length - 1])) {
      tags = '(' + args[args.length - 1].join(', ') + ')'
      delete args[args.length - 1]
    }

    // prefix messages: 'YYYY-mm-dd hh:mm [namespace] (optional, tags) message'
    message = [formattedDate(), namespace, tags, message].filter(Boolean).join(' ')

    stream.push(Array.prototype.filter.call(args, Boolean).join(' ') + '\n')
  }
}

module.exports = generateLogger
