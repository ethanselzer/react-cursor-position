import * as constants from '../constants';

export default class HoverActivation {
    constructor ({
        onIsActiveChanged,
        hoverDelayInMs,
        hoverOffDelayInMs
    }) {
        if (typeof onIsActiveChanged !== 'function'){
            throw new Error('onIsActiveChanged should be a function');
        }

        // this.initialElTop = 0;
        // this.currentElTop = 0;

        this.hoverDelayInMs = hoverDelayInMs;
        this.hoverOffDelayInMs = hoverOffDelayInMs;
        this.onIsActiveChanged = onIsActiveChanged;
        this.isActive = false;
        this.timers = [];
    }

    mouseEntered() {
        this.clearTimers();
        this.schedulActivation(this.hoverDelayInMs);
    }

    mouseLeft() {
        this.clearTimers();
        this.scheduleDeactivation(this.hoverOffDelayInMs);
    }

    schedulActivation(schedule) {
        const scheduleId = setTimeout(() => {
            this.activate();
        }, schedule);

        this.timers.push({
            id: scheduleId,
            name: constants.SET_ACTIVATION_TIMER_NAME
        });
    }

    scheduleDeactivation(schedule) {
        const scheduleId = setTimeout(() => {
            this.deactivate();
        }, schedule);

        this.timers.push({
            id: scheduleId,
            name: constants.UNSET_ACTIVATION_TIMER_NAME
        });
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

    // clearTimer(timerName) {
    //     this.timers.forEach((timer) => {
    //         if (timer.name === timerName) {
    //             clearTimeout(timer.id);
    //         }
    //     });
    // }
}
