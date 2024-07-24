"use server";

import { db } from "@/lib/db";

export const getUserReservations = async (userId: string) => {
  try {
    const reservations = await db.facilityReservation.findMany({
      where: {userId: userId}
    });

    return reservations
  }catch {
    return null;
  }
}

export const getAllReservations = async () => {
  try {
    const reservations = await db.facilityReservation.findMany();

    return reservations
  }catch {
    return null;
  }
}

export const getFacilityReservation = async (facilityId: string) => {
    try {
      const facilities = await db.facilityReservation.findMany({
        where: {facilityId: facilityId}
      });
  
      return facilities;
    } catch {
      return null;
    }
  }