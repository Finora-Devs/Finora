"use client";

import {
  ArrowDown,
  ArrowUp,
  CalendarDays,
  Info,
  Pencil,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";

import { 
  CATEGORY_NAME,
  sortTransactionList,
  SORTING_ORDER,
  expenseCategories,
  incomeCategories,
  Transaction,
  validateTransaction,
  emptyTransactionDraft, 
  frequencies, 
  TransactionDraft,
  TransactionErrors,
  formatMoney,
  fieldClass,
  labelClass
  } from "@/lib/types_and_helpers";

import { useTransactionContext } from "@/app/(protected)/context";
import { useEffect, useId, useRef, useState } from "react";
import { deleteTransaction, insertTransaction, updateTransaction } from "@/lib/clientFunctions";
//Sort by option box: complete
//search bar: complete
//Ascending/Descending toggle: complete.
//category option box: complete
//include/exclude toggle: complete
//add income button: complete
//add expense button: complete
//more options button: incomplete
  //remove button: incomplete, complete in expense page.
  //edit button: incomplete, complete in expense page.

//still need summary cards and chart

type TransactionType = "income" | "expense";

type Props = 
{
  searchDate: Date;
  setSearchDate: (newDate: Date) => void;
};

export default function TransactionList({searchDate, setSearchDate}: Props) {
  const { transactionsArr, setTransactionsArr } = useTransactionContext();

  const [searchTerm, setSearchTerm] = useState("");
  const [sortingOrder, setSortingOrder] = useState(SORTING_ORDER.DATE);
  const [descending, setDescending] = useState(true);
  const [category, setCategory] = useState(CATEGORY_NAME.ALL);
  const [include, setInclude] = useState(true);

  const TransactionList = sortTransactionList(
    searchTerm,
    sortingOrder,
    descending,
    category,
    include,
    "All",
    searchDate.getMonth(),
    searchDate.getFullYear(),
    transactionsArr
  );

  const [formType, setFormType] =
    useState<TransactionType | null>(null);

  const formRef = useRef<HTMLFormElement>(null);
  //const nameRef = useRef<HTMLInputElement>(null);
  const id = useId();

  const [panel, setPanel] = useState<"add" | "edit" | "remove" | null>(null);
  const [selected, setSelected] = useState<Transaction | null>(null);
  const [draft, setDraft] = useState<TransactionDraft>({ ...emptyTransactionDraft });
  const [errors, setErrors] = useState<TransactionErrors>({});
  const [actionError, setActionError] = useState("");
  const [saving, setSaving] = useState(false);
  const busyRef = useRef(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const firstFieldRef = useRef<HTMLInputElement>(null);
  const errorRef = useRef<HTMLParagraphElement>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);

  const isIncomeForm = formType === "income";

  const formCategories = isIncomeForm
    ? incomeCategories
    : expenseCategories;

  // useEffect(() => {
  //   if (!formType) return;

  //   const dialog = dialogRef.current;
  //   if (!dialog) return;

  //   const previousFocus =
  //     document.activeElement instanceof HTMLElement
  //       ? document.activeElement
  //       : null;

  //   const previousOverflow = document.body.style.overflow;

  //   formRef.current?.reset();
  //   dialog.showModal();
  //   document.body.style.overflow = "hidden";
  //   nameRef.current?.focus();

  //   return () => {
  //     dialog.close();
  //     document.body.style.overflow = previousOverflow;
  //     previousFocus?.focus();
  //   };
  // }, [formType]);

  useEffect(() => {
    if (!panel) return;
    const dialog = dialogRef.current;
    if (!dialog) return;
    const previousFocus =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    const previousOverflow = document.body.style.overflow;
    dialog.showModal();
    document.body.style.overflow = "hidden";
    if (panel === "remove") cancelRef.current?.focus();
    else firstFieldRef.current?.focus();
    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus();
    };
  }, [panel]);

  function close() {
    if (!busyRef.current) setPanel(null);
  }

  function open(mode: "add" | "edit" | "remove", record?: Transaction) {
      setSelected(record ?? null);
      setDraft(
        record
          ? {
              name: record.name,
              amount: String(record.amount),
              date: record.transaction_date,  //normalize date can be replaced with the built in date time formating options available in typescript.
              category: record.categories.name, //user does not manually type in the category, so this will never need to be checked for trailing whitespaces.
              frequency:
                record.frequency.toLowerCase() === "just once"//pretty sure this is always false. There should never be a way for the user to set the frequency to 'just once,' thats just a label for the button that sets the value to once.
                  ? "once"
                  : record.frequency.toLowerCase(),
              description: record.description ?? "",
            }
          : { ...emptyTransactionDraft },
      );
      setErrors({});
      setActionError("");
      setPanel(mode);
    }
    function update(field: keyof TransactionDraft, value: string) {
      setDraft((current) => ({ ...current, [field]: value }));
      setErrors((current) => ({ ...current, [field]: undefined }));
      setActionError("");
    }
    function errorProps(field: keyof TransactionDraft) {
      return {
        "aria-invalid": Boolean(errors[field]),
        "aria-describedby": errors[field] ? `${id}-${field}-error` : undefined,
      };
    }
    function fieldError(field: keyof TransactionDraft) {
      return errors[field] ? (
        <p id={`${id}-${field}-error`} className="mt-1 text-xs text-[#b53648]">
          {errors[field]}
        </p>
      ) : null;
    }
    async function submit(event: FormData) {
      if (busyRef.current) 
        {
          console.log("busyRef.current false");
          return;
        }
      const nextErrors = validateTransaction(draft, isIncomeForm);
      setErrors(nextErrors);
      if (Object.keys(nextErrors).length) {
        console.log("Object.keys(nextErrors).length = 0")
        requestAnimationFrame(() => errorRef.current?.focus());
        return;
      }
     
      busyRef.current = true;
      setSaving(true);
      setActionError("");
      try {
        if(selected)
        {
          await updateTransaction(event, selected.id, setTransactionsArr); //WARING: this function does not work on recurring transactions.
        }
        else
        {
          await insertTransaction(event, setTransactionsArr);
        }
        setPanel(null);
      } catch {
        setActionError("Unable to save this expense. Please try again.");
      } finally {
        busyRef.current = false;
        setSaving(false);
      }
    }
    async function remove() {
      if(!selected || busyRef.current) return;
      busyRef.current = true;
      setSaving(true);
      setActionError("");
      try {
        await deleteTransaction(selected?.id, setTransactionsArr);
        setPanel(null);
      } catch {
        setActionError("Unable to remove this expense. Please try again.");
      } finally {
        busyRef.current = false;
        setSaving(false);
      }
    }
    const typeString = isIncomeForm ? "income" : "expense"
    const title =
      panel === "edit" ? `Edit ${typeString}` : panel === "remove" ? `Remove ${typeString}` : `Add ${typeString}`;
    const normalOrder =
      sortingOrder === SORTING_ORDER.DATE || sortingOrder === SORTING_ORDER.AMOUNT || sortingOrder === SORTING_ORDER.FREQUENCY
        ? "descending"
        : "alphabetical";

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
            onClick={() => {
              setFormType("income");
              open("add");
            }}
          >
            <Plus className="h-4 w-4" />
            Add Income
          </button>

          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg bg-[#3f8068] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#326b56]"
            onClick={() => {
              setFormType("expense");
              open("add");
            }}
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
            onChange={(val) => setSearchTerm(val.target.value)}
          />
        </div>

        <label
          htmlFor="transaction-sort"
          className="text-sm text-[#607394]"
        >
          Sort by
        </label>

        <select
          id="transaction-sort"
          defaultValue={SORTING_ORDER.DATE}
          className="rounded-lg border border-[#dce7e2] bg-white px-3 py-2.5 text-sm text-[#17324d]"
          onChange={(val) => {
            setSortingOrder(Number(val.target.value) as SORTING_ORDER);
          }} //Done
        >
          <option value={SORTING_ORDER.DATE}>Date</option>
          <option value={SORTING_ORDER.NAME}>Name</option>
          <option value={SORTING_ORDER.AMOUNT}>Amount</option>
          <option value={SORTING_ORDER.CATEGORY}>Category</option>
          <option value={SORTING_ORDER.FREQUENCY}>Frequency</option>
        </select>

        <div className="flex overflow-hidden rounded-lg border border-[#dce7e2]">
          <button
            type="button"
            aria-label={`Use default ${normalOrder} order`}
            aria-pressed={!descending}
            onClick={() => setDescending(true)}
            className={`px-3 py-2.5 ${descending ? "bg-[#e5f3ec] text-[#28664f]" : "text-[#7185a1] hover:bg-[#f7faf8]"}`}
          >
            <ArrowDown className="h-4 w-4" />
          </button>

          <button
            type="button"
            aria-label="Reverse sorting order"
            aria-pressed={descending}
            onClick={() => setDescending(false)}
            className={`border-l border-[#dce7e2] px-3 py-2.5 ${!descending ? "bg-[#e5f3ec] text-[#28664f]" : "text-[#7185a1] hover:bg-[#f7faf8]"}`}
          >
            <ArrowUp aria-hidden="true" className="h-4 w-4" />
          </button>
        </div>

        <div className="flex items-center gap-2 rounded-lg border border-[#dce7e2] bg-white px-3 py-2.5 text-sm text-[#17324d]">
          {/* <CalendarDays
            aria-hidden="true"
            className="h-4 w-4 text-[#607394]"
          />
          <span>{Intl.DateTimeFormat("en-us", {month: "short", year: "numeric"}).format(searchDate)}</span> */}
          <span>
            <input
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
            />
            </span>
        </div>
      </div>

      {/* Include and exclude controls */}
      <div className="flex flex-wrap items-center gap-3 px-5 pb-5">
        <label
          htmlFor="transaction-category"
          className="text-sm text-[#607394]"
        >
          Category
        </label>

        {/* <select //keeping this in case I break something. if your seeing it, it means i forgot to delete it.
          id="transaction-category"
          defaultValue="all"
          className="min-w-[180px] rounded-lg border border-[#dce7e2] bg-white px-3 py-2.5 text-sm text-[#17324d]"
          onChange={(val) => {
            setCategory(val.target.value as CATEGORY_NAME);
          }} //done
        >
          <option value={CATEGORY_NAME.ALL}>All Categories</option>
          <option value={CATEGORY_NAME.FOOD}>Food</option>
          <option value={CATEGORY_NAME.HOUSING}>Housing</option>
          <option value={CATEGORY_NAME.TRANSPORTATION}>
            Transportation
          </option>
          <option value={CATEGORY_NAME.TUITION}>Tuition</option>
          <option value={CATEGORY_NAME.ENTERTAINMENT}>
            Entertainment
          </option>
          <option value={CATEGORY_NAME.UTILITIES}>Utilities</option>
          <option value={CATEGORY_NAME.SUBSCRIPTIONS}>
            Subscriptions
          </option>
          <option value={CATEGORY_NAME.OTHER}>Other</option>

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
        </select> */}

        <select
          id={`${id}-filter`}
          value={category}
          onChange={(event) => setCategory(event.target.value as CATEGORY_NAME)}
          className="min-w-[180px] rounded-lg border border-[#dce7e2] bg-white px-3 py-2.5 text-sm text-[#17324d]"
        >
          <option value={CATEGORY_NAME.ALL}>All Categories</option>
          {[...expenseCategories, ...incomeCategories].map((item) => (
            <option key={item.value} value={item.value}>
              {item.name}
            </option>
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
                <strong>Include:</strong> Show transactions in
                the selected category.
              </p>

              <p className="mt-1">
                <strong>Exclude:</strong> Hide transactions in
                the selected category and show the others.
              </p>
            </div>
          </div>
        </div>

        <div className="flex overflow-hidden rounded-lg border border-[#dce7e2]">
          <button
            type="button"
            aria-pressed={include}
            onClick={() => setInclude(true)}
            className={`px-4 py-2.5 text-sm font-medium ${include ? "bg-[#e5f3ec] text-[#28664f]" : "text-[#607394] hover:bg-[#f7faf8]"}`}
          >
            Include
          </button>
          <button
            type="button"
            aria-pressed={!include}
            onClick={() => setInclude(false)}
            className={`border-l border-[#dce7e2] px-4 py-2.5 text-sm font-medium ${!include ? "bg-[#e5f3ec] text-[#28664f]" : "text-[#607394] hover:bg-[#f7faf8]"}`}
          >
            Exclude
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="bg-[#f7faf8] text-[#4e7069]">
            <tr>
              {[
                "Date",
                "Name",
                "Category",
                "Frequency",
                "Amount",
                "Actions",
              ].map((heading) => (
                <th
                  key={heading}
                  scope="col"
                  className={`px-5 py-3 font-semibold ${heading === "Amount" || heading === "Actions" ? "text-right" : ""}`}
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-[#e5ebe8]">
            {TransactionList.map((transaction) => {
              const isIncome =
                transaction.categories.transaction_type === "income";

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
                      <span
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                          isIncome
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
                    {transaction.categories.name}
                  </td>

                  {/* Type */}
                  <td
                    className={`px-5 py-4 font-medium ${
                      isIncome
                        ? "text-[#16834b]"
                        : "text-[#e14b59]"
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
                    className={`whitespace-nowrap px-5 py-4 text-right font-semibold ${
                      isIncome
                        ? "text-[#16834b]"
                        : "text-[#e14b59]"
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
                    <div className="flex justify-end gap-1">
                    <button
                      type="button"
                      aria-label={`Edit ${transaction.name}`}
                      onClick={() => open("edit", transaction)}
                      className="rounded-lg p-2 text-[#4e7069] hover:bg-[#e5efeb]"
                    >
                      <Pencil aria-hidden="true" className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      aria-label={`Remove ${transaction.name}`}
                      onClick={() => open("remove", transaction)}
                      className="rounded-lg p-2 text-[#d94c5c] hover:bg-[#fce8eb]"
                    >
                      <Trash2 aria-hidden="true" className="h-4 w-4" />
                    </button>
                  </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="border-t border-[#e5ebe8] px-5 py-4 text-sm text-[#4e7069]">
        Showing {TransactionList.length} transactions
      </div>

      {/* Add Income / Add Expense popup: UI only */}
      <dialog
        ref={dialogRef}
        aria-labelledby={`${id}-title`}
        aria-modal="true"
        onCancel={(event) => {
          event.preventDefault();
          close();
        }}
        className="fixed inset-0 m-auto max-h-[90dvh] w-[calc(100%_-_2rem)] max-w-lg overflow-y-auto rounded-2xl border border-[#dce7e2] bg-white p-0 text-[#17324d] shadow-2xl backdrop:bg-black/40"
      >
        <div className="flex items-start justify-between gap-4 border-b border-[#e5ebe8] p-5">
          <div>
            <h2
              id={`${id}-title`}
              className="text-xl font-semibold text-[#123c35]"
            >
              {title}
            </h2>

            <p className="mt-1 text-sm text-[#4e7069]">
                {panel === "remove" ? "Review the transaction before removing it." :
                isIncomeForm ? "Enter your income details." : "Enter your expense details."}
            </p>
          </div>

          <button
            type="button"
            onClick={close}
            disabled={saving}
            aria-label="Close form"
            className="rounded-lg p-2 text-[#7185a1] hover:bg-[#f7faf8]"
          >
            <X aria-hidden="true" className="h-5 w-5" />
          </button>
        </div>

        {panel === "remove" ? (
          <div className="p-5">
            <p className="text-sm text-[#4e7069]">
              Remove <strong>{selected?.name}</strong> (
              {formatMoney(selected?.amount ?? 0)})?
            </p>
            {actionError && (
              <p role="alert" className="mt-3 text-sm text-[#b53648]">
                {actionError}
              </p>
            )}
            <div className="mt-6 flex justify-end gap-3">
              <button
                ref={cancelRef}
                type="button"
                onClick={close}
                disabled={saving}
                className="rounded-lg border border-[#dce7e2] px-4 py-2 text-sm"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => 
                  {
                    remove();
                  }}
                disabled={saving}// || !onRemove
                className="rounded-lg bg-[#d94c5c] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
              >
                {saving ? "Removing..." : "Remove"}
              </button>
            </div>
          </div>
        ) : (
        <form onSubmit={
            (event) => 
                        {
                          //This will insert or update based on current panel mode.
                          event.preventDefault();
                          const formData = new FormData(event.currentTarget);
                          
                          submit(formData);
                        }
          } noValidate aria-busy={saving}
          >
            <fieldset disabled={saving} className="min-w-0 space-y-4 p-5">
              <p className="text-xs text-[#7185a1]">
                Fields marked * are required.
              </p>
              {Object.values(errors).some(Boolean) && (
                <p
                  ref={errorRef}
                  role="alert"
                  tabIndex={-1}
                  className="rounded-lg bg-[#fce8eb] p-3 text-sm text-[#b53648]"
                >
                  Check the highlighted fields below.
                </p>
              )}
              <div>
                <label htmlFor={`${id}-name`} className={labelClass}>
                  {isIncomeForm ? "Income name / payer" : "Expense name / payee *"}
                </label>
                <input
                  ref={firstFieldRef}
                  id={`${id}-name`}
                  name="name"
                  type="text"
                  maxLength={100}
                  required
                  value={draft.name}
                  onChange={(event) => update("name", event.target.value)}
                  placeholder={`e.g., ${isIncomeForm ? "Paycheck" : "Grocery Purchase"}`}
                  className={fieldClass}
                  {...errorProps("name")}
                />
                {fieldError("name")}
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor={`${id}-amount`} className={labelClass}>
                    Amount (USD) *
                  </label>
                  <input
                    id={`${id}-amount`}
                    name="amount"
                    type="text"
                    inputMode="decimal"
                    required
                    value={draft.amount}
                    onChange={(event) => update("amount", event.target.value)}
                    placeholder="0.00"
                    className={fieldClass}
                    {...errorProps("amount")}
                  />
                  {fieldError("amount")}
                </div>
                <div>
                  <label htmlFor={`${id}-date`} className={labelClass}>
                    Date *
                  </label>
                  <input
                    id={`${id}-date`}
                    name="date"
                    type="date"
                    required
                    value={draft.date}
                    onChange={(event) => update("date", event.target.value)}
                    className={fieldClass}
                    {...errorProps("date")}
                  />
                  {fieldError("date")}
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor={`${id}-category`} className={labelClass}>
                    Category *
                  </label>
                  <select
                    id={`${id}-category`}
                    name="category"
                    required
                    value={draft.category}
                    onChange={(event) => update("category", event.target.value)}
                    className={fieldClass}
                    {...errorProps("category")}
                  >
                    <option value="" disabled>
                      Select category
                    </option>
                    {formCategories.map((item) => (
                      <option key={item.value} value={item.value}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                  {fieldError("category")}
                </div>
                <div>
                  <label htmlFor={`${id}-frequency`} className={labelClass}>
                    Frequency *
                  </label>
                  <select
                    id={`${id}-frequency`}
                    name="frequency"
                    required
                    value={draft.frequency}
                    onChange={(event) =>
                      update("frequency", event.target.value)
                    }
                    className={fieldClass}
                    {...errorProps("frequency")}
                  >
                    <option value="" disabled>
                      Select frequency
                    </option>
                    {frequencies.map((item) => (
                      <option key={item.value} value={item.value}>
                        {item.label}
                      </option>
                    ))}
                    {draft.frequency &&
                      !frequencies.some(
                        (item) => item.value === draft.frequency,
                      ) && (
                        <option value={draft.frequency}>
                          {draft.frequency}
                        </option>
                      )}
                  </select>
                  {fieldError("frequency")}
                </div>
              </div>
              <div>
                <label htmlFor={`${id}-description`} className={labelClass}>
                  Description (optional)
                </label>
                <textarea
                  id={`${id}-notes`}//the name and id need to be consistent between pages or it will break the insert function; if you change this back to description, also change the others and the insert function.
                  name="notes"
                  rows={3}
                  maxLength={500}
                  value={draft.description}
                  onChange={(event) =>
                    update("description", event.target.value)
                  }
                  placeholder="Add any extra details..."
                  className={`${fieldClass} resize-y`}
                  {...errorProps("description")}
                />
                {fieldError("description")}
              </div>
              {actionError && (
                <p role="alert" className="text-sm text-[#b53648]">
                  {actionError}
                </p>
              )}
            </fieldset>
            <div className="flex justify-end gap-3 border-t border-[#e5ebe8] bg-[#f7faf8] p-5">
              <button
                type="button"
                onClick={close}
                disabled={saving}
                className="rounded-lg border border-[#dce7e2] bg-white px-4 py-2.5 text-sm font-semibold text-[#4e7069] hover:bg-[#e5efeb]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-[#3f8068] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#326b56] disabled:opacity-50"
              >
                {saving
                  ? "Saving..."
                  : panel === "edit"
                    ? "Save Changes"
                    : isIncomeForm ? "Add Income" :"Add Expense"}
              </button>
            </div>
          </form>
        )}
      </dialog>
    </section>
  );
}