var storage = require('storage-engine');
var enabled = require('enabled');

//
// Compatiblity for when we get an ES compiled version.
//
if (storage.default) storage = storage.default;

/**
 * AsyncStorage Adapter for React-Native
 *
 * @param {String} namespace The namespace we should trigger on.
 * @public
 */
module.exports = async function asyncstorage(namespace) {
  var debug, diagnostics;

  try {
    debug = await storage.getItem('debug');
    diagnostics = await storage.getItem('diagnostics');
  } catch (e) {
    /* Nope, nothing. */
  }

  return enabled(namespace, debug || diagnostics || '');
};
