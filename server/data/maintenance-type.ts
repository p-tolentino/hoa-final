"use server";

import { db } from "@/lib/db";

export const getAllMaintenanceTypes = async () => {
  try {
    const types = await db.maintenanceType.findMany();

    return types;
  } catch {
    return null;
  }
};

export const getMaintenanceTypeById = async (id: string) => {
  try {
    const maintenanceType = await db.maintenanceType.findFirst({
      where: {
        id,
      },
    });

    return maintenanceType;
  } catch {
    return null;
  }
};

export const getMaintenanceTypeByTitle = async (title: string) => {
  try {
    const maintenanceType = await db.maintenanceType.findFirst({
      where: {
        title,
      },
    });

    return maintenanceType;
  } catch {
    return null;
  }
};
