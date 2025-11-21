/**
 * Centralized error handling utilities
 * Used across the application for consistent error management
 */

import logger from '../logger';

export enum ErrorCategory {
    AUTHENTICATION = 'AUTHENTICATION',
    AUTHORIZATION = 'AUTHORIZATION',
    VALIDATION = 'VALIDATION',
    DATABASE = 'DATABASE',
    EXTERNAL_API = 'EXTERNAL_API',
    WORKFLOW = 'WORKFLOW',
    PAYMENT = 'PAYMENT',
    SYSTEM = 'SYSTEM',
    UNKNOWN = 'UNKNOWN',
}

export interface AppError {
    category: ErrorCategory;
    message: string;
    statusCode: number;
    details?: any;
    stack?: string;
    isOperational: boolean;
}

export class ApplicationError extends Error implements AppError {
    category: ErrorCategory;
    statusCode: number;
    details?: any;
    isOperational: boolean;

    constructor(
        message: string,
        category: ErrorCategory = ErrorCategory.UNKNOWN,
        statusCode: number = 500,
        details?: any,
        isOperational: boolean = true
    ) {
        super(message);
        this.name = this.constructor.name;
        this.category = category;
        this.statusCode = statusCode;
        this.details = details;
        this.isOperational = isOperational;

        Error.captureStackTrace(this, this.constructor);
    }
}

// Specific error classes
export class AuthenticationError extends ApplicationError {
    constructor(message: string = 'Authentication failed', details?: any) {
        super(message, ErrorCategory.AUTHENTICATION, 401, details);
    }
}

export class AuthorizationError extends ApplicationError {
    constructor(message: string = 'Insufficient permissions', details?: any) {
        super(message, ErrorCategory.AUTHORIZATION, 403, details);
    }
}

export class ValidationError extends ApplicationError {
    constructor(message: string, details?: any) {
        super(message, ErrorCategory.VALIDATION, 400, details);
    }
}

export class DatabaseError extends ApplicationError {
    constructor(message: string, details?: any) {
        super(message, ErrorCategory.DATABASE, 500, details);
    }
}

export class ExternalAPIError extends ApplicationError {
    constructor(message: string, details?: any) {
        super(message, ErrorCategory.EXTERNAL_API, 502, details);
    }
}

export class WorkflowError extends ApplicationError {
    constructor(message: string, details?: any) {
        super(message, ErrorCategory.WORKFLOW, 500, details);
    }
}

export class PaymentError extends ApplicationError {
    constructor(message: string, details?: any) {
        super(message, ErrorCategory.PAYMENT, 402, details);
    }
}

/**
 * Error handler utility
 * Logs errors and returns appropriate response data
 */
export function handleError(error: Error | ApplicationError, context?: Record<string, any>) {
    const isAppError = error instanceof ApplicationError;

    // Log the error
    logger.error(error.message, {
        error,
        category: isAppError ? error.category : ErrorCategory.UNKNOWN,
        statusCode: isAppError ? error.statusCode : 500,
        isOperational: isAppError ? error.isOperational : false,
        details: isAppError ? error.details : undefined,
        ...context,
    });

    // Return response data
    return {
        error: error.message,
        category: isAppError ? error.category : ErrorCategory.UNKNOWN,
        statusCode: isAppError ? error.statusCode : 500,
        details: isAppError && process.env.NODE_ENV !== 'production' ? error.details : undefined,
    };
}

/**
 * Safe error serializer
 * Converts errors to JSON-safe objects
 */
export function serializeError(error: Error | ApplicationError): Record<string, any> {
    const isAppError = error instanceof ApplicationError;

    return {
        name: error.name,
        message: error.message,
        stack: process.env.NODE_ENV !== 'production' ? error.stack : undefined,
        category: isAppError ? error.category : ErrorCategory.UNKNOWN,
        statusCode: isAppError ? error.statusCode : 500,
        details: isAppError ? error.details : undefined,
    };
}

/**
 * Async error wrapper
 * Wraps async functions to catch and handle errors
 */
export function asyncHandler<T extends (...args: any[]) => Promise<any>>(fn: T) {
    return async (...args: Parameters<T>): Promise<ReturnType<T>> => {
        try {
            return await fn(...args);
        } catch (error) {
            if (error instanceof ApplicationError && error.isOperational) {
                throw error;
            }

            // Log unexpected errors
            logger.error('Unexpected error in async handler', {
                error: error instanceof Error ? error : new Error(String(error)),
                function: fn.name,
            });

            throw error;
        }
    };
}
