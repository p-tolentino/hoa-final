"use server";

import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import { getUserById } from "../data/user";

export const createCandidacy = async (values: any) => {
  const user = await currentUser();

  // No Current User
  if (!user) {
    return { error: "Unauthorized" };
  }

  // Validation if user is in database (not leftover session)
  const dbUser = await getUserById(user.id);

  if (!dbUser) {
    return { error: "Unauthorized" };
  }

  await db.candidates.create({
    data: {
        ...values
    }
  })
  
  return { success: "Application successfully created" };
  
};

export const updateCandidacy = async (id: string, values: any) => {
    const user = await currentUser();
  
    // No Current User
    if (!user) {
      return { error: "Unauthorized" };
    }
  
    // Validation if user is in database (not leftover session)
    const dbUser = await getUserById(user.id);
  
    if (!dbUser) {
      return { error: "Unauthorized" };
    }
  
    await db.candidates.update({
        where:{ id },
      data: {
          ...values
      }
    })
    
    return { success: `Application successfully updated`, values };
    
  }