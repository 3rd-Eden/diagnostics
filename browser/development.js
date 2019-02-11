const create = require('../diagnostics');

module.exports = create(function dev(namespace) {
  if (!dev.enabled()) return dev.nope;

  return function diagnostics() {

  }
});
