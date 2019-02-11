//
// Select the correct build version depending on the environment.
//
if (process.env.NODE_ENV !== 'production') {
  module.exports = require('./development.js');
} else {
  module.exports = require('./production.js');
}
