"use strict";

/**
 * Get the duration of a single tick.
 *
 * @TODO use process.hrtime() instead
 * @TODO get the overhead of this call and substract it from the time
 * @param {Function} fn
 * @api private
 */

exports.tickDuration = function tickDuration(fn) {
  process.nextTick(function tick() {
    var start = Date.now();

    process.nextTick(function tok() {
      fn(Date.now() - start);
    });
  });
};

/**
 * Get the amount of ticks occures within on a timespan.
 *
 * @TODO setTimeout's are not accurate to the milisecond so we should really
 * check a Date.now() or a process.hrtime() on each nextTick call to see if we
 * didn't blow passed our timeout.
 * @param {Number} duration the amount of seconds we want to count
 * @param {Function} fn
 * @api private
 */

exports.ticksPerSecond = function ticksPerSecond(duration, fn) {
  var ticks = 0
    , running = true;

  process.nextTick(function ticktock() {
    if (!running) return fn(Math.round(ticks / duration));

    ticks++;
    process.nextTick(ticktock);
  });

  setTimeout(function timeout() {
    running = false;
  }, duration * 1000);
};
