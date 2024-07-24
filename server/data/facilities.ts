"use server";

import { db } from "@/lib/db";

export const getFacilities = async () => {
    try {
      const facilities = await db.facility.findMany();
  
      return facilities;
    } catch {
      return null;
    }
  }

  export const getFacilityName = async (facilityId: string) => {
    try {
      const facilities = await db.facility.findFirst({ 
        where: {id: facilityId}
      });
  
      return facilities?.name;
    } catch {
      return "Unknown Facility";
    }
  }

  export const getFacilityRate = async (facilityId: string) => {
    try {
      const facilities = await db.facility.findFirst({ 
        where: {id: facilityId}
      });
  
      return facilities?.hourlyRate;
    } catch {
      return 0;
    }
  }
