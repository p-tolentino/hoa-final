"use server";

import * as z from "zod";
import bcrypt from "bcryptjs";

import { db } from "@/lib/db";
import { RegisterSchema } from "@/server/schemas";
import { getUserByEmail } from "@/server/data/user";

export const register = async (values: z.infer<typeof RegisterSchema>) => {
  const validatedFields = RegisterSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { email, password } = validatedFields.data;
  const hashedPassword = await bcrypt.hash(password, 10);

  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    if (existingUser.emailVerified) {
      return { error: "Email already in use! Try signing in with Google." };
    }
    return { error: "Email already in use!" };
  }

  await db.user.create({
    data: {
      email,
      password: hashedPassword,
    },
  });

  return { success: "Account successfully registered!" };
};
