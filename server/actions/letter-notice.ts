"use server";

import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import { getUserById } from "@/server/data/user";

export const createNotice = async (values: any) => {
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

  const res = await db.notice.create({
    data: {
      ...values,
    },
  });

  return { success: "Letter or notice created successfully", data: { res } };
};

export const createViolationLetter = async (values: any) => {
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

  const res = await db.letter.create({
    data: {
      ...values,
    },
  });

  return { success: "Letter sent successfully", data: { res } };
};

export const createViolationNotice = async (values: any) => {
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

  const res = await db.notice.create({
    data: {
      ...values,
    },
  });

  return { success: "Notice sent successfully", data: { res } };
};

export const createDisputeLetter = async (values: any) => {
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

  const res = await db.letter.create({
    data: {
      ...values,
    },
  });

  return { success: "Letter sent successfully", res };
};
