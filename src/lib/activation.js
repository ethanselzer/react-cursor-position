import * as constants from '../constants';
import noop from '../utils/noop';

export class Activation {
    constructor ({
        onIsActiveChanged,
        isActivatedOnTouch,
        pressDuration,
        pressMoveThreshold
    }) {
        this.isActive = false;
        this.initialElTop = 0;
        this.currentElTop = 0;
        this.timers = [];
        this.onIsActiveChanged = onIsActiveChanged || noop;
        this.isActivatedOnTouch = isActivatedOnTouch;
        this.pressDuration = pressDuration;
        this.pressMoveThreshold = pressMoveThreshold;
    }

    touchStarted(e, position) {
        if (this.isActivatedOnTouch) {
            e.preventDefault();
            this.activate();
            return;
        }
        this.initPressEventCriteria(position);
        this.setPressEventTimer();
    }

    touchMoved(e, position) {
        if (!this.isActive) {
            this.setPressEventCriteria(position);
        }
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

    setPressEventTimer() {
        this.timers.push({
            name: constants.PRESS_EVENT_TIMER_NAME,
            id: setTimeout(() => {
                if (Math.abs(this.currentElTop - this.initialElTop) < this.pressMoveThreshold) {
                    this.activate();
                }
            }, this.pressDuration)
        });
    }

    setPressEventCriteria(position) {
        this.currentElTop = position.y;
    }

    initPressEventCriteria(position) {
        const top = position.y
        this.initialElTop = top;
        this.currentElTop = top;
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
