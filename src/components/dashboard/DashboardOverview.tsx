import Link from "next/link";
import {
    ArrowDownRight,
    ArrowRight,
    ArrowUpRight,
    Award,
    BanknoteArrowUp,
    BookOpen,
    Briefcase,
    BriefcaseBusiness,
    Car,
    Crosshair,
    DollarSign,
    Faucet,
    Gamepad2,
    House,
    Laptop,
    LucideIcon,
    ShoppingBag,
    Target,
    University,
    Utensils,
} from "lucide-react";

import { expenseCategories, incomeCategories, formatMoney, getCategoryName, getIcon, sortBy, categoryBreakdown } from "@/lib/types_and_helpers";
import { useCategoryBudgetContext, useMonthlyBudgetContext, useSavingGoalsContext, useTransactionContext } from "@/app/(protected)/context";
import { getBudgetPercentage, getBudgetStatus, getCategorySpending, getMonthlySpending, getRemainingBudget } from "@/lib/budgetHelpers";
import { isActive } from "@/lib/GoalHelpers";
import { getTotalOfType } from "@/lib/transactionHelpers";


const spendingFigures: Record<
    string,
    { amount: string; percent: number; start: number }
> = {
    Housing: { amount: "$518.09", percent: 35, start: 0 },
    Food: { amount: "$266.45", percent: 18, start: 35 },
    Transportation: { amount: "$177.63", percent: 12, start: 53 },
    Tuition: { amount: "$148.03", percent: 10, start: 65 },
    Entertainment: { amount: "$118.42", percent: 8, start: 75 },
    Utilities: { amount: "$74.01", percent: 5, start: 83 },
    Subscriptions: { amount: "$74.01", percent: 5, start: 88 },
    Other: { amount: "$103.61", percent: 7, start: 93 },
};

// Reuse the project's existing category names and colors.
const spendingCategories = expenseCategories.map((category) => ({
    ...category,
    ...(spendingFigures[category.name] ?? {
        amount: "$0.00",
        percent: 0,
        start: 0,
    }),
}));

// Sample recent transactions. 
const recentTransactions = [
    {
        id: "food",
        name: "Chick-fil-A",
        category: "Food",
        date: "Nov 12, 2026",
        amount: "-$12.45",
        income: false,
        icon: Utensils,
        color: "text-[#16834b]",
        background: "bg-[#e5f3ec]",
    },
    {
        id: "shopping",
        name: "Amazon",
        category: "Other",
        date: "Nov 11, 2026",
        amount: "-$34.99",
        income: false,
        icon: ShoppingBag,
        color: "text-[#3173c9]",
        background: "bg-[#e8f1ff]",
    },
    {
        id: "paycheck",
        name: "Paycheck",
        category: "Employment",
        date: "Nov 10, 2026",
        amount: "+$612.50",
        income: true,
        icon: ArrowUpRight,
        color: "text-[#16834b]",
        background: "bg-[#e5f3ec]",
    },
    {
        id: "gas",
        name: "Shell",
        category: "Transportation",
        date: "Nov 9, 2026",
        amount: "-$38.20",
        income: false,
        icon: Car,
        color: "text-[#d94c5c]",
        background: "bg-[#fce8eb]",
    },
    {
        id: "rent",
        name: "Rent",
        category: "Housing",
        date: "Nov 1, 2026",
        amount: "-$400.00",
        income: false,
        icon: House,
        color: "text-[#8246c8]",
        background: "bg-[#f0e7fc]",
    },
];

// Sample category budget progress.
const categoryBudgets = [
    {
        name: "Food",
        amounts: "$266.45 / $350.00",
        percent: 76,
        status: "On track",
        barColor: "bg-[#3f8068]",   //under color
        textColor: "text-[#28664f]", // under color
        icon: Utensils,
    },
    {
        name: "Transportation",
        amounts: "$177.63 / $200.00",
        percent: 89,
        status: "Near limit",
        barColor: "bg-[#e5ab32]",   //aproaching color
        textColor: "text-[#9a6500]", //aproaching color
        icon: Car,
    },
    {
        name: "Entertainment",
        amounts: "$118.42 / $150.00",
        percent: 79,
        status: "On track",
        barColor: "bg-[#3f8068]",
        textColor: "text-[#28664f]",
        icon: Gamepad2,
    },
];

// Sample goal previews 
const savingsGoals = [
    {
        id: "laptop",
        name: "New Laptop",
        amounts: "$600.00 / $1,200.00",
        percent: 50,
        highestPriority: true,
        icon: Laptop,
    },
    {
        id: "textbooks",
        name: "Next Semester Textbooks",
        amounts: "$150.00 / $300.00",
        percent: 50,
        highestPriority: false,
        icon: BookOpen,
    },
];

