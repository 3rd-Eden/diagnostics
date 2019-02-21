# `diagnostics`

Diagnostics is an extremely small but powerful debug logger modeled after the
Node.js core debugging technique.

- Allows debugging in multiple JavaScript environments such as Node.js, browsers
  and React-Native.
- Separated development and production builds to minimize impact on your
  application when bundled.
- Allows for customization of logger, messages, and much more.

## Installation

The module is released in the public npm registry and can be installed by
running:

```
npm install --save diagnostics
```

## Usage

- [Introduction](#introduction)
  - [.enabled](#enabled)
  - [.namespace](#namespace)
  - [.dev/prod](#dev-prod)
- [Adapters](#adapters)
  - [process.env](#process-env)
  - [hash](#hash)
  - [localStorage](#localstorage)
  - [AsyncStorage](#asyncstorage)
- [Modifiers](#modifiers)
  - [namespace](#namespace)
- [Logger](#logger)

### Introduction

To create a new logger simply `require` the `diagnostics` module and call
the returned function the namespace under which the logs should be enabled.
Generally you use the name of the module or application that your developing
as first (root) namespace.

```js
const debug = require('diagnostics')('foo:bar:baz');
const debug = require('diagnostics')('foo:bar:baz', { options });

debug('this is a log message %s', 'that will only show up when enabled');
debug('that is pretty neat', { log: 'more', data: 1337 });
```

Please note that the returned logger is fully configured out of the box, you
do not need to use any of the adapters/modifiers your self, they are there
for when you want more advanced control over the process.

The returned logger exposes some addition properties that can be used used in
your application or library.

### enabled

The returned logger will have a `.enabled` property assigned to it. This boolean
can be used to check if the logger was enabled:

```js
const debug = require('diagnostics')('foo:bar');

if (debug.enabled) {
  //
  // Do something special
  //
}
```

### namespace

This is the namespace that you originally provided to the function.

```js
const debug = require('diagnostics')('foo:bar');

console.log(debug.namespace); // foo:bar
```

### dev/prod

There are different builds available of `diagnostics`, when you create a
production build of your application using `NODE_ENV=production` you will be
given an optimized, smaller build of `diagnostics` to reduce your bundle size.
The `dev` and `prod` booleans on the returned logger indicate if you have a
production or development version of the logger.

```js
const debug = require('diagnostics')('foo:bar');

if (debug.prod) {
  // do stuff
}
```

### Modifiers

Modifiers allows you to programmatically alter the messages that are being
logged. Modifiers are applied to **all** diagnostic instances. To add a new
modifier you call the `modify` method of one the returned loggers. It receives
the following arguments:

1. `message`, Array, the log message.
2. `options`, Object, the options that were passed into the logger when it was
   initially created.

```js
const debug = require('diagnostics')('example:modifiers');

debug.modify(function (message, options) {
  return messages;
});
```

The modifiers are only enabled for `development`.

#### namespace

This modifier is enabled for all debug instances and prefixes the messages
with the name of namespace under which it is logged. The namespace is colored
using the `colorspace` module which groups similar namespaces under the same
colorspace. You can have multiple namespaces for the debuggers where each
namespace should be separated by a `:`

```
foo
foo:bar
foo:bar:baz
```

For console based output the `namespace-ansi` is used.

### Loggers

By default it will log all messages to `console.log` in when the logger is
enabled using the debug flag that is set using one of the adapters.

You can override the default logger by assigning your own using the `set`
method. This method accepts a function as first argument which will be called
every time a message needs to be logged.

```js
const debug = require('diagnostics')('foo:more:namespaces');

debug.use(function logger(meta, args) {
  console.log(meta);
  console.debug(...args);
});
```

The assigned logger will receive 2 arguments:

1. `meta` An object with all the options that was provided to the original
   logger that wants to write the log message as well as properties of the
   debugger such as `prod`, `dev`, `namespace`, `enabled`.
2. `args` An array of the log messages that needs to be written.

### Adapters

Adapters allows `diagnostics` to pull the `DEBUG` and `DIAGNOSTICS` environment
variables from different sources. Not every JavaScript environment has a
`process.env` that we can leverage. Adapters allows us to have different
adapters for different environments. It means you can write your own custom
adapter if needed as well.

The `adapter` function should be passed a function as argument, this function
will receive the `namespace` of a logger as argument and it should return a
boolean that indicates if that logger should be enabled or not.

```js
const debug = require('diagnostics')('example:namespace');

debug.adapter(require('diagnostics/adapters/localstorage'));
```

The modifiers are only enabled for `development`. The following adapters are
available are available:

#### process.env

This adapter is enabled for `node.js`.

Uses the `DEBUG` or `DIAGNOSTICS` (both are recognized) environment variables to
pass in debug flag:

**UNIX/Linux/Mac**
```
DEBUG=foo* node index.js
```

Using environment variables on Windows is a bit different, and also depends on
toolchain you are using:

**Windows**
```
set DEBUG=foo* & node index.js
```

**Powershell**
```
$env:DEBUG='foo*';node index.js
```

#### hash

This adapter is enabled for `browsers`.

This adapter uses the `window.location.hash` of as source for the environment
variables. It assumes that hash is formatted using the same syntax as query
strings:

```
http://example.com/foo/bar#debug=foo*
```

It triggers on both the `debug=` and `diagnostics=` names.

#### localStorage

This adapter is enabled for `browsers`.

## License

MIT
