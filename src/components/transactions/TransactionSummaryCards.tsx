"use client";

import {
    ArrowDown,
    ArrowUp,
    CalendarDays,
    Ellipsis,
    Plus,
    Search,
    Info,
} from "lucide-react";
import { useState } from "react";

type TransactionSummaryCardsProps = {
    totalTransactions: number;
    totalIncome: number;
    totalExpenses: number;
    totalAmount: number;
};

export default function TransactionSummaryCards({
    totalTransactions,
    totalIncome,
    totalExpenses,
    totalAmount
}: TransactionSummaryCardsProps) {
    const summaryCard = [
        {
            title: "Total Transactions",
            value: totalTransactions.toString(),
            icon: <CalendarDays className="h-5 w-5" />,
            background: "bg-[#eef7f4]",
            color: "text-[#1e8e6d]"
        },
        {
            title: "Total Income",
            value: totalIncome.toString(),
            icon: <ArrowUp className="h-5 w-5" />,
            background: "bg-[#eafaf2]",
            color: "text-[#1a9a61]"
        },
        {
            title: "Total Expenses",
            value: totalExpenses.toString(),
            icon: <ArrowDown className="h-5 w-5" />,
            background: "bg-[#ffe9ea]",
            color: "text-[#d14b5c]"
        },
        {
            title: "Net Amount",
            value: totalAmount.toString(),
            icon: <Info className="h-5 w-5" />,
            background: "bg-[#edf5ff]",
            color: "text-[#3b82f6]"
        }
    ];

    return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {summaryCard.map((card) => {
        const Icon = () => card.icon;

        return (
          <div
            key={card.title}
            className="rounded-xl border border-[#dce7e2] bg-white p-5"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm text-[#4e7069]">
                  {card.title}
                </p>

                <p className="mt-3 text-2xl font-bold text-[#17324d]">
                  {card.value}
                </p>
              </div>

              <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${card.background}`}
              >
                {card.icon}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}