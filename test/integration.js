const { describe, it } = require('mocha');
const assume = require('assume');

/**
 * Auto generates the test suite that is used for integration testing the
 * loggers on that are created for different platforms.
 *
 * @param {String} name Name of the platform we're testing
 * @param {Object} helpers The namespace updating helpers.
 * @public
 */
module.exports = function create(name, helpers) {
  const diagnostics = require('../'+ name);
  const { on, off } = helpers;
  let debug;

  function timeout(duration) {
    return new Promise(function (resolve) {
      setTimeout(resolve, duration);
    });
  }

  async function builder(namespace, options) {
    debug = diagnostics(namespace, options);
    await timeout(10);
  }

  describe('diagnostics('+ name +')', function () {
    beforeEach(async function () {
      await builder('foo:bar')
    });

    it('returns a debugger function', function () {
      assume(debug).is.a('function');
    });

    describe('properties', function () {
      it('has the `modify`, `set` and `use` functions', function () {
        assume(debug.modify).equals(diagnostics.modify);
        assume(debug.use).equals(diagnostics.use);
        assume(debug.set).equals(diagnostics.set);
      });

      it('has dev/prod booleans', function () {
        assume(debug.prod).is.false();
        assume(debug.dev).is.true();
      });

      it('has the namespace assigned to it', function () {
        assume(debug.namespace).equals('foo:bar');
      });

      it('is enabled', async function () {
        await builder('foo:bar');
        assume(debug.enabled).is.false();

        await builder('foo:bar', { force: true });
        assume(debug.enabled).is.true();

        await builder('foo:bar');
        assume(debug.enabled).is.false();

        await on('foo*');
        await builder('foo:bar');

        assume(debug.enabled).is.true();
        await off();
      });
    });

    describe('logging', function () {
      beforeEach(async function () {
        await on('foo*');
      });

      afterEach(async function () {
        await off();
      });

      it('writes prefixed messages to the logger', async function() {
        await builder('foo:bar');

        let meta;
        let messages;

        debug.set(function (first, second) {
          meta = first;
          messages = second;
        });

        debug('multiple arguments', 'are', 'fine');

        assume(meta).is.a('object');
        assume(meta.namespace).equals('foo:bar');
        assume(meta.enabled).is.true();
        assume(meta.dev).is.true();

        assume(messages).is.a('array');
        assume(messages[0]).includes('foo:bar');

        //
        // Restore the original logger.
        //
        debug.set(require('../logger/console'));
      });
    });
  });
}
