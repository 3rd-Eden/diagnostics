const gonzole = require('../logger/console');
const { describe, it } = require('mocha');
const assume = require('assume');

describe('diagnostics(logger)', function () {
  describe('console', function () {
    it('is a function', function () {
      assume(gonzole).is.a('function');
    });

    it('logs to console.log', function (next) {
      var log = console.log;

      console.log = function () {
        var args = Array.prototype.slice.call(arguments, 0);

        assume(args[0]).equals('message');
        assume(args[1]).equals('here');

        console.log = log;
        next();
      };

      gonzole({}, ['message', 'here']);
    });
  });
});
