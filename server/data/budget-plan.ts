"use server";

import { db } from "@/lib/db";

export const getAllBudgetPlans = async () => {
  try {
    const plans = await db.budgetPlan.findMany();

    return plans;
  } catch {
    return null;
  }
};

export const getBudgetPlanByYear = async (year: number) => {
  try {
    const plan = await db.budgetPlan.findFirst({
      where: { 
        forYear: year },
    });

    return plan;
  } catch (error) {
    throw error;
  }
};

export const getBudget = async (budgetId: string) => {
  try {
    var plan = await db.budgetPlan.findUnique({
      where: { id: budgetId },
    });

    return plan;
  } catch {
    return null;
  }
};
