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
 * @return {Boolean} Indication if the namespace is allowed to log.
 * @public
 */
async function asyncstorage(namespace) {
  var debug, diagnostics;

  try {
    debug = await storage.getItem('debug');
    diagnostics = await storage.getItem('diagnostics');
  } catch (e) {
    /* Nope, nothing. */
  }

  return enabled(namespace, debug || diagnostics || '');
};

//
// Expose the adapter, but mark it as `async` because `typeof` and
// `Object.prototype.toString.call(async function)` don't always return an
// indication that the given function is async. If we explicitly mark it,
// it will be easier to track.
//
asyncstorage.async = true;
module.exports = asyncstorage;
