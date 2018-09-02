import TouchEnvironmentActivation from './TouchEnvironmentActivation';

export default class TouchActivation extends TouchEnvironmentActivation{
    constructor ({ onIsActiveChanged }) {
        super({ onIsActiveChanged });
    }

    touchStarted({ e }) {
        e.preventDefault();
        this.activate();
    }
}
