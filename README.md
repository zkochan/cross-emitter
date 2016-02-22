# cross-emitter

EventEmitter style wrapper around postMessage.

[![Dependency Status](https://david-dm.org/zkochan/cross-emitter/status.svg?style=flat)](https://david-dm.org/zkochan/cross-emitter)
[![Build Status](https://travis-ci.org/zkochan/cross-emitter.svg?branch=master)](https://travis-ci.org/zkochan/cross-emitter)
[![npm version](https://badge.fury.io/js/cross-emitter.svg)](http://badge.fury.io/js/cross-emitter)


# Installation

```
npm install --save cross-emitter
```


## Usage example

Lets say there's a button inside an iframe and it has to emit events to the parent window. Here's how it can be implemented with cross-emitter.

Code inside the iframe:

```js
var CrossEmitter = require('cross-emitter');

var innerEmitter = new CrossEmitter({
  targets: [
    window: window.parent
  ]
});

$('button').click(function() {
  innerEmitter.emit('hello', 'Hello world!');
});

/* it is also possible to subscribe to events inside the iframe */
innerEmitter.on('hello', function(msg) {
  console.log('from iframe: ' + msg);
});

/* Emitting events works in both directions. 
 * It is possible to listen events from the parent window.  */
innerEmitter.on('gotHello', function(times) {
  console.log('Parent window received hello ', times, ' times');
});
```

Code of the parent window:

```js
var CrossEmitter = require('cross-emitter');

var outerEmitter = new CrossEmitter({
  targets: [
    window: targetIframe.contentWindow
  ]
});

var helloesCount = 0;
outerEmitter.on('hello', function(msg) {
  console.log(msg);
  helloesCount++;
  outerEmitter.emit('gotHello', helloesCount);
});
```


## License

MIT © [Zoltan Kochan](https://www.kochan.io)
