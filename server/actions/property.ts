"use server";

import * as z from "zod";
import { PropertySchema } from "@/server/schemas";

import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import { getUserById } from "@/server/data/user";
import { UserRole } from "@prisma/client";

export const updateProperty = async (
  values: z.infer<typeof PropertySchema>,
  propertyId?: string
) => {
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

  if (user.role !== UserRole.ADMIN) {
    return { error: "Unauthorized: User role" };
  }

  await db.property.upsert({
    where: { id: propertyId },
    update: { ...values, purchaseDate: new Date(values.purchaseDate) },
    create: {
      ...values,
      userId: dbUser.id,
      purchaseDate: new Date(values.purchaseDate),
    },
  });

  return { success: "Updated property information successfully" };
};

export const updatePropertyOwner = async (
  propertyId: string,
  userId: string
) => {
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

  await db.property.updateMany({
    where: { id: propertyId },
    data: { userId },
  });

  return { success: "Updated property owner successfully" };
};

export const deleteProperty = async (propertyId: string) => {
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

  if (user.role !== UserRole.ADMIN) {
    return { error: "Unauthorized" };
  }

  await db.property.deleteMany({
    where: { id: propertyId },
  });

  return { success: "Deleted property information successfully" };
};
