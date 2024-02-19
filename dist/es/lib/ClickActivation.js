import MouseEnvironmentActivation from './MouseEnvironmentActivation';
export default class ClickActivation extends MouseEnvironmentActivation {
  constructor(_ref) {
    var {
      onIsActiveChanged
    } = _ref;
    super({
      onIsActiveChanged
    });
  }
  mouseClicked() {
    this.toggleActivation();
  }
}