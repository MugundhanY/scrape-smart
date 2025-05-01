"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { CronExpressionParser } from 'cron-parser';
import { revalidatePath } from "next/cache";


export async function UpdateWorkflowCron({id, cron}: {id: string, cron: string}) {
    const {userId} = auth();
    if(!userId) throw new Error("Unauthenticated");
    try{
        const options = {
            tz: 'UTC',
          };
          
        const interval = CronExpressionParser.parse(cron, options);
        await prisma.workflow.update({
            where: {id, userId},
            data: {
                cron,
                nextRunAt: interval.next().toDate(),
            },
        });
    } catch(error: any) {
        console.error("invalid cron", error.message);
        throw new Error("Invalid cron expression");
    }

    revalidatePath("/workflows");
}