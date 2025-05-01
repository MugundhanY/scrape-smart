"use server";

import { symmetricEncrypt } from "@/lib/encryption";
import { prisma } from "@/lib/prisma";
import { createCredentialSchema, createCredentialSchemaType } from "@/schema/credential";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function createCredential(form: createCredentialSchemaType){
    const {success, data} = createCredentialSchema.safeParse(form);
    if(!success){
        throw new Error ("Invalid form data");
   }

   const {userId} = auth();
   if(!userId){
       throw new Error("Unauthorized");
   }

   const encryptedValue = symmetricEncrypt(data.value);
   
   console.log("@TEST", {
    plain: data.value,
    encrypted: encryptedValue,
   });
   const result = await prisma.credential.create({
       data: {
        userId,
        name: data.name,
        value: encryptedValue,
        },
    });

    if(!result){
        throw new Error("Failed to create credential");
    }

    revalidatePath("/credentials");
}