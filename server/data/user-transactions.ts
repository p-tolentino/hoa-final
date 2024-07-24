"use server";

import { db } from "@/lib/db";
import { PaymentStatus } from "@prisma/client";

export const getTransactionByStatus = async (status: PaymentStatus) => {
  try {
    const transactions = await db.userTransaction.findMany({
      where: { status },
    });

    return transactions;
  } catch {
    return null;
  }
};

export const getTransactionByAddress = async (addressId: string) => {
  try {
    const transactions = await db.userTransaction.findMany({
      where: { addressId },
    });

    return transactions;
  } catch {
    return null;
  }
};

export const getAllTransactions = async () => {
  try {
    const transactions = await db.userTransaction.findMany();

    return transactions;
  } catch (err) {
    throw err;
  }
};

export const getPersonalAddress = async (userId: string) => {
  try {
    const personal = await db.personalInfo.findFirst({
      where: { userId },
    });

    return personal;
  } catch (err) {
    throw err;
  }
};

export const getPersonalInfo = async (userId: string) => {
  try {
    const personal = await db.personalInfo.findFirst({
      where: { userId },
    });

    return personal;
  } catch (err) {
    throw err;
  }
};
