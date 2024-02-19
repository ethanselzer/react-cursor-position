"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = addEventListener;
function addEventListener(node, eventName, handler, options) {
  node.addEventListener(eventName, handler, options);
  return {
    removeEventListener: function removeEventListener() {
      node.removeEventListener(eventName, handler, options);
    }
  };
}