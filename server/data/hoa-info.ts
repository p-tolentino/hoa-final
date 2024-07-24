"use server";

import { db } from "@/lib/db";

export const getHoaInfo = async () => {
  try {
    const hoa = await db.hoa.findFirst();

    return hoa;
  } catch {
    return null;
  }
};
