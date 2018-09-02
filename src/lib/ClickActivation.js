import MouseEnvironmentActivation from './MouseEnvironmentActivation';

export default class ClickActivation extends MouseEnvironmentActivation {
    constructor ({ onIsActiveChanged }) {
        super({ onIsActiveChanged });
    }

    mouseClicked() {
        this.toggleActivation();
    }
}
