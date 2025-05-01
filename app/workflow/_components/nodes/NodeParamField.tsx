"use client";
import { Input } from "@/components/ui/input";
import { TaskParam, TaskParamType } from "@/types/task";
import StringParam from "./Param/StringParam";
import { useReactFlow } from "@xyflow/react";
import { AppNode } from "@/types/appNode";
import { useCallback } from "react";
import BrowserInstanceParam from "./Param/BrowserInstanceParam";
import SelectParam from "./Param/SelectParam";
import CredentialsParam from "./Param/CredentialsParam";
import AIServiceParam from "./Param/AIServiceParam";

function NodeParamField({ param, nodeId, disabled }: { param: TaskParam, nodeId: string, disabled: boolean }) {
    const {updateNodeData, getNode } = useReactFlow();
    const node = getNode(nodeId) as AppNode;
    const value = node?.data?.inputs?.[param.name] || "";
    const updateNodeParamValue = useCallback((newValue: string) => {
        updateNodeData(nodeId, {
            inputs: {
                ...node?.data.inputs,
                [param.name]: newValue
            }
        });
    }, [
        updateNodeData,
        nodeId,
        node?.data.inputs,
        param.name
    ]);
    switch(param.type){
        case TaskParamType.STRING:
            return <StringParam param={param} value={value} updateNodeParamValue={updateNodeParamValue} disabled={disabled}/>
        case TaskParamType.BROWSER_INSTANCE:
            return <BrowserInstanceParam param={param} value={""} updateNodeParamValue={updateNodeParamValue} />
        case TaskParamType.SELECT:
            return <SelectParam param={param} value={value} updateNodeParamValue={updateNodeParamValue} disabled={disabled}/>
        case TaskParamType.CREDENTIAL:
            return <CredentialsParam param={param} value={value} updateNodeParamValue={updateNodeParamValue} disabled={disabled}/>
        case TaskParamType.AI_SERVICE:
            return <AIServiceParam param={param} value={value} updateNodeParamValue={updateNodeParamValue} disabled={disabled}/>
        default: 
            return (
                <div className="w-full">
                    <p className="text-xs text-muted-foreground">Not implemented</p>
                </div>
            )
    }
}

export default NodeParamField;