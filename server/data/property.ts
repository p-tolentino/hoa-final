"use server";

import { db } from "@/lib/db";

export const getAllProperties = async () => {
  try {
    const properties = await db.property.findMany();

    return properties;
  } catch {
    return null;
  }
};

export const getProperty = async (value: string) => {
  try {
    const info = await db.property.findUnique({
      where: { id: value },
    });

    return info;
  } catch {
    return null;
  }
};

