/**
 * Integration tests for workflow execution endpoint  
 */

// Mock cron-parser - must match actual API usage
jest.mock('cron-parser', () => {
    const mockNext = () => ({ toDate: () => new Date('2024-01-02T00:00:00Z') });
    const mockParse = () => ({ next: mockNext });

    return {
        parse: jest.fn(mockParse),
        parseExpression: jest.fn(mockParse),
    };
});

// Mock TaskRegistry to avoid importing UI components
jest.mock('@/lib/workflow/task/registry', () => ({
    TaskRegistry: {
        LaunchBrowser: {
            label: 'Launch Browser',
        },
    },
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
        trackWorkflow: jest.fn((name, fn) => Promise.resolve(fn())),
    },
}));

jest.mock('@/lib/observability/errors', () => {
    const { ValidationError: OriginalValidationError, WorkflowError: OriginalWorkflowError } = jest.requireActual('@/lib/observability/errors');
    return {
        handleError: jest.fn((error) => ({
            error: error.message,
            statusCode: 400,
            category: 'VALIDATION_ERROR',
        })),
        ValidationError: OriginalValidationError,
        WorkflowError: OriginalWorkflowError,
        AuthenticationError: class AuthenticationError extends Error { },
    };
});

// Mock Next.js properly handling both constructor and static methods
jest.mock('next/server', () => {
    const NextResponseMock: any = jest.fn((body, init) => ({
        json: async () => JSON.parse(body),
        status: init?.status || 200,
        ok: init?.status ? init.status >= 200 && init.status < 300 : true,
    }));

    NextResponseMock.json = jest.fn((data, init) => ({
        json: async () => data,
        status: init?.status || 200,
        ok: init?.status ? init.status >= 200 && init.status < 300 : true,
    }));

    return {
        NextResponse: NextResponseMock,
        NextRequest: jest.fn(),
    };
});

jest.mock('@/lib/prisma', () => ({
    prisma: {
        workflow: {
            findUnique: jest.fn(),
            update: jest.fn(),
        },
        workflowExecution: {
            create: jest.fn(),
        },
    },
}));

jest.mock('@/lib/workflow/executeWorkflow', () => ({
    ExecuteWorkflow: jest.fn(() => Promise.resolve()),
}));

import { GET } from '@/app/api/workflows/execute/route';
import parser from 'cron-parser';

describe('API Integration: GET /api/workflows/execute', () => {
    const validSecret = 'test-secret';

    beforeEach(() => {
        jest.clearAllMocks();
        process.env.API_SECRET = 'test-secret';

        // Ensure cron-parser mock is properly configured
        (parser.parse as jest.Mock).mockReturnValue({
            next: () => ({ toDate: () => new Date('2024-01-02T00:00:00Z') }),
        });
    });

    it('should execute a workflow successfully', async () => {
        const { prisma } = require('@/lib/prisma');
        const { ExecuteWorkflow } = require('@/lib/workflow/executeWorkflow');

        prisma.workflow.findUnique.mockResolvedValue({
            id: 'workflow-123',
            userId: 'user-123',
            cron: '0 0 * * *',
            executionPlan: JSON.stringify([{
                phase: 1,
                nodes: [{
                    id: 'node-1',
                    data: { type: 'LaunchBrowser' }
                }]
            }]),
            definition: '{\"nodes\":[]}',
        });

        prisma.workflow.update.mockResolvedValue({});
        prisma.workflowExecution.create.mockResolvedValue({
            id: 'execution-123',
            workflowId: 'workflow-123',
            userId: 'user-123',
        });

        ExecuteWorkflow.mockResolvedValue(undefined);

        const mockRequest = {
            url: 'http://localhost:3000/api/workflows/execute?workflowId=workflow-123',
            headers: {
                get: (name: string) => {
                    if (name === 'authorization') return `Bearer ${validSecret}`;
                    return null;
                },
            },
        } as any;

        const response = await GET(mockRequest);

        if (response.status !== 200) {
            const data = await response.json();
            console.error('Test failed with error:', data);
        }

        expect(response.status).toBe(200);
        expect(prisma.workflow.findUnique).toHaveBeenCalled();
        expect(prisma.workflowExecution.create).toHaveBeenCalled();
        expect(ExecuteWorkflow).toHaveBeenCalledWith('execution-123');
    });

    it('should reject unauthorized requests', async () => {
        const mockRequest = {
            url: 'http://localhost:3000/api/workflows/execute?workflowId=workflow-123',
            headers: {
                get: () => null,
            },
        } as any;

        const response = await GET(mockRequest);
        const data = await response.json();

        expect(response.status).toBe(401);
        expect(data.error).toBe('Unauthorized');
    });

    it('should reject requests with invalid secret', async () => {
        const mockRequest = {
            url: 'http://localhost:3000/api/workflows/execute?workflowId=workflow-123',
            headers: {
                get: (name: string) => {
                    if (name === 'authorization') return 'Bearer wrong-secret';
                    return null;
                },
            },
        } as any;

        const response = await GET(mockRequest);
        const data = await response.json();

        expect(response.status).toBe(401);
        expect(data.error).toBe('Unauthorized');
    });

    it('should return 400 for missing workflowId', async () => {
        const mockRequest = {
            url: 'http://localhost:3000/api/workflows/execute',
            headers: {
                get: (name: string) => {
                    if (name === 'authorization') return `Bearer ${validSecret}`;
                    return null;
                },
            },
        } as any;

        const response = await GET(mockRequest);

        expect(response.status).toBe(400);
    });

    it('should return 400 for non-existent workflow', async () => {
        const { prisma } = require('@/lib/prisma');

        prisma.workflow.findUnique.mockResolvedValue(null);

        const mockRequest = {
            url: 'http://localhost:3000/api/workflows/execute?workflowId=nonexistent',
            headers: {
                get: (name: string) => {
                    if (name === 'authorization') return `Bearer ${validSecret}`;
                    return null;
                },
            },
        } as any;

        const response = await GET(mockRequest);

        expect(response.status).toBe(400);
    });
});
