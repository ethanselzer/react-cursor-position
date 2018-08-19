import Activation from '../src/lib/Activation';
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
