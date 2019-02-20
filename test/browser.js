require('./integration')('browser', {
  on: function on(namespace) {
    localStorage.setItem('debug', namespace);
  },

  off: function off() {
    localStorage.setItem('debug', '');
  }
});
