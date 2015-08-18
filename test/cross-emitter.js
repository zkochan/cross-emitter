'use strict';

var sinon = require('sinon');
var CrossEmitter = require('../');
var dummyTarget = {
  window: {
    postMessage: function() {}
  }
};

describe('CrossEmitter', function() {
  describe('inner communication', function() {
    it('arguments are passed to the handler', function() {
      var handler = sinon.spy();
      var crossEmitter = new CrossEmitter({
        targets: [dummyTarget]
      });
      crossEmitter.on('foo', handler);
      crossEmitter.emit('foo', 1, 2);

      expect(handler.calledWithExactly(1, 2)).to.be.true;
    });

    it('handlers are executed in the correct order', function() {
      var handler1 = sinon.spy();
      var handler2 = sinon.spy();
      var crossEmitter = new CrossEmitter({
        targets: [dummyTarget]
      });
      crossEmitter.on('foo', handler1);
      crossEmitter.on('foo', handler2);
      crossEmitter.emit('foo');

      sinon.assert.callOrder(handler1, handler2);
    });
  });

  describe('outer communication', function() {
    it('should postMessage when event happens', function() {
      var postMessage = sinon.spy();
      var crossEmitter = new CrossEmitter({
        channel: 'fooChannel',
        targets: [{
          window: {
            postMessage: postMessage
          },
          origin: 'http://google.com'
        }]
      });
      crossEmitter.emit('foo', 1, 2);

      expect(postMessage.calledWithExactly(JSON.stringify({
        channel: 'fooChannel',
        args: ['foo', 1, 2]
      }), 'http://google.com')).to.be.true;
    });

    it('should emit inner event when outer event happend', function() {
      var cb;
      var crossEmitter = new CrossEmitter({
        channel: 'barChannel',
        targets: [dummyTarget],
        addEventListener: function(event, _cb, useCapture) {
          expect(event).to.eq('message');
          expect(useCapture).to.be.false;
          cb = _cb;
        }
      });

      var handler = sinon.spy();
      crossEmitter.on('foo', handler);

      cb({
        data: JSON.stringify({
          channel: 'barChannel',
          args: ['foo', 43, 23, 1]
        })
      });

      expect(handler.calledWithExactly(43, 23, 1)).to.be.true;
    });
  });

  it('removes listener', function() {
    var handler = sinon.spy();
    var crossEmitter = new CrossEmitter({
      channel: 'foo',
      targets: [dummyTarget]
    });
    crossEmitter.on('bar', handler);
    crossEmitter.removeListener('bar', handler);
    crossEmitter.emit('bar');
    sinon.assert.notCalled(handler);
  });
});
