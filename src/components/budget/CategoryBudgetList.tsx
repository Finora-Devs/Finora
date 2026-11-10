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
    categoryBudget,
    expenseCategories,
    fieldClass,
    formatMoney,
    getCategoryID,
    getCategoryName,
    incomeCategories,
} from "@/lib/types_and_helpers";
import { useCategoryBudgetContext, useTransactionContext } from "@/app/(protected)/context";
import { getBudgetPercentage, getBudgetStatus, getCategorySpending, getRemainingBudget } from "@/lib/budgetHelpers";
import { createCategoryBudget, deleteCategoryBudget, updateCategoryBudget } from "@/lib/clientFunctions";

const statusStyles = {
    //"On track": {
        "under_budget": {
        badge: "bg-[#e5f3ec] text-[#28664f]",
        bar: "bg-[#3f8068]",
        text: "text-[#28664f]",
    },
    //"Near limit": {
        "approaching_budget": {
        badge: "bg-[#fff3dc] text-[#9a6500]",
        bar: "bg-[#e5ab32]",
        text: "text-[#9a6500]",
    },
    //"Over budget": {
        "over_budget": {
        badge: "bg-[#fce8eb] text-[#b53648]",
        bar: "bg-[#d94c5c]",
        text: "text-[#b53648]",
    },


        no_budget:{ //should not be possible to trigger this, just here to get around compiler errors.
        badge: "bg-[#e5f3ec] text-[#28664f]",
        bar: "bg-[#3f8068]",
        text: "text-[#28664f]",
    }
};

