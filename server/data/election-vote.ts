"use server";

import { db } from "@/lib/db";

export const getAllVotes = async (electionId: string) => {
  try {
    const data = await db.voteResponse.findMany({
        where:{electionId: electionId}
    });

    return data;
  } catch {
    return null;
  }
};

export const getUniqueVotersCount = async (electionId: string) => {
  const votes = await getAllVotes(electionId);

  if (!votes) {
    return 0;
  }

  const uniqueVoters = new Set(votes.map(vote => vote.userId));
  return uniqueVoters.size;
};