'use strict';

var CrossEmitter = require('../');

$(function() {
  var crossEmitter = new CrossEmitter({
    target: document.getElementById('iframe').contentWindow
  });

  $('button').click(function() {
    var value = $('#eventName').val();
    if (!value) {
      return;
    }
    $('#eventName').val('');
    crossEmitter.emit('msg', 'outer - ' + value);
  });

  crossEmitter.on('msg', function(msg) {
    $('.events').append('<div class="event">' + msg + '</div>');
  });
});
