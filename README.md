# A Simple Log Function with Namespace and Date Stamp

This is a simple log module that write log messages with a timestamp and a namespace to the standard output (or a specified writable stream).

It is quick and dirty and not optimized for performance.

```js
var generateLogger = require('logger')
var log = generateLogger('namespace')

log('my message')
// -> 2015-02-02 11:35 [namespace] my message
```

If the last argument is an array the content will be printet in params after the namespace.

```js
var generateLogger = require('logger')
var log = generateLogger('namespace')

log('my message', ['foo', 'bar'])
// -> 2015-02-02 11:35 [namespace] (foo, bar) my message
```

That is all.

## License

MIT
