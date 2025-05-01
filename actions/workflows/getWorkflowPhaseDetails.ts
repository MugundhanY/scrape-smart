"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GetWorkflowPhaseDetails(phaseId: string){
    const { userId } = await auth();
    if(!userId) throw new Error('Unauthorized');


    return prisma.executionPhase.findUnique({
        where: {
            id: phaseId,
            execution: {
                userId,
            }
        },
        include: {
            logs: {
                orderBy: {
                    timestamp: 'asc',
                }
            }
        }
    })
}