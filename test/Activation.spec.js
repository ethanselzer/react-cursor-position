import Activation from '../src/lib/Activation';
import TouchEnvironmentActivation from '../src/lib/TouchEnvironmentActivation';
import MouseEnvironmentActivation from '../src/lib/MouseEnvironmentActivation';
import TapActivation from '../src/lib/TapActivation';
import PressActivation from '../src/lib/PressActivation';

import noop from '../src/utils/noop';

describe('Activation base class', () => {
    describe('construction', () => {
        it('throws an error if onIsActiveChanged function is not provided', () => {
            function shouldThrow() {
                new Activation();
            }

            expect(shouldThrow).toThrow();
        });
    });

    describe('clearTimers', () => {
        it('drains the timers array', () => {
            const activation = new Activation({
                onIsActiveChanged: noop
            });

            activation.timers.push({
                name: 'test',
                id: 1
            });
            expect(activation.timers.length).toBe(1);

            activation.clearTimers();

            expect(activation.timers.length).toBe(0);
        });

        it('calls clearTimeout for each collection item', () => {
            jest.useFakeTimers();
            const activation = new Activation({
                onIsActiveChanged: noop
            });

            activation.timers.push(
                {
                    name: 'test',
                    id: 1
                },
                {
                    name: 'test-two',
                    id: 2
                }
            );

            activation.clearTimers();

            expect(clearTimeout).toHaveBeenCalledTimes(2);
            expect(clearTimeout).toHaveBeenNthCalledWith(1, 2);
            expect(clearTimeout).toHaveBeenNthCalledWith(2, 1);
        });
    });

    describe('clearTimer', () => {
        it('calls clearTimeout for items in the collection with a matching name', () => {
            jest.useFakeTimers();
            const activation = new Activation({
                onIsActiveChanged: noop
            });
            activation.timers.push(
                {
                    name: 'test',
                    id: 1
                },
                {
                    name: 'test-two',
                    id: 2
                }
            );

            activation.clearTimer('test');

            expect(clearTimeout).toHaveBeenCalledTimes(1);
            expect(clearTimeout).toHaveBeenNthCalledWith(1, 1);
        });
    });
});

describe('TouchEnvironmentActivation', () => {
    it('stubs touchStarted', () => {
        const tea = new TouchEnvironmentActivation({
            onIsActiveChanged: noop
        });

        expect(tea.touchStarted).not.toThrow();
    });

    it('stubs touchMoved', () => {
        const tea = new TouchEnvironmentActivation({
            onIsActiveChanged: noop
        });

        expect(tea.touchMoved).not.toThrow();
    });
});

describe('TapActivation', () => {
    it('touchMoved returns if active', () => {
        const tapActivation = new TapActivation({
            onIsActiveChanged: noop,
            tapDurationInMs: 0,
            tapMoveThreshold: 0
        });
        const spy = jest.spyOn(tapActivation, 'setMoveThresholdCriteria');
        tapActivation.isActive = true;

        tapActivation.touchMoved({ position: {x: 0, y: 0} })

        expect(spy).not.toHaveBeenCalled();
    });

    it('touchMoved calls setMoveThresholdCriteria if not active', () => {
        const tapActivation = new TapActivation({
            onIsActiveChanged: noop,
            tapDurationInMs: 0,
            tapMoveThreshold: 0
        });
        const spy = jest.spyOn(tapActivation, 'setMoveThresholdCriteria');

        tapActivation.touchMoved({ position: {x: 0, y: 0} })

        expect(spy).toHaveBeenCalled();
    });
});

describe('PressActivation', () => {
    it('touchMoved returns if active', () => {
        const pressActivation = new PressActivation({
            onIsActiveChanged: noop,
            pressDurationInMs: 0,
            pressMoveThreshold: 0
        });
        const spy = jest.spyOn(pressActivation, 'setPressEventCriteria');
        pressActivation.isActive = true;

        pressActivation.touchMoved({ position: {x: 0, y: 0} })

        expect(spy).not.toHaveBeenCalled();
    });

    it('touchMoved calls setPressEventCriteria if not active', () => {
        const pressActivation = new PressActivation({
            onIsActiveChanged: noop,
            pressDurationInMs: 0,
            pressMoveThreshold: 0
        });
        const spy = jest.spyOn(pressActivation, 'setPressEventCriteria');

        pressActivation.touchMoved({ position: {x: 0, y: 0} })

        expect(spy).toHaveBeenCalled();
    });
});

describe('MouseEnvironmentActivation', () => {
    it('stubs mouseEntered', () => {
        const mea = new MouseEnvironmentActivation({
            onIsActiveChanged: noop
        });

        expect(mea.mouseEntered).not.toThrow();
    });

    it('stubs mouseMoved', () => {
        const mea = new MouseEnvironmentActivation({
            onIsActiveChanged: noop
        });

        expect(mea.mouseMoved).not.toThrow();
    });

    it('stubs mouseClicked', () => {
        const mea = new MouseEnvironmentActivation({
            onIsActiveChanged: noop
        });

        expect(mea.mouseClicked).not.toThrow();
    });

    it('stubs mouseLeft', () => {
        const mea = new MouseEnvironmentActivation({
            onIsActiveChanged: noop
        });

        expect(mea.mouseLeft).not.toThrow();
    });
});
