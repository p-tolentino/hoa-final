"use server";

import * as z from "zod";
import { signIn } from "@/auth";
import { LoginSchema } from "@/server/schemas";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";

import { AuthError } from "next-auth";
import { getUserByEmail } from "@/server/data/user";

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
    if (existingUser && !existingUser?.password) {
      // try {
      //   await signIn("google", {
      //     callbackUrl: callbackUrl || DEFAULT_LOGIN_REDIRECT,
      //   });
      // } catch (error) {
      //   if (error instanceof AuthError) {
      //     switch (error.type) {
      //       case "CredentialsSignin":
      //         return { error: "Invalid credentials!" };
      //       default:
      //         return { error: "Something went wrong." };
      //     }
      //   }

      //   throw error;
      // }
      return { error: "Sign in with Google using this email." };
    }
    return { error: "Email does not exist!" };
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
