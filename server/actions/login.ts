"use server";

import * as z from "zod";
import { signIn } from "@/auth";
import { LoginSchema } from "@/server/schemas";
import { DEFAULT_LOGIN_REDIRECT, DEFAULT_FIRST_LOGIN_REDIRECT } from "@/routes";

import { AuthError } from "next-auth";
import { getUserByEmail } from "@/server/data/user";
import { getInfoById } from "@/server/data/userInfo";

export const login = async (
  values: z.infer<typeof LoginSchema>,
  callbackUrl?: string | null
) => {
  const validatedFields = LoginSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { email, password } = validatedFields.data;

  const existingUser = await getUserByEmail(email);

  if (!existingUser || !existingUser.email || !existingUser.password) {
    return { error: "Email does not exist!" };
  }

  const existingInfo = await getInfoById(existingUser.id);
  if (!existingInfo) {
    callbackUrl = DEFAULT_FIRST_LOGIN_REDIRECT;
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: callbackUrl || DEFAULT_LOGIN_REDIRECT,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials!" };
        default:
          return { error: "Something went wrong." };
      }
    }

    throw error;
  }
};
