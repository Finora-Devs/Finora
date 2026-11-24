"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Pencil, Plus, Trash2, X } from "lucide-react";

import {
    expenseCategories,
    fieldClass,
    formatDate,
    formatMoney,
    frequencies,
    getCategoryName,
    incomeCategories,
    recurringTransaction,
} from "@/lib/types_and_helpers";
import { useRecurringTransactionContext, useTransactionContext } from "@/app/(protected)/context";
import { createRecurringTransaction, deleteRecurringTransaction, editRecurringTransaction } from "@/lib/clientFunctions";
import { isDueSoon } from "@/lib/RecurringHelpers";

type PopupMode = "create" | "edit" | "remove";

export default function RecurringExpenseList() {

    const {recurringTransactions, setRecurringTransactions} = useRecurringTransactionContext();
    const {transactionsArr, setTransactionsArr} = useTransactionContext();
    const [saving, setSaving] = useState(false);

    const [popupMode, setPopupMode] = useState<PopupMode | null>(null);

    const [selectedExpense, setSelectedExpense] =
        useState<recurringTransaction | null>(null);

    const dialogRef = useRef<HTMLDialogElement>(null);
    const formId = useId();

    const isEditing = popupMode === "edit";
    const isRemoving = popupMode === "remove";

    const popupTitle = isRemoving
        ? "Remove Recurring Transaction"
        : isEditing
            ? "Edit Recurring Transaction"
            : "Add Recurring Transaction";

    // Reuse shared frequencies, excluding options that do not repeat.
    const recurringFrequencies = frequencies.filter(
        (frequency) => frequency.value !== "once"
    );

    function openPopup(
        mode: PopupMode,
        transaction: recurringTransaction | null = null
    ) {
        setSelectedExpense(transaction);
        setPopupMode(mode);
    }

    function closePopup() {
        setPopupMode(null);
    }

    // Open the popup and restore scrolling and focus when it closes.
    useEffect(() => {
        if (!popupMode) return;

        const dialog = dialogRef.current;
        if (!dialog) return;

        const previousFocus =
            document.activeElement instanceof HTMLElement
                ? document.activeElement
                : null;

        const previousOverflow = document.body.style.overflow;

        dialog.showModal();
        document.body.style.overflow = "hidden";

        return () => {
            dialog.close();
            document.body.style.overflow = previousOverflow;
            previousFocus?.focus();
        };
    }, [popupMode]);

    async function submit(formData: FormData)
    {
        if(saving) return;

        //error checking

        setSaving(true);
        //actionError
        try
        {
            if(popupMode === "create")
            {
                await createRecurringTransaction(formData, setRecurringTransactions, setTransactionsArr);
            }
            else if(popupMode === "edit" && selectedExpense)
            {
                await editRecurringTransaction(selectedExpense.id, formData, setRecurringTransactions, setTransactionsArr);
            }
            else if(popupMode === "remove" && selectedExpense)
            {
                await deleteRecurringTransaction(selectedExpense.id, setRecurringTransactions);
            }
        }
        catch
        {

        }
        finally
        {
            setSaving(false);
            closePopup();
        }
    }

    return (
        <section className="min-w-0 rounded-xl border border-[#dce7e2] bg-white">
            {/* Heading and add button */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-5">
                <div>
                    <h2 className="text-lg font-semibold text-[#17324d]">
                        All Recurring Transactions
                    </h2>

                    <p className="mt-1 text-sm text-[#4e7069]">
                        Review repeating expenses and their next scheduled dates.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => openPopup("create")}
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[#008f73] px-4 py-2 text-sm font-semibold text-white hover:bg-[#007c64]"
                >
                    <Plus aria-hidden="true" className="h-4 w-4" />
                    Add Recurring Transaction
                </button>
            </div>

            {/* Expense table */}
            <div
                role="region"
                aria-label="Recurring expenses"
                tabIndex={0}
                className="overflow-x-auto focus-visible:outline-2 focus-visible:outline-[#3f8068]"
            >
                <table className="w-full min-w-[850px] text-left text-sm">
                    <caption className="sr-only">
                        Recurring expense amounts, categories, frequencies,
                        next scheduled dates, and actions.
                    </caption>

                    <thead className="bg-[#f7faf8] text-[#4e7069]">
                        <tr>
                            <th scope="col" className="px-5 py-3 font-medium">
                                Transaction
                            </th>
                            <th scope="col" className="px-5 py-3 font-medium">
                                Category
                            </th>
                            <th scope="col" className="px-5 py-3 font-medium">
                                Frequency
                            </th>
                            <th scope="col" className="px-5 py-3 font-medium">
                                Next Due Date
                            </th>
                            <th
                                scope="col"
                                className="px-5 py-3 text-right font-medium"
                            >
                                Amount
                            </th>
                            <th
                                scope="col"
                                className="px-5 py-3 text-right font-medium"
                            >
                                Actions
                            </th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-[#dce7e2]">
                        {recurringTransactions.map((transaction) => {
                            
                            const isIncome = transaction.category_id < 7;

                            return <tr
                                key={transaction.id}
                                className="hover:bg-[#f7faf8]"
                            >
                                <th
                                    scope="row"
                                    className="px-5 py-4 font-medium text-[#17324d]"
                                >
                                    {transaction.name}
                                </th>

                                <td className="px-5 py-4 text-[#4e7069]">
                                    {getCategoryName(transaction.category_id)}
                                </td>

                                <td className="px-5 py-4 capitalize text-[#4e7069]">
                                    {transaction.frequency}
                                </td>

                                <td className="px-5 py-4">
                                    <p className="whitespace-nowrap text-[#4e7069]">
                                        {new Intl.DateTimeFormat("en-US", {month: "long", day: "numeric", year: "numeric"}).format(transaction.next_due_date)}
                                    </p>

                                    {isDueSoon(transaction) && (
                                        <span className="mt-1 inline-block rounded-full bg-[#fff3dc] px-2 py-1 text-xs font-medium text-[#9a6500]">
                                            Due within 7 days
                                        </span>
                                    )}
                                </td>

                                <td className={`whitespace-nowrap px-5 py-4 text-right font-semibold ${isIncome ? 
                                                                                                            "text-[#16834b]" : //is income
                                                                                                            "text-[#d94c5c]"}`}> 
                                    {`${isIncome ? "+" : "-"}${formatMoney(transaction.amount)}`}
                                </td>

                                <td className="px-5 py-4">
                                    <div className="flex justify-end gap-1">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                openPopup("edit", transaction)
                                            }
                                            aria-label={`Edit ${transaction.name}`}
                                            className="flex h-11 w-11 items-center justify-center rounded-lg text-[#4e7069] hover:bg-[#e5f3ec]"
                                        >
                                            <Pencil
                                                aria-hidden="true"
                                                className="h-4 w-4"
                                            />
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                openPopup("remove", transaction)
                                            }
                                            aria-label={`Remove ${transaction.name}`}
                                            className="flex h-11 w-11 items-center justify-center rounded-lg text-[#b53648] hover:bg-[#fce8eb]"
                                        >
                                            <Trash2
                                                aria-hidden="true"
                                                className="h-4 w-4"
                                            />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        })}
                    </tbody>
                </table>
            </div>

            {/* Sample data note */}
            <p className="border-t border-[#dce7e2] px-5 py-4 text-xs text-[#4e7069]">
                Showing sample recurring expenses. Upcoming labels are
                illustrative.
            </p>

            {/* Shared create, edit, and remove popup */}
            <dialog
                ref={dialogRef}
                aria-labelledby={`${formId}-title`}
                onCancel={(event) => {
                    event.preventDefault();
                    closePopup();
                }}
                className="fixed inset-0 m-auto max-h-[90dvh] w-[calc(100%_-_2rem)] max-w-md overflow-y-auto rounded-xl border border-[#dce7e2] bg-white p-0 text-[#17324d] shadow-xl backdrop:bg-black/40"
            >
                <div className="flex items-start justify-between gap-3 border-b border-[#dce7e2] p-5">
                    <h2
                        id={`${formId}-title`}
                        className="text-lg font-semibold"
                    >
                        {popupTitle}
                    </h2>

                    <button
                        type="button"
                        onClick={closePopup}
                        aria-label="Close popup"
                        className="rounded-lg p-2 hover:bg-[#f3f7f5]"
                    >
                        <X aria-hidden="true" className="h-5 w-5" />
                    </button>
                </div>

                {popupMode && (
                    <form
                        key={`${popupMode}-${selectedExpense?.id ?? "new"}`}
                        onSubmit={(event) => {
                            event.preventDefault();
                            const formData = new FormData(event.currentTarget);
                          
                            submit(formData);
                            // UI only. Saving and removal will be connected later.
                        }}
                        className="space-y-4 p-5"
                    >
                        {isRemoving ? (
                            <>
                                {/* Removal confirmation */}
                                <p className="text-sm leading-6 text-[#4e7069]">
                                    Remove{" "}
                                    <strong>{selectedExpense?.name}</strong>{" "}
                                    from your recurring expenses?
                                </p>

                                <p className="text-sm leading-6 text-[#4e7069]">
                                    Removing this schedule should not delete
                                    transactions already recorded.
                                </p>
                            </>
                        ) : (
                            <>
                                {/* Expense name */}
                                <div>
                                    <label
                                        htmlFor={`${formId}-name`}
                                        className="mb-1 block text-sm font-medium text-[#4e7069]"
                                    >
                                        Transaction name *
                                    </label>

                                    <input
                                        id={`${formId}-name`}
                                        name="name"
                                        type="text"
                                        required
                                        defaultValue={
                                            isEditing
                                                ? selectedExpense?.name ?? ""
                                                : ""
                                        }
                                        placeholder="For example, Internet"
                                        className={fieldClass}
                                        disabled={saving}
                                    />
                                </div>

                                {/* Expense amount */}
                                <div>
                                    <label
                                        htmlFor={`${formId}-amount`}
                                        className="mb-1 block text-sm font-medium text-[#4e7069]"
                                    >
                                        Amount per payment (USD) *
                                    </label>

                                    <input
                                        id={`${formId}-amount`}
                                        name="amount"
                                        type="number"
                                        required
                                        min="0.01"
                                        step="0.01"
                                        inputMode="decimal"
                                        defaultValue={
                                            isEditing
                                                ? selectedExpense?.amount ?? ""
                                                : ""
                                        }
                                        placeholder="0.00"
                                        className={fieldClass}
                                        disabled={saving}
                                    />
                                </div>

                                {/* Expense category */}
                                <div>
                                    <label
                                        htmlFor={`${formId}-category`}
                                        className="mb-1 block text-sm font-medium text-[#4e7069]"
                                    >
                                        Category *
                                    </label>

                                    <select
                                        id={`${formId}-category`}
                                        name="category"
                                        required
                                        defaultValue={
                                            isEditing && selectedExpense
                                                ? getCategoryName(selectedExpense.category_id) ?? ""
                                                : ""
                                        }
                                        className={fieldClass}
                                        disabled={saving}
                                    >
                                        <option value="" disabled>
                                            Select category
                                        </option>

                                        {[...incomeCategories, ...expenseCategories].map((category) => (
                                            <option
                                                key={category.value}
                                                value={category.value}
                                            >
                                                {category.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Recurrence frequency */}
                                <div>
                                    <label
                                        htmlFor={`${formId}-frequency`}
                                        className="mb-1 block text-sm font-medium text-[#4e7069]"
                                    >
                                        Frequency *
                                    </label>

                                    <select
                                        id={`${formId}-frequency`}
                                        name="frequency"
                                        required
                                        defaultValue={
                                            isEditing
                                                ? selectedExpense?.frequency ?? ""
                                                : ""
                                        }
                                        className={fieldClass}
                                        disabled={saving}
                                    >
                                        <option value="" disabled>
                                            Select frequency
                                        </option>

                                        {recurringFrequencies.map((frequency) => (
                                            <option
                                                key={frequency.value}
                                                value={frequency.value}
                                            >
                                                {frequency.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Next expected payment date */}
                                <div>
                                    <label
                                        htmlFor={`${formId}-date`}
                                        className="mb-1 block text-sm font-medium text-[#4e7069]"
                                    >
                                        Next expected or due date *
                                    </label>

                                    <input
                                        id={`${formId}-date`}
                                        name="date"
                                        type="date"
                                        required
                                        defaultValue={
                                            isEditing && selectedExpense
                                                ? formatDate(selectedExpense.next_due_date) ?? ""
                                                : ""
                                        }
                                        className={fieldClass}
                                        disabled={saving}
                                    />
                                </div>
                            </>
                        )}

                        {/* Popup action buttons */}
                        <div className="flex flex-wrap justify-end gap-3 border-t border-[#dce7e2] pt-4">
                            <button
                                type="button"
                                onClick={closePopup}
                                className="min-h-11 rounded-lg border border-[#dce7e2] px-4 py-2 text-sm font-medium text-[#17324d] hover:bg-[#f7faf8]"
                                disabled={saving}
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                className={`min-h-11 rounded-lg px-4 py-2 text-sm font-semibold text-white ${isRemoving
                                    ? "bg-[#b53648] hover:bg-[#982d3c]"
                                    : "bg-[#008f73] hover:bg-[#007c64]"
                                    }`}
                                disabled={saving}
                            >
                                {isRemoving
                                    ? saving ? "Removing..." : "Remove Transaction"
                                    : isEditing
                                        ? saving ? "Saving..." : "Save Changes"
                                        : saving ? "Saving..." : "Add Recurring Transaction"}
                            </button>
                        </div>
                    </form>
                )}
            </dialog>
        </section>
    );
}