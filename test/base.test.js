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

      it('can process async based adapters', async function () {
        function timeout(duration) {
          return new Promise(function (resolve) {
            setTimeout(resolve, duration);
          });
        }

        diagnostics.use(async function (namespace) {
          await timeout(50);

          return namespace === 'async-namespace';
        });

        assume(await diagnostics.enabled('ping pong')).is.false();
        assume(await diagnostics.enabled('async-namespace')).is.true();
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
          assume(message[0]).equals('hello world');
          assume(opts).deep.equals({ foo: 'bar' });

          next();
        });

        diagnostics.process(['hello world'], { foo: 'bar' });
      });

      it('calls all modifiers in order and passes transformed message to next', function () {
        diagnostics.modify(function (args) {
          args.unshift('bar ');
          return args;
        });

        diagnostics.modify(function (args) {
          args.unshift('foo ');
          return args;
        });

        assume(diagnostics.process(['hello world'])).deep.equals(['foo ', 'bar ', 'hello world']);
      });
    });
  });

  describe('log processing:', function () {
    describe('#nope', function () {
      it('is a function', function () {
        assume(diagnostics.nope).is.a('function');
      });

      it('returns a function that returns false when called', function () {
        const nope = diagnostics.nope({});

        assume(nope).is.a('function');
        assume(nope()).is.false();
      });

      it('assigns the properties to the returned function', function () {
        const nope = diagnostics.nope({
          foo: 'bar'
        });

        assume(nope.foo).equals('bar');
        assume(nope.enabled).is.false();
      });
    });

    describe('#yep', function () {
      it('is a function', function () {
        assume(diagnostics.yep).is.a('function');
      });

      it('returns a function that returns true', function () {
        const yep = diagnostics.yep({});

        assume(yep).is.a('function');
        assume(yep()).is.true();
      });

      it('assigns the properties to the returned function', function () {
        const yep = diagnostics.yep({
          foo: 'bar'
        });

        assume(yep.foo).equals('bar');
        assume(yep.enabled).is.true();
      });

      it('calls the process, and write methods', function () {
        const yep = diagnostics.yep({});
        const steps = [];

        diagnostics.modify(function (messages) {
          assume(messages).includes('yolo');
          steps.push('modify');

          return messages;
        });

        diagnostics.set(function (meta, messages) {
          assume(messages).includes('yolo');
          steps.push('write');
        });

        yep('yolo');
        assume(steps.join('.')).equals('modify.write');
      });
    });
  });
});
