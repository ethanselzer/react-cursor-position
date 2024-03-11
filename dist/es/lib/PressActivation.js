import { PRESS_EVENT_TIMER_NAME } from '../constants';
import TouchEnvironmentActivation from './TouchEnvironmentActivation';
export default class PressActivation extends TouchEnvironmentActivation {
  constructor(_ref) {
    var {
      onIsActiveChanged,
      pressDurationInMs,
      pressMoveThreshold
    } = _ref;
    super({
      onIsActiveChanged
    });
    this.pressDurationInMs = pressDurationInMs;
    this.pressMoveThreshold = pressMoveThreshold;
  }
  touchStarted(_ref2) {
    var {
      position
    } = _ref2;
    this.initPressEventCriteria(position);
    this.setPressEventTimer();
  }
  touchMoved(_ref3) {
    var {
      position
    } = _ref3;
    if (this.isActive) {
      return;
    }
    this.setPressEventCriteria(position);
  }
  setPressEventTimer() {
    this.timers.push({
      name: PRESS_EVENT_TIMER_NAME,
      id: setTimeout(() => {
        if (Math.abs(this.currentElTop - this.initialElTop) < this.pressMoveThreshold) {
          this.activate();
        }
      }, this.pressDurationInMs)
    });
  }
  setPressEventCriteria(position) {
    this.currentElTop = position.y;
  }
  initPressEventCriteria(position) {
    var top = position.y;
    this.initialElTop = top;
    this.currentElTop = top;
  }
}