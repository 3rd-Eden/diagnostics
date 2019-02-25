const namespace = require('../modifiers/namespace');
const ansi = require('../modifiers/namespace-ansi');
const { describe, it } = require('mocha');
const assume = require('assume');

describe('diagnostics(modifiers)', function () {
  describe('namespace', function () {
    it('is a function', function () {
      assume(namespace).is.a('function');
    });

    it('will prefix messages with the namespace', function () {
      const data = namespace(['foo'], {
        namespace: 'lol hello'
      });

      assume(data[0]).equals('%clol hello:%c foo');
    });

    it('should slice the color flag as second argument', function () {
      const data = namespace(['foo', 'bar'], {
        namespace: 'lol hello'
      });

      assume(data[0]).equals('%clol hello:%c foo');
      assume(data[1]).contains('color:#');
      assume(data[2]).equals('color:inherit');
      assume(data[3]).equals('bar');
    });

    it('does not render colors if `colors===false`', function () {
      const data = namespace(['foo', 'bar'], {
        namespace: 'lol hello',
        colors: false
      });

      assume(data[0]).equals('lol hello: foo');
      assume(data[1]).equals('bar');
    });
  });

  describe('namespace-ansi', function () {
    it('is a function', function () {
      assume(ansi).is.a('function');
    });

    it('adds the namespace', function () {
      const data = ansi(['foo'], {
        namespace: 'lol hello'
      });

      assume(data[0]).equals('\x1b[38;5;109mlol hello:\x1b[39;49m foo');
    });

    it('does not render colors if `colors===false`', function () {
      const data = ansi(['foo', 'bar'], {
        namespace: 'lol hello',
        colors: false
      });

      assume(data[0]).equals('lol hello: foo');
      assume(data[1]).equals('bar');
    });
  });
});
