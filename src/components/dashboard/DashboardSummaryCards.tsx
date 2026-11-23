"use client";
import Link from "next/link";
import {
    ArrowDownRight,
    ArrowRight,
    ArrowUpRight,
    Wallet,
    WalletCards,
} from "lucide-react";
import { useMonthlyBudgetContext, useRecurringTransactionContext, useTransactionContext } from "@/app/(protected)/context";
import {getNetSpending, getTotalOfType} from "@/lib/transactionHelpers"
import { getAmountDueThisMonth } from "@/lib/RecurringHelpers";
import { formatMoney } from "@/lib/types_and_helpers";
import { getMonthlySpending, getRemainingBudget } from "@/lib/budgetHelpers";



export default function DashboardSummaryCards() {
    const {transactionsArr} = useTransactionContext();
    const {recurringTransactions} = useRecurringTransactionContext();
    const {monthlyBudget} = useMonthlyBudgetContext();
    const TMPBalance = 1_000;

    const currentDate = new Date();
// Sample values for the UI
    const summaryCards = [
    {
        label: "Total Balance",
        value: formatMoney(TMPBalance + getNetSpending(transactionsArr)), //gets the user balance + their net change
        detail: `Projected month-end balance: ${formatMoney(TMPBalance + getNetSpending(transactionsArr) - getAmountDueThisMonth(recurringTransactions))}`, //get user balance + net change - the amount of money that will be spent on recurring transactions this month.
        href: "/transactions",
        linkLabel: "View transactions",
        icon: Wallet,
        color: "text-[#3f8068]",
        background: "bg-[#e5f3ec]",
    },
    {
        label: "Monthly Income",
        value: formatMoney(getTotalOfType("income", transactionsArr.filter((t) =>  //finds total income in current month and year.
            {
                const tDate = new Date (`${t.transaction_date}T00:00:00`);
                return tDate.getMonth() === currentDate.getMonth() && tDate.getFullYear() === currentDate.getFullYear();
            }))),
        detail: "Income recorded this month",
        href: "/income",
        linkLabel: "View income",
        icon: ArrowUpRight,
        color: "text-[#16834b]",
        background: "bg-[#e5f3ec]",
    },
    {
        label: "Monthly Expenses",
        value: formatMoney(getTotalOfType("expense", transactionsArr.filter((t) =>  //finds total expenses in current month and year.
            {
                const tDate = new Date (`${t.transaction_date}T00:00:00`);
                return tDate.getMonth() === currentDate.getMonth() && tDate.getFullYear() === currentDate.getFullYear();
            }))),
        detail: "Expenses recorded this month",
        href: "/expenses",
        linkLabel: "View expenses",
        icon: ArrowDownRight,
        color: "text-[#d94c5c]",
        background: "bg-[#fce8eb]",
    },
    {
        label: "Available to Spend",
        value: formatMoney(getRemainingBudget(getMonthlySpending(transactionsArr, currentDate.getMonth(), currentDate.getFullYear()),
                             monthlyBudget ? monthlyBudget[0].amount : 0) - getAmountDueThisMonth(recurringTransactions)),
        detail: "After reserving for upcoming expenses",
        href: "/recurring",
        linkLabel: "View upcoming expenses",
        icon: WalletCards,
        color: "text-[#3173c9]",
        background: "bg-[#e8f1ff]",
    },
];

    return (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {/* Dashboard summary cards */}
            {summaryCards.map((card) => {
                const Icon = card.icon;

                return (
                    <div
                        key={card.label}
                        className="flex min-w-0 flex-col rounded-xl border border-[#dce7e2] bg-white p-5"
                    >
                        {/* Card label, value, and icon */}
                        <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                                <h2 className="text-sm font-normal text-[#4e7069]">
                                    {card.label}
                                </h2>

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

                        {/* Supporting information */}
                        <p className="mt-3 text-xs leading-5 text-[#4e7069]">
                            {card.detail}
                        </p>

                        {/* Link to the related page */}
                        <div className="mt-auto pt-3">
                            <Link
                                href={card.href}
                                className="inline-flex min-h-11 items-center gap-2 rounded text-sm font-medium text-[#3173c9] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3173c9]"
                            >
                                {card.linkLabel}

                                <ArrowRight
                                    aria-hidden="true"
                                    className="h-4 w-4 shrink-0"
                                />
                            </Link>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}