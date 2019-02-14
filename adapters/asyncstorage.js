var storage = require('storage-engine');
var enabled = require('enabled');

module.exports = async function asyncAdapter(namespace) {
  var debug = await storage.getItem('debug');
}
