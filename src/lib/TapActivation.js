import { TAP_GESTURE_TIMER_NAME } from '../constants';
import TouchEnvironmentActivation from './TouchEnvironmentActivation';

export default class TapActivation extends TouchEnvironmentActivation {
    constructor ({
        onIsActiveChanged,
        tapDuration,
        tapMoveThreshold
    }) {
        super({ onIsActiveChanged });

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
        /* istanbul ignore else */
        if (!this.isActive) {
            this.setMoveThresholdCriteria(position);
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
            name: TAP_GESTURE_TIMER_NAME,
            id: setTimeout(() => {
                if (this.isTapGestureActive) {
                    this.toggleActivation();
                }
            }, this.tapDuration)
        });
    }

    setMoveThresholdCriteria(position) {
        this.currentElTop = position.y;
    }

    initMoveThreshold(position) {
        const top = position.y
        this.initialElTop = top;
        this.currentElTop = top;
    }
}