export default function CategoryBudgetList() {
    const {categoryBudget, setCategoryBudget} = useCategoryBudgetContext();
    const {transactionsArr} = useTransactionContext();

    const [formMode, setFormMode] = useState<
        "create" | "edit" | "remove" | null
    >(null);


    const [selectedBudget, setSelectedBudget] =
        useState<categoryBudget | null>(null);

    const dialogRef = useRef<HTMLDialogElement>(null);
    const formRef = useRef<HTMLFormElement>(null);
    const categoryRef = useRef<HTMLSelectElement>(null);
    const cancelRef = useRef<HTMLButtonElement>(null);

    const formId = useId();

    const isEditing = formMode === "edit";
    const isRemoving = formMode === "remove";

    function openPopup(
        mode: "create" | "edit" | "remove",
        budget: categoryBudget | null = null,
    ) {
        setSelectedBudget(budget);
        setFormMode(mode);
    }

    const [actionError, setActionError] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);

    const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (saving) return;
        const form = e.currentTarget
        const formData = new FormData(form);
        const amount = formData.get("amount");
        if (!Number.isFinite(Number(amount)) || Number(amount) <= 0) {
          setActionError("Please enter a valid amount greater than 0.");
          return;
        }
    
        setSaving(true);
        setActionError("");
        try
        {
            //if the user has selected a budget, update it.
            if(selectedBudget)
            {
                await updateCategoryBudget(formData, selectedBudget.id, setCategoryBudget);
            }
            else
            {
                //if they have not selected a budget and try to enter a category they already have, update that budget. Otherwise, add a new budget.
                const duplicateBudget = categoryBudget?.find((budget) => budget.categoryId === getCategoryID(formData.get("category") as string)) ?? null;

                duplicateBudget ? 
                    await updateCategoryBudget(formData, duplicateBudget.id, setCategoryBudget) 
                    :
                    await createCategoryBudget(formData, setCategoryBudget);
            }
        }
        catch
        {
          setActionError("Unable to save this budget. Please try again.")
        }
        finally
        {
          setFormMode(null);
          setSaving(false);
        }
      }

    const handleRemove = async () => {
        if(saving || !selectedBudget) return;

        setSaving(true);
        setActionError("");
        try
        {
            await deleteCategoryBudget(selectedBudget.id, setCategoryBudget);
        }
        catch
        {
            setActionError("Unable to remove this budget. Please try again.")
        }
        finally
        {
            setSaving(false);
            setFormMode(null);
        }
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
                {categoryBudget ? categoryBudget.map((budget) => {
                    const styles = statusStyles[getBudgetStatus(getCategorySpending(transactionsArr, budget.categoryId, budget.month.getMonth(), budget.month.getFullYear()), budget.amount)]

                    const StatusIcon =
                        getBudgetStatus(getCategorySpending(transactionsArr, budget.categoryId, budget.month.getMonth(), budget.month.getFullYear()), budget.amount) === "under_budget" 
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
                                        {getCategoryName(budget.categoryId)} 
                                    </h3>

                                    <p className="mt-1 text-sm text-[#4e7069]">
                                        Budget: {formatMoney(budget.amount)}
                                    </p>
                                </div>

                                <div className="flex shrink-0 gap-1">
                                    <button
                                        type="button"
                                        onClick={() => openPopup("edit", budget)}
                                        aria-label={`Edit ${getCategoryName(budget.categoryId)} budget`}
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
                                        aria-label={`Remove ${getCategoryName(budget.categoryId)} budget`}
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
                                {getBudgetStatus(getCategorySpending(transactionsArr, budget.categoryId, budget.month.getMonth(), budget.month.getFullYear()), budget.amount)}
                            </span>


                            <div className="mt-4">
                                <div className="mb-2 flex flex-wrap items-center justify-between gap-2 text-sm">
                                    <p className="text-[#4e7069]">
                                        {formatMoney(getCategorySpending(transactionsArr, budget.categoryId, budget.month.getMonth(), budget.month.getFullYear()))} spent 
                                    </p>

                                    <p className="font-semibold text-[#17324d]">
                                        {parseInt(String(getBudgetPercentage(getCategorySpending(transactionsArr, budget.categoryId, budget.month.getMonth(), budget.month.getFullYear()), budget.amount)))}% used
                                    </p>
                                </div>

                                <div
                                    role="progressbar"
                                    aria-label={`${getCategoryName(budget.categoryId)} budget used`}
                                    aria-valuemin={0}
                                    aria-valuemax={100}
                                    aria-valuenow={Math.min(
                                        getBudgetPercentage(getCategorySpending(transactionsArr, budget.categoryId, budget.month.getMonth(), budget.month.getFullYear()), budget.amount),
                                        100,
                                    )}
                                    aria-valuetext={`${parseInt(String(getBudgetPercentage(getCategorySpending(transactionsArr, budget.categoryId, budget.month.getMonth(), budget.month.getFullYear()), budget.amount)))}% used; ${formatMoney(getRemainingBudget(getCategorySpending(transactionsArr, budget.categoryId, budget.month.getMonth(), budget.month.getFullYear()), budget.amount))}`}
                                    className="h-2.5 overflow-hidden rounded-full bg-[#edf3ef]"
                                >
                                    <div
                                        className={`h-full rounded-full ${styles.bar}`}
                                        style={{
                                            width: `${Math.min(
                                                parseInt(String(getBudgetPercentage(getCategorySpending(transactionsArr, budget.categoryId, budget.month.getMonth(), budget.month.getFullYear()), budget.amount))),
                                                100,
                                            )}%`,
                                        }}
                                    />
                                </div>

                                <p
                                    className={`mt-2 text-sm font-medium ${styles.text}`}
                                >
                                    {formatMoney(getRemainingBudget(getCategorySpending(transactionsArr, budget.categoryId, budget.month.getMonth(), budget.month.getFullYear()), budget.amount))}
                                </p>
                            </div>


                            <div className="mt-4 flex items-center gap-2 border-t border-[#e5ebe8] pt-3 text-xs text-[#7185a1]">
                                <Bell aria-hidden="true" className="h-4 w-4" />

                                <span>
                                    {budget.emailsEnabled
                                        ? "Email notifications enabled"
                                        : "Email notifications off"}
                                </span>
                            </div>
                        </article>
                    );
                })
            :
            "CategoryBudgetsNull"}
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
                        disabled={saving}
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
                                {getCategoryName(selectedBudget?.categoryId ?? 1)}
                            </strong>
                            ?
                        </p>

                        <div className="mt-6 flex flex-wrap justify-end gap-3">
                            <button
                                ref={cancelRef}
                                type="button"
                                disabled={saving}
                                onClick={() => setFormMode(null)}
                                className="rounded-lg border border-[#dce7e2] px-4 py-2.5 text-sm font-semibold text-[#4e7069] hover:bg-[#f7faf8]"
                            >
                                Cancel
                            </button>

                            {/* UI only.*/}
                            <button
                                type="button"
                                disabled={saving}
                                className="rounded-lg bg-[#d94c5c] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#bd3c4b]"
                                onClick={(e) => {
                                    e.preventDefault; handleRemove()
                                }}
                            >
                                {saving ? "Removing..." : "Remove Budget"}
                            </button>
                        </div>
                    </div>
                ) : (
                    <form
                        ref={formRef}
                        onSubmit={handleSubmit}
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
                                    disabled={saving}
                                    required
                                    defaultValue={
                                        isEditing
                                            ? [...incomeCategories, ...expenseCategories][selectedBudget?.categoryId ?? 0].value //broken. Does not overwrite default value of "".
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
                                    disabled={saving}
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

                            {/* <div>   This input should not be needed unless i'm misunderstanding how this is going to work. I'll leave the code in case I'm wrong.
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
                                            ? new Intl.DateTimeFormat("sv-SE", {year: "numeric", month: "2-digit"}).format(selectedBudget?.month ?? new Date("1970-01"))
                                            : ""
                                    }
                                    className={fieldClass}
                                />
                            </div> */}

                            <div className="flex items-start gap-3">
                                <input
                                    id={`${formId}-notifications`}
                                    name="emailNotifications"
                                    type="checkbox"
                                    disabled={saving}
                                    defaultChecked={
                                        isEditing
                                            ? selectedBudget?.emailsEnabled ?? false
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
                                disabled={saving}
                                onClick={() => setFormMode(null)}
                                className="rounded-lg border border-[#dce7e2] bg-white px-4 py-2.5 text-sm font-semibold text-[#4e7069] hover:bg-[#e5efeb]"
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                disabled={saving}
                                className="rounded-lg bg-[#008f73] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#00765f]"
                            >
                                {saving ? "Saving..." : 
                                    isEditing
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