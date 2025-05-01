"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GetUserPurchaseHistory(){
    const { userId } = await auth();

    if(!userId) throw new Error("Unauthenticated");

    return prisma.userPurchase.findMany({
        where: { userId },
        orderBy: { 
            date: "desc",
        },
    })
}