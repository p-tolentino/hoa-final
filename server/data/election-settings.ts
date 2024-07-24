"use server";

import { db } from "@/lib/db";

export const getActiveElection = async () => {
  try {
    const data = await db.electionSettings.findFirst({
        where: {status: "ON-GOING"}
    });

    return data;
  } catch {
    return null;
  }
};

export const getAllElections = async () => {
  try {
    const data = await db.electionSettings.findMany();
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const getElection = async (electionId: string) => {
  try {
      const data = await db.electionSettings.findFirst({
        where:{id: electionId}
      });

      return data
  } catch{
    return null
  }
};

export const getElectionRequiredVotes = async (electionId: string) => {
  try {
      const data = await db.electionSettings.findFirst({
        where:{id: electionId}
      });

      return data?.requiredVotes
  } catch{
    return 0;
  }
};

export const getAllVotesDashboard = async (electionId: string) => {
  try {
    // Fetch the votes
    const votes = await db.voteResponse.findMany({
      where: { electionId: electionId },
    });

    // Get candidate IDs from the votes
    const candidateIds = votes.map(vote => vote.candidateId);

    // Fetch the userIds from the Candidates model using candidateIds
    const candidates = await db.candidates.findMany({
      where: { id: { in: candidateIds } },
      select: {
        userId: true,
        id: true,
      },
    });

    // Get the userIds from the candidates
    const userIds = candidates.map(candidate => candidate.userId);

    // Fetch personal info using userIds
    const personalInfos = await db.personalInfo.findMany({
      where: { userId: { in: userIds } },
      select: {
        userId: true,
        firstName: true,
        lastName: true,
      },
    });

    // Create a map of userId to fullName for easy lookup
    const userIdToNameMap = personalInfos.reduce((acc, info) => {
      acc[info.userId] = `${info.firstName} ${info.lastName}`;
      return acc;
    }, {} as { [key: string]: string });

    // Combine the vote counts with candidate names
    const voteCounts = votes.reduce((acc, vote) => {
      const candidate = candidates.find(candidate => candidate.id === vote.candidateId);
      if (candidate) {
        const name = userIdToNameMap[candidate.userId] || 'Unknown Candidate';
        if (!acc[name]) {
          acc[name] = 0;
        }
        acc[name]++;
      }
      return acc;
    }, {} as { [key: string]: number });

    // Convert the vote counts to an array of objects
    const result = Object.entries(voteCounts).map(([candidateName, voteCount]) => ({
      candidateName,
      voteCount,
    }));

    return result;
  } catch (error) {
    console.error(error);
    return null;
  }
};