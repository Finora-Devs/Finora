import {
  ArrowDown,
  ArrowUp,
  CalendarDays,
  Ellipsis,
  Plus,
  Search,
  Info,
} from "lucide-react";

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
            {/* Heading and action buttons */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-5">
                <h2 className="text-xl font-semibold text-[#17324d]">
                    All Transactions
                </h2>

                <div className="flex flex-wrap gap-3">
                    <button
                        type="button"
                        className="inline-flex items-center gap-2 rounded-lg bg-[#008f73] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#00765f]"
                    >
                        <Plus className="h-4 w-4" />
                        Add Income
                    </button>

                    <button
                        type="button"
                        className="inline-flex items-center gap-2 rounded-lg bg-[#3f8068] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#326b56]"
                    >
                        <Plus className="h-4 w-4" />
                        Add Expense
                    </button>
                </div>
            </div>

            {/* Search, sorting, and controls */}
            <div className="flex flex-wrap items-center gap-3 px-5 pb-4">
                <div className="relative min-w-[220px] flex-1">
                    <label htmlFor="transaction-search" className="sr-only">
                        Search transactions
                    </label>

                    <Search
                        aria-hidden="true"
                        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7185a1]"
                    />

                    <input
                        id="transaction-search"
                        type="search"
                        placeholder="Search transactions..."
                        className="w-full rounded-lg border border-[#dce7e2] bg-[#f7faf8] py-2.5 pl-10 pr-3 text-sm text-[#17324d] placeholder:text-[#7185a1] focus:border-[#3f8068] focus:outline-none"
                    />
                </div>

                <label htmlFor="transaction-sort" className="text-sm text-[#607394]">
                    Sort by
                </label>

                <select
                    id="transaction-sort"
                    defaultValue="date"
                    className="rounded-lg border border-[#dce7e2] bg-white px-3 py-2.5 text-sm text-[#17324d]"
                >
                    <option value="date">Date</option>
                    <option value="name">Name</option>
                    <option value="amount">Amount</option>
                    <option value="category">Category</option>
                    <option value="frequency">Frequency</option>
                </select>

                <div className="flex overflow-hidden rounded-lg border border-[#dce7e2]">
                    <button
                        type="button"
                        aria-label="Sort descending"
                        className="bg-[#e5f3ec] px-3 py-2.5 text-[#28664f]"
                    >
                        <ArrowDown className="h-4 w-4" />
                    </button>
                    <button
                        type="button"
                        aria-label="Sort ascending"
                        className="border-l border-[#dce7e2] px-3 py-2.5 text-[#7185a1] hover:bg-[#f7faf8]"
                    >
                        <ArrowUp className="h-4 w-4" />
                    </button>
                </div>

                <div className="flex items-center gap-2 rounded-lg border border-[#dce7e2] bg-white px-3 py-2.5 text-sm text-[#17324d]">
                    <CalendarDays aria-hidden="true" className="h-4 w-4 text-[#607394]" />
                    <span>Sep 1, 2026 – Sep 30, 2026</span>
                </div>
            </div>

            {/* Include and exclude controls */}
            <div className="flex flex-wrap items-center gap-3 px-5 pb-5">
                <label htmlFor="transaction-category" className="text-sm text-[#607394]">
                    Category
                </label>

                <select
                    id="transaction-category"
                    defaultValue="all"
                    className="min-w-[180px] rounded-lg border border-[#dce7e2] bg-white px-3 py-2.5 text-sm text-[#17324d]"
                >
                    <option value="all">All Categories</option>
                    <option value="food">Food</option>
                    <option value="housing">Housing</option>
                    <option value="transportation">Transportation</option>
                    <option value="tuition">Tuition</option>
                    <option value="entertainment">Entertainment</option>
                    <option value="utilities">Utilities</option>
                    <option value="subscriptions">Subscriptions</option>
                    <option value="employment">Employment</option>
                    <option value="other">Other</option>
                </select>

                <div className="flex items-center gap-2 text-sm text-[#7185a1]">
                    <span>Include / Exclude</span>

                    <div className="group relative">
                        <button
                            type="button"
                            aria-label="How Include and Exclude work"
                            aria-describedby="include-exclude-help"
                            className="flex rounded-full text-[#7185a1] hover:text-[#28664f] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3f8068]"
                        >
                            <Info aria-hidden="true" className="h-4 w-4" />
                        </button>

                        <div
                            id="include-exclude-help"
                            role="tooltip"
                            className="pointer-events-none absolute left-1/2 top-full z-40 mt-2 hidden w-64 -translate-x-1/2 rounded-lg border border-[#dce7e2] bg-white p-3 text-left text-xs leading-5 text-[#17324d] shadow-lg group-hover:block group-focus-within:block"
                        >
                            <p>
                                <strong>Include:</strong> Show transactions in the selected category.
                            </p>
                            <p className="mt-1">
                                <strong>Exclude:</strong> Hide transactions in the selected category
                                and show the others.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex overflow-hidden rounded-lg border border-[#dce7e2]">
                    <button
                        type="button"
                        className="bg-[#e5f3ec] px-4 py-2.5 text-sm font-medium text-[#28664f]"
                    >
                        Include
                    </button>
                    <button
                        type="button"
                        className="border-l border-[#dce7e2] bg-white px-4 py-2.5 text-sm font-medium text-[#607394] hover:bg-[#f7faf8]"
                    >
                        Exclude
                    </button>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full min-w-[760px] text-left text-sm">
                    <thead className="bg-[#f7faf8] text-[#4e7069]">
                        <tr>
                            <th scope="col" className="px-5 py-3 font-semibold">
                                Date
                            </th>
                            <th scope="col" className="px-5 py-3 font-semibold">
                                Name
                            </th>
                            <th scope="col" className="px-5 py-3 font-semibold">
                                Category
                            </th>
                            <th scope="col" className="px-5 py-3 font-semibold">
                                Type
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
                                    {/* Date */}
                                    <td className="whitespace-nowrap px-5 py-4 text-[#7185a1]">
                                        {transaction.date}
                                    </td>

                                    {/* Name */}
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

                                            <span className="whitespace-nowrap font-medium text-[#17324d]">
                                                {transaction.name}
                                            </span>
                                        </div>
                                    </td>

                                    {/* Category */}
                                    <td className="px-5 py-4 text-[#607394]">
                                        {transaction.category}
                                    </td>

                                    {/* Type */}
                                    <td
                                        className={`px-5 py-4 font-medium ${isIncome ? "text-[#16834b]" : "text-[#e14b59]"
                                            }`}
                                    >
                                        {isIncome ? "Income" : "Expense"}
                                    </td>

                                    {/* Frequency */}
                                    <td className="whitespace-nowrap px-5 py-4 text-[#7185a1]">
                                        {transaction.frequency}
                                    </td>

                                    {/* Amount */}
                                    <td
                                        className={`whitespace-nowrap px-5 py-4 text-right font-semibold ${isIncome ? "text-[#16834b]" : "text-[#e14b59]"
                                            }`}
                                    >
                                        {isIncome ? "+" : "−"}$
                                        {transaction.amount.toLocaleString("en-US", {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                        })}
                                    </td>

                                    {/* Actions */}
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