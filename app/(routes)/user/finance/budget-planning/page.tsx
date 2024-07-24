import { currentUser } from "@/lib/auth";
import { getAllBudgetPlans } from "@/server/data/budget-plan";
import BudgetPlanning from "./_components/budget-plans-table";
import { BudgetPlanColumn } from "./_components/columns";

const BudgetPlanPage = async () => {
  const user = await currentUser();

  if (!user) {
    return null;
  }

  const plans = await getAllBudgetPlans();

  if (!plans) {
    return null;
  }

  await Promise.all(plans);

  const formattedBudgetPlans: BudgetPlanColumn[] = plans.map((item) => ({
    id: item.id || "",
    title: item.title || "",
    forYear: item.forYear.toString() || "",
  }));

  return (
    <BudgetPlanning
      budgetPlans={formattedBudgetPlans.sort(
        (a, b) => Number(a.forYear) - Number(b.forYear)
      )}
    />
  );
};

export default BudgetPlanPage;
