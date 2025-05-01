"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GetCredentialsForUser(){
    const { userId } = await auth();
    if(!userId){
        throw new Error("Unauthenticated");
    }

    return prisma.credential.findMany({
        where: {
            userId
        },
        orderBy: {
            name: "asc"
        }
    });
}