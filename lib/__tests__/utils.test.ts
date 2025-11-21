import { cn } from '../utils';

describe('utils', () => {
    describe('cn function', () => {
        it('should merge class names correctly', () => {
            const result = cn('px-4', 'py-2');
            expect(result).toBe('px-4 py-2');
        });

        it('should handle conditional classes', () => {
            const result = cn('px-4', false && 'py-2', 'bg-red-500');
            expect(result).toBe('px-4 bg-red-500');
        });

        it('should handle conflicting tailwind classes', () => {
            const result = cn('px-2 px-4');
            // twMerge should keep only the last px class
            expect(result).toBe('px-4');
        });

        it('should handle empty input', () => {
            const result = cn();
            expect(result).toBe('');
        });

        it('should handle arrays', () => {
            const result = cn(['px-4', 'py-2']);
            expect(result).toBe('px-4 py-2');
        });

        it('should handle objects', () => {
            const result = cn({ 'px-4': true, 'py-2': false, 'bg-blue-500': true });
            expect(result).toBe('px-4 bg-blue-500');
        });
    });
});
