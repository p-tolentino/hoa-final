"use server";

import { db } from "@/lib/db";

export const getAllMaintenanceRequests = async () => {
  try {
    const requests = await db.maintenanceRequest.findMany();

    return requests;
  } catch {
    return null;
  }
};

export const getRequestById = async (id: string) => {
  try {
    const request = await db.maintenanceRequest.findUnique({
      where: { id },
    });

    return request;
  } catch {
    return null;
  }
};

export const getMaintenanceOfficerActivitiesById = async (maintainReqId: string) => {
  try {
    const activities = await db.maintenanceOfficerActivity.findMany({
      where: { maintainReqId },
    });

    return activities;
  } catch {
    return null;
  }
};

export const getProgressReportsByActivityId = async (activity: string) => {
  try {
    const progress = await db.maintenanceProgress.findMany({
      where: { activity },
    });

    return progress;
  } catch {
    return null;
  }
};

export const getAllProgressReports = async () => {
  try {
    const progress = await db.maintenanceProgress.findMany();

    return progress;
  } catch {
    return null;
  }
};

export const getNoticeByMaintenanceId = async (idToLink: string) => {
  try {
    const maintenanceNotice = await db.maintenanceNotice.findFirst({
      where: { idToLink }
    })

    return maintenanceNotice
  } catch {
    return null
  }
}
