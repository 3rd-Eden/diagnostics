require('./integration')('node', {
  on: function on(namespace) {
    process.env.DEBUG=namespace;
  },

  off: function off() {
    process.env.DEBUG='';
  }
});
