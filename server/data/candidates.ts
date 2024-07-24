"use server";

import { db } from "@/lib/db";

export const getAllCandidates = async () => {
  try {
    const data = await db.candidates.findMany();

    const candidates = data.map((candidate) => ({
      ...candidate,
      educBackground: candidate.educBackground.map((education) =>
        JSON.parse(education)
      ),
      workExperience: candidate.workExperience.map((work) => JSON.parse(work)),
    }));

    return candidates;
  } catch {
    return null;
  }
};

export const getCandidateById = async (id: string) => {
  try {
    const candidate = await db.candidates.findUnique({
      where: { id },
    });

    if (candidate) {
      candidate.educBackground = candidate.educBackground.map((education) =>
        JSON.parse(education)
      );
      candidate.workExperience = candidate.workExperience.map((work) =>
        JSON.parse(work)
      );
    }

    return candidate;
  } catch {
    return null;
  }
};

export const getApprovedCandidates = async (id: string) => {
  try {
    const data = await db.candidates.findMany({
        where: {status: "APPROVED", electionId: id}
    });

    return data;
  } catch {
    return null;
  }
};

export const getCandidatesByElection = async (electionId: string) => {
  try {
    const data = await db.candidates.findMany({
        where: {electionId: electionId}
    });

    return data;
  } catch {
    return null;
  }
};

export const getApprovedCandidatesByElection = async (electionId: string) => {
  try {
    const data = await db.candidates.findMany({
        where: {electionId: electionId, status: "APPROVED"}
    });

    return data;
  } catch {
    return null;
  }
};


