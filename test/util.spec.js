import noop from '../src/utils/noop';

describe('noop', () => {
    it('is a function', () => {
        expect(typeof noop).toBe('function');
    });

    it('should return undefined', () => {
        expect(noop()).toBeUndefined();
    });
});
