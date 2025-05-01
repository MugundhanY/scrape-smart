import { AppNodeMissingInputs } from "@/types/appNode";
import React, { createContext, Dispatch, SetStateAction } from "react";

type FlowValidationContextType = {
    invalidInputs: AppNodeMissingInputs[]
    setInvalidInputs: Dispatch<SetStateAction<AppNodeMissingInputs[]>>;
    clearErrors: () => void;
}

export const FlowValidationContext = createContext<FlowValidationContextType | null>(null);


export function FlowValidationContextProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [invalidInputs, setInvalidInputs] = React.useState<AppNodeMissingInputs[]>([]);

    const clearErrors = () => setInvalidInputs([]);
    return (
        <FlowValidationContext.Provider value={{ invalidInputs, setInvalidInputs, clearErrors}}>
            {children}
        </FlowValidationContext.Provider>
    )
}