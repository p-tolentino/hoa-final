"use server";

import { db } from "@/lib/db";

export const getAllRegularMaintainService = async () => {
  try {
    const regularMaintainService = await db.maintenanceSchedule.findMany({
        include: {
          service: true,
        //facility: true,
        }
      });

    return regularMaintainService;
  } catch {
    return null;
  }
};