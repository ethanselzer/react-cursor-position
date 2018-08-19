import Activation from './Activation';

export default class MouseActivation extends Activation {
    constructor ({ onIsActiveChanged }) {
        super({ onIsActiveChanged });
    }

    /* istanbul ignore next */
    mouseEntered() {}

    /* istanbul ignore next */
    mouseMoved() {}

    /* istanbul ignore next */
    mouseLeft() {}

    /* istanbul ignore next */
    mouseClicked() {}
}
