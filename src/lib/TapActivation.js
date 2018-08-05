import { PRESS_EVENT_TIMER_NAME } from '../constants';
import TouchEnvironmentActivation from './TouchEnvironmentActivation';

export default class TapActivation extends TouchEnvironmentActivation {
    constructor ({
        onIsActiveChanged,
        tapDuration = 180,
        tapMoveThreshold = 5
    }) {
        super({ onIsActiveChanged });

        this.initialElTop = 0;
        this.currentElTop = 0;
        this.hasTapGestureEnded = false;
        this.tapDuration = tapDuration;
        this.tapMoveThreshold = tapMoveThreshold;
    }

    touchStarted({ position }) {
        this.hasTapGestureEnded = false;
        this.initMoveThreshold(position);
        this.setTapEventTimer();
    }

    touchMoved({ position }) {
        if (!this.isActive) {
            this.setPressEventCriteria(position);
        }
    }

    touchEnded() {
        this.hasTapGestureEnded = true;
    }

    get hasPassedMoveThreshold() {
        return Math.abs(this.currentElTop - this.initialElTop) > this.tapMoveThreshold
    }

    get isTapGestureActive() {
        return !this.hasPassedMoveThreshold && this.hasTapGestureEnded;
    }

    setTapEventTimer() {
        this.timers.push({
            name: PRESS_EVENT_TIMER_NAME,
            id: setTimeout(() => {
                if (this.isTapGestureActive) {
                    this.toggleActivation();
                }
            }, this.tapDuration)
        });
    }

    toggleActivation() {
        if (this.isActive){
            this.deactivate();
        } else {
            this.activate();
        }
    }

    setPressEventCriteria(position) {
        this.currentElTop = position.y;
    }

    initMoveThreshold(position) {
        const top = position.y
        this.initialElTop = top;
        this.currentElTop = top;
    }
}
