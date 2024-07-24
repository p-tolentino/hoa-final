"use server";

import { db } from "@/lib/db";
import * as z from "zod";
import { currentUser } from "@/lib/auth";
import { FacilityReservationSchema } from "@/server/schemas";

export const createReservation = async(values: z.infer<typeof FacilityReservationSchema>) => {
    const user = await currentUser();

    // No Current User
    if (!user) {
      return { error: "Unauthorized" };
    }

    await db.facilityReservation.create({
        data: {
            facilityId: values.facilityId,
            userId: values.userId,
            startTime: values.startTime,
            endTime: values.endTime,
            numHours: parseInt(values.numHours),
            reservationFee: parseInt(values.reservationFee),
        }
    })
    return { success: "Facility successfully Created" };
}

export const deleteReservation = async (reservationID: string) => {
    try {
        const user = await currentUser();

        // Check if there's a current user
        if (!user) {
            return { error: "Unauthorized" };
        }

        // Delete the reservation
        await db.facilityReservation.delete({
            where: { id: reservationID },
        });

        return { success: "Reservation successfully deleted" };
    } catch (error) {
        console.error("Failed to delete reservation:", error);
        return { error: "Failed to delete reservation" };
    }
};

export const updateReservation = async (id: string, values: any) => {
    try {
        const user = await currentUser();

        // Check if there's a current user
        if (!user) {
            return { error: "Unauthorized" };
        }

        // Delete the reservation
        await db.facilityReservation.update({
            where: { id },
            data: {
                ...values
            }
        });

        return { success: "Reservation successfully updated" };
    } catch (error) {
        console.error("Failed to update reservation:", error);
        return { error: "Failed to update reservation" };
    }
};




