"use client";

import { CreateFlowNode } from '@/lib/workflow/createFlowNode';
import { TaskType } from '@/types/task';
import { Workflow } from '@prisma/client';
import { addEdge, Background, BackgroundVariant, Connection, Controls, Edge, getOutgoers, ReactFlow, useEdgesState, useNodesState, useReactFlow } from '@xyflow/react';
import "@xyflow/react/dist/style.css";
import NodeComponent from './nodes/NodeComponent';
import React, { useCallback, useEffect } from 'react';
import { AppNode } from '@/types/appNode';
import DeletableEdge from './edges/DeletableEdge';
import { TaskRegistry } from '@/lib/workflow/task/registry';

const nodeTypes = {
    FlowScrapeNode: NodeComponent,
};

const edgeTypes = {
    default: DeletableEdge,
};

const snapGrid: [number, number] = [50, 50];
const fitViewOptions = { padding: 1}

function FlowEditor({workflow} : {workflow: Workflow}) {
    const [nodes, setNodes, onNodesChange] = useNodesState<AppNode>([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
    const { setViewport, screenToFlowPosition, updateNodeData } = useReactFlow();
    useEffect(() => {
        try {
            const flow = JSON.parse(workflow.definition);
            if(!flow) {
                return;
            }
            setNodes(flow.nodes || []);
            setEdges(flow.edges || []);
            if(!flow.viewport) return;
            const { x = 0, y =  0, zoom = 1 } = flow.viewport;
            setViewport({ x, y, zoom });
        } catch (error) {

        }
    }, [workflow.definition, setEdges, setNodes, setViewport]);

    const onDragOver = useCallback((event: React.DragEvent) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    const onDrop = useCallback((event: React.DragEvent) => {
        event.preventDefault();
        const taskType = event.dataTransfer.getData("application/reactflow");
        if(typeof taskType === undefined || !taskType) {
            return;
        }
        const postion = screenToFlowPosition({
            x: event.clientX,
            y: event.clientY,
        });
        const newNode = CreateFlowNode(taskType as TaskType, postion);
        setNodes((nds) => nds.concat(newNode));
    }, [screenToFlowPosition, setNodes]);

    const onConnect = useCallback((connection: Connection) => {
        setEdges((eds) => addEdge({...connection, animated: true}, eds));
        if(!connection.targetHandle) return;
        const node = nodes.find((node) => node.id === connection.target);
        if(!node) return;
        const nodeInputs = node.data.inputs;
        delete nodeInputs[connection.targetHandle];
        updateNodeData(node.id, {
            inputs: nodeInputs,
        });
    }, [nodes, setEdges, updateNodeData]);

    const isValidConnection = useCallback((connection: Edge | Connection) => {
        if(connection.source === connection.target) return false;
        const source = nodes.find((node) => node.id === connection.source);
        const target = nodes.find((node) => node.id === connection.target);
        if(!source || !target){
            console.log('Invalid Connection: source or target not found');
            return false;
        }
        const sourceTask = TaskRegistry[source.data.type];
        const targetTask = TaskRegistry[target.data.type];

        const output = sourceTask.outputs.find((output) => output.name === connection.sourceHandle);
        const input = targetTask.inputs.find((input) => input.name === connection.targetHandle);
        if(input?.type !== output?.type) {
            console.error('Invalid Connection: input type and output type do not match');
            return false;
        }
        const hasCycle = (node: AppNode, visited = new Set()) => {
            if(visited.has(node.id)) return true;
            visited.add(node.id);

            for(const outgoer of getOutgoers(node, nodes, edges)) {
                if(outgoer.id === connection.source) return true;
                if(hasCycle(outgoer, visited)) return true;
            }
        };

        const detectedCycle = hasCycle(target);
        return !detectedCycle;
    }, [edges, nodes]);
  return (
    <main className='h-full w-full'>
        <ReactFlow
        nodes={nodes}
        edges={edges}
        onEdgesChange={onEdgesChange}
        onNodesChange={onNodesChange}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        snapToGrid
        snapGrid={snapGrid}
        fitViewOptions={fitViewOptions}
        fitView
        onDragOver={onDragOver}
        onDrop={onDrop}
        onConnect={onConnect}
        isValidConnection={isValidConnection}>
            <Controls position='top-left' fitViewOptions={fitViewOptions}/>
            <Background variant={BackgroundVariant.Dots} gap={12} size={1}/>
        </ReactFlow>
    </main>
  )
}

export default FlowEditor