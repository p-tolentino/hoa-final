"use server";

import * as z from "zod";
import { PersonalInfoSchema } from "@/server/schemas";

import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import { getUserById } from "@/server/data/user";

export const updateInfo = async (
  values: z.infer<typeof PersonalInfoSchema>
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

  await db.personalInfo.upsert({
    where: { userId: dbUser.id },
    update: { ...values, birthDay: new Date(values.birthDay) },
    create: {
      ...values,
      userId: dbUser.id,
      birthDay: new Date(values.birthDay),
    },
  });

  return { success: "Updated information successfully" };
};
