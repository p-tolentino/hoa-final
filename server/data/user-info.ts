import { db } from "@/lib/db";

export const getInfoById = async (id: string) => {
  try {
    const info = await db.personalInfo.findUnique({
      where: { userId: id },
    });

    return info;
  } catch {
    return null;
  }
};

export const getPropertyById = async (id: string) => {
  try {
    const properties = await db.property.findMany({
      where: { userId: id },
      include: {
        documents: true,
      },
    });

    return properties;
  } catch {
    return null;
  }
};

export const getVehicleById = async (id: string) => {
  try {
    const vehicles = await db.vehicle.findMany({
      where: { userId: id },
    });

    return vehicles;
  } catch {
    return null;
  }
};
