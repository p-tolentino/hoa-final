"use server"

import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import { getUserById } from "@/server/data/user";

export const createContact = async (data: any) => {
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

    await db.externalMaintainers.create({
        data: {
            ...data
        },
    });

    return { success: "External contact created successfully" };
    
  };
  
  export const updateContact = async (values: any, id: string) => {
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
  
    await db.externalMaintainers.update({
      where: { id },
      data: {
        ...values,
      },
    });
  
    return { success: "Updated external contact successfully" };
  };

  export const deleteContact = async (id: string) => {
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
  
    await db.externalMaintainers.delete({
      where: { id },
    });
  
    return { success: "Deleted external contact successfully" };
  }