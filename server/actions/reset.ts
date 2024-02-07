"use server";

import * as z from "zod";

import { getUserByEmail } from "@/server/data/user";
import { ResetSchema } from "@/server/schemas";

import { sendResetPasswordEmail } from "@/lib/mail";
import { generateResetPasswordToken } from "@/lib/tokens";

export const reset = async (values: z.infer<typeof ResetSchema>) => {
  const validatedFields = ResetSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid email" };
  }

  const { email } = validatedFields.data;

  const existingUser = await getUserByEmail(email);

  if (!existingUser) {
    return { error: "Email not found" };
  }

  const resetPasswordToken = await generateResetPasswordToken(email);

  await sendResetPasswordEmail(
    resetPasswordToken.email,
    resetPasswordToken.token
  );

  return { success: "Reset email sent!" };
};
