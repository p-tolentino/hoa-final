import { v4 as uuidv4 } from "uuid";
import { db } from "./db";
import { getResetPasswordTokenByEmail } from "@/server/data/reset-password-token";

export const generateResetPasswordToken = async (email: string) => {
  const token = uuidv4();
  const expires = new Date(new Date().getTime() + 3600 * 1000);

  const existingToken = await getResetPasswordTokenByEmail(email);

  if (existingToken) {
    await db.resetPasswordToken.delete({
      where: {
        id: existingToken.id,
      },
    });
  }

  const resetPasswordToken = await db.resetPasswordToken.create({
    data: {
      email,
      token,
      expires,
    },
  });

  return resetPasswordToken;
};
