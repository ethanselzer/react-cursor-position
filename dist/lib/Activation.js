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
var Activation = exports["default"] = /*#__PURE__*/function () {
  function Activation() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      onIsActiveChanged = _ref.onIsActiveChanged;
    _classCallCheck(this, Activation);
    if (typeof onIsActiveChanged !== 'function') {
      throw new Error('onIsActiveChanged should be a function');
    }
    this.onIsActiveChanged = onIsActiveChanged;
    this.isActive = false;
    this.timers = [];
  }
  _createClass(Activation, [{
    key: "activate",
    value: function activate() {
      this.isActive = true;
      this.onIsActiveChanged({
        isActive: true
      });
    }
  }, {
    key: "deactivate",
    value: function deactivate() {
      this.isActive = false;
      this.onIsActiveChanged({
        isActive: false
      });
      this.clearTimers();
    }
  }, {
    key: "toggleActivation",
    value: function toggleActivation() {
      if (this.isActive) {
        this.deactivate();
      } else {
        this.activate();
      }
    }
  }, {
    key: "clearTimers",
    value: function clearTimers() {
      var timers = this.timers;
      while (timers.length) {
        var timer = timers.pop();
        clearTimeout(timer.id);
      }
    }
  }, {
    key: "clearTimer",
    value: function clearTimer(timerName) {
      this.timers.forEach(function (timer) {
        if (timer.name === timerName) {
          clearTimeout(timer.id);
        }
      });
    }
  }]);
  return Activation;
}();