"use server";

import { db } from "@/lib/db";

export const getContacts = async () => {
  try {
    const contacts = await db.externalMaintainers.findMany();

    return contacts;
  } catch {
    return null;
  }
}