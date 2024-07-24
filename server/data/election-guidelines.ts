"use server";

import { db } from "@/lib/db";

export const getElectionGuidelines = async () => {
  try {
    const electionGuidelines = await db.electionGuidelines.findFirst();

    return electionGuidelines;
  } catch {
    return null;
  }
};