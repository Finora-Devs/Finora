import BudgetSummaryCards from "./BudgetSummaryCards";
import MonthlyBudget from "./MonthlyBudget";
import CategoryBudgetList from "./CategoryBudgetList";

import {
  getMonthlySpending,
  getCategorySpending,
  getBudgetPercentage, 
  getBudgetStatus
} from "@/lib/budgetHelpers";
import {
  useTransactionContext,
  useMonthlyBudgetContext
} from "@/app/(protected)/context";

export default function BudgetPage(){

  const { transactionsArr } = useTransactionContext();
  const { monthlyBudget } = useMonthlyBudgetContext();

  const currentDate = new Date();
  const month = currentDate.getMonth() + 1; // getMonth() returns 0-11, so we add 1
  const year = currentDate.getFullYear();

  const monthlySpending = getMonthlySpending(transactionsArr, month, year);
  const budgetAmount = monthlyBudget?.amount ?? 0;
  const status = getBudgetStatus(monthlySpending, budgetAmount);


    return(
        <section className="space-y-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                 <h1 className="text-3xl font-bold text-[#123c35]">
                    Budget
                 </h1>

                 <p className="mt-2 text-sm text-[#4e7069]">
                    Plan Your Monthly Spending and Manage Budget Categories
                 </p>
                </div>
                <div className="text-center sm:mr-4">
          <p className="mb-1 text-xs text-[#4e7069]">
            Month
          </p>

          <p className="rounded-lg bg-white px-3 text-sm text-[#17324d]">
            {new Intl.DateTimeFormat("en-US", {
              month: "long",
              year: "numeric",
            }).format(currentDate)}
          </p>
        </div>
      </div>
    {/*Summary cards*/ }
    <BudgetSummaryCards/>
    {/*Monthly budget */}
    <MonthlyBudget/>
    {/*Budget category */}
    <CategoryBudgetList />


        </section>
    );
}