function SpendingBreakdown() {

    const {transactionsArr} = useTransactionContext();
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth()-1);

    //all transactions in month.
    const monthsTransactions = transactionsArr.filter((t) => 
    {
        const tDate = new Date(`${t.transaction_date}T00:00:00`);

        return lastMonth.getMonth() === tDate.getMonth() && lastMonth.getFullYear() === tDate.getFullYear();
    })

    const categories = categoryBreakdown(monthsTransactions);
    let cumulativePercent = 0;


    return (
        <section className="min-w-0 rounded-xl border border-[#dce7e2] bg-white p-5">
            {/* Panel heading and sample reporting period */}
            <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-lg font-semibold text-[#17324d]">
                    Spending Breakdown
                </h2>

                <span className="rounded-lg bg-[#f3f7f5] px-3 py-1 text-xs text-[#4e7069]">
                    {new Intl.DateTimeFormat("en-US", {month: "long", year: "numeric"}).format(lastMonth)}
                </span>
            </div>

            <p className="mt-1 text-xs text-[#4e7069]">
                Spending for previous month
            </p>

            <div className="mt-6 flex flex-col items-center gap-6 2xl:flex-row">
                {/* Decorative donut chart; values are also listed in the legend */}
                <div
                    aria-hidden="true"
                    className="relative h-48 w-48 shrink-0"
                >
                    <svg
                        viewBox="0 0 120 120"
                        className="h-full w-full -rotate-90"
                    >
                        <circle
                            cx="60"
                            cy="60"
                            r="45"
                            fill="none"
                            stroke="#edf3ef"
                            strokeWidth="20"
                        />

                        {categories.map((category) => 
                        {
                            const offset = cumulativePercent;
                            cumulativePercent+= category.percent;
                            return (
                                <circle
                                    key={category.value}
                                    cx="60"
                                    cy="60"
                                    r="45"
                                    fill="none"
                                    stroke={category.textColor}
                                    strokeWidth="20"
                                    pathLength={100}
                                    strokeDasharray={`${category.percent} ${100 - category.percent}`}
                                    strokeDashoffset={`${-offset}`}
                                 />
                                )
                        })}
                    </svg>

                    {/* Donut center label */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-lg font-bold text-[#17324d]">
                            {formatMoney(getTotalOfType("expense", monthsTransactions))}
                        </span>

                        <span className="mt-1 text-xs text-[#4e7069]">
                            {`${new Intl.DateTimeFormat("en-US", {month: "long"}).format(lastMonth)} spending`}
                        </span>
                    </div>
                </div>

                {/* Category legend */}
                <ul className="w-full min-w-0 space-y-3">
                    {categories.map((category) => (
                        <li
                            key={category.value}
                            className="grid grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-3 text-xs sm:text-sm"
                        >
                            <span className="flex min-w-0 items-center gap-2 text-[#17324d]">
                                <span
                                    aria-hidden="true"
                                    className="h-2.5 w-2.5 shrink-0 rounded-full"
                                    style={{ backgroundColor: category.textColor }}
                                />

                                <span className="break-words">
                                    {category.name}
                                </span>
                            </span>

                            <span className="text-right text-[#4e7069]">
                                {Math.round(category.percent)}%
                            </span>

                            <span className="text-right font-medium tabular-nums text-[#17324d]">
                                {formatMoney(category.amount)}
                            </span>
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
}

function RecentTransactions() {

    const {transactionsArr} = useTransactionContext();

    const visibleTransactions = sortBy(undefined, undefined, transactionsArr).slice(0,5);

    return (
        <section className="min-w-0 rounded-xl border border-[#dce7e2] bg-white p-5">
            {/* Panel heading and related page link */}
            <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-lg font-semibold text-[#17324d]">
                    Recent Transactions
                </h2>

                <Link
                    href="/transactions"
                    className="inline-flex min-h-11 items-center gap-2 text-sm text-[#3173c9] hover:underline"
                >
                    View All
                    <ArrowRight aria-hidden="true" className="h-4 w-4" />
                </Link>
            </div>

            {/* Transaction previews */}
            <ul className="mt-2 divide-y divide-[#dce7e2]">
                {visibleTransactions.map((transaction) => {
                    const Icon = getIcon(transaction.category_id);

                    const isIncome = transaction.categories.transaction_type === "income";
                    const transactionDate = new Date(transaction.transaction_date);

                    const bgColor = [...incomeCategories, ...expenseCategories][transaction.category_id-1]?.backgroundColor ?? "#3aa561";
                    const textColor = [...incomeCategories, ...expenseCategories][transaction.category_id-1]?.textColor ?? "#3aa561";

                    return (
                        <li
                            key={transaction.id}
                            className="flex items-center gap-3 py-4"
                        >
                            <div
                                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full`}
                                style={{backgroundColor: bgColor}}
                            >
                                <Icon
                                    aria-hidden="true"
                                    className={`h-5 w-5`}
                                    style={{color: textColor}}
                                />
                            </div>

                            <div className="min-w-0 flex-1">
                                <p className="break-words text-sm font-medium text-[#17324d]">
                                    {transaction.name}
                                </p>

                                <p className="mt-1 text-xs text-[#4e7069]">
                                    {transaction.categories.name}
                                </p>

                                <p className="mt-1 text-xs text-[#687b8e]">
                                    {new Intl.DateTimeFormat("en-US", {month: "short", day: "numeric", year: "numeric"}).format(transactionDate)} {/* use new intl date time format */}
                                </p>
                            </div>

                            <div className="shrink-0 text-right">
                                <p
                                    className={`text-sm font-semibold tabular-nums ${isIncome
                                            ? "text-[#16834b]"
                                            : "text-[#e14b59]"
                                        }`}
                                >
                                    {`${isIncome ? "+" : "-"}${formatMoney(transaction.amount)}`}
                                </p>

                                <span className="mt-1 inline-flex items-center gap-1 text-xs text-[#4e7069]">
                                    {isIncome ? (
                                        <ArrowUpRight
                                            aria-hidden="true"
                                            className="h-3 w-3"
                                        />
                                    ) : (
                                        <ArrowDownRight
                                            aria-hidden="true"
                                            className="h-3 w-3"
                                        />
                                    )}

                                    {isIncome ? "Income" : "Expense"}
                                </span>
                            </div>
                        </li>
                    );
                })}
            </ul>
        </section>
    );
}

function BudgetStatus() {

    const {monthlyBudget} = useMonthlyBudgetContext();
    const {categoryBudget} = useCategoryBudgetContext();
    const {transactionsArr} = useTransactionContext();
    const currentDate = new Date(0);

    getMonthlySpending(transactionsArr, currentDate.getMonth(), currentDate.getFullYear());

    return (
        <section className="min-w-0 rounded-xl border border-[#dce7e2] bg-white p-5">
            {/* Panel heading and related page link */}
            <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-lg font-semibold text-[#17324d]">
                    Budget Status
                </h2>

                <Link
                    href="/budget"
                    className="inline-flex min-h-11 items-center gap-2 text-sm text-[#3173c9] hover:underline"
                >
                    View All
                    <ArrowRight aria-hidden="true" className="h-4 w-4" />
                </Link>
            </div>

            {/* Monthly budget overview */}
            <div className="mt-3 rounded-lg bg-[#f3f7f5] p-4">
                <p className="text-xs text-[#4e7069]">
                    Remaining Monthly Budget
                </p>

                <p className="mt-1 text-xl font-bold text-[#17324d]">
                    {monthlyBudget ? formatMoney(getRemainingBudget(getMonthlySpending(transactionsArr, monthlyBudget[0].month.getMonth(), monthlyBudget[0].month.getFullYear()), monthlyBudget[0].amount)) : "Loading..."}
                </p>

                <p className="mt-1 text-xs leading-5 text-[#4e7069]">
                    {monthlyBudget ? `${formatMoney(getMonthlySpending(transactionsArr, monthlyBudget[0].month.getMonth(), monthlyBudget[0].month.getFullYear()))} spent of a ${formatMoney(monthlyBudget[0].amount)} budget.` : "Loading..."}
                </p>
            </div>

            {/* Category budget previews */}
            <ul className="mt-5 space-y-5">
                {categoryBudget?.map((budget) => {
                    let Icon = getIcon(budget.categoryId); 

                    const spending = getCategorySpending(transactionsArr,budget.categoryId, budget.month.getMonth(), budget.month.getFullYear());
                    const percentage = getBudgetPercentage(spending, budget.amount);
                    const budgetStatus = getBudgetStatus(spending, budget.amount);

                    const barColor = budgetStatus === "under_budget" ? 
                                        "bg-[#3f8068]" : //under budget green
                                        budgetStatus === "approaching_budget" ?
                                            "bg-[#e5ab32]" : //approaching budget yellow
                                            "bg-[#d94c5c]"; //over budget red
                    const statusColor = budgetStatus === "under_budget" ? 
                                        "text-[#28664f]" : //under budget green
                                        budgetStatus === "approaching_budget" ?
                                            "text-[#9a6500]" : //approaching budget yellow
                                            "text-[#b53648]"; //over budget red

                    return (
                        <li key={budget.categoryId}>
                            <div className="flex flex-wrap items-center justify-between gap-2">
                                <span className="inline-flex items-center gap-2 text-sm text-[#17324d]">
                                    <Icon
                                        aria-hidden="true"
                                        className="h-4 w-4 shrink-0"
                                    />
                                    {getCategoryName(budget.categoryId)}
                                </span>

                                <span className="text-xs tabular-nums text-[#4e7069]">
                                    {formatMoney(budget.amount)}
                                </span>
                            </div>

                            <div
                                role="progressbar"
                                aria-label={`${getCategoryName(budget.categoryId)} budget used`}
                                aria-valuemin={0}
                                aria-valuemax={100}
                                aria-valuenow={percentage}
                                aria-valuetext={`${percentage}% used; ${budgetStatus}`}
                                className="mt-2 h-2.5 overflow-hidden rounded-full bg-[#e8eeeb]"
                            >
                                <div
                                    className={`h-full rounded-full ${barColor}`} //replace bg color
                                    style={{ width: `${percentage}%` }}
                                />
                            </div>

                            <div
                                className={`mt-1 flex justify-between gap-2 text-xs ${statusColor}`} //text color
                            >
                                <span>{budgetStatus}</span>
                                <span>{Math.round(percentage)}% used</span>
                            </div>
                        </li>
                    );
                })}
            </ul>
        </section>
    );
}

function SavingsGoals() {

    const {savingGoals} = useSavingGoalsContext();

    //only show the top five incomeplete goals.
    const visibleGoals = savingGoals.filter((goal) => isActive(goal)).sort((a,b) => a.priority - b.priority).slice(0,5);

    return (
        <section className="min-w-0 rounded-xl border border-[#dce7e2] bg-white p-5">
            {/* Panel heading and related page link */}
            <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-lg font-semibold text-[#17324d]">
                    Savings Goals
                </h2>

                <Link
                    href="/goals"
                    className="inline-flex min-h-11 items-center gap-2 text-sm text-[#3173c9] hover:underline"
                >
                    View All
                    <ArrowRight aria-hidden="true" className="h-4 w-4" />
                </Link>
            </div>

            {/* Goal previews */}
            <ul className="mt-2 divide-y divide-[#dce7e2]">
                {visibleGoals.map((goal) => {
                    const Icon = Crosshair;
                    const percent = Math.min(100, (goal.currentAmount / goal.targetAmount) * 100)

                    return (
                        <li key={goal.id} className="flex gap-3 py-5">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#e8f1ff]">
                                <Icon
                                    aria-hidden="true"
                                    className="h-5 w-5 text-[#3173c9]"
                                />
                            </div>

                            <div className="min-w-0 flex-1">
                                <p className="break-words text-sm font-medium text-[#17324d]">
                                    {goal.name}
                                </p>

                                {goal.priority === 1 && (
                                    <span className="mt-1 inline-block rounded-full bg-[#fff3dc] px-2 py-1 text-xs font-medium text-[#9a6500]">
                                        Highest priority
                                    </span>
                                )}

                                <p className="mt-2 text-xs tabular-nums text-[#4e7069]">
                                    {formatMoney(goal.currentAmount)}
                                </p>

                                <div
                                    role="progressbar"
                                    aria-label={`${goal.name} savings progress`}
                                    aria-valuemin={0}
                                    aria-valuemax={100}
                                    aria-valuenow={percent}
                                    className="mt-2 h-2.5 overflow-hidden rounded-full bg-[#e8eeeb]"
                                >
                                    <div
                                        className="h-full rounded-full bg-[#3f8068]"
                                        style={{ width: `${percent}%` }}
                                    />
                                </div>

                                <p className="mt-1 text-right text-xs text-[#4e7069]">
                                    {Math.round(percent)}% saved
                                </p>
                            </div>
                        </li>
                    );
                })}
            </ul>

            <p className="mt-3 text-xs leading-5 text-[#4e7069]">
                Monthly budget adjustments apply to your highest-priority goal.
            </p>
        </section>
    );
}

export default function DashboardOverview() {
    return (
        <div className="grid min-w-0 gap-4 xl:grid-cols-2">
            {/* Top row */}
            <SpendingBreakdown />
            <RecentTransactions />

            {/* Bottom row */}
            <BudgetStatus />
            <SavingsGoals />
        </div>
    );
}