import * as constants from '../constants';
import MouseEnvironmentActivation from './MouseEnvironmentActivation';
export default class HoverActivation extends MouseEnvironmentActivation {
  constructor(_ref) {
    var {
      onIsActiveChanged,
      hoverDelayInMs,
      hoverOffDelayInMs
    } = _ref;
    super({
      onIsActiveChanged
    });
    this.hoverDelayInMs = hoverDelayInMs;
    this.hoverOffDelayInMs = hoverOffDelayInMs;
  }
  mouseEntered() {
    this.clearTimers();
    this.schedulActivation(this.hoverDelayInMs);
  }
  mouseLeft() {
    this.clearTimers();
    this.scheduleDeactivation(this.hoverOffDelayInMs);
  }
  schedulActivation(schedule) {
    var scheduleId = setTimeout(() => {
      this.activate();
    }, schedule);
    this.timers.push({
      id: scheduleId,
      name: constants.SET_ACTIVATION_TIMER_NAME
    });
  }
  scheduleDeactivation(schedule) {
    var scheduleId = setTimeout(() => {
      this.deactivate();
    }, schedule);
    this.timers.push({
      id: scheduleId,
      name: constants.UNSET_ACTIVATION_TIMER_NAME
    });
  }
}