"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _constants = require("../constants");
var _TouchEnvironmentActivation = _interopRequireDefault(require("./TouchEnvironmentActivation"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }
function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
var PressActivation = exports["default"] = /*#__PURE__*/function (_TouchEnvironmentActi) {
  _inherits(PressActivation, _TouchEnvironmentActi);
  function PressActivation(_ref) {
    var _this;
    var onIsActiveChanged = _ref.onIsActiveChanged,
      pressDurationInMs = _ref.pressDurationInMs,
      pressMoveThreshold = _ref.pressMoveThreshold;
    _classCallCheck(this, PressActivation);
    _this = _callSuper(this, PressActivation, [{
      onIsActiveChanged: onIsActiveChanged
    }]);
    _this.pressDurationInMs = pressDurationInMs;
    _this.pressMoveThreshold = pressMoveThreshold;
    return _this;
  }
  _createClass(PressActivation, [{
    key: "touchStarted",
    value: function touchStarted(_ref2) {
      var position = _ref2.position;
      this.initPressEventCriteria(position);
      this.setPressEventTimer();
    }
  }, {
    key: "touchMoved",
    value: function touchMoved(_ref3) {
      var position = _ref3.position;
      if (this.isActive) {
        return;
      }
      this.setPressEventCriteria(position);
    }
  }, {
    key: "setPressEventTimer",
    value: function setPressEventTimer() {
      var _this2 = this;
      this.timers.push({
        name: _constants.PRESS_EVENT_TIMER_NAME,
        id: setTimeout(function () {
          if (Math.abs(_this2.currentElTop - _this2.initialElTop) < _this2.pressMoveThreshold) {
            _this2.activate();
          }
        }, this.pressDurationInMs)
      });
    }
  }, {
    key: "setPressEventCriteria",
    value: function setPressEventCriteria(position) {
      this.currentElTop = position.y;
    }
  }, {
    key: "initPressEventCriteria",
    value: function initPressEventCriteria(position) {
      var top = position.y;
      this.initialElTop = top;
      this.currentElTop = top;
    }
  }]);
  return PressActivation;
}(_TouchEnvironmentActivation["default"]);