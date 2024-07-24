"use server";

import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import { getUserById } from "@/server/data/user";
import { getHoaInfo } from "@/server/data/hoa-info";
import { newHoaSchema } from "@/server/schemas";
import * as z from "zod";

export const generateHoa = async () => {
  // const user = await currentUser();

  // // No Current User
  // if (!user) {
  //   return { error: "Unauthorized" };
  // }

  // // Validation if user is in database (not leftover session)
  // const dbUser = await getUserById(user.id);

  // if (!dbUser) {
  //   return { error: "Unauthorized" };
  // }

  await db.hoa.create({
    data: {
      name: "Sample HOA",
      startingFunds: 10000,
      contactNumber:999999,
      funds: 10000,
      fixedDue: 500,
      lotSizeDue: 600,
      byLawsLink: "",
    },
  });

  return { success: "Generated sample HOA successfully" };
};

export const createHoa = async (data: z.infer<typeof newHoaSchema>) => {

  const existingHoa = await db.hoa.findFirst();

  if (existingHoa) {
    // An HOA entry exists, so we update it
    const result = await db.hoa.update({
      where: { id: existingHoa.id }, // Use the existing entry's ID for the update
      data: {
        name: data.name,
        contactNumber: Number(data.contactNumber),
        startingFunds: Number(data.funds),
        funds: Number(data.funds),
        fixedDue: Number(data.fixedDue),
        officerTerm: Number(data.officerTerm),
        overdueDelinquent: Number(data.overdueDelinquent),
        violationDelinquent: Number(data.violationDelinquent),
        cancelPeriod: Number(data.cancelPeriod),
        cancellationFee: Number(data.cancelFee),
        // Add other fields as needed
      },
    });

  return { success: "HOA entry updated successfully", details: result };
  } else {
    // No HOA entry exists, so we create a new one
    const result = await db.hoa.create({
      data: {
        name: data.name,
        contactNumber:  Number(data.contactNumber),
        startingFunds: Number(data.funds),
        funds: Number(data.funds),
        fixedDue: Number(data.fixedDue),
        officerTerm: Number(data.officerTerm),
        overdueDelinquent: Number(data.overdueDelinquent),
        violationDelinquent: Number(data.violationDelinquent),
        cancelPeriod: Number(data.cancelPeriod),
        cancellationFee: Number(data.cancelFee),
        // Add other required fields for creation
      },
    });

    return { success: "HOA entry created successfully", details: result };
  }
};

export const updateByLaws = async (link: string) => {
  const user = await currentUser();
  const hoaInfo = await getHoaInfo()

  // No Current User
  if (!user) {
    return { error: "Unauthorized" };
  }

  // Validation if user is in database (not leftover session)
  const dbUser = await getUserById(user.id);

  if (!dbUser) {
    return { error: "Unauthorized" };
  }

  await db.hoa.update({
    where: { id: hoaInfo?.id},
    data: {
      byLawsLink: link,
    },
  });

  return { success: "Updated HOA by-laws successfully" };
};


