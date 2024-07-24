"use server";

import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import { getUserById } from "@/server/data/user";
import { MaintenanceTypeFormValues } from "@/app/(routes)/user/maintenance/maintenance-list/_components/AddMaintenanceButton";

export const createMaintenanceType = async (values: MaintenanceTypeFormValues) => {
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

  await db.maintenanceType.create({
    data: {
      ...values,
    },
  });

  return { success: "Created maintenance type successfully" };
};

export const updateMaintenanceType = async (
  values: MaintenanceTypeFormValues,
  id: string
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

  await db.maintenanceType.update({
    where: { id },
    data: {
      ...values,
    },
  });

  return { success: "Updated maintenance type successfully" };
};

export const deleteMaintenanceType = async (id: string) => {
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

  await db.maintenanceType.delete({
    where: {
      id,
    },
  });

  return { success: "Maintenance type deleted successfully" };
};
