"use client";

//validateExpense, ExpenseDraft. expenseErrors?



import { useEffect, useId, useRef, useState } from "react";
import type { FormEvent } from "react";
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


import { useTransactionContext } from "@/app/(protected)/context";
import { 
  CATEGORY_NAME,
  sortBy,
  SORTING_ORDER,
  expenseCategories,
  Transaction,
  validateTransaction,
  emptyTransactionDraft, 
  frequencies, 
  TransactionDraft,
  TransactionErrors,
  formatMoney
  } from "@/lib/types_and_helpers";
import { deleteTransaction, insertTransaction, updateTransaction } from "@/lib/clientFunctions";

// type Submission = Omit<TransactionDraft, "amount"> & { amount: number }; //never used.
// type Props = {   //none of this needs to be passes as a prop the way things are currently set up. we may need to hoist our state to the expense page later to get the summary cards working properly, but we aren't there yet.
//   //transactions: ExpenseRecord[];
//   periodLabel: string;
//   // Optional integration points for the backend team. No database writes here.
//   onSave?: (
//     expense: Submission,
//     existingId?: Transaction["id"],
//   ) => Promise<void>;
//   onRemove?: (id: Transaction["id"]) => Promise<void>;
// };
type Props = 
{
  searchDate: Date;
  setSearchDate: (newDate: Date) => void;
};
const fieldClass =
  "mt-2 w-full rounded-lg border border-[#dce7e2] bg-[#f7faf8] px-3 py-2.5 text-sm text-[#17324d] placeholder:text-[#7185a1] focus:border-[#3f8068] focus:outline-none focus:ring-2 focus:ring-[#3f8068]/20 aria-[invalid=true]:border-[#d94c5c]";
const labelClass = "block text-sm font-medium text-[#4e7069]";

