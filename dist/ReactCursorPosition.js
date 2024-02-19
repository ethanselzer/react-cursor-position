"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "INTERACTIONS", {
  enumerable: true,
  get: function get() {
    return _constants.INTERACTIONS;
  }
});
exports["default"] = void 0;
var _react = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _ElementRelativeCursorPosition = _interopRequireDefault(require("./lib/ElementRelativeCursorPosition"));
var _addEventListener = _interopRequireDefault(require("./utils/addEventListener"));
var _constants = require("./constants");
var _noop = _interopRequireDefault(require("./utils/noop"));
var _PressActivation = _interopRequireDefault(require("./lib/PressActivation"));
var _TouchActivation = _interopRequireDefault(require("./lib/TouchActivation"));
var _TapActivation = _interopRequireDefault(require("./lib/TapActivation"));
var _HoverActivation = _interopRequireDefault(require("./lib/HoverActivation"));
var _ClickActivation = _interopRequireDefault(require("./lib/ClickActivation"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { "default": e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n["default"] = e, t && t.set(e, n), n; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }
function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var _default = exports["default"] = /*#__PURE__*/function (_React$Component) {
  _inherits(_default, _React$Component);
  function _default(props) {
    var _this;
    _classCallCheck(this, _default);
    _this = _callSuper(this, _default, [props]);
    _defineProperty(_assertThisInitialized(_this), "onPositionChanged", function () {
      var onPositionChanged = _this.props.onPositionChanged;
      onPositionChanged(_this.state);
    });
    _this.state = {
      detectedEnvironment: {
        isMouseDetected: false,
        isTouchDetected: false
      },
      elementDimensions: {
        width: 0,
        height: 0
      },
      isActive: false,
      isPositionOutside: true,
      position: {
        x: 0,
        y: 0
      }
    };
    _this.shouldGuardAgainstMouseEmulationByDevices = false;
    _this.eventListeners = [];
    _this.timers = [];
    _this.elementOffset = {
      x: 0,
      y: 0
    };
    _this.onTouchStart = _this.onTouchStart.bind(_assertThisInitialized(_this));
    _this.onTouchMove = _this.onTouchMove.bind(_assertThisInitialized(_this));
    _this.onTouchEnd = _this.onTouchEnd.bind(_assertThisInitialized(_this));
    _this.onTouchCancel = _this.onTouchCancel.bind(_assertThisInitialized(_this));
    _this.onMouseEnter = _this.onMouseEnter.bind(_assertThisInitialized(_this));
    _this.onMouseMove = _this.onMouseMove.bind(_assertThisInitialized(_this));
    _this.onMouseLeave = _this.onMouseLeave.bind(_assertThisInitialized(_this));
    _this.onClick = _this.onClick.bind(_assertThisInitialized(_this));
    _this.onIsActiveChanged = _this.onIsActiveChanged.bind(_assertThisInitialized(_this));
    _this.setTouchActivationStrategy(props.activationInteractionTouch);
    _this.setMouseActivationStrategy(props.activationInteractionMouse);
    return _this;
  }
  _createClass(_default, [{
    key: "onIsActiveChanged",
    value: function onIsActiveChanged(_ref) {
      var isActive = _ref.isActive;
      if (isActive) {
        this.activate();
      } else {
        this.deactivate();
      }
    }
  }, {
    key: "onTouchStart",
    value: function onTouchStart(e) {
      this.init();
      this.onTouchDetected();
      this.setShouldGuardAgainstMouseEmulationByDevices();
      var position = this.core.getCursorPosition(this.getTouchEvent(e));
      this.setPositionState(position);
      this.touchActivation.touchStarted({
        e: e,
        position: position
      });
    }
  }, {
    key: "onTouchMove",
    value: function onTouchMove(e) {
      if (!this.isCoreReady) {
        return;
      }
      var position = this.core.getCursorPosition(this.getTouchEvent(e));
      this.touchActivation.touchMoved({
        e: e,
        position: position
      });
      if (!this.state.isActive) {
        return;
      }
      this.setPositionState(position);
      e.preventDefault();
      if (this.props.shouldStopTouchMovePropagation) {
        e.stopPropagation();
      }
    }
  }, {
    key: "onTouchEnd",
    value: function onTouchEnd() {
      this.touchActivation.touchEnded();
      this.unsetShouldGuardAgainstMouseEmulationByDevices();
    }
  }, {
    key: "onTouchCancel",
    value: function onTouchCancel() {
      this.touchActivation.touchCanceled();
      this.unsetShouldGuardAgainstMouseEmulationByDevices();
    }
  }, {
    key: "onMouseEnter",
    value: function onMouseEnter(e) {
      if (this.shouldGuardAgainstMouseEmulationByDevices) {
        return;
      }
      this.init();
      this.onMouseDetected();
      this.setPositionState(this.core.getCursorPosition(e));
      this.mouseActivation.mouseEntered();
    }
  }, {
    key: "onMouseMove",
    value: function onMouseMove(e) {
      if (!this.isCoreReady) {
        return;
      }
      var position = this.core.getCursorPosition(e);
      this.setPositionState(position);
      this.mouseActivation.mouseMoved(position);
    }
  }, {
    key: "onMouseLeave",
    value: function onMouseLeave() {
      this.mouseActivation.mouseLeft();
      this.setState({
        isPositionOutside: true
      });
    }
  }, {
    key: "onClick",
    value: function onClick(e) {
      this.setPositionState(this.core.getCursorPosition(e));
      this.mouseActivation.mouseClicked();
      this.onMouseDetected();
    }
  }, {
    key: "onTouchDetected",
    value: function onTouchDetected() {
      var environment = {
        isTouchDetected: true,
        isMouseDetected: false
      };
      this.setState({
        detectedEnvironment: environment
      });
      this.props.onDetectedEnvironmentChanged(environment);
    }
  }, {
    key: "onMouseDetected",
    value: function onMouseDetected() {
      var environment = {
        isTouchDetected: false,
        isMouseDetected: true
      };
      this.setState({
        detectedEnvironment: environment
      });
      this.props.onDetectedEnvironmentChanged(environment);
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      if (this.props.isEnabled) {
        this.enable();
      }
    }
  }, {
    key: "componentWillReceiveProps",
    value: function componentWillReceiveProps(_ref2) {
      var willBeEnabled = _ref2.isEnabled;
      var isEnabled = this.props.isEnabled;
      var isEnabledWillChange = isEnabled !== willBeEnabled;
      if (!isEnabledWillChange) {
        return;
      }
      if (willBeEnabled) {
        this.enable();
      } else {
        this.disable();
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.disable();
    }
  }, {
    key: "isCoreReady",
    get: function get() {
      return !!this.core;
    }
  }, {
    key: "enable",
    value: function enable() {
      this.addEventListeners();
    }
  }, {
    key: "disable",
    value: function disable() {
      this.removeEventListeners();
    }
  }, {
    key: "init",
    value: function init() {
      this.core = new _ElementRelativeCursorPosition["default"](this.el);
      this.setElementDimensionsState(this.getElementDimensions(this.el));
    }
  }, {
    key: "setTouchActivationStrategy",
    value: function setTouchActivationStrategy(interaction) {
      var _this$props = this.props,
        pressDurationInMs = _this$props.pressDurationInMs,
        pressMoveThreshold = _this$props.pressMoveThreshold,
        tapDurationInMs = _this$props.tapDurationInMs,
        tapMoveThreshold = _this$props.tapMoveThreshold;
      var TOUCH = _constants.INTERACTIONS.TOUCH,
        TAP = _constants.INTERACTIONS.TAP,
        PRESS = _constants.INTERACTIONS.PRESS;
      switch (interaction) {
        case PRESS:
          this.touchActivation = new _PressActivation["default"]({
            onIsActiveChanged: this.onIsActiveChanged,
            pressDurationInMs: pressDurationInMs,
            pressMoveThreshold: pressMoveThreshold
          });
          break;
        case TAP:
          this.touchActivation = new _TapActivation["default"]({
            onIsActiveChanged: this.onIsActiveChanged,
            tapDurationInMs: tapDurationInMs,
            tapMoveThreshold: tapMoveThreshold
          });
          break;
        case TOUCH:
          this.touchActivation = new _TouchActivation["default"]({
            onIsActiveChanged: this.onIsActiveChanged
          });
          break;
        default:
          throw new Error('Must implement a touch activation strategy');
      }
    }
  }, {
    key: "setMouseActivationStrategy",
    value: function setMouseActivationStrategy(interaction) {
      var _this$props2 = this.props,
        hoverDelayInMs = _this$props2.hoverDelayInMs,
        hoverOffDelayInMs = _this$props2.hoverOffDelayInMs;
      var HOVER = _constants.INTERACTIONS.HOVER,
        CLICK = _constants.INTERACTIONS.CLICK;
      switch (interaction) {
        case HOVER:
          this.mouseActivation = new _HoverActivation["default"]({
            onIsActiveChanged: this.onIsActiveChanged,
            hoverDelayInMs: hoverDelayInMs,
            hoverOffDelayInMs: hoverOffDelayInMs
          });
          break;
        case CLICK:
          this.mouseActivation = new _ClickActivation["default"]({
            onIsActiveChanged: this.onIsActiveChanged
          });
          break;
        default:
          throw new Error('Must implement a mouse activation strategy');
      }
    }
  }, {
    key: "reset",
    value: function reset() {
      var _this$core = this.core,
        _this$core2 = _this$core === void 0 ? {} : _this$core,
        lastMouseEvent = _this$core2.lastEvent;
      this.init();
      if (!lastMouseEvent) {
        return;
      }
      this.setPositionState(this.core.getCursorPosition(lastMouseEvent));
    }
  }, {
    key: "activate",
    value: function activate() {
      this.setState({
        isActive: true
      });
      this.props.onActivationChanged({
        isActive: true
      });
    }
  }, {
    key: "deactivate",
    value: function deactivate() {
      var _this2 = this;
      this.setState({
        isActive: false
      }, function () {
        var _this2$state = _this2.state,
          isPositionOutside = _this2$state.isPositionOutside,
          position = _this2$state.position;
        _this2.props.onPositionChanged({
          isPositionOutside: isPositionOutside,
          position: position
        });
        _this2.props.onActivationChanged({
          isActive: false
        });
      });
    }
  }, {
    key: "setPositionState",
    value: function setPositionState(position) {
      var isPositionOutside = this.getIsPositionOutside(position);
      this.setState({
        isPositionOutside: isPositionOutside,
        position: position
      }, this.onPositionChanged);
    }
  }, {
    key: "setElementDimensionsState",
    value: function setElementDimensionsState(dimensions) {
      this.setState({
        elementDimensions: dimensions
      });
    }
  }, {
    key: "setShouldGuardAgainstMouseEmulationByDevices",
    value: function setShouldGuardAgainstMouseEmulationByDevices() {
      this.shouldGuardAgainstMouseEmulationByDevices = true;
    }
  }, {
    key: "unsetShouldGuardAgainstMouseEmulationByDevices",
    value: function unsetShouldGuardAgainstMouseEmulationByDevices() {
      var _this3 = this;
      this.timers.push({
        name: _constants.MOUSE_EMULATION_GUARD_TIMER_NAME,
        id: setTimeout(function () {
          _this3.shouldGuardAgainstMouseEmulationByDevices = false;
        }, 0)
      });
    }
  }, {
    key: "getElementDimensions",
    value: function getElementDimensions(el) {
      var _el$getBoundingClient = el.getBoundingClientRect(),
        width = _el$getBoundingClient.width,
        height = _el$getBoundingClient.height;
      return {
        width: width,
        height: height
      };
    }
  }, {
    key: "getIsPositionOutside",
    value: function getIsPositionOutside(position) {
      var x = position.x,
        y = position.y;
      var _this$state$elementDi = this.state.elementDimensions,
        width = _this$state$elementDi.width,
        height = _this$state$elementDi.height;
      var isPositionOutside = x < 0 || y < 0 || x > width || y > height;
      return isPositionOutside;
    }
  }, {
    key: "getTouchEvent",
    value: function getTouchEvent(e) {
      return e.touches[0];
    }
  }, {
    key: "getIsReactComponent",
    value: function getIsReactComponent(reactElement) {
      return typeof reactElement.type === 'function';
    }
  }, {
    key: "shouldDecorateChild",
    value: function shouldDecorateChild(child) {
      return !!child && this.getIsReactComponent(child) && this.props.shouldDecorateChildren;
    }
  }, {
    key: "decorateChild",
    value: function decorateChild(child, props) {
      return /*#__PURE__*/(0, _react.cloneElement)(child, props);
    }
  }, {
    key: "decorateChildren",
    value: function decorateChildren(children, props) {
      var _this4 = this;
      return _react.Children.map(children, function (child) {
        return _this4.shouldDecorateChild(child) ? _this4.decorateChild(child, props) : child;
      });
    }
  }, {
    key: "addEventListeners",
    value: function addEventListeners() {
      this.eventListeners.push((0, _addEventListener["default"])(this.el, 'touchstart', this.onTouchStart, {
        passive: false
      }), (0, _addEventListener["default"])(this.el, 'touchmove', this.onTouchMove, {
        passive: false
      }), (0, _addEventListener["default"])(this.el, 'touchend', this.onTouchEnd), (0, _addEventListener["default"])(this.el, 'touchcancel', this.onTouchCancel), (0, _addEventListener["default"])(this.el, 'mouseenter', this.onMouseEnter), (0, _addEventListener["default"])(this.el, 'mousemove', this.onMouseMove), (0, _addEventListener["default"])(this.el, 'mouseleave', this.onMouseLeave), (0, _addEventListener["default"])(this.el, 'click', this.onClick));
    }
  }, {
    key: "removeEventListeners",
    value: function removeEventListeners() {
      while (this.eventListeners.length) {
        this.eventListeners.pop().removeEventListener();
      }
    }
  }, {
    key: "getPassThroughProps",
    value: function getPassThroughProps() {
      var _this5 = this;
      return Object.keys(this.props).reduce(function (result, key) {
        if (!Object.keys(_this5.constructor.propTypes).includes(key)) {
          result[key] = _this5.props[key];
        }
        return result;
      }, {});
    }
  }, {
    key: "render",
    value: function render() {
      var _this6 = this;
      var _this$props3 = this.props,
        children = _this$props3.children,
        className = _this$props3.className,
        mapChildProps = _this$props3.mapChildProps,
        style = _this$props3.style;
      var props = Object.assign({}, mapChildProps(this.state), this.getPassThroughProps());
      return /*#__PURE__*/_react["default"].createElement("div", {
        className: className,
        ref: function ref(el) {
          return _this6.el = el;
        },
        style: Object.assign({}, style, {
          WebkitUserSelect: 'none'
        })
      }, this.decorateChildren(children, props));
    }
  }]);
  return _default;
}(_react["default"].Component);
_defineProperty(_default, "displayName", 'ReactCursorPosition');
_defineProperty(_default, "propTypes", {
  activationInteractionMouse: _propTypes["default"].oneOf([_constants.INTERACTIONS.CLICK, _constants.INTERACTIONS.HOVER]),
  activationInteractionTouch: _propTypes["default"].oneOf([_constants.INTERACTIONS.PRESS, _constants.INTERACTIONS.TAP, _constants.INTERACTIONS.TOUCH]),
  children: _propTypes["default"].any,
  className: _propTypes["default"].string,
  hoverDelayInMs: _propTypes["default"].number,
  hoverOffDelayInMs: _propTypes["default"].number,
  isEnabled: _propTypes["default"].bool,
  mapChildProps: _propTypes["default"].func,
  onActivationChanged: _propTypes["default"].func,
  onDetectedEnvironmentChanged: _propTypes["default"].func,
  onPositionChanged: _propTypes["default"].func,
  pressDurationInMs: _propTypes["default"].number,
  pressMoveThreshold: _propTypes["default"].number,
  shouldDecorateChildren: _propTypes["default"].bool,
  shouldStopTouchMovePropagation: _propTypes["default"].bool,
  style: _propTypes["default"].object,
  tapDurationInMs: _propTypes["default"].number,
  tapMoveThreshold: _propTypes["default"].number
});
_defineProperty(_default, "defaultProps", {
  activationInteractionMouse: _constants.INTERACTIONS.HOVER,
  activationInteractionTouch: _constants.INTERACTIONS.PRESS,
  hoverDelayInMs: 0,
  hoverOffDelayInMs: 0,
  isEnabled: true,
  mapChildProps: function mapChildProps(props) {
    return props;
  },
  onActivationChanged: _noop["default"],
  onDetectedEnvironmentChanged: _noop["default"],
  onPositionChanged: _noop["default"],
  pressDurationInMs: 500,
  pressMoveThreshold: 5,
  shouldDecorateChildren: true,
  shouldStopTouchMovePropagation: false,
  tapDurationInMs: 180,
  tapMoveThreshold: 5
});