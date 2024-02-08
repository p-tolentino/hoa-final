"use server";

import * as z from "zod";
import bcrypt from "bcryptjs";

import { db } from "@/lib/db";
import { SettingsSchema } from "@/server/schemas";
import { getUserById } from "@/server/data/user";
import { currentUser } from "@/lib/auth";

export const settings = async (values: z.infer<typeof SettingsSchema>) => {
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

  if (values.password && values.newPassword && dbUser.password) {
    const passwordsMatch = await bcrypt.compare(
      values.password,
      dbUser.password
    );

    if (!passwordsMatch) {
      return { error: "Incorrect password" };
    }

    const hashedPassword = await bcrypt.hash(values.newPassword, 10);

    values.password = hashedPassword;
    values.newPassword = undefined;
  }

  await db.user.update({
    where: { id: dbUser.id },
    data: {
      ...values,
    },
  });

  return { success: "Updated password successfully" };
};
