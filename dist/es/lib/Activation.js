export default class Activation {
  constructor() {
    var {
      onIsActiveChanged
    } = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    if (typeof onIsActiveChanged !== 'function') {
      throw new Error('onIsActiveChanged should be a function');
    }
    this.onIsActiveChanged = onIsActiveChanged;
    this.isActive = false;
    this.timers = [];
  }
  activate() {
    this.isActive = true;
    this.onIsActiveChanged({
      isActive: true
    });
  }
  deactivate() {
    this.isActive = false;
    this.onIsActiveChanged({
      isActive: false
    });
    this.clearTimers();
  }
  toggleActivation() {
    if (this.isActive) {
      this.deactivate();
    } else {
      this.activate();
    }
  }
  clearTimers() {
    var timers = this.timers;
    while (timers.length) {
      var timer = timers.pop();
      clearTimeout(timer.id);
    }
  }
  clearTimer(timerName) {
    this.timers.forEach(timer => {
      if (timer.name === timerName) {
        clearTimeout(timer.id);
      }
    });
  }
}