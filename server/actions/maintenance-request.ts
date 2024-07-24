"use server";

import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import { getUserById } from "@/server/data/user";

export const createMaintenanceRequest = async (values: any) => {
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

  const result = await db.maintenanceRequest.create({
    data: {
      ...values,
      submittedBy: dbUser.id
    },
  });

  return { success: "Created maintenance request successfully", maintenance: { ...result } };
};

export const updateMaintenanceRequest = async (id: string,
  values: any,
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

  await db.maintenanceRequest.update({
    where: { id },
    data: {
      ...values,
    },
  });

  return { success: "Updated maintenance request successfully" };
};

export const deleteMaintenanceRequest = async (id: string) => {
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

  await db.maintenanceRequest.delete({
    where: {
      id,
    },
  });

  return { success: "Maintenance request deleted successfully" };
};

export const createOfficerTasks = async (values: any) => {
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

  await db.maintenanceOfficerActivity.createMany({
    data: {
      ...values,
    },
  });

  return {
    success: "Tasks successfully created.",
  };
};

export const createMaintenanceNotice = async (values: any) => {
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

  const res = await db.maintenanceNotice.create({
    data: {
      ...values,
    },
  });

  return { success: "Notice sent successfully", data: { res } };
};

export const updateNoticeSent = async (id: string, letterSent: boolean) => {
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

  await db.maintenanceRequest.update({
    where: { id },
    data: {
      letterSent,
    },
  });

  return {
    success: "Maintenance notice sent successfully to HOA.",
  };
};

export const createMaintenanceProgressReport = async (values: any) => {
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

  await db.maintenanceProgress.createMany({
    data: {
      ...values,
    },
  });

  return {
    success: "Progress report for maintenance successfully created.",
  };
};

export const updateMaintenanceOfficerTask = async (
  id: string,
  isDone: boolean
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

  await db.maintenanceOfficerActivity.update({
    where: { id },
    data: {
      isDone,
      dateCompleted: new Date(),
    },
  });

  return {
    success: "Officer activity marked done.",
  };
};