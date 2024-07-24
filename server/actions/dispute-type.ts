"use server";

import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import { getUserById } from "@/server/data/user";
import { DisputeTypeFormValues } from "@/app/(routes)/user/disputes/dispute-list/_components/AddDisputeButton";

export const createDisputeType = async (values: DisputeTypeFormValues) => {
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

  await db.disputeType.create({
    data: {
      ...values,
    },
  });

  return { success: "Created dispute type successfully" };
};

export const updateDisputeType = async (
  values: DisputeTypeFormValues,
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

  await db.disputeType.update({
    where: { id },
    data: {
      ...values,
    },
  });

  return { success: "Updated dispute type successfully" };
};

export const deleteDisputeType = async (id: string) => {
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

  await db.disputeType.delete({
    where: {
      id,
    },
  });

  return { success: "Dispute type deleted successfully" };
};
