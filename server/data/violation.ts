"use server";

import { db } from "@/lib/db";

export const getAllViolations = async () => {
  try {
    const violations = await db.violation.findMany();

    return violations;
  } catch {
    return null;
  }
};

export const getViolationById = async (id: string) => {
  try {
    const violation = await db.violation.findUnique({
      where: { id },
    });

    return violation;
  } catch {
    return null;
  }
};

export const getViolationOfficerActivitiesById = async (
  violationId: string
) => {
  try {
    const activities = await db.violationOfficerActivity.findMany({
      where: { violationId },
    });

    return activities;
  } catch {
    return null;
  }
};

export const getProgressReportsByActivityId = async (activity: string) => {
  try {
    const progress = await db.violationProgress.findMany({
      where: { activity },
    });

    return progress;
  } catch {
    return null;
  }
};

export const getAllProgressReports = async () => {
  try {
    const progress = await db.violationProgress.findMany();

    return progress;
  } catch {
    return null;
  }
};
