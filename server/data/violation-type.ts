"use server";

import { db } from "@/lib/db";

export const getAllViolationTypes = async () => {
  try {
    const types = await db.violationType.findMany();

    return types;
  } catch {
    return null;
  }
};

export const getViolationTypeById = async (id: string) => {
  try {
    const violation = await db.violationType.findFirst({
      where: {
        id,
      },
    });

    return violation;
  } catch {
    return null;
  }
};

export const getViolationTypeByTitle = async (title: string) => {
  try {
    const violation = await db.violationType.findFirst({
      where: {
        title,
      },
    });

    return violation;
  } catch {
    return null;
  }
};
