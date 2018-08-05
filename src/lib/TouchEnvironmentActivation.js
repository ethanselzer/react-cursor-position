export default class TouchEnvironmentActivation {
    constructor ({ onIsActiveChanged }) {
        if (typeof onIsActiveChanged !== 'function'){
            throw new Error('onIsActiveChanged should be a function');
        }

        this.onIsActiveChanged = onIsActiveChanged;
        this.isActive = false;
        this.timers = [];
    }

    touchStarted() {

    }

    touchMoved() {

    }

    touchEnded() {
        this.deactivate();
    }

    touchCanceled() {
        this.deactivate()
    }

    activate() {
        this.isActive = true;
        this.onIsActiveChanged({ isActive: true });
    }

    deactivate() {
        this.isActive = false;
        this.onIsActiveChanged({ isActive: false });
        this.clearTimers();
    }

    clearTimers() {
        const timers = this.timers;
        while (timers.length) {
            const timer = timers.pop();
            clearTimeout(timer.id);
        }
    }

    clearTimer(timerName) {
        this.timers.forEach((timer) => {
            if (timer.name === timerName) {
                clearTimeout(timer.id);
            }
        });
    }
}
