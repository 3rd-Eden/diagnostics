var colorspace = require('colorspace');

/**
 * Prefix the messages with a colored namespace.
 *
 * @param {Array} messages The messages array that is getting written.
 * @param {Object} options Options for diagnostics.
 * @returns {Array} Altered messages array.
 * @public
 */
module.exports = function colorNamespace(messages, options) {
  var namespace = options.namespace;
  var color = colorspace(namespace);

  //
  // The console API supports a special %c formatter in browsers. This is used
  // to style console messages with any CSS styling, in our case we want to
  // use colorize the namespace for clarity. As these are formatters, and
  // we need to inject our CSS string as second messages argument so it
  // gets picked up correctly.
  //
  messages[0] = '%c'+ namespace +'%c' + messages[0];
  args.splice(1, 0, 'color:'+ color, '');

  return messages;
};
