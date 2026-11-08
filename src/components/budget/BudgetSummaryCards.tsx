"use client";

import
{
    Wallet,
    ArrowDownRight,
    PiggyBank,
    Percent,
}from "lucide-react";

import { useMonthlyBudgetContext, useTransactionContext } from "@/app/(protected)/context";
import { getBudgetPercentage, getMonthlySpending, getRemainingBudget } from "@/lib/budgetHelpers";
import { formatMoney } from "@/lib/types_and_helpers";


//moved the summary card array delcaration down so that I could use the monthly budget context in them
export default function BudgetSummaryCards()
{
//will contain the most recent monthly budget if it exists, or null if it doesn't.
const {monthlyBudget} = useMonthlyBudgetContext();
const {transactionsArr} = useTransactionContext();

//if monthly budget exists, create summary cards with budget data. else create empty array.
const summaryCards = monthlyBudget ? [
    {
    label: "Monthly Budget",
    value: formatMoney((monthlyBudget.amount)),
    icon: Wallet,
    color: "text-[#3f8068]",
    background: "bg-[#e5f3ec]"
    },
    {
    label: "Amount Spent",
    value: formatMoney(getMonthlySpending(transactionsArr, monthlyBudget.month.getMonth(), monthlyBudget.month.getFullYear())), //an issue in the way transaction dates are handled can cause transactions on the first of the month to be ignored due to timezones.
    icon: ArrowDownRight,
    color: "text-[#d94c5c]",
    background: "bg-[#fce8eb]",
    },
    {
    label: "Amount Remaining",
    value: formatMoney(getRemainingBudget(getMonthlySpending(transactionsArr, monthlyBudget.month.getMonth(), monthlyBudget.month.getFullYear()), monthlyBudget.amount)),
    icon: PiggyBank,
    color: "text-[#3173c9]",
    background: "bg-[#e8f1ff]",
    },
    {
    label: "Budget Used",
    value: `${parseInt(String(getBudgetPercentage(getMonthlySpending(transactionsArr, monthlyBudget.month.getMonth(), monthlyBudget.month.getFullYear()), monthlyBudget.amount)), 10)}%`,
    icon: Percent,
    color: "text-[]",
    background: "bg-[#f0e7fc]",
    },
] :
[{
    label: "Monthly Budget",
    value: "",
    icon: Wallet,
    color: "text-[#3f8068]",
    background: "bg-[#e5f3ec]"
    },
    {
    label: "Amount Spent",
    value: "",
    icon: ArrowDownRight,
    color: "text-[#d94c5c]",
    background: "bg-[#fce8eb]",
    },
    {
    label: "Amount Remaining",
    value: "",
    icon: PiggyBank,
    color: "text-[#3173c9]",
    background: "bg-[#e8f1ff]",
    },
    {
    label: "Budget Used",
    value: "",
    icon: Percent,
    color: "text-[]",
    background: "bg-[#f0e7fc]",
    }];
  
    return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {summaryCards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.label}
            className="rounded-xl border border-[#dce7e2] bg-white p-5"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm text-[#4e7069]">
                  {card.label}
                </p>

                <p className="mt-3 break-words text-2xl font-bold text-[#17324d]">
                  {card.value}
                </p>
              </div>
              <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${card.background}`}
              >
                <Icon
                  aria-hidden="true"
                  className={`h-5 w-5 ${card.color}`}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