export default function ExpenseList({searchDate, setSearchDate}: Props) {
  // Search, sorting, and category controls.
  const {transactionsArr, setTransactionsArr} = useTransactionContext();
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<SORTING_ORDER>(SORTING_ORDER.DATE);
  const [reversed, setReversed] = useState(true);
  const [category, setCategory] = useState(CATEGORY_NAME.ALL);
  const [include, setInclude] = useState(true);

  const rows = sortBy(search,
    sortField,
    reversed,
    category,
    include,
    "expense",
    searchDate.getMonth(),
    searchDate.getFullYear(),
    transactionsArr);

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
  const id = useId();

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
  function close() {
    if (!busyRef.current) setPanel(null);
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
  //async function submit(event: FormEvent<HTMLFormElement>) {
  async function submit(event: FormData) {
    //event.preventDefault(); not valid for FormData. call before the function call
    if (busyRef.current) 
      {
        console.log("busyRef.current false");
        return;
      }
    const nextErrors = validateTransaction(draft);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      console.log("Object.keys(nextErrors).length = 0")
      requestAnimationFrame(() => errorRef.current?.focus());
      return;
    }
   
    //if (!onSave) return;
    busyRef.current = true;
    setSaving(true);
    setActionError("");
    try {/*
      await onSave(
        {
          ...draft,
          name: draft.name.trim(),
          amount: Number(draft.amount),
          description: draft.description.trim(),
        },
        selected?.id,
      );
      setPanel(null);*/

      if(selected)
      {
        updateTransaction(event, selected.id, setTransactionsArr); //WARING: this function does not work on recurring transactions.
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
    //if (!onRemove || !selected || busyRef.current) return;
    if(!selected || busyRef.current) return;
    busyRef.current = true;
    setSaving(true);
    setActionError("");
    try {
      //await onRemove(selected.id);
      await deleteTransaction(selected?.id, setTransactionsArr);
      setPanel(null);
    } catch {
      setActionError("Unable to remove this expense. Please try again.");
    } finally {
      busyRef.current = false;
      setSaving(false);
    }
  }
  const title =
    panel === "edit"
      ? "Edit Expense"
      : panel === "remove"
        ? "Remove Expense"
        : "Add Expense";
  const normalOrder =
    sortField === SORTING_ORDER.DATE || sortField === SORTING_ORDER.AMOUNT || sortField === SORTING_ORDER.FREQUENCY
      ? "descending"
      : "alphabetical";

  return (
    <section className="overflow-hidden rounded-xl border border-[#dce7e2] bg-white">
      {/* Heading and action buttons */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-5">
        <h2 className="text-xl font-semibold text-[#17324d]">All Expenses</h2>
        <button
          type="button"
          onClick={() => open("add")}
          className="inline-flex items-center gap-2 rounded-lg bg-[#3f8068] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#326b56]"
        >
          <Plus aria-hidden="true" className="h-4 w-4" />
          Add Expense
        </button>
      </div>
      {/* Search, sorting, and controls */}
      <div className="flex flex-wrap items-center gap-3 px-5 pb-4">
        <div className="relative min-w-0 basis-full sm:min-w-[200px] sm:flex-1 sm:basis-auto">
          <label htmlFor={`${id}-search`} className="sr-only">
            Search expenses
          </label>
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7185a1]"
          />
          <input
            id={`${id}-search`}
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search expenses..."
            className="w-full rounded-lg border border-[#dce7e2] bg-[#f7faf8] py-2.5 pl-10 pr-3 text-sm text-[#17324d] placeholder:text-[#7185a1] focus:border-[#3f8068] focus:outline-none"
          />
        </div>
        <label htmlFor={`${id}-sort`} className="text-sm text-[#607394]">
          Sort by
        </label>
        <select
          id={`${id}-sort`}
          value={sortField}
          onChange={(event) => {
            setSortField(Number(event.target.value) as SORTING_ORDER);
          }}
          className="rounded-lg border border-[#dce7e2] bg-white px-3 py-2.5 text-sm text-[#17324d]"
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
            aria-pressed={!reversed}
            onClick={() => setReversed(true)}
            className={`px-3 py-2.5 ${reversed ? "bg-[#e5f3ec] text-[#28664f]" : "text-[#7185a1] hover:bg-[#f7faf8]"}`}
          >
            <ArrowDown aria-hidden="true" className="h-4 w-4" />
          </button>
          <button
            type="button"
            aria-label="Reverse sorting order"
            aria-pressed={reversed}
            onClick={() => setReversed(false)}
            className={`border-l border-[#dce7e2] px-3 py-2.5 ${!reversed ? "bg-[#e5f3ec] text-[#28664f]" : "text-[#7185a1] hover:bg-[#f7faf8]"}`}
          >
            <ArrowUp aria-hidden="true" className="h-4 w-4" />
          </button>
        </div>
        <span className="inline-flex items-center gap-2 rounded-lg border border-[#dce7e2] px-3 py-2.5 text-sm text-[#17324d]">
          <CalendarDays aria-hidden="true" className="h-4 w-4 text-[#607394]" />
          {Intl.DateTimeFormat("en-us", {month: "short", year: "numeric"}).format(searchDate)}
        </span>
      </div>
      {/* Include and exclude controls */}
      <div className="flex flex-wrap items-center gap-3 px-5 pb-5">
        <label htmlFor={`${id}-filter`} className="text-sm text-[#607394]">
          Category
        </label>
        <select
          id={`${id}-filter`}
          value={category}
          onChange={(event) => setCategory(event.target.value as CATEGORY_NAME)}
          className="min-w-[180px] rounded-lg border border-[#dce7e2] bg-white px-3 py-2.5 text-sm text-[#17324d]"
        >
          <option value={CATEGORY_NAME.ALL}>All Categories</option>
          {expenseCategories.map((item) => (
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
              aria-describedby={`${id}-help`}
              className="rounded-full text-[#7185a1] hover:text-[#28664f]"
            >
              <Info aria-hidden="true" className="h-4 w-4" />
            </button>
            <div
              id={`${id}-help`}
              role="tooltip"
              className="pointer-events-none absolute right-0 top-full z-40 mt-2 hidden w-60 rounded-lg border border-[#dce7e2] bg-white p-3 text-xs leading-5 text-[#17324d] shadow-lg group-hover:block group-focus-within:block"
            >
              <p>
                <strong>Include:</strong> Show expenses in the selected
                category.
              </p>
              <p className="mt-1">
                <strong>Exclude:</strong> Hide expenses in that category. All
                Categories shows every expense.
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
        <table className="w-full min-w-[700px] text-left text-sm">
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
            {rows.map((transaction) => (
              <tr key={transaction.id} className="hover:bg-[#f8fbf9]">
                {/* Date */}
                <td className="whitespace-nowrap px-5 py-4 text-[#7185a1]">
                  {transaction.transaction_date} {/*display date can be replaced with built in date time functions available in typescript. */}
                </td>
                {/* Name */}
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#fce8eb] text-[#d94c5c]">
                      <ArrowUp aria-hidden="true" className="h-4 w-4" />
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
                <td className="whitespace-nowrap px-5 py-4 text-right font-semibold text-[#d94c5c]">
                  −{formatMoney(transaction.amount)}
                </td>
                {/* Actions */}
                <td className="px-5 py-4">
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
            ))}
            {rows.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-5 py-12 text-center text-[#7185a1]"
                >
                  {transactionsArr.length === 0
                    ? "No expenses recorded for this month."
                    : "No expenses match your search or filters."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div
        aria-live="polite"
        className="border-t border-[#e5ebe8] px-5 py-4 text-sm text-[#4e7069]"
      >
        Showing {rows.length} of {transactionsArr.length} expenses
      </div>
      {/* Add / Edit / Remove popups are included in this file. */}
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
              {panel === "remove"
                ? "Review the expense before removing it."
                : "Enter your expense details."}
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
                          if(panel === "edit")
                          {
                            //selected.id
                            //update the selected transaction using the form

                            event.preventDefault();
                            const formData = new FormData(event.currentTarget);
              
                            submit(formData);
                          }
                          else
                          {
                            //this portion is an insert.
                            event.preventDefault();
                            const formData = new FormData(event.currentTarget);
              
                            submit(formData);
                          }
                        }
          } noValidate aria-busy={saving}>
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
                  Expense name / payee *
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
                  placeholder="e.g., Grocery Purchase"
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
                    {expenseCategories.map((item) => (
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
                    : "Add Expense"}
              </button>
            </div>
          </form>
        )}
      </dialog>
    </section>
  );
}
