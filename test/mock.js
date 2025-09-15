const localStorage = require('objstorage');

//
// Fake the window.location so we can alter the hash
//
global.window = {
  location: {
    hash: '#'
  }
};

//
// Fake localStorage with a compatible mock api
//
global.localStorage = localStorage;
