"use server";

import { db } from "@/lib/db";
import * as z from "zod";
import { NewTransactionSchema } from "@/server/schemas";
import { currentUser } from "@/lib/auth";
import { HoaTransactionType } from "@prisma/client";

export const createTransaction = async (
  values: z.infer<typeof NewTransactionSchema>
) => {
  const user = await currentUser();

  // No Current User
  if (!user) {
    return { error: "Unauthorized" };
  }

  await db.hoaTransaction.create({
    data: {
      type: values.type as HoaTransactionType,
      purpose: values.purpose,
      description: values.description,
      amount: parseInt(values.amount, 10),
      dateIssued: new Date(values.dateIssued),
      submittedBy: user.id,
    },
  });

  return { success: "Transaction successfully Added! / Updated" };
};

export const updateFunds = async (funds: number) => {
  await db.hoa.updateMany({
    data: {
      funds,
    },
  });

  return { success: "Funds updated successfully" };
};
