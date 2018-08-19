import Activation from './Activation';

export default class TouchEnvironmentActivation extends Activation {
    constructor ({ onIsActiveChanged }) {
        super({ onIsActiveChanged });

        this.initialElTop = 0;
        this.currentElTop = 0;
    }

    /* istanbul ignore next */
    touchStarted() {}

    /* istanbul ignore next */
    touchMoved() {}

    touchEnded() {
        this.deactivate();
    }

    touchCanceled() {
        this.deactivate()
    }
}
