import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    const checks = {
        database: false,
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV,
    };

    try {
        // Check database connectivity
        await prisma.$queryRaw`SELECT 1`;
        checks.database = true;

        return NextResponse.json({
            status: 'healthy',
            checks,
        }, { status: 200 });
    } catch (error) {
        return NextResponse.json({
            status: 'unhealthy',
            checks,
            error: error instanceof Error ? error.message : 'Unknown error',
        }, { status: 503 });
    }
}
