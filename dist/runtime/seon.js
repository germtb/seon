'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createFunction = require('./createFunction');

Object.defineProperty(exports, 'createFunction', {
  enumerable: true,
  get: function get() {
    return _createFunction.createFunction;
  }
});

var _patternMatching = require('./patternMatching');

Object.defineProperty(exports, 'match', {
  enumerable: true,
  get: function get() {
    return _patternMatching.match;
  }
});
Object.defineProperty(exports, 'matchExpression', {
  enumerable: true,
  get: function get() {
    return _patternMatching.matchExpression;
  }
});