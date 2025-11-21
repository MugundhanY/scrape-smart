import { waitFor } from '../waitFor';

describe('waitFor', () => {
    it('should resolve after specified milliseconds', async () => {
        const start = Date.now();
        await waitFor(100);
        const end = Date.now();
        const elapsed = end - start;

        // Allow for some variance in setTimeout
        expect(elapsed).toBeGreaterThanOrEqual(95);
        expect(elapsed).toBeLessThan(150);
    });

    it('should resolve immediately for 0ms', async () => {
        const start = Date.now();
        await waitFor(0);
        const end = Date.now();
        const elapsed = end - start;

        expect(elapsed).toBeLessThan(50);
    });

    it('should work with multiple concurrent calls', async () => {
        const promises = [
            waitFor(50),
            waitFor(100),
            waitFor(25),
        ];

        const start = Date.now();
        await Promise.all(promises);
        const end = Date.now();

        // Should take approximately the longest wait time
        expect(end - start).toBeGreaterThanOrEqual(95);
        expect(end - start).toBeLessThan(150);
    });
});
