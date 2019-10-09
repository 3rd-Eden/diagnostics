const localstorage = require('../adapters/localstorage');
const asyncstorage = require('../adapters/asyncstorage');
const env = require('../adapters/process.env');
const { describe, it } = require('mocha');
let storage = require('storage-engine');
const hash = require('../adapters/hash');
const assume = require('assume');

if (storage.default) storage = storage.default;

describe('diagnostics(adapters)', function () {
  describe('hash', function () {
    it('is disabled by default', function () {
      assume(hash('foo:bar')).is.false();
    });

    it('reads #debug=...', function () {
      window.location.hash = '#debug=foo*';
      assume(hash('foo:bar')).is.true();
    });

    it('reads #diagnostics=...', function () {
      window.location.hash = '#diagnostics=bar*';
      assume(hash('bar:foo')).is.true();
    });
  });

  describe('localstorage', function () {
    afterEach(function () {
      global.localStorage.removeItem('debug');
      global.localStorage.removeItem('diagnostics');
    });

    it('is disabled by default', function () {
      assume(localstorage('local:storage')).is.false();
    });

    it('reads the debug key', function () {
      global.localStorage.setItem('debug', 'local*');
      assume(localstorage('local:storage')).is.true();
    });

    it('reads the diagnostics key', function () {
      global.localStorage.setItem('diagnostics', 'diag*');
      assume(localstorage('diag:nostics')).is.true();
    });
  });

  describe('process.env', function () {
    afterEach(function () {
      process.env.DEBUG = '';
      process.env.DIAGNOSTICS = '';
    });

    it('is disabled by default', function () {
      assume(env('process:env')).is.false();
    });

    it('reads the DEBUG variable', function () {
      process.env.DEBUG = 'process*'
      assume(env('process:env')).is.true();
    });

    it('considers excluded namespace', function () {
      process.env.DEBUG = '*,-process:env'
      assume(env('process:env')).is.false();
    });

    it('reads the DIAGNOSTICS key', function () {
      process.env.DIAGNOSTICS = 'no*'
      assume(env('no:joke')).is.true();
    });
  });

  describe('asyncstorage', function () {
    afterEach(async function () {
      await storage.clear();
    });

    it('is disabled by default', async function () {
      assume(await asyncstorage('async:storage')).is.false();
    });

    it('reads the debug key', async function () {
      await storage.setItem('debug', 'async*');
      assume(await asyncstorage('async:storage')).is.true();
    });

    it('reads the diagnostics key', async function () {
      await storage.setItem('diagnostics', 'it*');
      assume(await asyncstorage('it:works')).is.true();
    });
  });
});
