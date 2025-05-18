import { prisma } from "@/lib/prisma";

type Phase = {
    creditsConsumed: number | null;
};
export function GetPhasesTotalCost(phases: Phase[]) {
    return phases.reduce((acc, phase) => acc + (phase.creditsConsumed || 0), 0);
}