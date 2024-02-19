import { TAP_GESTURE_TIMER_NAME } from '../constants';
import TouchEnvironmentActivation from './TouchEnvironmentActivation';
export default class TapActivation extends TouchEnvironmentActivation {
  constructor(_ref) {
    var {
      onIsActiveChanged,
      tapDurationInMs,
      tapMoveThreshold
    } = _ref;
    super({
      onIsActiveChanged
    });
    this.hasTapGestureEnded = false;
    this.tapDurationInMs = tapDurationInMs;
    this.tapMoveThreshold = tapMoveThreshold;
  }
  touchStarted(_ref2) {
    var {
      position
    } = _ref2;
    this.hasTapGestureEnded = false;
    this.initMoveThreshold(position);
    this.setTapEventTimer();
  }
  touchMoved(_ref3) {
    var {
      position
    } = _ref3;
    if (this.isActive) {
      return;
    }
    this.setMoveThresholdCriteria(position);
  }
  touchEnded() {
    this.hasTapGestureEnded = true;
  }
  get hasPassedMoveThreshold() {
    return Math.abs(this.currentElTop - this.initialElTop) > this.tapMoveThreshold;
  }
  get isTapGestureActive() {
    return !this.hasPassedMoveThreshold && this.hasTapGestureEnded;
  }
  setTapEventTimer() {
    this.timers.push({
      name: TAP_GESTURE_TIMER_NAME,
      id: setTimeout(() => {
        if (this.isTapGestureActive) {
          this.toggleActivation();
        }
      }, this.tapDurationInMs)
    });
  }
  setMoveThresholdCriteria(position) {
    this.currentElTop = position.y;
  }
  initMoveThreshold(position) {
    var top = position.y;
    this.initialElTop = top;
    this.currentElTop = top;
  }
}