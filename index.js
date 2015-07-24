'use strict';

function CrossEmitter(opts) {
  opts = opts || {};

  if (!opts.target) {
    throw new Error('opts.target is required');
  }

  this._target = opts.target;
  this._origin = opts.origin || '*';
  this._channel = opts.channel || 'default';


  var _this = this;
  function onMessage(e) {
    var event = parse(e.data);
    if (event.channel === _this._channel) {
      _this._emit.apply(_this, event.args);
    }
  }

  if (window.addEventListener) {
    window.addEventListener('message', onMessage, false);
  } else {
    window.attachEvent('onmessage', onMessage, false);
  }
}

CrossEmitter.prototype.on = function() {

};

CrossEmitter.prototype.emit = function() {

};

module.exports = CrossEmitter;
