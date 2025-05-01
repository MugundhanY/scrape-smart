"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function GetWorkflowExecutionWithPhases(executionId: string) {
    const {userId} = auth();
    if(!userId) throw new Error("Unathenticated");
    
    return prisma.workflowExecution.findUnique({
        where:{
            id: executionId,
            userId,
        },
        include: {
            phases: {
                orderBy: {
                    number: "asc"
                }
            }
        }
    })
}