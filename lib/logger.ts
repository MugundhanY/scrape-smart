import winston from 'winston';

const logLevel = process.env.LOG_LEVEL || (process.env.NODE_ENV === 'production' ? 'info' : 'debug');

// Custom format for better readability
const customFormat = winston.format.printf(({ timestamp, level, message, requestId, userId, ...meta }) => {
    let log = `${timestamp} [${level}]`;

    if (requestId) log += ` [req:${requestId}]`;
    if (userId) log += ` [user:${userId}]`;

    log += `: ${message}`;

    // Add metadata if present
    const metaKeys = Object.keys(meta).filter(key => !['service', 'stack'].includes(key));
    if (metaKeys.length > 0) {
        const cleanMeta = metaKeys.reduce((acc, key) => {
            acc[key] = meta[key];
            return acc;
        }, {} as Record<string, any>);
        log += ` ${JSON.stringify(cleanMeta)}`;
    }

    // Add stack trace for errors
    if (meta.stack) {
        log += `\n${meta.stack}`;
    }

    return log;
});

const logger = winston.createLogger({
    level: logLevel,
    format: winston.format.combine(
        winston.format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss.SSS',
        }),
        winston.format.errors({ stack: true }),
        winston.format.splat(),
    ),
    defaultMeta: { service: 'scrape-smart' },
    transports: [
        // Console transport for development
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                customFormat
            ),
        }),
    ],
});

// Add file transports for production
if (process.env.NODE_ENV === 'production') {
    // Error logs
    logger.add(
        new winston.transports.File({
            filename: 'logs/error.log',
            level: 'error',
            maxsize: 10485760, // 10MB
            maxFiles: 10,
            format: winston.format.combine(
                winston.format.json()
            ),
        })
    );

    // Combined logs
    logger.add(
        new winston.transports.File({
            filename: 'logs/combined.log',
            maxsize: 10485760, // 10MB
            maxFiles: 10,
            format: winston.format.combine(
                winston.format.json()
            ),
        })
    );

    // Audit logs (user actions)
    logger.add(
        new winston.transports.File({
            filename: 'logs/audit.log',
            level: 'info',
            maxsize: 10485760, // 10MB
            maxFiles: 20,
            format: winston.format.combine(
                winston.format.json()
            ),
        })
    );
}

// Export typed logger with context
export interface LogContext {
    requestId?: string;
    userId?: string;
    email?: string;
    action?: string;
    resource?: string;
    error?: Error | string;
    duration?: number;
    [key: string]: any;
}

class ContextLogger {
    private context: LogContext = {};

    setContext(context: LogContext) {
        this.context = { ...this.context, ...context };
        return this;
    }

    clearContext() {
        this.context = {};
        return this;
    }

    private mergeContext(meta?: LogContext) {
        return { ...this.context, ...meta };
    }

    info(message: string, meta?: LogContext) {
        logger.info(message, this.mergeContext(meta));
    }

    error(message: string, meta?: LogContext) {
        const errorMeta = meta?.error
            ? {
                ...meta,
                error: meta.error instanceof Error ? meta.error.message : meta.error,
                stack: meta.error instanceof Error ? meta.error.stack : undefined,
            }
            : meta;
        logger.error(message, this.mergeContext(errorMeta));
    }

    warn(message: string, meta?: LogContext) {
        logger.warn(message, this.mergeContext(meta));
    }

    debug(message: string, meta?: LogContext) {
        logger.debug(message, this.mergeContext(meta));
    }

    // Audit logging for user actions
    audit(action: string, meta?: LogContext) {
        logger.info(`AUDIT: ${action}`, {
            ...this.mergeContext(meta),
            auditAction: action,
            timestamp: new Date().toISOString(),
        });
    }

    // Performance logging
    performance(operation: string, duration: number, meta?: LogContext) {
        logger.info(`PERF: ${operation}`, {
            ...this.mergeContext(meta),
            duration,
            operation,
        });
    }
}

// Create singleton instance
const contextLogger = new ContextLogger();

// Export both the raw logger and context logger
export default contextLogger;
export { logger as rawLogger };
