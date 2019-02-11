const create = require('../diagnostics.js');
const { describe, it } = require('mocha');
const EventEmitter = require('events');
const assume = require('assume');

describe('diagnostics(base)', function () {
  const events = new EventEmitter();
  let diagnostics;

  beforeEach(function () {
    diagnostics = create(function () {});
  });

  it('returns the passed function with addition static props', function () {
    function dev() {}

    assume(dev.nope).is.a('undefined');
    assume(create(dev)).equals(dev);
    assume(dev.nope).is.not.a('undefined');
  });

  describe('#nope', function () {
    it('creates a nope, no-side effects, empty function', function () {
      assume(diagnostics.nope).is.a('function');
      assume(diagnostics.nope).does.not.throw();
    });
  });

  describe('custom loggers:', function () {
    describe('#set', function () {
      it('is a function', function () {
        assume(diagnostics.set).is.a('function');
      });
    });

    describe('#write', function () {
      it('will write to the #set logger', function () {
        var messages = [];

        diagnostics.set(function writer(meta, message) {
          assume(meta).is.a('object');
          assume(meta.meta).equals('data');

          messages.push(message);
        });

        diagnostics.write({ meta: 'data' }, 'hello world');
        assume(messages).is.length(1);
        assume(messages[0]).equals('hello world');

        diagnostics.set(diagnostics.nope);

        diagnostics.write({ meta: 'data' }, 'hello world');
        assume(messages).is.length(1);
        assume(messages[0]).equals('hello world');
      });
    });
  });

  describe('environment adapters:', function () {
    describe('#use', function () {
      it('is a function', function () {
        assume(diagnostics.use).is.a('function');
      });

      it('returns true when an new adapter is addded', function () {
        assume(diagnostics.use(function () { })).is.true();
      });

      it('returns false if an adapter has been previously added', function () {
        function adapter() { }

        assume(diagnostics.use(adapter)).is.true();
        assume(diagnostics.use(adapter)).is.false();
      });
    });

    describe('#enabled', function () {
      it('is a function', function () {
        assume(diagnostics.enabled).is.a('function');
      });

      it('calls the assigned adapter with the namespace', function () {
        diagnostics.use(function (namespace) {
          return namespace === 'this is an example'
        });

        assume(diagnostics.enabled('foo')).is.false();
        assume(diagnostics.enabled('this is an example')).is.true();
      });
    });
  });

  describe('message transforming:', function () {
    describe('#modify', function () {
      it('is a function', function () {
        assume(diagnostics.modify).is.a('function');
      });

      it('returns true when a modifer is added', function () {
        assume(diagnostics.modify(function (x) { return x; })).is.true();
      });

      it('returns false when a modifier is already added', function () {
        function modifier(x) { return x; }

        assume(diagnostics.modify(modifier)).is.true();
        assume(diagnostics.modify(modifier)).is.false();
      });
    });

    describe('#process', function () {
      before(function () {
        diagnostics.modify(function (message, opts) {
          events.emit('process', message, opts);

          return message;
        });
      });

      it('calls the stored modifier', function (next) {
        events.once('process', function (message, opts) {
          assume(message).equals('hello world');
          assume(opts).deep.equals({ foo: 'bar' });

          next();
        });

        diagnostics.process('hello world', { foo: 'bar' });
      });

      it('calls all modifiers in order and passes transformed message to next', function () {
        diagnostics.modify(function (message) {
          return 'bar ' + message;
        });

        diagnostics.modify(function (message) {
          return 'foo '+ message;
        });

        assume(diagnostics.process('hello world')).equals('foo bar hello world');
      });
    });
  });
});
