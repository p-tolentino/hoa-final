"use server";

import { db } from "@/lib/db";
import * as z from "zod";
import { currentUser } from "@/lib/auth";
import { CategoryType } from "@prisma/client";
import { PollSchema } from "@/server/schemas";
import { Status } from "@prisma/client";

export const createPoll = async (values: z.infer<typeof PollSchema>) => {
  const user = await currentUser();

  // No Current User
  if (!user) {
    return { error: "Unauthorized" };
  }

  try {
    const poll = await db.polls.create({
      data: {
        userId: user.id,
        title: values.title,
        description: values.description,
        category: values.category as CategoryType,
        startDate: new Date(values.startDate).toISOString(),
        endDate: new Date(values.endDate).toISOString(),
        status: values.status,
        questions: {
          create: values.questions.map((q) => ({
            text: q.text,
            options: {
              create: q.options.map((o) => ({
                text: o.text,
              })),
            },
          })),
        },
      },
    });
    return { success: "Poll successfully created", pollId: poll.id };
  } catch (error) {
    console.error("Failed to create poll:", error);
    return { error: "Failed to create poll" };
  }
};

export const updateStatus = async (pollId: string, status: string) => {
  const user = await currentUser();

  // No Current User
  if (!user) {
    return { error: "Unauthorized" };
  }

  try {
    await db.polls.update({
      where: { id: pollId },
      data: { status: status as Status },
    });
    return { succes: "poll status updated successfully" };
  } catch (error) {
    console.error("Failed to update poll:", error);
    return { error: "Failed to create poll" };
  }
};

export const createResponse = async (
  pollId: string,
  questionId: string,
  optionId: string
) => {
  const user = await currentUser();

  // No Current User
  if (!user) {
    return { error: "Unauthorized" };
  }

  try {
    const response = await db.response.create({
      data: {
        userId: user.id,
        pollId: pollId,
        questionId: questionId,
        optionId: optionId,
      },
    });
    return response;
  } catch (error) {
    console.error("Failed to create response:", error);
    // Depending on your error handling strategy, you might want to throw the error, return null, or handle it differently
    throw new Error("Failed to create response");
  }
};
