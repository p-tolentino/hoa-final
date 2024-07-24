"use server";

import { db } from "@/lib/db";

export const getPosts = async () => {
  try {
    const posts = await db.post.findMany();

    return posts;
  } catch {
    return null;
  }
};

export const getDiscussionPosts = async () => {
  const postType = "DISCUSSION";

  try {
    const posts = await db.post.findMany({
      where: { type: postType },
    });

    return posts;
  } catch {
    return null;
  }
};

export const getBusinessPosts = async () => {
  const postType = "BUSINESS";

  try {
    const posts = await db.post.findMany({
      where: { type: postType },
    });

    return posts;
  } catch {
    return null;
  }
};

  export const getOfficerPosts = async () => {
    const postType = "OFFICER";
  
    try {
      const posts = await db.post.findMany({
        where: { type: postType },
      });
  
      return posts;
    } catch {
      return null;
    }
};
