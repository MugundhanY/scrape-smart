"use server";

import { prisma } from "@/lib/prisma";
import { ExecuteWorkflow } from "@/lib/workflow/executeWorkflow";
import { FlowToExecutionplan } from "@/lib/workflow/executionPlan";
import { TaskRegistry } from "@/lib/workflow/task/registry";
import { ExecutionPhaseStatus, WorkflowExecutionPlan, WorkflowExecutionStatus, WorkflowExecutionTrigger, WorkflowStatus } from "@/types/workflow";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function RunWorkflow(form: {
    workflowId: string;
    flowDefinition?: string;
}) {
    const { userId } = await auth();
    if(!userId) throw new Error("Unathenticated");

    const {workflowId, flowDefinition} = form;
    if(!workflowId) throw new Error("workflowId is required");

    const workflow = await prisma.workflow.findUnique({
        where: {
            userId,
            id: workflowId,
        }
    });

    if(!workflow) throw new Error("Workflow not found");

    let executionPlan: WorkflowExecutionPlan;
    let workflowDefinition = flowDefinition;
    if(workflow.status === WorkflowStatus.PUBLISHED){
        if(!workflow.executionPlan) throw new Error("No execution plan found in published workflow");
        executionPlan = JSON.parse(workflow.executionPlan);
        workflowDefinition = workflow.definition;
    } else {
        if(!flowDefinition) {
            throw new Error("flow definition is required");
        }
        const flow = JSON.parse(flowDefinition);
        const result = FlowToExecutionplan(flow.nodes, flow.edges);
        if(result.error) throw new Error("flow definition is invalid");

        if(!result.executionPlan) throw new Error("No execution plan generated");

        executionPlan = result.executionPlan;
    }

    const execution = await prisma.workflowExecution.create({
        data:{
            workflowId,
            userId,
            status: WorkflowExecutionStatus.PENDING,
            startedAt: new Date(),
            trigger: WorkflowExecutionTrigger.MANUAL,
            definition: workflowDefinition,
            phases: {
                create: executionPlan.flatMap((phase) => {
                    return phase.nodes.map((node) => {
                        return {
                            userId,
                            status: ExecutionPhaseStatus.CREATED,
                            number: phase.phase,
                            node: JSON.stringify(node),
                            name: TaskRegistry[node.data.type].label,
                        }
                    })
                })
            }
        },
        select: {
            id: true,
            phases: true,
        }
    })

    if(!execution) throw new Error("workflow execution not created");

    ExecuteWorkflow(execution.id);
    redirect(`/workflow/runs/${workflowId}/${execution.id}`);
}