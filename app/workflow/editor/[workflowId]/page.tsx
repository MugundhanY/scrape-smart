import { prisma } from '@/lib/prisma';
import { auth } from "@/lib/auth";
import React from 'react'
import Editor from '../../_components/Editor';

async function page({params}: {params: {workflowId: string}}) {
    const {workflowId} = params;
    const {userId} = await auth();
    if(!userId) {
        return <div>Unauthenticated</div>
    }
    const workflow = await prisma.workflow.findUnique({
        where: {
            id: workflowId,
            userId,
        },
    });
    if(!workflow) {
        return <div>Workflow not found</div>;
    }
  return (
    <Editor workflow={workflow} />
  )
}

export default page