import Activation from './Activation';
export default class TouchEnvironmentActivation extends Activation {
  constructor(_ref) {
    var {
      onIsActiveChanged
    } = _ref;
    super({
      onIsActiveChanged
    });
    this.initialElTop = 0;
    this.currentElTop = 0;
  }
  touchStarted() {}
  touchMoved() {}
  touchEnded() {
    this.deactivate();
  }
  touchCanceled() {
    this.deactivate();
  }
}