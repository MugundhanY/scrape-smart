/**
 * Performance metrics collection
 * Used to track and log performance across the application
 */

import logger from '../logger';

export interface PerformanceMetric {
    operation: string;
    duration: number;
    timestamp: Date;
    metadata?: Record<string, any>;
}

class MetricsCollector {
    private timers: Map<string, number> = new Map();

    /**
     * Start timing an operation
     */
    startTimer(operation: string): void {
        this.timers.set(operation, Date.now());
    }

    /**
     * End timing and log the operation
     */
    endTimer(operation: string, metadata?: Record<string, any>): number {
        const startTime = this.timers.get(operation);

        if (!startTime) {
            logger.warn(`No timer found for operation: ${operation}`);
            return 0;
        }

        const duration = Date.now() - startTime;
        this.timers.delete(operation);

        logger.performance(operation, duration, metadata);

        return duration;
    }

    /**
     * Measure an async function
     */
    async measure<T>(
        operation: string,
        fn: () => Promise<T>,
        metadata?: Record<string, any>
    ): Promise<T> {
        const startTime = Date.now();

        try {
            const result = await fn();
            const duration = Date.now() - startTime;

            logger.performance(operation, duration, {
                ...metadata,
                success: true,
            });

            return result;
        } catch (error) {
            const duration = Date.now() - startTime;

            logger.performance(operation, duration, {
                ...metadata,
                success: false,
                error: error instanceof Error ? error.message : String(error),
            });

            throw error;
        }
    }

    /**
     * Record a custom metric
     */
    recordMetric(name: string, value: number, metadata?: Record<string, any>): void {
        logger.info(`METRIC: ${name}`, {
            metric: name,
            value,
            ...metadata,
            timestamp: new Date().toISOString(),
        });
    }

    /**
     * Track database query performance
     */
    async trackQuery<T>(
        query: string,
        fn: () => Promise<T>
    ): Promise<T> {
        return this.measure(`db:${query}`, fn, { queryType: 'database' });
    }

    /**
     * Track API call performance
     */
    async trackAPICall<T>(
        endpoint: string,
        fn: () => Promise<T>
    ): Promise<T> {
        return this.measure(`api:${endpoint}`, fn, { type: 'external_api' });
    }

    /**
     * Track workflow execution performance
     */
    async trackWorkflow<T>(
        workflowId: string,
        fn: () => Promise<T>
    ): Promise<T> {
        return this.measure(`workflow:${workflowId}`, fn, {
            type: 'workflow',
            workflowId,
        });
    }
}

// Export singleton instance
export const metrics = new MetricsCollector();

/**
 * Decorator for measuring method execution time
 */
export function Measure(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
        const operation = `${target.constructor.name}.${propertyKey}`;
        return metrics.measure(operation, () => originalMethod.apply(this, args));
    };

    return descriptor;
}
