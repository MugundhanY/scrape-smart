"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GetAvailableCredits() {
    const { userId } = await auth();
    if (!userId) throw new Error("Unathenticated");

    const balance = await prisma.userBalance.findUnique({
        where: { userId },
    });
    if(!balance) return 0;
    return balance.credits;
}