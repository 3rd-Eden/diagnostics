'use strict';

var colorspace = require('colorspace');
var enabled = require('enabled');

/**
 * Bare minimum browser version of diagnostics. It doesn't need fancy pancy
 * detection algorithms. The code is only enabled when *you* enable it for
 * debugging purposes.
 *
 * @param {String} name Namespace of the diagnostics instance.
 * @returns {Function} The logger.
 * @public
 */
module.exports = function factory(name) {
  if (!enabled(name)) return function diagnopes() {};

  //
  // The color for the namespace.
  //
  var color = colorspace(name);

  /**
   * The actual function that does the logging.
   *
   * @param {...args} args The data that needs to be logged.
   * @public
   */
  return function diagnostics() {
    var args = Array.prototype.slice.call(arguments, 0);

    //
    // We cannot push a value as first argument of the argument array as
    // console's formatting %s, %d only works on the first argument it receives.
    // So in order to prepend our namespace we need to override and prefix the
    // first argument.
    //
    args[0] = '%c'+ name +'%c: '+ args[0];

    //
    // Now we want to inject the colors to the arguments, so they get colored.
    // The last empty argh here is to remove the color again so the log message
    // is not colored.
    //
    args.splice(1, 0, 'color:'+ color, '');

    //
    // So yea. IE8 doesn't have an apply so we need a work around to puke the
    // arguments in place.
    //
    try { Function.prototype.apply.call(console.log, console, args); }
    catch (e) {}
  };
};
