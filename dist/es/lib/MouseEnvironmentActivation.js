import Activation from './Activation';
export default class MouseActivation extends Activation {
  constructor(_ref) {
    var {
      onIsActiveChanged
    } = _ref;
    super({
      onIsActiveChanged
    });
  }
  mouseEntered() {}
  mouseMoved() {}
  mouseLeft() {}
  mouseClicked() {}
}