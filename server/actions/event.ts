"use server";

import { db } from "@/lib/db";
import * as z from "zod";
import { currentUser } from "@/lib/auth";
import { CategoryType } from "@prisma/client";
import { newEventSchema } from "@/server/schemas";
import { Status } from "@prisma/client";

export const createEvent = async (values: z.infer<typeof newEventSchema>) => {
  const user = await currentUser();

  // No Current User
  if (!user) {
    return { error: "Unauthorized" };
  }

  try {
    const poll = await db.events.create({
      data: {
        userId: user.id,
        title: values.title,
        description: values.description,
        date: new Date(values.date).toISOString(),
        venue: values.venue,
      },
    });
    return { success: "Poll successfully created", pollId: poll.id };
  } catch (error) {
    console.error("Failed to create poll:", error);
    return { error: "Failed to create poll" };
  }
};
