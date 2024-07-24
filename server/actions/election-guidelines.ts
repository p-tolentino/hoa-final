"use server";

import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import { getUserById } from "../data/user";
import { getElectionGuidelines } from "../data/election-guidelines";

export const generateEmptyGuidelines = async () => {
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
  
    await db.electionGuidelines.create({
        data:{
          boardResolution: [
            "Members of the Board of Directors are eligible to stand for and accept nominations.",
            "Candidates are nominated by members of the Homeowners' Association of good standing.",
            "Members of good standing are those homeowners who have no outstanding balance in any required homeowner fees, including, but not limited to, monthly dues and violation fees.",
            "Only members of good standing can vote and be nominated as candidates for the upcoming eletion.",
            "An announcement within the MIA will invite nominees/candidates to submit their application.",
            "The Election Committee may modify these guidelines to supplement or correct any information.",
          ],// Reference: https://www.facebook.com/manuela4a/photos/a.514350415931685/875955643104492/?type=3
          qualifications: [
            "Must be of legal age",
            "Must be a member of good standing (with no arrears and no more than 3 months of unpaid dues)",
            "Must be an actual resident of the subdivision for at least (6) months prior to the date of the election as certified by the Board Secretary or, in the Secretary’s absence, by a member having a personal knowledge thereof",
            "Has not been convicted and/or has no pending case, civil and/or criminal, especially involving moral turptitude",
            "The legitimate spouse of a member in good standing may be a candidate for directorship in lieu of such member",
          ]
        }
    })
    
    return { success: "Generated guidelines" };
    
  };

export const createElectionGuidelines = async (values: any) => {
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

  await db.electionGuidelines.create({
    data: {
        ...values
    }
  })
  
  return { success: "Guidelines successfully created" };
  
};

export const updateCandidacyForm =  async (link: string) => {
  const user = await currentUser();
  const guidelinesInfo = await getElectionGuidelines()

  // No Current User
  if (!user) {
    return { error: "Unauthorized" };
  }

  // Validation if user is in database (not leftover session)
  const dbUser = await getUserById(user.id);

  if (!dbUser) {
    return { error: "Unauthorized" };
  }

  await db.electionGuidelines.update({
    where: { id: guidelinesInfo?.id},
    data: {
      candidacyFormLink: link,
      updatedFormDate: new Date(),
      updatedFormBy: dbUser.id,
    },
  });

  return { success: "Updated candidacy form successfully" };
};

export const updateElectionGuidelines = async (id: string, values: any) => {
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

  await db.electionGuidelines.update({
    where: { id },
    data: {
        ...values
    }
  })
  
  return { success: "Guidelines successfully updated" };
  
};