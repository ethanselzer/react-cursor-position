"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UNSET_ACTIVATION_TIMER_NAME = exports.TAP_GESTURE_TIMER_NAME = exports.SET_ACTIVATION_TIMER_NAME = exports.PRESS_EVENT_TIMER_NAME = exports.MOUSE_EMULATION_GUARD_TIMER_NAME = exports.INTERACTIONS = void 0;
var PRESS_EVENT_TIMER_NAME = exports.PRESS_EVENT_TIMER_NAME = 'pressEvent';
var TAP_GESTURE_TIMER_NAME = exports.TAP_GESTURE_TIMER_NAME = 'tap';
var MOUSE_EMULATION_GUARD_TIMER_NAME = exports.MOUSE_EMULATION_GUARD_TIMER_NAME = 'mouseEmulation';
var SET_ACTIVATION_TIMER_NAME = exports.SET_ACTIVATION_TIMER_NAME = 'setHovering';
var UNSET_ACTIVATION_TIMER_NAME = exports.UNSET_ACTIVATION_TIMER_NAME = 'unsetHovering';
var INTERACTIONS = exports.INTERACTIONS = {
  TOUCH: 'touch',
  TAP: 'tap',
  DOUBLE_TAP: 'double_tap',
  PRESS: 'press',
  CLICK: 'click',
  HOVER: 'hover'
};