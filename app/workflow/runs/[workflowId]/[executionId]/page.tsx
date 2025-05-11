import { GetWorkflowExecutionWithPhases } from '@/actions/workflows/getWorkflowExecutionWithPhases'
import Topbar from '@/app/workflow/_components/topbar/Topbar'
import { waitFor } from '@/lib/helper/waitFor'
import { auth } from "@/lib/auth";
import { Loader2Icon } from 'lucide-react'
import React, { Suspense } from 'react'
import ExecutionViewer from './_components/ExecutionViewer'

function ExecutionViewerPage({
    params,
}: {
    params: {
        executionId: string,
        workflowId: string,
    }
}) {
  return (
    <div className='flex flex-col h-screen q-full overflow-hidden'>
        <Topbar workflowId={params.workflowId} title="Workflow run details" subtitle={`Run ID: ${params.executionId}`} hideButtons/>
        <section className='flex h-full overflow-auto'>
            <Suspense fallback={
                <div className='flex w-full items-center justify-center h-full'>
                    <Loader2Icon className='h-10 w-10 animate-spin stroke-primary'/>
                </div>
            }>
                <ExecutionViewerWrapper executionId={params.executionId}/>
            </Suspense>
        </section>
    </div>
  )
}

async function ExecutionViewerWrapper({executionId}: {executionId: string}) {
    const {userId} = await auth();
    if(!userId) return <div>Unathenticated</div>;

    const workflowExecution = await GetWorkflowExecutionWithPhases(executionId);
    if(!workflowExecution) return <div>Workflow execution not found</div>;

    return (
        <ExecutionViewer initialData={workflowExecution} />
    )
}

export default ExecutionViewerPage