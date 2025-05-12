import { prisma } from "@/lib/prisma";
import { getAppUrl } from "@/types/appUrl";
import { WorkflowStatus } from "@/types/workflow";
import { timingSafeEqual } from "crypto";

// Function to securely validate the API secret
function isValidSecret(secret: string){
    const API_SECRET = process.env.API_SECRET;
    if(!API_SECRET) return false;
    try {
        return timingSafeEqual(Buffer.from(secret), Buffer.from(API_SECRET));
    } catch (error) {
        return false;
    }
}

export async function GET(req: Request){
    // Security check for cron endpoint
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    const secret = authHeader.split(" ")[1];
    if (!isValidSecret(secret)) {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const now = new Date();
    
    // Look ahead by 10 minutes to catch any workflows that should run
    // within the next cron job interval (optimization for Vercel free tier)
    const lookAheadTime = new Date(now);
    lookAheadTime.setMinutes(lookAheadTime.getMinutes() + 10);
      const workflows = await prisma.workflow.findMany({
        select: {id: true},
        where: {
            status: WorkflowStatus.PUBLISHED,
            cron: {
                not: null,
            },
            nextRunAt: {
                lte: lookAheadTime, // Use lookAheadTime instead of now to process workflows scheduled within the next 10 minutes
            }
        }
    });

    for(const workflow of workflows) {
        triggerWorkflow(workflow.id);
    }

    return Response.json({workflowsToRun: workflows.length}, {status: 200});
}

function triggerWorkflow(workflowId: string) {
    const triggerApiUrl = getAppUrl(`/api/workflows/execute?workflowId=${workflowId}`);

    // Use async fetch pattern with more comprehensive error handling
    fetch(triggerApiUrl, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${process.env.API_SECRET!}`,
            'Content-Type': 'application/json',
        },
        cache: "no-store",
    })
    .then(async response => {
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP error ${response.status}: ${errorText}`);
        }
        console.log(`Successfully triggered workflow ${workflowId}`);
    })
    .catch((error) => {
        console.error(`Error triggering workflow ${workflowId}:`, error.message);
    });
}