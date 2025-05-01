"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function SetupUser(){
    const { userId } = await auth();
    if (!userId) {
        throw new Error("User not authenticated");
    }

    const balance = await prisma.userBalance.findUnique({
        where: { userId },
    });
    if (!balance) {
        await prisma.userBalance.create({
            data: {
                userId,
                credits: 100,
            },
        });
    }

    redirect("/");
}