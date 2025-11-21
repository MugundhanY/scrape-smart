/**
 * Request context utilities
 * Provides request tracking and correlation IDs
 */

import { randomUUID } from 'crypto';

export interface RequestContext {
    requestId: string;
    userId?: string;
    email?: string;
    startTime: number;
    path?: string;
    method?: string;
}

// Store for request contexts (in production, use AsyncLocalStorage)
const requestContextStore = new Map<string, RequestContext>();

class RequestContextManager {
    /**
     * Create a new request context
     */
    create(options?: Partial<RequestContext>): RequestContext {
        const context: RequestContext = {
            requestId: randomUUID(),
            startTime: Date.now(),
            ...options,
        };

        requestContextStore.set(context.requestId, context);
        return context;
    }

    /**
     * Get request context by ID
     */
    get(requestId: string): RequestContext | undefined {
        return requestContextStore.get(requestId);
    }

    /**
     * Update request context
     */
    update(requestId: string, updates: Partial<RequestContext>): void {
        const context = requestContextStore.get(requestId);
        if (context) {
            Object.assign(context, updates);
        }
    }

    /**
     * Delete request context (cleanup)
     */
    delete(requestId: string): void {
        requestContextStore.delete(requestId);
    }

    /**
     * Get duration for a request
     */
    getDuration(requestId: string): number {
        const context = requestContextStore.get(requestId);
        return context ? Date.now() - context.startTime : 0;
    }

    /**
     * Clear old contexts (cleanup for memory)
     */
    cleanup(maxAge: number = 3600000): void {
        const now = Date.now();
        const entries = Array.from(requestContextStore.entries());
        for (const [id, context] of entries) {
            if (now - context.startTime > maxAge) {
                requestContextStore.delete(id);
            }
        }
    }
}

export const requestContext = new RequestContextManager();

// Cleanup old contexts every 10 minutes
if (typeof setInterval !== 'undefined') {
    setInterval(() => {
        requestContext.cleanup();
    }, 600000);
}
