"use server";

import { PeriodToDateRange } from "@/lib/helper/dates";
import { prisma } from "@/lib/prisma";
import { Period } from "@/types/analytics";
import { WorkflowExecutionStatus } from "@/types/workflow";
import { auth } from "@/lib/auth";

const { COMPLETED, FAILED } = WorkflowExecutionStatus;

export async function GetStatsCardsValues(period: Period) {
    const { userId } = await auth();
    if(!userId) {
        throw new Error("User not authenticated");
    }
    const dateRange = PeriodToDateRange(period);
    const executions = await prisma.workflowExecution.findMany({
        where: {
            userId, 
            startedAt: {
                gte: dateRange.startDate,
                lte: dateRange.endDate,
            },
            status: {
                in: [COMPLETED, FAILED]
            }
        },
        select: {
            creditsConsumed: true,
            phases: {
                where: {
                    creditsConsumed: {
                        not: null,
                    },
                },
                select: {
                    creditsConsumed: true,
                },
            }
        }
    });
    
    const stats = {
        workflowExecutions: executions.length,
        creditsConsumed: 0,
        phaseExecutions: 0,
    };    stats.creditsConsumed = executions.reduce((sum: number, execution: any) => sum + execution.creditsConsumed, 0);

    stats.phaseExecutions = executions.reduce((sum: number, execution: any) => sum + execution.phases.length, 0);

    return stats; 
}