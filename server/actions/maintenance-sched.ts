"use server";

import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import { getUserById } from "@/server/data/user";

export const createRegularMaintainService = async (values: any) => {
  const user = await currentUser();

  const { title, facilityId, days, startTime, endTime } = values

  // No Current User
  if (!user) {
    return { error: "Unauthorized" };
  }

  // Validation if user is in database (not leftover session)
  const dbUser = await getUserById(user.id);

  if (!dbUser) {
    return { error: "Unauthorized" };
  }

  await db.regularMaintainService.create({
    data: {
        title,
        facilityId,
        // facility: {
        //   connect: { id: facilityId }
        // },
        schedules: {
          create: {
            days,
            startTime,
            endTime
          }
        }
      }
  });

  return { success: "Created regular maintenance successfully" };
};

export const updateRegularMaintainService = async (
  values: any,
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

  const { title, facilityId, days, startTime, endTime } = values;

  try {
    await db.regularMaintainService.update({
      where: { id },
      data: {
        title,
        facilityId,
      },
    });

    await db.maintenanceSchedule.updateMany({
      where: { serviceId: id },
      data: {
        days,
        startTime,
        endTime,
      },
    });

    return { success: "Updated regular maintenance schedule successfully" };
  } catch (error) {
    console.error("Error updating regular maintenance:", error);
    return { error: "An error occurred while updating regular maintenance" };
  }
};

export const deleteRegularMaintainService = async (id: string) => {
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

  await db.regularMaintainService.delete({
    where: {
      id,
    },
  });

  return { success: "Regular maintenance schedule deleted successfully" };
};
