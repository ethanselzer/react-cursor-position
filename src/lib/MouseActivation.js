import Activation from './Activation';

export default class MouseActivation extends Activation {
    constructor ({ onIsActiveChanged }) {
        super({ onIsActiveChanged });
    }

    mouseEntered() {}

    mouseMoved() {}

    mouseLeft() {}

    mouseClicked() {}
}
