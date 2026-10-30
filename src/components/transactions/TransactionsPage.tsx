'use client';
import {
  ArrowDownRight,
  ArrowUpRight,
  List,
  Plus,
  Wallet,
} from "lucide-react";
import TransactionList from "./TransactionList";
import SpendingByCategory from "./SpendingByCategory";
import { useTransactionContext } from "@/app/(protected)/context";
import { formatMoney } from "@/lib/types_and_helpers";
import { useState } from "react";


export default function TransactionsPage() {
  const { transactionsArr } = useTransactionContext();
  const [searchDate, setSearchDate] = useState(new Date());
  const setSearchDateWrapper = (newDate: Date) => setSearchDate(newDate);

    const currentMonthLabel = searchDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const totalTransactions = transactionsArr.length;
  const totalIncome = transactionsArr.reduce<number>(
    (total, transaction) => {
      if (
        transaction.categories.transaction_type === "income"
      ) {
        return total + Number(transaction.amount);
      }

      return total;
    },
    0
  );

  const totalExpenses = transactionsArr.reduce<number>(
    (total, transaction) => {
      if (
        transaction.categories.transaction_type === "expense"
      ) {
        return total + Number(transaction.amount);
      }

      return total;
    },
    0
  );

const netAmount = totalIncome - totalExpenses;

const summaryCards = [
  {
    label: "Total Transactions",
    value: totalTransactions.toLocaleString("en-US"),
    note: currentMonthLabel,
    icon: List,
    color: "text-[#3f8068]",
    background: "bg-[#e5f3ec]",
  },
  {
    label: "Total Income",
    value: formatMoney(totalIncome),
    note: currentMonthLabel,
    icon: ArrowUpRight,
    color: "text-[#16834b]",
    background: "bg-[#e5f3ec]",
  },
  {
    label: "Total Expenses",
    value: formatMoney(totalExpenses),
    note: currentMonthLabel,
    icon: ArrowDownRight,
    color: "text-[#d94c5c]",
    background: "bg-[#fce8eb]",
  },
  {
    label: "Net Amount",
    value: formatMoney(netAmount),
    note: currentMonthLabel,
    icon: Wallet,
    color: "text-[#3173c9]",
    background: "bg-[#e8f1ff]",
  },
];

  return (
    <section className="space-y-6">
      {/*Heading*/}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#123c35]">Transactions</h1>
          <p className="mt-2 text-sm text-[#4e7069]">
            View and manage your income and expenses.
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
      </div>

      {/* Top cards */}
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
    <TransactionList 
      searchDate = {searchDate}
      setSearchDate={setSearchDateWrapper}
      />
  </div>

  <SpendingByCategory />
</div>
    </section>
  );
}