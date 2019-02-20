const AsyncStorage = require('asyncstorageapi');
const poison = require('require-poisoning');
const localStorage = require('objstorage');

//
// Fake react-native require so we can inject AsyncStorage as faked API
// so we can test if our adapter is working as intended.
//
poison('react-native', {
  AsyncStorage: AsyncStorage
});

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
