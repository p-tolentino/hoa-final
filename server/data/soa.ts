"use server";

import { db } from "@/lib/db";

export const getAllSoas = async () => {
  try {
    const soas = await db.monthlySoa.findMany();

    return soas;
  } catch (error) {
    throw error;
  }
};

export const getAllSoasByAddress = async (addressId: string) => {
  try {
    const soas = await db.monthlySoa.findMany({
      where: {
        addressId,
      },
    });

    return soas;
  } catch (error) {
    throw error;
  }
};

export const getSoaByDate = async (
  forYear: number,
  forMonth: number,
  addressId: string
) => {
  try {
    const soa = await db.monthlySoa.findFirst({
      where: {
        forYear,
        forMonth,
        addressId,
      },
    });

    return soa;
  } catch (error) {
    throw error;
  }
};

export const getAllSoaPayments = async () => {
  try {
    const soaPayments = await db.soaPayment.findMany();

    return soaPayments;
  } catch (error) {
    throw error;
  }
};
