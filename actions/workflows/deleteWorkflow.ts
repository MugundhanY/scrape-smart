"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function DeleteWorkflow(id: string) {
    const { userId } = await auth();

    if(!userId) {
        throw new Error('Unauthenticated');
    }

    await prisma.workflow.delete({
        where: {
            id,
            userId
        }
    });

    revalidatePath('/workflows');
}