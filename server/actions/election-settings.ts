"use server";

import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import { getUserById } from "../data/user";

export const createElectionSettings = async (values: any) => {
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

  await db.electionSettings.create({
    data: {
        ...values
    }
  })
  
  return { success: "Election successfully created" };
  
};

export const updateElectionSettings = async (id: string, values: any) => {
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
  
    await db.electionSettings.update({
      where:{ id },
      data: {
          ...values
      }
    })
    
    return { success: "Election successfully updated" };
    
  };

  export const extendElection = async (electionId: string, extendedDate: string) => {
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
  
    // Updating the election end date
    const updatedElection = await db.electionSettings.update({
      where: {
        id: electionId,
      },
      data: {
        endElectDate: new Date(extendedDate),
      }
    });
  
    if (updatedElection) {
      return { success: "Election end date successfully extended" };
    } else {
      return { error: "Election update failed" };
    }
  };



  export const concludeElection = async (electionId: string) => {
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
  
    // Updating the election end date
    const concludeElection = await db.electionSettings.update({
      where: { id: electionId, },
      data: { status: "CLOSED", }
    });
  
    if (!concludeElection) {
      return { error: "Election conclusion failed" };
    }

  // Update positions to 'Member' for those whose committee was 'Board of Directors'
  await db.personalInfo.updateMany({
    where: {
      committee: "Board of Directors",
    },
    data: {
      position: "Member",
      committee: null,  // Optionally reset the committee if needed
    },
  });

  // Calculate the winners
  const votes = await db.voteResponse.groupBy({
    by: ['candidateId'],
    _count: {
      candidateId: true,
    },
    where: {
      electionId: electionId,
    },
    orderBy: {
      _count: {
        candidateId: 'desc',
      },
    },
  });

  console.log(votes)

  const electionSettings = await db.electionSettings.findUnique({
    where: { id: electionId },
  });

// Handling ties
if (electionSettings && votes.length > electionSettings.totalBoardMembers) {
  // Check if the last position has a tie
  const lastValidPositionVoteCount = votes[electionSettings.totalBoardMembers - 1]._count.candidateId;
  const potentialTieCount = votes.filter(vote => vote._count.candidateId === lastValidPositionVoteCount).length;

  if (potentialTieCount > 1) {
    // More than one candidate has the same vote count in the last valid position
    console.log("A tie needs resolution for the final qualifying position.");
    return { error: "Tie detected at the cutoff point. Additional steps required to resolve the tie." };
  }
}

  const winners = votes.slice(0, electionSettings?.totalBoardMembers);

  console.log(winners)

// Assume winners are gathered from the 'Candidates' model and not directly from 'PersonalInfo'
await Promise.all(winners.map(async winner => {
  // First, retrieve the userId from the Candidates table for each winner
  const candidate = await db.candidates.findUnique({
    where: { id: winner.candidateId },
    select: { userId: true }  // Only fetch the userId
  });

  if (candidate) {
    // Then, update the PersonalInfo entry corresponding to this userId
    await db.personalInfo.update({
      where: {
        userId: candidate.userId, // Use the userId from the candidate
      },
      data: {
        committee: "Board of Directors",
      },
    });
  }
}));

return { success: "Election concluded successfully" };
  }

  export const markElectionAsInvalid = async (id: string) => {
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
  
    await db.electionSettings.update({
      where:{ id },
      data: {
          status: "CLOSED"
      }
    })
    
    return { success: "Election marked as invalid" };
    
  };

