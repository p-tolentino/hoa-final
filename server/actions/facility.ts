"use server";

import { db } from "@/lib/db";
import * as z from "zod";
import { currentUser } from "@/lib/auth";
import { NewFacilitySchema } from '@/server/schemas'

export const createFacility = async(values: z.infer<typeof NewFacilitySchema>) => {
    const user = await currentUser();

    // No Current User
    if (!user) {
      return { error: "Unauthorized" };
    }

    await db.facility.create({
        data: {
            name: values.name,
            hourlyRate: parseInt(values.hourlyRate, 10),
            description: values.description,
            address: values.address,
            mediaLink: values.media,
        }
    })
    return { success: "Facility successfully Created" };
}

export const updateFacility = async(values: z.infer<typeof NewFacilitySchema>, facilityID: string) => {
    const user = await currentUser();

    // Check if there's a current user
    if (!user) {
        return { error: "Unauthorized" };
    }

    // Update the facility
    const updatedFacility = await db.facility.update({
        where: { id: facilityID },
        data: {
            ...values,
            hourlyRate: parseInt(values.hourlyRate, 10)
        },
    });

    return { success: "Facility successfully updated", facility: updatedFacility };
}

export const deleteFacility = async(facilityID: string) => {
    const user = await currentUser();

    // Check if there's a current user
    if (!user) {
        return { error: "Unauthorized" };
    }

    // Update the facility
    const deleteFacility = await db.facility.delete({
        where: { id: facilityID },
    });

    return { success: "Facility successfully deleted"};
}




