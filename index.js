'use strict';

var Subscriber = require('frame-message').Subscriber;
var Publisher = require('frame-message').Publisher;

function CrossEmitter(opts) {
  opts = opts || {};

  this._eventCallbacks = {};
  this._subscriber = new Subscriber(opts);
  this._publisher = new Publisher(opts);

  var _this = this;
  this._subscriber.subscribe(function() {
    _this.innerEmit.apply(_this, arguments);
  });
}

CrossEmitter.prototype.on = function(event, cb) {
  if (!event || typeof event !== 'string') {
    throw new Error('event is required and has to be a string');
  }
  if (!cb || typeof cb !== 'function') {
    throw new Error('cb is required and has to be a function');
  }

  this._eventCallbacks[event] = this._eventCallbacks[event] || [];
  this._eventCallbacks[event].push(cb);
};

CrossEmitter.prototype.innerEmit = function(event) {
  if (!event || typeof event !== 'string') {
    throw new Error('event is required and has to be a string');
  }

  if (!this._eventCallbacks[event]) {
    return;
  }

  var args = Array.prototype.splice.call(arguments, 1);
  for (var i = 0, len = this._eventCallbacks[event].length; i < len; i++) {
    this._eventCallbacks[event][i].apply(this, args);
  }
};

CrossEmitter.prototype.emit = function(event) {
  if (!event || typeof event !== 'string') {
    throw new Error('event is required and has to be a string');
  }

  this.innerEmit.apply(this, arguments);

  this._publisher.publish.apply(this._publisher, arguments);
};

CrossEmitter.prototype.removeListener = function(event, listener) {
  var callbacks = this._eventCallbacks[event];
  if (!callbacks) {
    return;
  }

  var i = 0;
  while(i < callbacks.length) {
    if (callbacks[i] === listener) {
      callbacks.splice(i, 1);
    } else {
      i++;
    }
  }
};

module.exports = CrossEmitter;
