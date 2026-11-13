"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Pencil, Plus, Trash2, X } from "lucide-react";

import {
    expenseCategories,
    fieldClass,
    frequencies,
} from "@/lib/types_and_helpers";

type RecurringExpense = {
    id: string;
    name: string;
    amount: string;
    amountLabel: string;
    category: string;
    frequency: string;
    nextDate: string;
    nextDateLabel: string;
    upcoming: boolean;
};

type PopupMode = "create" | "edit" | "remove";

// Sample values for the UI. Dates and upcoming labels are not calculated.
const recurringExpenses: RecurringExpense[] = [
    {
        id: "internet",
        name: "Internet",
        amount: "50.00",
        amountLabel: "$50.00",
        category: "Utilities",
        frequency: "monthly",
        nextDate: "2026-11-15",
        nextDateLabel: "November 15, 2026",
        upcoming: true,
    },
    {
        id: "phone",
        name: "Phone Plan",
        amount: "30.00",
        amountLabel: "$30.00",
        category: "Utilities",
        frequency: "monthly",
        nextDate: "2026-11-18",
        nextDateLabel: "November 18, 2026",
        upcoming: true,
    },
    {
        id: "gym",
        name: "Gym Membership",
        amount: "40.00",
        amountLabel: "$40.00",
        category: "Subscriptions",
        frequency: "monthly",
        nextDate: "2026-11-22",
        nextDateLabel: "November 22, 2026",
        upcoming: false,
    },
    {
        id: "streaming",
        name: "Streaming Services",
        amount: "60.00",
        amountLabel: "$60.00",
        category: "Subscriptions",
        frequency: "monthly",
        nextDate: "2026-11-25",
        nextDateLabel: "November 25, 2026",
        upcoming: false,
    },
    {
        id: "rent",
        name: "Rent",
        amount: "1000.00",
        amountLabel: "$1,000.00",
        category: "Housing",
        frequency: "monthly",
        nextDate: "2026-12-01",
        nextDateLabel: "December 1, 2026",
        upcoming: false,
    },
];

export default function RecurringExpenseList() {
    const [popupMode, setPopupMode] = useState<PopupMode | null>(null);

    const [selectedExpense, setSelectedExpense] =
        useState<RecurringExpense | null>(null);

    const dialogRef = useRef<HTMLDialogElement>(null);
    const formId = useId();

    const isEditing = popupMode === "edit";
    const isRemoving = popupMode === "remove";

    const popupTitle = isRemoving
        ? "Remove Recurring Expense"
        : isEditing
            ? "Edit Recurring Expense"
            : "Add Recurring Expense";

    // Reuse shared frequencies, excluding options that do not repeat.
    const recurringFrequencies = frequencies.filter(
        (frequency) => frequency.value !== "once"
    );

    function openPopup(
        mode: PopupMode,
        expense: RecurringExpense | null = null
    ) {
        setSelectedExpense(expense);
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

    return (
        <section className="min-w-0 rounded-xl border border-[#dce7e2] bg-white">
            {/* Heading and add button */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-5">
                <div>
                    <h2 className="text-lg font-semibold text-[#17324d]">
                        All Recurring Expenses
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
                    Add Recurring Expense
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
                                Expense
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
                        {recurringExpenses.map((expense) => (
                            <tr
                                key={expense.id}
                                className="hover:bg-[#f7faf8]"
                            >
                                <th
                                    scope="row"
                                    className="px-5 py-4 font-medium text-[#17324d]"
                                >
                                    {expense.name}
                                </th>

                                <td className="px-5 py-4 text-[#4e7069]">
                                    {expense.category}
                                </td>

                                <td className="px-5 py-4 capitalize text-[#4e7069]">
                                    {expense.frequency}
                                </td>

                                <td className="px-5 py-4">
                                    <p className="whitespace-nowrap text-[#4e7069]">
                                        {expense.nextDateLabel}
                                    </p>

                                    {expense.upcoming && (
                                        <span className="mt-1 inline-block rounded-full bg-[#fff3dc] px-2 py-1 text-xs font-medium text-[#9a6500]">
                                            Due within 7 days
                                        </span>
                                    )}
                                </td>

                                <td className="whitespace-nowrap px-5 py-4 text-right font-semibold text-[#d94c5c]">
                                    {expense.amountLabel}
                                </td>

                                <td className="px-5 py-4">
                                    <div className="flex justify-end gap-1">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                openPopup("edit", expense)
                                            }
                                            aria-label={`Edit ${expense.name}`}
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
                                                openPopup("remove", expense)
                                            }
                                            aria-label={`Remove ${expense.name}`}
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
                        ))}
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
                                        Expense name *
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
                                            isEditing
                                                ? expenseCategories.find(
                                                    (category) =>
                                                        category.name ===
                                                        selectedExpense?.category
                                                )?.value ?? ""
                                                : ""
                                        }
                                        className={fieldClass}
                                    >
                                        <option value="" disabled>
                                            Select category
                                        </option>

                                        {expenseCategories.map((category) => (
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
                                        name="nextDate"
                                        type="date"
                                        required
                                        defaultValue={
                                            isEditing
                                                ? selectedExpense?.nextDate ?? ""
                                                : ""
                                        }
                                        className={fieldClass}
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
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                className={`min-h-11 rounded-lg px-4 py-2 text-sm font-semibold text-white ${isRemoving
                                    ? "bg-[#b53648] hover:bg-[#982d3c]"
                                    : "bg-[#008f73] hover:bg-[#007c64]"
                                    }`}
                            >
                                {isRemoving
                                    ? "Remove Expense"
                                    : isEditing
                                        ? "Save Changes"
                                        : "Add Recurring Expense"}
                            </button>
                        </div>
                    </form>
                )}
            </dialog>
        </section>
    );
}