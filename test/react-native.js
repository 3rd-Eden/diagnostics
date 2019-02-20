let storage = require('storage-engine');
if (storage.default) storage = storage.default;

require('./integration')('react-native', {
  on: async function on(namespace) {
    await storage.setItem('debug', namespace);
  },

  off: async function off() {
    await storage.setItem('debug', '');
  }
});
