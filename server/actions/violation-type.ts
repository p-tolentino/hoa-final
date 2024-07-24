"use server";

import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import { getUserById } from "@/server/data/user";
import { ViolationTypeFormValues } from "@/app/(routes)/user/violations/violation-list/_components/AddViolationButton";

export const createViolationType = async (values: ViolationTypeFormValues) => {
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

  await db.violationType.create({
    data: {
      ...values,
      firstOffenseFee: parseFloat(values.firstOffenseFee),
      secondOffenseFee: parseFloat(values.secondOffenseFee),
      thirdOffenseFee: parseFloat(values.thirdOffenseFee),
    },
  });

  return { success: "Created violation type successfully" };
};

export const updateViolationType = async (
  values: ViolationTypeFormValues,
  id: string
) => {
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

  await db.violationType.update({
    where: { id },
    data: {
      ...values,
      firstOffenseFee: parseFloat(values.firstOffenseFee),
      secondOffenseFee: parseFloat(values.secondOffenseFee),
      thirdOffenseFee: parseFloat(values.thirdOffenseFee),
    },
  });

  return { success: "Updated violation type successfully" };
};

export const deleteViolationType = async (id: string) => {
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

  await db.violationType.delete({
    where: {
      id,
    },
  });

  return { success: "Violation type deleted successfully" };
};
