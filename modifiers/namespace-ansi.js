var colorspace = require('colorspace');
var kuler = require('kuler');

/**
 * Prefix the messages with a colored namespace.
 *
 * @param {Array} messages The messages array that is getting written.
 * @param {Object} options Options for diagnostics.
 * @returns {Array} Altered messages array.
 * @public
 */
module.exports = function ansiModifier(messages, options) {
  var namespace = options.namespace;
  var ansi = kuler(namespace, colorspace(namespace));

  messages[0] = ansi + ' ' + messages[0];
  return messages;
};
