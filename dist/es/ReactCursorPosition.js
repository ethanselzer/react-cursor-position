function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import React, { Children, cloneElement } from 'react';
import PropTypes from 'prop-types';
import Core from './lib/ElementRelativeCursorPosition';
import addEventListener from './utils/addEventListener';
import { INTERACTIONS, MOUSE_EMULATION_GUARD_TIMER_NAME } from './constants';
import noop from './utils/noop';
import PressActivation from './lib/PressActivation';
import TouchActivation from './lib/TouchActivation';
import TapActivation from './lib/TapActivation';
import HoverActivation from './lib/HoverActivation';
import ClickActivation from './lib/ClickActivation';
export { INTERACTIONS };
export default class _Class extends React.Component {
  constructor(props) {
    super(props);
    _defineProperty(this, "onPositionChanged", () => {
      var {
        onPositionChanged
      } = this.props;
      onPositionChanged(this.state);
    });
    this.state = {
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
    this.shouldGuardAgainstMouseEmulationByDevices = false;
    this.eventListeners = [];
    this.timers = [];
    this.elementOffset = {
      x: 0,
      y: 0
    };
    this.onTouchStart = this.onTouchStart.bind(this);
    this.onTouchMove = this.onTouchMove.bind(this);
    this.onTouchEnd = this.onTouchEnd.bind(this);
    this.onTouchCancel = this.onTouchCancel.bind(this);
    this.onMouseEnter = this.onMouseEnter.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
    this.onClick = this.onClick.bind(this);
    this.onIsActiveChanged = this.onIsActiveChanged.bind(this);
    this.setTouchActivationStrategy(props.activationInteractionTouch);
    this.setMouseActivationStrategy(props.activationInteractionMouse);
  }
  onIsActiveChanged(_ref) {
    var {
      isActive
    } = _ref;
    if (isActive) {
      this.activate();
    } else {
      this.deactivate();
    }
  }
  onTouchStart(e) {
    this.init();
    this.onTouchDetected();
    this.setShouldGuardAgainstMouseEmulationByDevices();
    var position = this.core.getCursorPosition(this.getTouchEvent(e));
    this.setPositionState(position);
    this.touchActivation.touchStarted({
      e,
      position
    });
  }
  onTouchMove(e) {
    if (!this.isCoreReady) {
      return;
    }
    var position = this.core.getCursorPosition(this.getTouchEvent(e));
    this.touchActivation.touchMoved({
      e,
      position
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
  onTouchEnd() {
    this.touchActivation.touchEnded();
    this.unsetShouldGuardAgainstMouseEmulationByDevices();
  }
  onTouchCancel() {
    this.touchActivation.touchCanceled();
    this.unsetShouldGuardAgainstMouseEmulationByDevices();
  }
  onMouseEnter(e) {
    if (this.shouldGuardAgainstMouseEmulationByDevices) {
      return;
    }
    this.init();
    this.onMouseDetected();
    this.setPositionState(this.core.getCursorPosition(e));
    this.mouseActivation.mouseEntered();
  }
  onMouseMove(e) {
    if (!this.isCoreReady) {
      return;
    }
    var position = this.core.getCursorPosition(e);
    this.setPositionState(position);
    this.mouseActivation.mouseMoved(position);
  }
  onMouseLeave() {
    this.mouseActivation.mouseLeft();
    this.setState({
      isPositionOutside: true
    });
  }
  onClick(e) {
    this.setPositionState(this.core.getCursorPosition(e));
    this.mouseActivation.mouseClicked();
    this.onMouseDetected();
  }
  onTouchDetected() {
    var environment = {
      isTouchDetected: true,
      isMouseDetected: false
    };
    this.setState({
      detectedEnvironment: environment
    });
    this.props.onDetectedEnvironmentChanged(environment);
  }
  onMouseDetected() {
    var environment = {
      isTouchDetected: false,
      isMouseDetected: true
    };
    this.setState({
      detectedEnvironment: environment
    });
    this.props.onDetectedEnvironmentChanged(environment);
  }
  componentDidMount() {
    if (this.props.isEnabled) {
      this.enable();
    }
  }
  componentWillReceiveProps(_ref2) {
    var {
      isEnabled: willBeEnabled
    } = _ref2;
    var {
      isEnabled
    } = this.props;
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
  componentWillUnmount() {
    this.disable();
  }
  get isCoreReady() {
    return !!this.core;
  }
  enable() {
    this.addEventListeners();
  }
  disable() {
    this.removeEventListeners();
  }
  init() {
    this.core = new Core(this.el);
    this.setElementDimensionsState(this.getElementDimensions(this.el));
  }
  setTouchActivationStrategy(interaction) {
    var {
      pressDurationInMs,
      pressMoveThreshold,
      tapDurationInMs,
      tapMoveThreshold
    } = this.props;
    var {
      TOUCH,
      TAP,
      PRESS
    } = INTERACTIONS;
    switch (interaction) {
      case PRESS:
        this.touchActivation = new PressActivation({
          onIsActiveChanged: this.onIsActiveChanged,
          pressDurationInMs,
          pressMoveThreshold
        });
        break;
      case TAP:
        this.touchActivation = new TapActivation({
          onIsActiveChanged: this.onIsActiveChanged,
          tapDurationInMs,
          tapMoveThreshold
        });
        break;
      case TOUCH:
        this.touchActivation = new TouchActivation({
          onIsActiveChanged: this.onIsActiveChanged
        });
        break;
      default:
        throw new Error('Must implement a touch activation strategy');
    }
  }
  setMouseActivationStrategy(interaction) {
    var {
      hoverDelayInMs,
      hoverOffDelayInMs
    } = this.props;
    var {
      HOVER,
      CLICK
    } = INTERACTIONS;
    switch (interaction) {
      case HOVER:
        this.mouseActivation = new HoverActivation({
          onIsActiveChanged: this.onIsActiveChanged,
          hoverDelayInMs,
          hoverOffDelayInMs
        });
        break;
      case CLICK:
        this.mouseActivation = new ClickActivation({
          onIsActiveChanged: this.onIsActiveChanged
        });
        break;
      default:
        throw new Error('Must implement a mouse activation strategy');
    }
  }
  reset() {
    var {
      core: {
        lastEvent: lastMouseEvent
      } = {}
    } = this;
    this.init();
    if (!lastMouseEvent) {
      return;
    }
    this.setPositionState(this.core.getCursorPosition(lastMouseEvent));
  }
  activate() {
    this.setState({
      isActive: true
    });
    this.props.onActivationChanged({
      isActive: true
    });
  }
  deactivate() {
    this.setState({
      isActive: false
    }, () => {
      var {
        isPositionOutside,
        position
      } = this.state;
      this.props.onPositionChanged({
        isPositionOutside,
        position
      });
      this.props.onActivationChanged({
        isActive: false
      });
    });
  }
  setPositionState(position) {
    var isPositionOutside = this.getIsPositionOutside(position);
    this.setState({
      isPositionOutside,
      position
    }, this.onPositionChanged);
  }
  setElementDimensionsState(dimensions) {
    this.setState({
      elementDimensions: dimensions
    });
  }
  setShouldGuardAgainstMouseEmulationByDevices() {
    this.shouldGuardAgainstMouseEmulationByDevices = true;
  }
  unsetShouldGuardAgainstMouseEmulationByDevices() {
    this.timers.push({
      name: MOUSE_EMULATION_GUARD_TIMER_NAME,
      id: setTimeout(() => {
        this.shouldGuardAgainstMouseEmulationByDevices = false;
      }, 0)
    });
  }
  getElementDimensions(el) {
    var {
      width,
      height
    } = el.getBoundingClientRect();
    return {
      width,
      height
    };
  }
  getIsPositionOutside(position) {
    var {
      x,
      y
    } = position;
    var {
      elementDimensions: {
        width,
        height
      }
    } = this.state;
    var isPositionOutside = x < 0 || y < 0 || x > width || y > height;
    return isPositionOutside;
  }
  getTouchEvent(e) {
    return e.touches[0];
  }
  getIsReactComponent(reactElement) {
    return typeof reactElement.type === 'function';
  }
  shouldDecorateChild(child) {
    return !!child && this.getIsReactComponent(child) && this.props.shouldDecorateChildren;
  }
  decorateChild(child, props) {
    return /*#__PURE__*/cloneElement(child, props);
  }
  decorateChildren(children, props) {
    return Children.map(children, child => {
      return this.shouldDecorateChild(child) ? this.decorateChild(child, props) : child;
    });
  }
  addEventListeners() {
    this.eventListeners.push(addEventListener(this.el, 'touchstart', this.onTouchStart, {
      passive: false
    }), addEventListener(this.el, 'touchmove', this.onTouchMove, {
      passive: false
    }), addEventListener(this.el, 'touchend', this.onTouchEnd), addEventListener(this.el, 'touchcancel', this.onTouchCancel), addEventListener(this.el, 'mouseenter', this.onMouseEnter), addEventListener(this.el, 'mousemove', this.onMouseMove), addEventListener(this.el, 'mouseleave', this.onMouseLeave), addEventListener(this.el, 'click', this.onClick));
  }
  removeEventListeners() {
    while (this.eventListeners.length) {
      this.eventListeners.pop().removeEventListener();
    }
  }
  getPassThroughProps() {
    return Object.keys(this.props).reduce((result, key) => {
      if (!Object.keys(this.constructor.propTypes).includes(key)) {
        result[key] = this.props[key];
      }
      return result;
    }, {});
  }
  render() {
    var {
      children,
      className,
      mapChildProps,
      style
    } = this.props;
    var props = Object.assign({}, mapChildProps(this.state), this.getPassThroughProps());
    return /*#__PURE__*/React.createElement("div", {
      className,
      ref: el => this.el = el,
      style: Object.assign({}, style, {
        WebkitUserSelect: 'none'
      })
    }, this.decorateChildren(children, props));
  }
}
_defineProperty(_Class, "displayName", 'ReactCursorPosition');
_defineProperty(_Class, "propTypes", {
  activationInteractionMouse: PropTypes.oneOf([INTERACTIONS.CLICK, INTERACTIONS.HOVER]),
  activationInteractionTouch: PropTypes.oneOf([INTERACTIONS.PRESS, INTERACTIONS.TAP, INTERACTIONS.TOUCH]),
  children: PropTypes.any,
  className: PropTypes.string,
  hoverDelayInMs: PropTypes.number,
  hoverOffDelayInMs: PropTypes.number,
  isEnabled: PropTypes.bool,
  mapChildProps: PropTypes.func,
  onActivationChanged: PropTypes.func,
  onDetectedEnvironmentChanged: PropTypes.func,
  onPositionChanged: PropTypes.func,
  pressDurationInMs: PropTypes.number,
  pressMoveThreshold: PropTypes.number,
  shouldDecorateChildren: PropTypes.bool,
  shouldStopTouchMovePropagation: PropTypes.bool,
  style: PropTypes.object,
  tapDurationInMs: PropTypes.number,
  tapMoveThreshold: PropTypes.number
});
_defineProperty(_Class, "defaultProps", {
  activationInteractionMouse: INTERACTIONS.HOVER,
  activationInteractionTouch: INTERACTIONS.PRESS,
  hoverDelayInMs: 0,
  hoverOffDelayInMs: 0,
  isEnabled: true,
  mapChildProps: props => props,
  onActivationChanged: noop,
  onDetectedEnvironmentChanged: noop,
  onPositionChanged: noop,
  pressDurationInMs: 500,
  pressMoveThreshold: 5,
  shouldDecorateChildren: true,
  shouldStopTouchMovePropagation: false,
  tapDurationInMs: 180,
  tapMoveThreshold: 5
});