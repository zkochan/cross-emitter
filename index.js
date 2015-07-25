'use strict';

var FrameMessage = require('frame-message');

function CrossEmitter(opts) {
  opts = opts || {};
  
  this._eventCallbacks = {};
  this._frameMessage = new FrameMessage(opts);

  var _this = this;
  this._frameMessage.recieve(function() {
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

  this._frameMessage.post.apply(this._frameMessage, arguments);
};

module.exports = CrossEmitter;
