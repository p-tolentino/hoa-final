"use server";

import { signOut } from "@/auth";

export const logout = async () => {
  //----------------------------------------------------------------
  // Server actions here before signing out
  //----------------------------------------------------------------

  await signOut();
};
