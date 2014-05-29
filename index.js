'use strict';

var human = require('pretty-hrtime')
  , env = require('env-variable')
  , Stream = require('stream')
  , hex = require('text-hex')
  , kuler = require('kuler')
  , util = require('util');

/**
 * All the different name spaces that are currently using this module.
 *
 * @type {Array}
 * @private
 */
var namespaces = []
  , max;

/**
 * Check if the terminal we're using allows the use of colors.
 *
 * @type {Boolean}
 * @private
 */
var tty = require('tty').isatty(1);

/**
 * The default stream instance we should be writing against.
 *
 * @type {Stream}
 * @public
 */
var stream = process.stdout;

/**
 * A simple environment based logger.
 *
 * Options:
 *
 * - color: The color for the namespace, can be a hex/CSS color string, defaults
 *   to automatically generated color from the method name.
 *
 * - colour: Alternate spelling for color, does the same thing.
 *
 * - colors: Force the use of colors or forcefully disable them. If this option
 *   is not supplied the colors will be based on your terminal.
 *
 * - stream: The Stream instance we should write our logs to, defaults to
 *   process.stdout but can be anything you like.
 *
 * - precise: By default our log timing is rounded up to the nearest value. If
 *   you need a more precise timing you can set this true.
 *
 * @param {String} name The namespace of your log function.
 * @param {Object} options Logger configuration.
 * @returns {Function} Configured logging method.
 * @api public
 */
function factory(name, options) {
  options = options || {};

  if ('object' === typeof name) options = name;
  if ('string' !== typeof name) name = resolve(module);

  //
  // All argument normalization has been done, check if the given name is
  // actually allowed to log something.
  //
  if (!enabled(name)) return function nope() {};

  options.colors = 'colors' in options ? options.colors : tty;
  options.color = options.color || options.colour || hex(name);
  options.ansi = options.colors ? kuler(name, options.color) : name;
  options.stream = options.stream || stream;

  //
  // Allow multiple streams, so make sure it's an array which makes iteration
  // easier.
  //
  if (!Array.isArray(options.stream)) options.stream = [options.stream];

  //
  // Add the namespace an re-calculate the max-length of the namespace so we can
  // have a consistent indentation.
  //
  namespaces.push(name);
  max = Math.max.apply(Math, namespaces.map(function map(namespace) {
    return namespace.toString().length;
  }));

  //
  // The actual debug function which does the logging magic.
  //
  return function debug(line) {
    debug.prev = debug.prev || process.hrtime();

    //
    // Better formatting for error instances.
    //
    if (line instanceof Error) line = line.stack || line.message || line;

    line = [
      //
      // Add extra padding so all log messages start at the same line.
      //
      (new Array(max + 1 - name.length)).join(' '),

      //
      // Add the colorized namespace.
      //
      options.ansi,

      //
      // Add the duration since the last call.
      //
      ' ' + human(process.hrtime(debug.prev), {
        precise: !!options.precise
      }),

      //
      // The total time we took to execute the next debug statement.
      //
      ' ',
      line
    ].join('');

    //
    // Use util.format so we can follow the same API as console.log.
    //
    line = util.format.apply(this, [line].concat(
        Array.prototype.slice.call(arguments, 1)
    )) + '\n';

    options.stream.forEach(function each(stream) {
      stream.write(line);
    });

    //
    // Update the previous call with the current time.
    //
    debug.prev = process.hrtime();
  };
}

/**
 * Checks if a given logger based on the allowed environment variables.
 *
 * @param {String} name
 * @returns {Boolean}
 * @api private
 */
function enabled(name) {
  var envy = env()
    , variable = envy.debug || envy.diagnostics || '';

  if (!variable) return false;

  return variable.split(/[\s,]+/).every(function checks(check) {
    check = check.replace('*', '.*?');

    if ('-' === check.charAt(0)) {
      return !(new RegExp('^' + check.substr(1) + '$')).test(name);
    }

    return (new RegExp('^' + check + '$')).test(name);
  });
}

/**
 * Attempt to resolve the name of the application by searching for the
 * package.json use the name property of that. If we cannot find a name property
 * we will use the name of the folder of the module that required us.
 *
 * @param {Module} module The module reference.
 * @returns {String} name of the module.
 * @api private
 */
function resolve(module) {
  var fs = require('fs')
    , path = require('path')
    , folder = path.dirname(module.filename);

  while (folder) {
    var json = path.join(folder, 'package.json');

    if (fs.existsSync(json)) {
      json = require(json);

      if (
           'diagnostics' in json.dependencies
        || 'diagnostics' in json.devDependencies
      ) {
        return json.name;
      }
    }

    folder = path.join(folder, '..');
    if (path.sep === folder) break;
  }

  //
  // We couldn't find a package.json, use a directory/folder as name instead.
  //
  return path.dirname(module.filename).split(path.sep).pop();
}

/**
 * Override the "default" stream that we write to. This allows you to globally
 * configure the steams.
 *
 * @param {Stream} output
 * @returns {function} Factory
 * @api private
 */
function to(output) {
  stream = output instanceof Stream ? output : stream;
  return factory;
}

//
// Expose our private methods so they can be tested.
//
factory.resolve = resolve;
factory.enabled = enabled;
factory.to = to;

//
// Expose the module.
//
module.exports = factory;