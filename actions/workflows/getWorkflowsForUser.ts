"use server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GetWorkflowsForUser() {
    const { userId } = await auth();
    if(!userId) {
        throw new Error("User is not authenticated");
    }
    return prisma.workflow.findMany({
        where: {
            userId,
        },
        orderBy: {
            createdAt: "asc",
        },
    });
}