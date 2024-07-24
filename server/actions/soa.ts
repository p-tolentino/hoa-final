"use server";

import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import { getUserById } from "@/server/data/user";

export const createSoa = async (addressId: string) => {
  const user = await currentUser();

  // No Current User
  if (!user) {
    return { error: "Unauthorized" };
  }

  // Validation if user is in database (not leftover session)
  const dbUser = await getUserById(user.id);

  if (!dbUser) {
    return { error: "Unauthorized" };
  }

  const soa = await db.monthlySoa.create({
    data: {
      forMonth: new Date().getMonth(),
      forYear: new Date().getFullYear(),
      addressId,
      total: 0,
      paidAmount: 0,
      balance: 0,
    },
  });

  return { success: "Created Monthly SOA successfully", soa };
};

export const createPrevMonthSoa = async (addressId: string) => {
  const user = await currentUser();

  // No Current User
  if (!user) {
    return { error: "Unauthorized" };
  }

  // Validation if user is in database (not leftover session)
  const dbUser = await getUserById(user.id);

  if (!dbUser) {
    return { error: "Unauthorized" };
  }

  const soa = await db.monthlySoa.create({
    data: {
      forMonth: new Date().getMonth() - 1,
      forYear: new Date().getFullYear(),
      addressId,
      total: 0,
      paidAmount: 0,
      balance: 0,
    },
  });

  return { success: "Created Monthly SOA successfully", soa };
};

export const updateSoa = async (id: string, values: any) => {
  const user = await currentUser();

  // No Current User
  if (!user) {
    return { error: "Unauthorized" };
  }

  // Validation if user is in database (not leftover session)
  const dbUser = await getUserById(user.id);

  if (!dbUser) {
    return { error: "Unauthorized" };
  }

  const soa = await db.monthlySoa.update({
    where: { id },
    data: {
      ...values,
    },
  });

  return { success: "Updated Monthly SOA successfully", soa };
};

export const createSoaPayment = async (values: any) => {
  const user = await currentUser();

  // No Current User
  if (!user) {
    return { error: "Unauthorized" };
  }

  // Validation if user is in database (not leftover session)
  const dbUser = await getUserById(user.id);

  if (!dbUser) {
    return { error: "Unauthorized" };
  }

  const payment = await db.soaPayment.create({
    data: {
      ...values,
      paidBy: dbUser.id,
    },
  });

  return { success: "Created Monthly SOA successfully", payment };
};
