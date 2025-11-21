import { DatesToDurationString, PeriodToDateRange } from '../dates';

describe('Date Helpers', () => {
    describe('DatesToDurationString', () => {
        it('should return null for undefined dates', () => {
            expect(DatesToDurationString(undefined, undefined)).toBeNull();
            expect(DatesToDurationString(new Date(), undefined)).toBeNull();
            expect(DatesToDurationString(undefined, new Date())).toBeNull();
        });

        it('should format milliseconds for durations under 1 second', () => {
            const start = new Date('2024-01-01T00:00:00.000Z');
            const end = new Date('2024-01-01T00:00:00.500Z');
            expect(DatesToDurationString(end, start)).toBe('500ms');
        });

        it('should format minutes and seconds for longer durations', () => {
            const start = new Date('2024-01-01T00:00:00.000Z');
            const end = new Date('2024-01-01T00:02:30.000Z');
            expect(DatesToDurationString(end, start)).toBe('2m 30s');
        });

        it('should handle zero duration', () => {
            const date = new Date('2024-01-01T00:00:00.000Z');
            expect(DatesToDurationString(date, date)).toBe('0ms');
        });

        it('should handle 1 minute exactly', () => {
            const start = new Date('2024-01-01T00:00:00.000Z');
            const end = new Date('2024-01-01T00:01:00.000Z');
            expect(DatesToDurationString(end, start)).toBe('1m 0s');
        });
    });

    describe('PeriodToDateRange', () => {
        it('should return correct date range for January 2024', () => {
            const period = { year: 2024, month: 0 }; // January is month 0
            const { startDate, endDate } = PeriodToDateRange(period);

            expect(startDate.getFullYear()).toBe(2024);
            expect(startDate.getMonth()).toBe(0);
            expect(startDate.getDate()).toBe(1);

            expect(endDate.getFullYear()).toBe(2024);
            expect(endDate.getMonth()).toBe(0);
            expect(endDate.getDate()).toBe(31);
        });

        it('should handle February in a leap year', () => {
            const period = { year: 2024, month: 1 }; // February, leap year
            const { startDate, endDate } = PeriodToDateRange(period);

            expect(startDate.getDate()).toBe(1);
            expect(endDate.getDate()).toBe(29); // 2024 is a leap year
        });

        it('should handle February in a non-leap year', () => {
            const period = { year: 2023, month: 1 }; // February, non-leap year
            const { startDate, endDate } = PeriodToDateRange(period);

            expect(startDate.getDate()).toBe(1);
            expect(endDate.getDate()).toBe(28); // 2023 is not a leap year
        });

        it('should handle December correctly', () => {
            const period = { year: 2024, month: 11 }; // December
            const { startDate, endDate } = PeriodToDateRange(period);

            expect(startDate.getDate()).toBe(1);
            expect(endDate.getDate()).toBe(31);
            expect(endDate.getMonth()).toBe(11);
        });
    });
});
