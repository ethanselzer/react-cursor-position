import { PRESS_EVENT_TIMER_NAME } from '../constants';
import TouchEnvironmentActivation from './TouchEnvironmentActivation';

export default class PressActivation extends TouchEnvironmentActivation {
    constructor ({
        onIsActiveChanged,
        pressDuration,
        pressMoveThreshold
    }) {
        super({ onIsActiveChanged });

        this.initialElTop = 0;
        this.currentElTop = 0;

        this.pressDuration = pressDuration;
        this.pressMoveThreshold = pressMoveThreshold;
    }

    touchStarted({ position }) {
        this.initPressEventCriteria(position);
        this.setPressEventTimer();
    }

    touchMoved({ position }) {
        if (!this.isActive) {
            this.setPressEventCriteria(position);
        }
    }

    setPressEventTimer() {
        this.timers.push({
            name: PRESS_EVENT_TIMER_NAME,
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
}
