"use server";

import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import { getUserById } from "@/server/data/user";

export const createNotification = async (values: any) => {
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

  await db.notification.create({
    data: {
      ...values,
    },
  });

  return { success: "Notification created successfully" };
};

export const updateIsRead = async (id: string, isRead: boolean) => {
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

  await db.notification.update({
    where: { id },
    data: {
      isRead,
    },
  });

  return { success: "Notification updated successfully" };
};

export const archiveNotification = async (id: string, isArchived: boolean) => {
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

  await db.notification.update({
    where: { id },
    data: {
      isArchived,
    },
  });

  return { success: "Notification archived successfully" };
};
