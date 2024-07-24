"use server";

import { db } from "@/lib/db";

export const getHoaTransactions = async () => {
  try {
    const transactions = await db.hoaTransaction.findMany();

    return transactions;
  } catch {
    return null;
  }
};
