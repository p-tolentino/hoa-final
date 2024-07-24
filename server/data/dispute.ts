"use server";

import { db } from "@/lib/db";

export const getAllDisputes = async () => {
  try {
    const disputes = await db.dispute.findMany();

    return disputes;
  } catch {
    return null;
  }
};

export const getDisputeById = async (id: string) => {
  try {
    const dispute = await db.dispute.findUnique({
      where: { id },
    });

    return dispute;
  } catch {
    return null;
  }
};

export const getDisputeOfficerActivitiesById = async (disputeId: string) => {
  try {
    const activities = await db.disputeOfficerActivity.findMany({
      where: { disputeId },
    });

    return activities;
  } catch {
    return null;
  }
};

export const getProgressReportsByActivityId = async (activity: string) => {
  try {
    const progress = await db.disputeProgress.findMany({
      where: { activity },
    });

    return progress;
  } catch {
    return null;
  }
};

export const getAllProgressReports = async () => {
  try {
    const progress = await db.disputeProgress.findMany();

    return progress;
  } catch {
    return null;
  }
};
