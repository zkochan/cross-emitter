'use strict';

function parse(data) {
  var parsedData;
  try {
    parsedData = JSON.parse(data);
  } catch (err) {
    parsedData = {};
  }
  return parsedData;
}

function CrossEmitter(opts) {
  opts = opts || {};

  if (!opts.target) {
    throw new Error('opts.target is required');
  }

  this._target = opts.target;
  this._origin = opts.origin || '*';
  this._channel = opts.channel || 'default';
  this._eventCallbacks = {};


  var _this = this;
  function onMessage(e) {
    var event = parse(e.data);
    if (event.channel === _this._channel) {
      _this.innerEmit.apply(_this, event.args);
    }
  }

  if (window.addEventListener) {
    window.addEventListener('message', onMessage, false);
  } else {
    window.attachEvent('onmessage', onMessage, false);
  }
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

  var msg = {
    channel: this._channel,
    args: Array.prototype.slice.call(arguments)
  };
  this._target.postMessage(JSON.stringify(msg), this._origin);
};

module.exports = CrossEmitter;
