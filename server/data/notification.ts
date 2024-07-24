"use server";

import { db } from "@/lib/db";

export const getAllNotifications = async () => {
  try {
    const notifications = await db.notification.findMany();

    return notifications;
  } catch {
    return null;
  }
};

export const getNotificationsByUserId = async (recipient: string) => {
  try {
    const notification = await db.notification.findMany({
      where: {
        recipient,
      },
    });

    return notification;
  } catch {
    return null;
  }
};
