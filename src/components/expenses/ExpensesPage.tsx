"use client";

import { useState } from "react";
import { ArrowDownRight, CalendarDays, Tags, TrendingUp } from "lucide-react";
import { useTransactionContext } from "@/app/(protected)/context";
import ExpenseList from "./ExpenseList";
import SpendingByCategory from "./SpendingByCategory";
import { formatMoney } from "@/lib/types_and_helpers";

export default function ExpensesPage() {
  const { transactionsArr } = useTransactionContext();
  const [searchDate, setSearchDate] = useState(new Date());

  const setSearchDateWrapper = (newDate: Date) => setSearchDate(newDate);
  // const [month, setMonth] = useState(currentMonth);
      // const expenses = expensesInMonth(transactionsArr, month);
      // const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  // const priorTotal = expensesInMonth(
  //   transactionsArr,
  //   previousMonth(month),
  // ).reduce((sum, expense) => sum + expense.amount, 0);
  // const largest = expenses.reduce(
  //   (max, expense) => Math.max(max, expense.amount),
  //   0,
  // );
  // const topCategory = categoryBreakdown(expenses).sort(
  //   (a, b) => b.amount - a.amount,
  // )[0];
  const cards = [
    {
      label: "Total Expenses",
      value: 1_000_000, //formatMoney(total),
      note: Intl.DateTimeFormat("en-us", {month: "long"}).format(searchDate),//monthLabel(month),
      icon: ArrowDownRight,
      color: "text-[#d94c5c]",
      background: "bg-[#fce8eb]",
    },
    {
      label: "Largest Expense",
      value: 5_000,//formatMoney(largest),
      note: Intl.DateTimeFormat("en-us", {month: "long"}).format(searchDate),//monthLabel(month),
      icon: TrendingUp,
      color: "text-[#c58627]",
      background: "bg-[#fff3dc]",
    },
    {
      label: "Most-Spent Category",
      value: "Housing",//total > 0 ? topCategory.name : "No expenses",
      note: Intl.DateTimeFormat("en-us", {month: "long"}).format(searchDate),//total > 0 ? formatMoney(topCategory.amount) : monthLabel(month),
      icon: Tags,
      color: "text-[#8246c8]",
      background: "bg-[#f0e7fc]",
    },
    {
      label: "Previous Month",
      value: 999_999,//formatMoney(priorTotal),
      note: Intl.DateTimeFormat("en-us", {month: "long"}).format(searchDate),//monthLabel(previousMonth(month)),
      icon: CalendarDays,
      color: "text-[#3173c9]",
      background: "bg-[#e8f1ff]",
    },
  ];

  return (
    <section className="space-y-6">
      {/* Heading */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#123c35]">Expenses</h1>
          <p className="mt-2 text-sm text-[#4e7069]">
            View and manage your expenses and spending categories.
          </p>
        </div>
        <div className="mr-6 text-center">
          <p className="mb-1 text-xs text-[#4e7069]">
            Month
          </p>

          <p className="rounded-lg bg-white px-3 py-1 text-sm text-[#17324d]">
            {new Intl.DateTimeFormat("en-US", {
              month: "long",
              year: "numeric",
            }).format(new Date())}
          </p>
            {/* <input //this shouldn't be an input should it?
            id="expense-month"
            type="month"
            value={new Intl.DateTimeFormat("sv-SE", {year: "numeric", month: "numeric"}).format(searchDate)}
            min="1900-01"
            max="9998-12"
            onChange={(event) => {
              const date = event.target.value.split("-");
              if (/^\d{4}-\d{2}$/.test(event.target.value))
                {
                  setSearchDate(new Date(Number(date[0]), Number(date[1]) - 1));
                }
            }}
            className="rounded-lg border border-[#dce7e2] bg-white px-3 py-2 text-sm text-[#17324d] focus:outline-2 focus:outline-[#3f8068]"
          /> */}
        </div>
      </div>
      {/* Top cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="rounded-xl border border-[#dce7e2] bg-white p-5"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm text-[#4e7069]">{card.label}</p>
                  <p className="mt-3 break-words text-2xl font-bold text-[#17324d]">
                    {card.value}
                  </p>
                  <p className="mt-2 text-xs text-[#7185a1]">{card.note}</p>
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
      <div className="grid items-start gap-4 xl:grid-cols-[minmax(0,2fr)_minmax(300px,1fr)]">
        <div className="min-w-0">
          <ExpenseList
            //transactions={expenses}
            searchDate = {searchDate}
            setSearchDate={setSearchDateWrapper}
          />
        </div>
        <SpendingByCategory
          periodLabel={Intl.DateTimeFormat("en-us", {month: "long", year: "numeric"}).format(searchDate)}
        />
      </div>
    </section>
  );
}
