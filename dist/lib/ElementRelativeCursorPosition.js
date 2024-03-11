"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var ElementRelativeCursorPosition = exports["default"] = /*#__PURE__*/function () {
  function ElementRelativeCursorPosition(el) {
    _classCallCheck(this, ElementRelativeCursorPosition);
    this.el = el;
  }
  _createClass(ElementRelativeCursorPosition, [{
    key: "getDocumentRelativeElementOffset",
    value: function getDocumentRelativeElementOffset(el) {
      var rootEl = this.getRootOfEl(el);
      var _rootEl$getBoundingCl = rootEl.getBoundingClientRect(),
        docLeft = _rootEl$getBoundingCl.left,
        docTop = _rootEl$getBoundingCl.top;
      var _el$getBoundingClient = el.getBoundingClientRect(),
        elLeft = _el$getBoundingClient.left,
        elTop = _el$getBoundingClient.top;
      return {
        x: Math.abs(docLeft) + elLeft,
        y: Math.abs(docTop) + elTop
      };
    }
  }, {
    key: "getRootOfEl",
    value: function getRootOfEl(el) {
      if (el.parentElement) {
        return this.getRootOfEl(el.parentElement);
      }
      return el;
    }
  }, {
    key: "getComputedElementRelativeCursorPosition",
    value: function getComputedElementRelativeCursorPosition(event, documentRelativeElementOffset) {
      this.lastEvent = event;
      var position = this.getDocumentRelativeCursorPosition(event);
      var cursorX = position.x,
        cursorY = position.y;
      var offsetX = documentRelativeElementOffset.x,
        offsetY = documentRelativeElementOffset.y;
      return {
        x: Math.round(cursorX - offsetX),
        y: Math.round(cursorY - offsetY)
      };
    }
  }, {
    key: "getDocumentRelativeCursorPosition",
    value: function getDocumentRelativeCursorPosition(event) {
      return {
        x: event.pageX,
        y: event.pageY
      };
    }
  }, {
    key: "documentRelativeElementOffset",
    get: function get() {
      if (!this.elementOffset) {
        this.elementOffset = this.getDocumentRelativeElementOffset(this.el);
      }
      return this.elementOffset;
    }
  }, {
    key: "getCursorPosition",
    value: function getCursorPosition(event) {
      return this.getComputedElementRelativeCursorPosition(event, this.documentRelativeElementOffset);
    }
  }]);
  return ElementRelativeCursorPosition;
}();