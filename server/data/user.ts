"use server";

import { db } from "@/lib/db";

export const getUserByEmail = async (email: string) => {
  try {
    const user = await db.user.findUnique({
      where: { email },
      include: {
        info: true,
      },
    });

    return user;
  } catch {
    return null;
  }
};

export const getUserById = async (id: string) => {
  try {
    const user = await db.user.findUnique({
      where: { id },
      include: {
        info: true,
      },
    });

    return user;
  } catch {
    return null;
  }
};

export const getAllUsers = async () => {
  try {
    const users = await db.user.findMany({
      include: {
        info: true,
      },
    });

    return users;
  } catch {
    return null;
  }
};


export const getActiveUsers = async () => {
  try {
    const account = await db.user.findMany({
      where: { role: "USER", status: 'ACTIVE' },
    });

    return account;
  } catch {
    return null;
  }
};