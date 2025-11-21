/**
 * Integration tests for auth registration endpoint
 */

// Mock bcrypt FIRST
jest.mock('bcryptjs', () => ({
    hash: jest.fn(() => Promise.resolve('hashed_password')),
    compare: jest.fn(() => Promise.resolve(true)),
}));

// Mock all observability modules
jest.mock('@/lib/logger', () => ({
    __esModule: true,
    default: {
        info: jest.fn(),
        error: jest.fn(),
        warn: jest.fn(),
        debug: jest.fn(),
        audit: jest.fn(),
    },
}));

jest.mock('@/lib/observability/context', () => ({
    requestContext: {
        create: jest.fn(() => ({ requestId: 'test-request-id' })),
        update: jest.fn(),
        delete: jest.fn(),
        getDuration: jest.fn(() => 100),
    },
}));

jest.mock('@/lib/observability/metrics', () => ({
    metrics: {
        trackQuery: jest.fn((name, fn) => fn()),
        trackAPICall: jest.fn((name, fn) => fn()),
    },
}));

jest.mock('@/lib/observability/errors', () => {
    const { ValidationError: OriginalValidationError } = jest.requireActual('@/lib/observability/errors');
    return {
        handleError: jest.fn((error) => ({
            error: error.message,
            statusCode: 500,
            category: 'DATABASE_ERROR',
        })),
        ValidationError: OriginalValidationError, // Use real ValidationError
        AuthenticationError: class AuthenticationError extends Error { },
    };
});

// Mock Next.js
jest.mock('next/server', () => ({
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
        user: {
            findUnique: jest.fn(),
            create: jest.fn(),
        },
        userBalance: {
            create: jest.fn(),
        },
    },
}));

import { POST } from '@/app/api/auth/register/route';

describe('API Integration: POST /api/auth/register', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should register a new user successfully', async () => {
        const { prisma } = require('@/lib/prisma');

        prisma.user.findUnique.mockResolvedValue(null);
        prisma.user.create.mockResolvedValue({
            id: 'user-new',
            email: 'newuser@example.com',
            name: 'New User',
            password: 'hashed_password',
            createdAt: new Date(),
        });
        prisma.userBalance.create.mockResolvedValue({
            id: 'balance-123',
            userId: 'user-new',
            credits: 100,
        });

        const mockRequest = {
            json: async () => ({
                name: 'New User',
                email: 'newuser@example.com',
                password: 'password123',
            }),
        } as any;

        const response = await POST(mockRequest);
        const data = await response.json();

        expect(response.status).toBe(201);
        expect(data.message).toBe('User registered successfully');
        expect(data.user).toBeDefined();
        expect(data.user.password).toBeUndefined();
        expect(prisma.user.create).toHaveBeenCalled();
        expect(prisma.userBalance.create).toHaveBeenCalled();
    });

    it('should reject registration with missing email', async () => {
        const mockRequest = {
            json: async () => ({
                name: 'Test User',
                password: 'password123',
                // email intentionally missing
            }),
        } as any;

        const response = await POST(mockRequest);
        const data = await response.json();

        expect(response.status).toBe(400);
        expect(data.message).toBe('Missing required fields');
    });

    it('should reject registration with missing password', async () => {
        const mockRequest = {
            json: async () => ({
                name: 'Test User',
                email: 'test@example.com',
                // password intentionally missing
            }),
        } as any;

        const response = await POST(mockRequest);
        const data = await response.json();

        expect(response.status).toBe(400);
        expect(data.message).toBe('Missing required fields');
    });

    it('should reject duplicate email registration', async () => {
        const { prisma } = require('@/lib/prisma');

        prisma.user.findUnique.mockResolvedValue({
            id: 'user-existing',
            email: 'existing@example.com',
        });

        const mockRequest = {
            json: async () => ({
                name: 'Duplicate User',
                email: 'existing@example.com',
                password: 'password123',
            }),
        } as any;

        const response = await POST(mockRequest);
        const data = await response.json();

        expect(response.status).toBe(400);
        expect(data.message).toBe('Email already in use');
    });

    it('should handle database errors gracefully', async () => {
        const { prisma } = require('@/lib/prisma');

        prisma.user.findUnique.mockRejectedValue(new Error('Database connection failed'));

        const mockRequest = {
            json: async () => ({
                name: 'Test User',
                email: 'test@example.com',
                password: 'password123',
            }),
        } as any;

        const response = await POST(mockRequest);

        expect(response.status).toBe(500);
    });
});
