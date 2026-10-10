"use client";

import {
  ArrowDown,
  ArrowUp,
  CalendarDays,
  Ellipsis,
  Plus,
  Search,
  Info,
  X,
} from "lucide-react";

import { formatMoney, incomeEntries } from "./incomeData";

import {
  SORTING_ORDER,
  CATEGORY_NAME,
  sortBy,
} from "@/lib/types_and_helpers";

import { useTransactionContext } from "@/app/(protected)/context";
import { useEffect, useId, useRef, useState } from "react";

//going to need to make something to make this differetiate between income and expenses even when category is set to all.

const formCategories = [
  "Employment",
  "Scholarships",
  "Financial Aid",
  "Allowance",
  "Self Employment",
  "Other Income",
];

const frequencies = [
  "Just Once",
  "Weekly",
  "Biweekly",
  "Monthly",
  "Semesterly",
  "Yearly",
];

const fieldClass =
  "mt-2 w-full rounded-lg border border-[#dce7e2] " +
  "bg-[#f7faf8] px-3 py-2.5 text-sm text-[#17324d] " +
  "placeholder:text-[#7185a1] focus:border-[#3f8068] " +
  "focus:outline-none focus:ring-2 focus:ring-[#3f8068]/20";

export default function IncomeList() {
  const { transactionsArr } = useTransactionContext();

  const [searchTerm, setSearchTerm] = useState(""); //not sure if most of these need to be states or not. I will change this as I expierement.
  const [sortingOrder, setSortingOrder] =
    useState(SORTING_ORDER.DATE);
  const [descending, setDescending] = useState(true);
  const [category, setCategory] = useState(CATEGORY_NAME.INCOME);
  const [include, setInclude] = useState(true);

  const incomeList = sortBy(
    searchTerm,
    sortingOrder,
    descending,
    category,
    include,
    transactionsArr,
  );

  // const [newTransactionAmount, setnewTransactionAmount] = useState(1.00);//will need input validation to prevent inputs like 1.001
  // const [newTransactionCategory, setnewTransactionCategory] = useState(7);//may make this an enum for readability
  // const [newTransactionFrequency, setnewTransactionFrequency] = useState("once");
  // const [newTransactionName, setnewTransactionName] = useState("placeHolder");
  // const [newTransactionDate, setnewTransactionDate] = useState(new Date().toDateString());

  const [isIncomeFormOpen, setIsIncomeFormOpen] = useState(false);

  const dialogRef = useRef<HTMLDialogElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const formId = useId();

  useEffect(() => {
    if (!isIncomeFormOpen) return;

    const dialog = dialogRef.current;
    if (!dialog) return;

    const previousFocus =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

    const previousOverflow = document.body.style.overflow;

    formRef.current?.reset();
    dialog.showModal();
    document.body.style.overflow = "hidden";
    nameRef.current?.focus();

    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus();
    };
  }, [isIncomeFormOpen]);

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
            onClick={() => setIsIncomeFormOpen(true)}
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
            onChange={(val) => setSearchTerm(val.target.value)}
          />
        </div>

        <label
          htmlFor="income-sort"
          className="text-sm text-[#607394]"
        >
          Sort by
        </label>

        <select
          id="income-sort"
          defaultValue="date"
          className="rounded-lg border border-[#dce7e2] bg-white px-3 py-2.5 text-sm text-[#17324d]"
          onChange={(val) => {
            setSortingOrder(Number(val.target.value) as SORTING_ORDER);
          }}
        >
          <option value={SORTING_ORDER.DATE}>Date</option>
          <option value={SORTING_ORDER.NAME}>Source</option>
          <option value={SORTING_ORDER.AMOUNT}>Amount</option>
          <option value={SORTING_ORDER.CATEGORY}>Category</option>
          <option value={SORTING_ORDER.FREQUENCY}>Frequency</option>
        </select>

        <div className="flex overflow-hidden rounded-lg border border-[#dce7e2]">
          <button
            type="button"
            aria-label="Sort descending"
            className={`px-3 py-2.5 hover:bg-[#f7faf8] ${
              descending
                ? "bg-[#e5f3ec] text-[#28664f]"
                : "text-[#7185a1]"
            }`}
            onClick={() => setDescending(true)}
          >
            <ArrowDown className="h-4 w-4" />
          </button>

          <button
            type="button"
            aria-label="Sort ascending"
            className={`border-l border-[#dce7e2] px-3 py-2.5 hover:bg-[#f7faf8] ${
              !descending
                ? "bg-[#e5f3ec] text-[#28664f]"
                : "text-[#7185a1]"
            }`}
            onClick={() => setDescending(false)}
          >
            <ArrowUp className="h-4 w-4" />
          </button>
        </div>

        <div className="flex items-center gap-2 rounded-lg border border-[#dce7e2] bg-white px-3 py-2.5 text-sm text-[#17324d]">
          <CalendarDays
            aria-hidden="true"
            className="h-4 w-4 text-[#607394]"
          />
          <span>Sep 1, 2026 – Sep 30, 2026</span>
        </div>
      </div>

      {/* Include and exclude controls */}
      <div className="flex flex-wrap items-center gap-3 px-5 pb-5">
        <label
          htmlFor="income-category"
          className="text-sm text-[#607394]"
        >
          Source
        </label>

        <select
          id="income-category"
          defaultValue="all"
          className="min-w-[180px] rounded-lg border border-[#dce7e2] bg-white px-3 py-2.5 text-sm text-[#17324d]"
          onChange={(val) => {
            setCategory(val.target.value as CATEGORY_NAME);
          }}
        >
          <option value={CATEGORY_NAME.INCOME}>All Sources</option>
          <option value={CATEGORY_NAME.EMPLOYMENT}>Employment</option>
          <option value={CATEGORY_NAME.SCHOLARSHIPS}>
            Scholarships
          </option>
          <option value={CATEGORY_NAME.FINANCIAL_AID}>
            Financial Aid
          </option>
          <option value={CATEGORY_NAME.ALLOWANCE}>Allowance</option>
          <option value={CATEGORY_NAME.SELF_EMPLOYMENT}>
            Self Employment
          </option>
          <option value={CATEGORY_NAME.OTHER_INCOME}>
            Other Income
          </option>

          {/* {incomeCategories.map((category) => (
              <option key={category.name} value={category.name}>{category.name}</option>
          ))} */}
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
                <strong>Include:</strong> Show income in the
                selected source category.
              </p>

              <p className="mt-1">
                <strong>Exclude:</strong> Hide income in the
                selected source category and show the others.
              </p>
            </div>
          </div>
        </div>

        <div className="flex overflow-hidden rounded-lg border border-[#dce7e2]">
          <button
            type="button"
            className={`px-4 py-2.5 text-sm font-medium hover:bg-[#f7faf8] ${
              include
                ? "bg-[#e5f3ec] text-[#28664f]"
                : "text-[#607394] bg-white"
            }`}
            onClick={() => setInclude(true)}
          >
            Include
          </button>

          <button
            type="button"
            className={`border-l border-[#dce7e2] px-4 py-2.5 text-sm font-medium hover:bg-[#f7faf8] ${
              !include
                ? "bg-[#e5f3ec] text-[#28664f]"
                : "text-[#607394] bg-white"
            }`}
            onClick={() => setInclude(false)}
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
              <th
                scope="col"
                className="px-5 py-3 text-right font-semibold"
              >
                Amount
              </th>
              <th
                scope="col"
                className="px-5 py-3 text-right font-semibold"
              >
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[#e5ebe8]">
            {incomeList.map((transaction) => {
              return (
                <tr
                  key={transaction.id}
                  className="hover:bg-[#f8fbf9]"
                >
                  {/* Date */}
                  <td className="whitespace-nowrap px-5 py-4 text-[#7185a1]">
                    {transaction.transaction_date}
                  </td>

                  {/* Name */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#e5f3ec] text-[#16834b]">
                        <ArrowDown
                          aria-hidden="true"
                          className="h-4 w-4"
                        />
                      </span>

                      <span className="whitespace-nowrap font-medium text-[#17324d]">
                        {transaction.name}
                      </span>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="px-5 py-4 text-[#607394]">
                    {transaction.categories.name}
                  </td>

                  {/* Frequency */}
                  <td className="whitespace-nowrap px-5 py-4 text-[#7185a1]">
                    {transaction.frequency}
                  </td>

                  {/* Amount */}
                  <td className="whitespace-nowrap px-5 py-4 text-right font-semibold text-[#16834b]">
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
        Showing 1 to {incomeEntries.length} of {incomeEntries.length}
        {" "}sample income entries
      </div>

      {/* Add Income popup: UI only */}
      <dialog
        ref={dialogRef}
        aria-labelledby={`${formId}-title`}
        aria-modal="true"
        onCancel={(event) => {
          event.preventDefault();
          setIsIncomeFormOpen(false);
        }}
        className="fixed inset-0 m-auto max-h-[90dvh] w-[calc(100%_-_2rem)] max-w-lg overflow-y-auto rounded-2xl border border-[#dce7e2] bg-white p-0 text-[#17324d] shadow-2xl backdrop:bg-black/40"
      >
        <div className="flex items-start justify-between gap-4 border-b border-[#e5ebe8] p-5">
          <div>
            <h2
              id={`${formId}-title`}
              className="text-xl font-semibold text-[#123c35]"
            >
              Add Income
            </h2>

            <p className="mt-1 text-sm text-[#4e7069]">
              Enter your income details.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsIncomeFormOpen(false)}
            aria-label="Close form"
            className="rounded-lg p-2 text-[#7185a1] hover:bg-[#f7faf8]"
          >
            <X aria-hidden="true" className="h-5 w-5" />
          </button>
        </div>

        <form
          ref={formRef}
          onSubmit={(event) => event.preventDefault()}
        >
          <div className="space-y-4 p-5">
            <p className="text-xs text-[#7185a1]">
              Fields marked * are required.
            </p>

            <div>
              <label
                htmlFor={`${formId}-name`}
                className="block text-sm font-medium text-[#4e7069]"
              >
                Income name / source *
              </label>

              <input
                ref={nameRef}
                id={`${formId}-name`}
                name="name"
                type="text"
                required
                maxLength={100}
                placeholder="e.g., Paycheck"
                className={fieldClass}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor={`${formId}-amount`}
                  className="block text-sm font-medium text-[#4e7069]"
                >
                  Amount (USD) *
                </label>

                <input
                  id={`${formId}-amount`}
                  name="amount"
                  type="number"
                  inputMode="decimal"
                  min="0.01"
                  step="0.01"
                  required
                  placeholder="0.00"
                  className={fieldClass}
                />
              </div>

              <div>
                <label
                  htmlFor={`${formId}-date`}
                  className="block text-sm font-medium text-[#4e7069]"
                >
                  Date *
                </label>

                <input
                  id={`${formId}-date`}
                  name="date"
                  type="date"
                  required
                  className={fieldClass}
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor={`${formId}-category`}
                  className="block text-sm font-medium text-[#4e7069]"
                >
                  Category *
                </label>

                <select
                  id={`${formId}-category`}
                  name="category"
                  defaultValue=""
                  required
                  className={fieldClass}
                >
                  <option value="" disabled>
                    Select category
                  </option>

                  {formCategories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor={`${formId}-frequency`}
                  className="block text-sm font-medium text-[#4e7069]"
                >
                  Frequency *
                </label>

                <select
                  id={`${formId}-frequency`}
                  name="frequency"
                  defaultValue=""
                  required
                  className={fieldClass}
                >
                  <option value="" disabled>
                    Select frequency
                  </option>

                  {frequencies.map((frequency) => (
                    <option key={frequency} value={frequency}>
                      {frequency}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label
                htmlFor={`${formId}-notes`}
                className="block text-sm font-medium text-[#4e7069]"
              >
                Notes (optional)
              </label>

              <textarea
                id={`${formId}-notes`}
                name="notes"
                rows={3}
                maxLength={500}
                placeholder="Add any extra details..."
                className={`${fieldClass} resize-y`}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 border-t border-[#e5ebe8] bg-[#f7faf8] p-5">
            <button
              type="button"
              onClick={() => setIsIncomeFormOpen(false)}
              className="rounded-lg border border-[#dce7e2] bg-white px-4 py-2.5 text-sm font-semibold text-[#4e7069] hover:bg-[#e5efeb]"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="rounded-lg bg-[#008f73] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#00765f]"
            >
              Save Income
            </button>
          </div>
        </form>
      </dialog>
    </section>
  );
}