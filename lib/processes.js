"use strict";

/**
 * Diagnostics about the current running processes in the event loop.
 *
 * This file provides diagnostics about the current running processes and
 * handles in the event loop. This file should provide the following intel:
 *
 * - Determing the different type's of handles
 * - Count's of the different handles
 * - Active request counts etc
 *
 * @copyright (c) 2012 observe.it (observe.it) <opensource@observe.it>
 * MIT Licensed
 */

var net = require('net')
  , http = require('http');

/**
 * Detect the instance of a handle.
 *
 * @param {Mixed} instance
 * @returns {String}
 * @api private
 */

function type(instance) {
  if (instance instanceof net.Socket) {
    if ('incomming' in instance) return 'http.incomingmessage';
    return 'net.socket';
  }

  if (instance instanceof net.Server) return 'net.server';
  if (instance instanceof http.Server) return 'http.server';
  if (instance instanceof http.IncomingMessage) return 'http.incomingmessage';
  if (instance instanceof http.OutgoingMessage) return 'http.outgoingmessage';
}
