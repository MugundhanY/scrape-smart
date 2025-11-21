/**
 * Integration test for the health check endpoint
 * Tests the flow from API call to database and back
 */

// Mock Next.js server components before importing the route
jest.mock('next/server', () => ({
    NextRequest: jest.fn(),
    NextResponse: {
        json: jest.fn((data, init) => ({
            json: async () => data,
            status: init?.status || 200,
            ok: init?.status ? init.status >= 200 && init.status < 300 : true,
        })),
    },
}));

jest.mock('@/lib/prisma', () => ({
    prisma: {
        $queryRaw: jest.fn(),
    },
}));

import { GET } from '@/app/api/health/route';

describe('API Integration Tests', () => {
    describe('GET /api/health', () => {
        beforeEach(() => {
            jest.clearAllMocks();
        });

        it('should return healthy status when database is connected', async () => {
            const { prisma } = require('@/lib/prisma');
            prisma.$queryRaw.mockResolvedValue([{ '?column?': 1 }]);

            const mockRequest = {} as any;
            const response = await GET(mockRequest);
            const data = await response.json();

            expect(response.status).toBe(200);
            expect(data.status).toBe('healthy');
            expect(data.checks).toBeDefined();
            expect(data.checks.database).toBe(true);
            expect(data.checks.timestamp).toBeDefined();
            expect(data.checks.uptime).toBeGreaterThanOrEqual(0);
        });

        it('should return unhealthy status when database connection fails', async () => {
            const { prisma } = require('@/lib/prisma');
            prisma.$queryRaw.mockRejectedValue(new Error('Database connection failed'));

            const mockRequest = {} as any;
            const response = await GET(mockRequest);
            const data = await response.json();

            expect(response.status).toBe(503);
            expect(data.status).toBe('unhealthy');
            expect(data.checks.database).toBe(false);
            expect(data.error).toBe('Database connection failed');
        });

        it('should include required check fields', async () => {
            const { prisma } = require('@/lib/prisma');
            prisma.$queryRaw.mockResolvedValue([{ '?column?': 1 }]);

            const mockRequest = {} as any;
            const response = await GET(mockRequest);
            const data = await response.json();

            expect(data.checks).toHaveProperty('database');
            expect(data.checks).toHaveProperty('timestamp');
            expect(data.checks).toHaveProperty('uptime');
            expect(data.checks).toHaveProperty('environment');
        });

        it('should return valid timestamp', async () => {
            const { prisma } = require('@/lib/prisma');
            prisma.$queryRaw.mockResolvedValue([{ '?column?': 1 }]);

            const mockRequest = {} as any;
            const response = await GET(mockRequest);
            const data = await response.json();

            const timestamp = new Date(data.checks.timestamp);
            expect(timestamp).toBeInstanceOf(Date);
            expect(timestamp.getTime()).not.toBeNaN();

            // Timestamp should be within the last few seconds
            const now = new Date();
            const diff = Math.abs(now.getTime() - timestamp.getTime());
            expect(diff).toBeLessThan(5000); // Within 5 seconds
        });
    });
});
