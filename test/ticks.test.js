/*global expect */
"use strict";

var ticker = require('../lib/ticks');

describe('ticker', function () {
  describe('#tickDuration', function () {
    it('should return a tick', function (done) {
      ticker.tickDuration(function (duration) {
        console.log('tick', duration);
        expect(duration).to.be.a('number');

        done();
      });
    });
  });

  describe('#ticksPerSecond', function () {
    it('should return a count', function (done) {
      ticker.ticksPerSecond(1, function (ticks) {
        expect(ticks).to.be.a('number');
        expect(ticks).to.be.above(100);

        done();
      });
    });
  });
});
