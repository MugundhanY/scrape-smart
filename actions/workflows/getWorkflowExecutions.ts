"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GetWorkflowExecutions(workflowId: string) {
    const { userId } = await auth();
    if(!userId) {
        throw new Error("unauthenticated");
    }

    return prisma.workflowExecution.findMany({
        where: {
            workflowId,
            userId,
        },
        orderBy: {
            createdAt: 'desc',
        }
    });
}