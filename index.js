var os = require('os')

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
  namespace = '[' + namespace + ']'

  writableStream = writableStream || process.stdout

  return function (message) {
    var args = arguments
    var tags
    if (Array.isArray(args[args.length - 1])) {
      tags = '(' + args[args.length - 1].join(', ') + ')'
      delete args[args.length - 1]
    }

    // prefix messages: 'YYYY-mm-dd hh:mm [namespace] (optional, tags) message'
    message = [formattedDate(), namespace, tags, message].filter(Boolean).join(' ')

    writableStream.write(Array.prototype.filter.call(args, Boolean).join(' ') + os.EOL)
  }
}

module.exports = generateLogger
