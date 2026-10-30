'use client';
import { ArrowUpRight, BriefcaseBusiness, GraduationCap, Wallet } from "lucide-react";
import { useState } from "react";
import IncomeList from "./IncomeList";
import IncomeBySource from "./IncomeBySource";
import { useTransactionContext } from "@/app/(protected)/context";
import { formatMoney } from "./incomeData";;


export default function IncomePage() {

  const { transactionsArr } = useTransactionContext();

  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${String(
    now.getMonth() + 1
  ).padStart(2, "0")}`;

  const previousDate = new Date(
    now.getFullYear(),
    now.getMonth() - 1,
    1
  );
  const previousMonth = `${previousDate.getFullYear()}-${String(
    previousDate.getMonth() + 1
  ).padStart(2, "0")}`;

  const currentMonthLabel = new Date(
    now.getFullYear(),
    now.getMonth(),
    1
  ).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const previousMonthLabel = previousDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const incomeTransactions = transactionsArr.filter(
    (transaction) =>
      transaction.categories.transaction_type === "income" &&
      transaction.transaction_date.slice(0, 7) === currentMonth
  );

  const previousMonthTransactions = transactionsArr.filter(
    (transaction) =>
      transaction.categories.transaction_type === "income" &&
      transaction.transaction_date.slice(0, 7) === previousMonth
  );

  const totalIncome = incomeTransactions.reduce(
    (sum, transaction) => sum + Number(transaction.amount),
    0
  );

  const jobIncome = incomeTransactions
    .filter((transaction) => transaction.categories.name === "Employment")
    .reduce((sum, transaction) => sum + Number(transaction.amount), 0);

  const studentAid = incomeTransactions
    .filter((transaction) =>
      ["Scholarships", "Financial Aid"].includes(
        transaction.categories.name
      )
    )
    .reduce((sum, transaction) => sum + Number(transaction.amount), 0);

  const lastMonthIncome = previousMonthTransactions.reduce(
    (sum, transaction) => sum + Number(transaction.amount),
    0
  );

  const summaryCards = [
    { label: "Total Income", value: totalIncome, note: currentMonthLabel, icon: Wallet, color: "text-[#16834b]", background: "bg-[#e5f3ec]" },
    { label: "Job Income", value: jobIncome, note: currentMonthLabel, icon: BriefcaseBusiness, color: "text-[#3173c9]", background: "bg-[#e8f1ff]" },
    { label: "Financial Aid / Scholarships", value: studentAid, note: currentMonthLabel, icon: GraduationCap, color: "text-[#c68a00]", background: "bg-[#fff5d9]" },
    { label: "Last Month’s Income", value: lastMonthIncome, note: previousMonthLabel, icon: ArrowUpRight, color: "text-[#8246c8]", background: "bg-[#f0e7fc]" },
  ];

  const [searchDate, setSearch] = useState(new Date());
  const setSearchWrapper = (newDate: Date) => setSearch(newDate);

  return (
    <section className="space-y-6">
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
            {/* <input
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
        <div className="text-center sm:mr-4">
          <p className="mb-1 text-xs text-[#4e7069]">
            Month
          </p>

          <p className="rounded-lg bg-white px-3 py-2 text-sm text-[#17324d]">
            {new Intl.DateTimeFormat("en-US", {
              month: "long",
              year: "numeric",
            }).format(new Date())}
          </p>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="rounded-xl border border-[#dce7e2] bg-white p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm text-[#4e7069]">{card.label}</p>
                  <p className="mt-3 text-2xl font-bold text-[#17324d]">{formatMoney(card.value)}</p>
                  <p className="mt-2 text-xs text-[#7185a1]">{card.note}</p>
                </div>
                <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${card.background}`}>
                  <Icon aria-hidden="true" className={`h-5 w-5 ${card.color}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="grid items-start gap-4 xl:grid-cols-[minmax(0,2fr)_minmax(300px,1fr)]">
        <div className="min-w-0">
          <IncomeList 
            searchDate = {searchDate}
            setSearchDate={setSearchWrapper}/></div>
          <IncomeBySource />
        </div>
      </section>
  );
}
