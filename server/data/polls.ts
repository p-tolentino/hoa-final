"use server";

import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";

export const getPolls = async () => {
  try {
    const polls = await db.polls.findMany();

    return polls;
  } catch {
    return null;
  }
}

export const getQuestionsAndOptionsByPollId = async (value: string) => {
  try {
    // Directly query the questions table
    const questions = await db.question.findMany({
      where: {
        pollId: value, // Match questions by pollId
      },
      include: {
        options: true, // Include related options for each question
      },
    });
    return questions;
  } catch (error) {
    console.error('Failed to fetch questions and options:', error);
    return null;
  }
}

export const hasUserAnsweredPoll = async (pollId: string): Promise<boolean> => {
  const user = await currentUser();

  // No Current User
  if (!user) {
    return true;
  }
  
  const count = await db.response.count({
    where: {
      userId: user.id,
      pollId: pollId,
    },
  });

  return count > 0;
};

export const getOptionResponseCount = async (optionId: string) => {
  const count = await db.response.count({
    where: {
      optionId: optionId,
    },
  });

  return count;
};