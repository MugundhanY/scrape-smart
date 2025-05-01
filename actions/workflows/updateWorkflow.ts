"use server";

import { prisma } from "@/lib/prisma";
import { WorkflowStatus } from "@/types/workflow";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function UpdateWorkflow({
    id,
    definition,
}: {
    id: string;
    definition: string;
}) {
    const { userId } = await auth();

    if(!userId) {
        throw new Error("User is not authenticated");
    }

    const workflow = await prisma.workflow.findUnique({
        where: {
            id,
            userId,
        },
    });

    if(!workflow) {
        throw new Error("Workflow not found");
    }

    if(workflow.status !== WorkflowStatus.DRAFT) {
        throw new Error("Workflow is not a draft");
    }
    await prisma.workflow.update({
        data: {
            definition,
        },
        where: {
            id,
            userId,
        },
    });

    revalidatePath(`/workflows`);
}