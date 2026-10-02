import {
  ArrowDown,
  ArrowUp,
  CalendarDays,
  Ellipsis,
  Plus,
  Search,
  Info,
} from "lucide-react";

import { formatMoney, incomeCategories, incomeEntries } from "./incomeData";

export default function IncomeList() {
    return (
        <section className="overflow-hidden rounded-xl border border-[#dce7e2] bg-white">
            {/* Heading and action buttons */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-5">
                <h2 className="text-xl font-semibold text-[#17324d]">
                    All Income
                </h2>

                <div className="flex flex-wrap gap-3">
                    <button
                        type="button"
                        className="inline-flex items-center gap-2 rounded-lg bg-[#008f73] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#00765f]"
                    >
                        <Plus className="h-4 w-4" />
                        Add Income
                    </button>


                </div>
            </div>

            {/* Search, sorting, and controls */}
            <div className="flex flex-wrap items-center gap-3 px-5 pb-4">
                <div className="relative min-w-[220px] flex-1">
                    <label htmlFor="income-search" className="sr-only">
                        Search income sources
                    </label>

                    <Search
                        aria-hidden="true"
                        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7185a1]"
                    />

                    <input
                        id="income-search"
                        type="search"
                        placeholder="Search income sources..."
                        className="w-full rounded-lg border border-[#dce7e2] bg-[#f7faf8] py-2.5 pl-10 pr-3 text-sm text-[#17324d] placeholder:text-[#7185a1] focus:border-[#3f8068] focus:outline-none"
                    />
                </div>

                <label htmlFor="income-sort" className="text-sm text-[#607394]">
                    Sort by
                </label>

                <select
                    id="income-sort"
                    defaultValue="date"
                    className="rounded-lg border border-[#dce7e2] bg-white px-3 py-2.5 text-sm text-[#17324d]"
                >
                    <option value="date">Date</option>
                    <option value="name">Source</option>
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
                <label htmlFor="income-category" className="text-sm text-[#607394]">
                    Source
                </label>

                <select
                    id="income-category"
                    defaultValue="all"
                    className="min-w-[180px] rounded-lg border border-[#dce7e2] bg-white px-3 py-2.5 text-sm text-[#17324d]"
                >
                    <option value="all">All Sources</option>
                    {incomeCategories.map((category) => (
                        <option key={category.name} value={category.name}>{category.name}</option>
                    ))}
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
                                <strong>Include:</strong> Show income in the selected source category.
                            </p>
                            <p className="mt-1">
                                <strong>Exclude:</strong> Hide income in the selected source category
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
                <table className="w-full min-w-[700px] text-left text-sm">
                    <thead className="bg-[#f7faf8] text-[#4e7069]">
                        <tr>
                            <th scope="col" className="px-5 py-3 font-semibold">
                                Date
                            </th>
                            <th scope="col" className="px-5 py-3 font-semibold">
                                Source
                            </th>
                            <th scope="col" className="px-5 py-3 font-semibold">
                                Category
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
                        {incomeEntries.map((transaction) => {

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
                                                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#e5f3ec] text-[#16834b]`}
                                            >
                                                <ArrowDown aria-hidden="true" className="h-4 w-4" />
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

                                    {/* Frequency */}
                                    <td className="whitespace-nowrap px-5 py-4 text-[#7185a1]">
                                        {transaction.frequency}
                                    </td>

                                    {/* Amount */}
                                    <td
                                        className="whitespace-nowrap px-5 py-4 text-right font-semibold text-[#16834b]"
                                    >
                                        +{formatMoney(transaction.amount)}
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
                Showing 1 to {incomeEntries.length} of {incomeEntries.length} sample income entries
            </div>
        </section>
    );
}