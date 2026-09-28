import { ArrowDown, ArrowUp, Ellipsis } from "lucide-react";

type Transaction = {
    id: string;
    name: string;
    category: string;
    date: string;
    frequency: string;
    amount: number;
    type: "income" | "expense";
};

const transactions: Transaction[] = [
    {
        id: "1",
        name: "Paycheck",
        category: "Employment",
        date: "Sep 8, 2026",
        frequency: "Biweekly",
        amount: 612.5,
        type: "income",
    },
    {
        id: "2",
        name: "Rent",
        category: "Housing",
        date: "Sep 1, 2026",
        frequency: "Monthly",
        amount: 400,
        type: "expense",
    },
    {
        id: "3",
        name: "Shell",
        category: "Transportation",
        date: "Sep 7, 2026",
        frequency: "Just Once",
        amount: 38.2,
        type: "expense",
    },
    {
        id: "4",
        name: "Amazon",
        category: "Other",
        date: "Sep 9, 2026",
        frequency: "Just Once",
        amount: 34.99,
        type: "expense",
    },
    {
        id: "5",
        name: "Chick-fil-A",
        category: "Food",
        date: "Sep 10, 2026",
        frequency: "Just Once",
        amount: 12.45,
        type: "expense",
    },
];

export default function TransactionList() {
    return (
        <section className="overflow-hidden rounded-xl border border-[#dce7e2] bg-white">
            {/* List heading and visual filter controls */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#e5ebe8] p-5">
                <div>
                    <h2 className="text-lg font-semibold text-[#17324d]">
                        All Transactions
                    </h2>
                    <p className="mt-1 text-sm text-[#4e7069]">
                        Review your income and expenses.
                    </p>
                </div>

                <div className="flex flex-wrap gap-2">
                    <select
                        aria-label="Filter transactions by type"
                        defaultValue="all"
                        className="rounded-lg border border-[#dce7e2] bg-white px-3 py-2 text-sm text-[#17324d]"
                    >
                        <option value="all">All Types</option>
                        <option value="income">Income</option>
                        <option value="expense">Expenses</option>
                    </select>

                    <select
                        aria-label="Filter transactions by category"
                        defaultValue="all"
                        className="rounded-lg border border-[#dce7e2] bg-white px-3 py-2 text-sm text-[#17324d]"
                    >
                        <option value="all">All Categories</option>
                        <option value="food">Food</option>
                        <option value="housing">Housing</option>
                        <option value="transportation">Transportation</option>
                        <option value="employment">Employment</option>
                        <option value="other">Other</option>
                    </select>

                    <select
                        aria-label="Sort transactions"
                        defaultValue="newest"
                        className="rounded-lg border border-[#dce7e2] bg-white px-3 py-2 text-sm text-[#17324d]"
                    >
                        <option value="newest">Newest First</option>
                        <option value="oldest">Oldest First</option>
                        <option value="name">Name</option>
                        <option value="amount">Amount</option>
                    </select>
                </div>
            </div>

            {/* Horizontal scrolling keeps the columns readable on small screens */}
            <div className="overflow-x-auto">
                <table className="w-full min-w-[760px] text-left text-sm">
                    <thead className="bg-[#f7faf8] text-[#4e7069]">
                        <tr>
                            <th scope="col" className="px-5 py-3 font-semibold">
                                Transaction
                            </th>
                            <th scope="col" className="px-5 py-3 font-semibold">
                                Category
                            </th>
                            <th scope="col" className="px-5 py-3 font-semibold">
                                Date
                            </th>
                            <th scope="col" className="px-5 py-3 font-semibold">
                                Frequency
                            </th>
                            <th scope="col" className="px-5 py-3 text-right font-semibold">
                                Amount
                            </th>
                            <th scope="col" className="px-5 py-3 text-right font-semibold">
                                <span className="sr-only">Actions</span>
                            </th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-[#e5ebe8]">
                        {transactions.map((transaction) => {
                            const isIncome = transaction.type === "income";

                            return (
                                <tr key={transaction.id} className="hover:bg-[#f8fbf9]">
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-3">
                                            <span
                                                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${isIncome
                                                        ? "bg-[#e5f3ec] text-[#16834b]"
                                                        : "bg-[#fce8eb] text-[#d94c5c]"
                                                    }`}
                                            >
                                                {isIncome ? (
                                                    <ArrowDown className="h-4 w-4" />
                                                ) : (
                                                    <ArrowUp className="h-4 w-4" />
                                                )}
                                            </span>
                                            <span className="font-medium text-[#17324d]">
                                                {transaction.name}
                                            </span>
                                        </div>
                                    </td>

                                    <td className="px-5 py-4 text-[#4e7069]">
                                        {transaction.category}
                                    </td>
                                    <td className="px-5 py-4 text-[#4e7069]">
                                        {transaction.date}
                                    </td>
                                    <td className="px-5 py-4 text-[#4e7069]">
                                        {transaction.frequency}
                                    </td>
                                    <td
                                        className={`px-5 py-4 text-right font-semibold ${isIncome ? "text-[#16834b]" : "text-[#17324d]"
                                            }`}
                                    >
                                        {isIncome ? "+" : "−"}$
                                        {transaction.amount.toLocaleString("en-US", {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                        })}
                                    </td>
                                    <td className="px-5 py-4 text-right">
                                        <button
                                            type="button"
                                            aria-label={`More options for ${transaction.name}`}
                                            className="rounded-lg p-2 text-[#4e7069] hover:bg-[#e5efeb]"
                                        >
                                            <Ellipsis className="h-5 w-5" />
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            <div className="border-t border-[#e5ebe8] px-5 py-4 text-sm text-[#4e7069]">
                Showing {transactions.length} sample transactions
            </div>
        </section>
    );
}