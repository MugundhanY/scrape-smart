"use server";

import { prisma } from "@/lib/prisma";
import { duplicateWorkflowSchema, duplicateWorkflowSchemaType } from "@/schema/workflow";
import { WorkflowStatus } from "@/types/workflow";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function DuplicateWorkflow(form: duplicateWorkflowSchemaType) {
  // Your code here
  const {success, data} = duplicateWorkflowSchema.safeParse(form);
    if (!success) {
        throw new Error("Invalid form data");
    }
    const { userId } = auth();
    if(!userId) {
        throw new Error("unathenticated");
    }

    const sourceWorkflow = await prisma.workflow.findUnique({
        where: {
            id: data.workflowId,
            userId,
        }
    });

    if(!sourceWorkflow) {
        throw new Error("Workflow not found");
    }
    const result = await prisma.workflow.create({
        data: {
            description: data.description,
            status: WorkflowStatus.DRAFT,
            definition: sourceWorkflow.definition,
            name: data.name,
            userId,
        }
    });

    if(!result) {
        throw new Error("Failed to duplicate workflow");
    }

    revalidatePath("/workflows");
}