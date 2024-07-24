"use server";

import * as z from "zod";
import bcrypt from "bcryptjs";

import { db } from "@/lib/db";
import { RegisterSchema } from "@/server/schemas";
import { getUserByEmail } from "@/server/data/user";
import { HomeRelation } from "@prisma/client";

export const register = async (values: z.infer<typeof RegisterSchema>) => {
  const validatedFields = RegisterSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { email, password, firstName, lastName, birthDay, phoneNumber, address, type, relation } = validatedFields.data;
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
  }).then( async () => {
    const newUser = await getUserByEmail(email);

    if(newUser){
      await db.personalInfo.create({
        data: {
          firstName, lastName, phoneNumber, address, type,
          userId: newUser.id,
          relation: relation as HomeRelation,
          birthDay: new Date(birthDay),
        },
      });
    }
  });

  return { success: "Account successfully registered!" };
};
