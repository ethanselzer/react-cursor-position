import TouchEnvironmentActivation from './TouchEnvironmentActivation';
export default class TouchActivation extends TouchEnvironmentActivation {
  constructor(_ref) {
    var {
      onIsActiveChanged
    } = _ref;
    super({
      onIsActiveChanged
    });
  }
  touchStarted(_ref2) {
    var {
      e
    } = _ref2;
    e.preventDefault();
    this.activate();
  }
}