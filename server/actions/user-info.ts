"use server";

import * as z from "zod";
import { PersonalInfoSchema, VehicleSchema } from "@/server/schemas";

import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import { getUserById } from "@/server/data/user";
import { HomeRelation, Status } from "@prisma/client";
import { ExtendedUser } from "@/next-auth";
import { getHoaInfo } from "../data/hoa-info";
import { getAllViolations } from "../data/violation";
import { getTransactionByAddress } from "../data/user-transactions";
import { createNotification } from "./notification";

export const updateInfo = async (
  values: z.infer<typeof PersonalInfoSchema>
) => {
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

  await db.personalInfo.upsert({
    where: { userId: dbUser.id },
    update: {
      ...values,
      relation: values.relation as HomeRelation,
      birthDay: new Date(values.birthDay),
    },
    create: {
      ...values,
      userId: dbUser.id,
      relation: values.relation as HomeRelation,
      birthDay: new Date(values.birthDay),
    },
  });

  return { success: "Updated information successfully" };
};

export const addVehicle = async (values: z.infer<typeof VehicleSchema>) => {
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

  await db.vehicle.create({ data: { ...values, userId: dbUser.id } });

  return { success: "Vehicle added successfully" };
};

export const updateGovtId = async (govtId: string) => {
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

  await db.personalInfo.update({
    where: { userId: dbUser.id },
    data: {
      govtId,
    },
  });

  return { success: "Member approved successfully" };
};

export const updateUserStatus = async (id: string) => {
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

  await db.user.update({
    where: { id },
    data: {
      status: Status.ACTIVE,
    },
  });

  return { success: "Member approved successfully" };
};

export const getHouseMembers = async (propertyId: string) => {
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

  const users = await db.personalInfo.findMany({
    where: {
      address: propertyId,
    },
  });

  return { users };
};

export const updatePosComm = async (userId: string, values: any) => {
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

  await db.personalInfo.update({
    where: { userId },
    data: {
      ...values,
    },
  });

  return { success: "Updated information successfully" };
};

export const updateDp = async (userId: string, imageUrl: string) => {
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

  await db.personalInfo.update({
    where: { userId },
    data: {
      imageUrl
    },
  });

  return { success: "Updated profile picture successfully" };
}

export const checkDelinquency = async(existingUser: ExtendedUser) => {
    const hoaInfo = await getHoaInfo();

    if (!existingUser || !hoaInfo) {
      return null;
    }

    const violations = await getAllViolations();
    const userViolations = await violations?.filter(
      (violation) =>
        violation.personsInvolved.includes(existingUser?.id) && violation.feeToIncur
    );

    const isViolationDelinquent = userViolations && hoaInfo.violationDelinquent !== 0 && userViolations.length >= hoaInfo.violationDelinquent

    const transactions = await getTransactionByAddress(existingUser.info.address);
    const now = new Date();
    const isOverdueDelinquent = transactions?.some((transaction) => {
      const transactionDate = new Date(transaction.createdAt);
      const monthsOverdue =
        (now.getFullYear() - transactionDate.getFullYear()) * 12 +
        now.getMonth() -
        transactionDate.getMonth();
      return (transaction.status != "PAID" && monthsOverdue >= hoaInfo.overdueDelinquent);
    });

    if ((isViolationDelinquent || isOverdueDelinquent) && existingUser.status !== Status.DELINQUENT) {
      await db.user.update({
        where:{ id: existingUser.info?.userId },
        data: {
          status: Status.DELINQUENT
        }
      })

      if(isOverdueDelinquent){
        const notifData = {
          type: 'delinquency',
          recipient: existingUser.info?.userId,
          title: 'Delinquency Notice',
          description:
            `In order to continue using features of the system, kindly settle any overdue fees you have in your account.`,
          linkToView: `/user/finance/statement-of-account`
        }

        await createNotification(notifData).then(data => {
          if (data.success) {
            console.log(data.success)
          }
        })
      }

      if(isViolationDelinquent){
        const notifData = {
          type: 'delinquency',
          recipient: existingUser.info?.userId,
          title: 'Delinquency Notice',
          description:
            `You have ${hoaInfo.violationDelinquent} or more violations on your record. Kindly contact the HOA to address any concerns.`,
          linkToView: `/user/membership/admin-directory`
        }

        await createNotification(notifData).then(data => {
          if (data.success) {
            console.log(data.success)
          }
        })
      }
    }
}