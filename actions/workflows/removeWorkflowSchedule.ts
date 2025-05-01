"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";


async function RemoveWorkflowSchedule(id: string) {
    const {userId} = auth();
    if(!userId) throw new Error("Unauthenticated");
    await prisma.workflow.update({
        where: {id, userId},
        data: {
            cron: null,
            nextRunAt: null,
        },
    });
    revalidatePath("/workflows");
}

export default RemoveWorkflowSchedule