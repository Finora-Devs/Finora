"use client";

import { useEffect, useId, useRef, useState } from "react";
import {
    AlertTriangle,
    Bell,
    CheckCircle2,
    Pencil,
    Plus,
    Trash2,
    X,
} from "lucide-react";

import {
    expenseCategories,
    fieldClass,
} from "@/lib/types_and_helpers";

type CategoryBudget = {
    id: string;
    category: string;
    amount: string;
    budgetLabel: string;
    spentLabel: string;
    remainingLabel: string;
    usedPercent: number;
    month: string;
    status: "On track" | "Near limit" | "Over budget";
    emailNotifications: boolean;
};


const categoryBudgets: CategoryBudget[] = [
    {
        id: "food",
        category: "Food",
        amount: "300.00",
        budgetLabel: "$300.00",
        spentLabel: "$360.00",
        remainingLabel: "$60.00 over budget",
        usedPercent: 120,
        month: "2026-10",
        status: "Over budget",
        emailNotifications: true,
    },
    {
        id: "housing",
        category: "Housing",
        amount: "1000.00",
        budgetLabel: "$1,000.00",
        spentLabel: "$700.00",
        remainingLabel: "$300.00 remaining",
        usedPercent: 70,
        month: "2026-10",
        status: "On track",
        emailNotifications: true,
    },
    {
        id: "transportation",
        category: "Transportation",
        amount: "300.00",
        budgetLabel: "$300.00",
        spentLabel: "$240.00",
        remainingLabel: "$60.00 remaining",
        usedPercent: 80,
        month: "2026-10",
        status: "Near limit",
        emailNotifications: false,
    },
    {
        id: "other",
        category: "Other",
        amount: "400.00",
        budgetLabel: "$400.00",
        spentLabel: "$100.00",
        remainingLabel: "$300.00 remaining",
        usedPercent: 25,
        month: "2026-10",
        status: "On track",
        emailNotifications: false,
    },
];


const statusStyles = {
    "On track": {
        badge: "bg-[#e5f3ec] text-[#28664f]",
        bar: "bg-[#3f8068]",
        text: "text-[#28664f]",
    },
    "Near limit": {
        badge: "bg-[#fff3dc] text-[#9a6500]",
        bar: "bg-[#e5ab32]",
        text: "text-[#9a6500]",
    },
    "Over budget": {
        badge: "bg-[#fce8eb] text-[#b53648]",
        bar: "bg-[#d94c5c]",
        text: "text-[#b53648]",
    },
};

