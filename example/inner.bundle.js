'use strict';

var CrossEmitter = require('../');
var crossEmitter = new CrossEmitter({
  target: window.parent
});

$(function() {
  $('button').click(function() {
    var value = $('#eventName').val();
    if (!value) {
      return;
    }
    $('#eventName').val('');
    crossEmitter.emit('msg', 'inner - ' + value);
  });

  crossEmitter.on('msg', function(msg) {
    $('.events').append('<div class="event">' + msg + '</div>');
  });
});
