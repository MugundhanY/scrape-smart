import { GetWorkflowExecutions } from "@/actions/workflows/getWorkflowExecutions";
import Topbar from "../../_components/topbar/Topbar";
import { Suspense } from "react";
import { InboxIcon, Loader2Icon } from "lucide-react";
import { waitFor } from "@/lib/helper/waitFor";
import ExecutionsTable from "./_components/ExecutionsTable";

export default function ExecutionPage({params}: {params: {workflowId: string}}) {
    return <div className="h-full w-full overflow-auto">
        <Topbar workflowId={params.workflowId} title="All runs" subtitle="List of all your workflow runs" hideButtons />
        <Suspense 
        fallback={
            <div className="flex h-full w-full items-center justify-center">
                <Loader2Icon size={30} className="animate-spin stroke-primary" />
            </div>
            }>
            <ExecutionsTableWrapper workflowId={params.workflowId} />
        </Suspense>
    </div>
}

async function ExecutionsTableWrapper({workflowId}: {workflowId: string}) {
    const executions = await GetWorkflowExecutions(workflowId);
    if(!executions) {
        return <p>No data</p>;
    }
    if(executions.length === 0) {
        return (
        <div className="container w-full py-6">
            <div className="flex items-center flex-col gap-2 justify-center h-full">
                <div className="rounded-full bg-accent w-20 h-20 flex items-center justify-center">
                    <InboxIcon size={40} className="stroke-primary" />
                </div>
                <div className="flex flex-col text-center gap-1">
                    <p className="font-bold">
                        No runs have been triggered yet for this workflow
                    </p>
                    <p className="text-sm text-muted-foreground">
                        You can trigger a new run in the top editor page
                    </p>
                </div>
            </div>
        </div>
        )
    }
    return (
        <div className="container w-full py-6">
            <ExecutionsTable workflowId={workflowId} initialData={executions}/>
        </div>
    );
}