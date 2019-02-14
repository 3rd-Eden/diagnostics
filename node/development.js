var create = require('../diagnostics');

/**
 * Create a new diagnostics logger.
 *
 * @param {String} namespace The namespace it should enable.
 * @param {Object} options Additional options.
 * @returns {Function} The logger.
 * @public
 */
var diagnostics = create(function dev(namespace, options) {
  options = options || {};

  if (!dev.enabled() && !(options.force || dev.force)) return dev.nope;

  options.namespace = namespace;
  return dev.yep(options);
});

//
// Configure the logger for the given environment.
//
diagnostics.modify(require('../modifiers/namespace-ansi'));
diagnostics.use(require('../adapters/process.env'));
diagnostics.set(require('../logger/console'));

//
// Expose the diagnostics logger.
//
module.exports = diagnostics;