export default function CategoryBudgetList() {

    const [formMode, setFormMode] = useState<
        "create" | "edit" | "remove" | null
    >(null);


    const [selectedBudget, setSelectedBudget] =
        useState<CategoryBudget | null>(null);

    const dialogRef = useRef<HTMLDialogElement>(null);
    const formRef = useRef<HTMLFormElement>(null);
    const categoryRef = useRef<HTMLSelectElement>(null);
    const cancelRef = useRef<HTMLButtonElement>(null);

    const formId = useId();

    const isEditing = formMode === "edit";
    const isRemoving = formMode === "remove";

    function openPopup(
        mode: "create" | "edit" | "remove",
        budget: CategoryBudget | null = null,
    ) {
        setSelectedBudget(budget);
        setFormMode(mode);
    }

    useEffect(() => {
        if (!formMode) return;

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

        if (formMode === "remove") {
            cancelRef.current?.focus();
        } else {
            categoryRef.current?.focus();
        }

        return () => {
            dialog.close();
            document.body.style.overflow = previousOverflow;
            previousFocus?.focus();
        };
    }, [formMode]);

    return (
        <section className="rounded-xl border border-[#dce7e2] bg-white">

            <div className="flex flex-wrap items-center justify-between gap-4 p-5">
                <div>
                    <h2 className="text-xl font-semibold text-[#17324d]">
                        Category Budgets
                    </h2>

                    <p className="mt-1 text-sm text-[#4e7069]">
                        Set spending limits for individual expense categories.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => openPopup("create")}
                    className="inline-flex items-center gap-2 rounded-lg bg-[#008f73] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#00765f]"
                >
                    <Plus aria-hidden="true" className="h-4 w-4" />
                    Create Category Budget
                </button>
            </div>

            <div className="grid gap-4 px-5 pb-5 md:grid-cols-2">
                {categoryBudgets.map((budget) => {
                    const styles = statusStyles[budget.status];

                    const StatusIcon =
                        budget.status === "On track"
                            ? CheckCircle2
                            : AlertTriangle;

                    return (
                        <article
                            key={budget.id}
                            className="min-w-0 rounded-xl border border-[#dce7e2] p-4"
                        >

                            <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0">
                                    <h3 className="text-lg font-semibold text-[#17324d]">
                                        {budget.category}
                                    </h3>

                                    <p className="mt-1 text-sm text-[#4e7069]">
                                        Budget: {budget.budgetLabel}
                                    </p>
                                </div>

                                <div className="flex shrink-0 gap-1">
                                    <button
                                        type="button"
                                        onClick={() => openPopup("edit", budget)}
                                        aria-label={`Edit ${budget.category} budget`}
                                        className="rounded-lg p-2 text-[#4e7069] hover:bg-[#e5efeb]"
                                    >
                                        <Pencil
                                            aria-hidden="true"
                                            className="h-4 w-4"
                                        />
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => openPopup("remove", budget)}
                                        aria-label={`Remove ${budget.category} budget`}
                                        className="rounded-lg p-2 text-[#d94c5c] hover:bg-[#fce8eb]"
                                    >
                                        <Trash2
                                            aria-hidden="true"
                                            className="h-4 w-4"
                                        />
                                    </button>
                                </div>
                            </div>


                            <span
                                className={`mt-4 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${styles.badge}`}
                            >
                                <StatusIcon
                                    aria-hidden="true"
                                    className="h-3.5 w-3.5"
                                />
                                {budget.status}
                            </span>


                            <div className="mt-4">
                                <div className="mb-2 flex flex-wrap items-center justify-between gap-2 text-sm">
                                    <p className="text-[#4e7069]">
                                        {budget.spentLabel} spent
                                    </p>

                                    <p className="font-semibold text-[#17324d]">
                                        {budget.usedPercent}% used
                                    </p>
                                </div>

                                <div
                                    role="progressbar"
                                    aria-label={`${budget.category} budget used`}
                                    aria-valuemin={0}
                                    aria-valuemax={100}
                                    aria-valuenow={Math.min(
                                        budget.usedPercent,
                                        100,
                                    )}
                                    aria-valuetext={`${budget.usedPercent}% used; ${budget.remainingLabel}`}
                                    className="h-2.5 overflow-hidden rounded-full bg-[#edf3ef]"
                                >
                                    <div
                                        className={`h-full rounded-full ${styles.bar}`}
                                        style={{
                                            width: `${Math.min(
                                                budget.usedPercent,
                                                100,
                                            )}%`,
                                        }}
                                    />
                                </div>

                                <p
                                    className={`mt-2 text-sm font-medium ${styles.text}`}
                                >
                                    {budget.remainingLabel}
                                </p>
                            </div>


                            <div className="mt-4 flex items-center gap-2 border-t border-[#e5ebe8] pt-3 text-xs text-[#7185a1]">
                                <Bell aria-hidden="true" className="h-4 w-4" />

                                <span>
                                    {budget.emailNotifications
                                        ? "Email notifications enabled"
                                        : "Email notifications off"}
                                </span>
                            </div>
                        </article>
                    );
                })}
            </div>


            <dialog
                ref={dialogRef}
                aria-labelledby={`${formId}-title`}
                aria-modal="true"
                onCancel={(event) => {
                    event.preventDefault();
                    setFormMode(null);
                }}
                className="fixed inset-0 m-auto max-h-[90dvh] w-[calc(100%_-_2rem)] max-w-lg overflow-y-auto rounded-2xl border border-[#dce7e2] bg-white p-0 text-[#17324d] shadow-2xl backdrop:bg-black/40"
            >
                <div className="flex items-start justify-between gap-4 border-b border-[#e5ebe8] p-5">
                    <h2
                        id={`${formId}-title`}
                        className="text-xl font-semibold text-[#123c35]"
                    >
                        {isRemoving
                            ? "Remove Category Budget"
                            : isEditing
                                ? "Edit Category Budget"
                                : "Create Category Budget"}
                    </h2>

                    <button
                        type="button"
                        onClick={() => setFormMode(null)}
                        aria-label="Close category budget popup"
                        className="rounded-lg p-2 text-[#7185a1] hover:bg-[#f7faf8]"
                    >
                        <X aria-hidden="true" className="h-5 w-5" />
                    </button>
                </div>

                {isRemoving ? (
                    <div className="p-5">
                        <p className="text-sm leading-6 text-[#4e7069]">
                            Are you sure you want to remove the budget for{" "}
                            <strong className="text-[#17324d]">
                                {selectedBudget?.category}
                            </strong>
                            ?
                        </p>

                        <div className="mt-6 flex flex-wrap justify-end gap-3">
                            <button
                                ref={cancelRef}
                                type="button"
                                onClick={() => setFormMode(null)}
                                className="rounded-lg border border-[#dce7e2] px-4 py-2.5 text-sm font-semibold text-[#4e7069] hover:bg-[#f7faf8]"
                            >
                                Cancel
                            </button>

                            {/* UI only.*/}
                            <button
                                type="button"
                                className="rounded-lg bg-[#d94c5c] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#bd3c4b]"
                            >
                                Remove Budget
                            </button>
                        </div>
                    </div>
                ) : (
                    <form
                        ref={formRef}
                        onSubmit={(event) => {
                            event.preventDefault();

                            // UI only
                        }}
                    >
                        <div className="space-y-5 p-5">
                            <div>
                                <label
                                    htmlFor={`${formId}-category`}
                                    className="block text-sm font-medium text-[#4e7069]"
                                >
                                    Category *
                                </label>

                                <select
                                    ref={categoryRef}
                                    id={`${formId}-category`}
                                    name="category"
                                    required
                                    defaultValue={
                                        isEditing
                                            ? selectedBudget?.category ?? ""
                                            : ""
                                    }
                                    className={fieldClass}
                                >
                                    <option value="" disabled>
                                        Select category
                                    </option>

                                    {expenseCategories.map((category) => (
                                        <option key={category.value} value={category.value}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label
                                    htmlFor={`${formId}-amount`}
                                    className="block text-sm font-medium text-[#4e7069]"
                                >
                                    Budget amount (USD) *
                                </label>

                                <input
                                    id={`${formId}-amount`}
                                    name="amount"
                                    type="number"
                                    inputMode="decimal"
                                    min="0.01"
                                    step="0.01"
                                    required
                                    defaultValue={
                                        isEditing
                                            ? selectedBudget?.amount ?? ""
                                            : ""
                                    }
                                    placeholder="Enter budget amount"
                                    className={fieldClass}
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor={`${formId}-month`}
                                    className="block text-sm font-medium text-[#4e7069]"
                                >
                                    Applicable month *
                                </label>

                                <input
                                    id={`${formId}-month`}
                                    name="month"
                                    type="month"
                                    required
                                    defaultValue={
                                        isEditing
                                            ? selectedBudget?.month ?? ""
                                            : ""
                                    }
                                    className={fieldClass}
                                />
                            </div>

                            <div className="flex items-start gap-3">
                                <input
                                    id={`${formId}-notifications`}
                                    name="emailNotifications"
                                    type="checkbox"
                                    defaultChecked={
                                        isEditing
                                            ? selectedBudget?.emailNotifications ?? false
                                            : false
                                    }
                                    className="mt-1 h-4 w-4 shrink-0 accent-[#3f8068]"
                                />

                                <label
                                    htmlFor={`${formId}-notifications`}
                                    className="text-sm text-[#4e7069]"
                                >
                                    Email me when spending approaches or exceeds
                                    this category budget.
                                </label>
                            </div>
                        </div>

                        <div className="flex flex-wrap justify-end gap-3 border-t border-[#e5ebe8] bg-[#f7faf8] p-5">
                            <button
                                type="button"
                                onClick={() => setFormMode(null)}
                                className="rounded-lg border border-[#dce7e2] bg-white px-4 py-2.5 text-sm font-semibold text-[#4e7069] hover:bg-[#e5efeb]"
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                className="rounded-lg bg-[#008f73] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#00765f]"
                            >
                                {isEditing
                                    ? "Save Changes"
                                    : "Create Category Budget"}
                            </button>
                        </div>
                    </form>
                )}
            </dialog>
        </section>
    );
}