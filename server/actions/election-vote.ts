"use server";

import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import { getUserById } from "../data/user";

export const createElectionVote = async (electionId: string, candidateId: string) => {
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

  await db.voteResponse.create({
    data: {
       userId: dbUser.id,
       electionId: electionId,
       candidateId: candidateId,
    }
  })
  
  return { success: "User successfully voted" };
  
};