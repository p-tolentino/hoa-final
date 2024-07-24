"use server";

import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";

export const getEvents = async () => {
  try {
    const events = await db.events.findMany();

    return events;
  } catch {
    return null;
  }
}