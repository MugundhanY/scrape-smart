"use client";

import useFlowValidation from "@/components/hooks/useFlowValidation";
import { cn } from "@/lib/utils";
import { useReactFlow } from "@xyflow/react";
import React from "react";

function NodeCard({children, nodeId, isSelected}: {nodeId: string, children: React.ReactNode, isSelected: boolean}) {
    const {getNode, setCenter} = useReactFlow();
    const {invalidInputs} = useFlowValidation();
    const hasInvaildInputs = invalidInputs.some(input => input.nodeId === nodeId);
    return <div onDoubleClick={() => {
        const node = getNode(nodeId);
        if(!node) return;
        const {position, measured} = node;
        if(!position || !measured) return;
        const {width, height} = measured;
        const x = position.x + width! / 2;
        const y = position.y + height! / 2;
        if(x === undefined || y === undefined) return;
        setCenter(x, y, {
            zoom: 1,
            duration: 500,
        });
    }} className={cn("rounded-md cursor-pointer bg-background border-2 border-separate w-[420px] text-xs gap-1 flex flex-col", isSelected && "border-primary", hasInvaildInputs && "border-destructive border-2")}>{children}</div>
}

export default NodeCard;