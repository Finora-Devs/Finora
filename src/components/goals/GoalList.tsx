"use client";

import { useEffect, useId, useRef, useState } from "react";
import {
    CalendarDays,
    CheckCircle2,
    Pencil,
    Plus,
    RotateCcw,
    Star,
    Trash2,
    X,
} from "lucide-react";

import { fieldClass } from "@/lib/types_and_helpers";

type Goal = {
    id: string;
    name: string;
    description: string;
    targetAmount: string;
    targetLabel: string;
    savedLabel: string;
    remainingLabel: string;
    progress: number;
    deadline: string;
    deadlineLabel: string;
    status: "Active" | "Completed";
    highestPriority: boolean;
    activity: string[];
};

type PopupMode =
    | "create"
    | "edit"
    | "contribute"
    | "priority"
    | "complete"
    | "reopen"
    | "remove";

// Sample goals for the UI.
const goals: Goal[] = [
    {
        id: "laptop",
        name: "New Laptop",
        description: "A reliable laptop for classes and programming projects.",
        targetAmount: "1200.00",
        targetLabel: "$1,200.00",
        savedLabel: "$600.00",
        remainingLabel: "$600.00",
        progress: 50,
        deadline: "2027-01-15",
        deadlineLabel: "January 15, 2027",
        status: "Active",
        highestPriority: true,
        activity: [
            "Manual contribution: +$100.00",
            "Monthly budget adjustment: +$50.00",
        ],
    },
    {
        id: "emergency-fund",
        name: "Emergency Fund",
        description: "Set money aside for unexpected expenses.",
        targetAmount: "1500.00",
        targetLabel: "$1,500.00",
        savedLabel: "$450.00",
        remainingLabel: "$1,050.00",
        progress: 30,
        deadline: "",
        deadlineLabel: "No deadline",
        status: "Active",
        highestPriority: false,
        activity: [
            "Manual contribution: +$150.00",
            "Manual contribution: +$50.00",
        ],
    },
    {
        id: "textbooks",
        name: "Next Semester Textbooks",
        description: "Prepare for books and other required course materials.",
        targetAmount: "300.00",
        targetLabel: "$300.00",
        savedLabel: "$150.00",
        remainingLabel: "$150.00",
        progress: 50,
        deadline: "2027-01-05",
        deadlineLabel: "January 5, 2027",
        status: "Active",
        highestPriority: false,
        activity: ["Manual contribution: +$50.00"],
    },
    {
        id: "headphones",
        name: "Study Headphones",
        description: "Noise-canceling headphones for studying.",
        targetAmount: "200.00",
        targetLabel: "$200.00",
        savedLabel: "$200.00",
        remainingLabel: "$0.00",
        progress: 100,
        deadline: "",
        deadlineLabel: "No deadline",
        status: "Completed",
        highestPriority: false,
        activity: [
            "Manual contribution: +$75.00",
            "Goal marked completed.",
        ],
    },
];

export default function GoalList() {
    const [view, setView] = useState<"Active" | "Completed">("Active");
    const [popupMode, setPopupMode] = useState<PopupMode | null>(null);
    const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);

    const dialogRef = useRef<HTMLDialogElement>(null);
    const formRef = useRef<HTMLFormElement>(null);
    const formId = useId();

    const isEditing = popupMode === "edit";
    const isGoalForm = popupMode === "create" || isEditing;

    // Only controls which sample cards are visible.
    const visibleGoals = goals.filter((goal) => goal.status === view);

    // Options shown when completing or removing the highest-priority goal.
    const replacementGoals = goals.filter(
        (goal) =>
            goal.status === "Active" &&
            goal.id !== selectedGoal?.id
    );

    const needsReplacement =
        selectedGoal?.highestPriority === true &&
        (popupMode === "complete" || popupMode === "remove") &&
        replacementGoals.length > 0;

    const popupTitles: Record<PopupMode, string> = {
        create: "Add Savings Goal",
        edit: "Edit Savings Goal",
        contribute: "Add Contribution",
        priority: "Change Highest Priority",
        complete: "Mark Goal Completed",
        reopen: "Reopen Goal",
        remove: "Remove Goal",
    };

    const submitLabels: Record<PopupMode, string> = {
        create: "Create Goal",
        edit: "Save Changes",
        contribute: "Add Contribution",
        priority: "Set Highest Priority",
        complete: "Mark Completed",
        reopen: "Reopen Goal",
        remove: "Remove Goal",
    };

    function openPopup(mode: PopupMode, goal: Goal | null = null) {
        setSelectedGoal(goal);
        setPopupMode(mode);
    }

    function closePopup() {
        setPopupMode(null);
    }

    // Open the dialog and restore scrolling and focus when it closes.
    useEffect(() => {
        if (!popupMode) return;

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

        return () => {
            dialog.close();
            document.body.style.overflow = previousOverflow;
            previousFocus?.focus();
        };
    }, [popupMode]);

    return (
        <section className="min-w-0 rounded-xl border border-[#dce7e2] bg-white">
            {/* List heading and add button */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-5">
                <div>
                    <h2 className="text-lg font-semibold text-[#17324d]">
                        Your Savings Goals
                    </h2>

                    <p className="mt-1 text-sm text-[#4e7069]">
                        Review your progress and manage your goals.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => openPopup("create")}
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[#008f73] px-4 py-2 text-sm font-semibold text-white hover:bg-[#007c64]"
                >
                    <Plus aria-hidden="true" className="h-4 w-4" />
                    Add Savings Goal
                </button>
            </div>

            {/* Active and completed views */}
            <div
                role="group"
                aria-label="Filter goals by status"
                className="flex flex-wrap gap-2 px-5 pb-5"
            >
                {(["Active", "Completed"] as const).map((status) => (
                    <button
                        key={status}
                        type="button"
                        aria-pressed={view === status}
                        onClick={() => setView(status)}
                        className={`min-h-11 rounded-lg border px-4 py-2 text-sm font-medium ${view === status
                                ? "border-[#3f8068] bg-[#e5f3ec] text-[#28664f]"
                                : "border-[#dce7e2] text-[#4e7069] hover:bg-[#f7faf8]"
                            }`}
                    >
                        {status}
                    </button>
                ))}
            </div>

            {/* Goal cards */}
            <div className="grid gap-4 px-5 pb-5 xl:grid-cols-2">
                {visibleGoals.map((goal) => (
                    <article
                        key={goal.id}
                        className="min-w-0 rounded-xl border border-[#dce7e2] p-4 sm:p-5"
                    >
                        {/* Goal status */}
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="inline-flex items-center gap-1 rounded-full bg-[#e5f3ec] px-2.5 py-1 text-xs font-medium text-[#28664f]">
                                {goal.status === "Completed" && (
                                    <CheckCircle2
                                        aria-hidden="true"
                                        className="h-3.5 w-3.5"
                                    />
                                )}

                                {goal.status}
                            </span>

                            {goal.highestPriority && (
                                <span className="inline-flex items-center gap-1 rounded-full bg-[#fff3dc] px-2.5 py-1 text-xs font-medium text-[#9a6500]">
                                    <Star
                                        aria-hidden="true"
                                        className="h-3.5 w-3.5"
                                    />
                                    Highest priority
                                </span>
                            )}
                        </div>

                        {/* Goal name and description */}
                        <h3 className="mt-3 break-words text-lg font-semibold text-[#17324d]">
                            {goal.name}
                        </h3>

                        <p className="mt-1 break-words text-sm leading-6 text-[#4e7069]">
                            {goal.description}
                        </p>

                        {/* Target, saved amount, and remaining amount */}
                        <dl className="mt-5 grid gap-3 sm:grid-cols-3">
                            <div>
                                <dt className="text-xs text-[#4e7069]">
                                    Target
                                </dt>
                                <dd className="mt-1 font-semibold text-[#17324d]">
                                    {goal.targetLabel}
                                </dd>
                            </div>

                            <div>
                                <dt className="text-xs text-[#4e7069]">
                                    Saved
                                </dt>
                                <dd className="mt-1 font-semibold text-[#16834b]">
                                    {goal.savedLabel}
                                </dd>
                            </div>

                            <div>
                                <dt className="text-xs text-[#4e7069]">
                                    Remaining
                                </dt>
                                <dd className="mt-1 font-semibold text-[#17324d]">
                                    {goal.remainingLabel}
                                </dd>
                            </div>
                        </dl>

                        {/* Goal progress */}
                        <div className="mt-5">
                            <div className="mb-2 flex justify-between gap-3 text-sm text-[#4e7069]">
                                <span>Progress</span>
                                <span>{goal.progress}%</span>
                            </div>

                            <div
                                role="progressbar"
                                aria-label={`${goal.name} savings progress`}
                                aria-valuemin={0}
                                aria-valuemax={100}
                                aria-valuenow={goal.progress}
                                className="h-2.5 overflow-hidden rounded-full bg-[#edf3ef]"
                            >
                                <div
                                    className="h-full rounded-full bg-[#3f8068]"
                                    style={{ width: `${goal.progress}%` }}
                                />
                            </div>
                        </div>

                        {/* Optional deadline */}
                        <p className="mt-4 flex items-center gap-2 text-sm text-[#4e7069]">
                            <CalendarDays
                                aria-hidden="true"
                                className="h-4 w-4 shrink-0"
                            />
                            {goal.deadline
                                ? `Target date: ${goal.deadlineLabel}`
                                : goal.deadlineLabel}
                        </p>

                        {/* Goal actions */}
                        <div className="mt-5 flex flex-wrap gap-2 border-t border-[#dce7e2] pt-4">
                            {goal.status === "Active" ? (
                                <>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            openPopup("contribute", goal)
                                        }
                                        className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-[#008f73] px-3 py-2 text-sm font-medium text-white hover:bg-[#007c64]"
                                    >
                                        <Plus
                                            aria-hidden="true"
                                            className="h-4 w-4"
                                        />
                                        Add Contribution
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => openPopup("edit", goal)}
                                        className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-[#dce7e2] px-3 py-2 text-sm text-[#17324d] hover:bg-[#f7faf8]"
                                    >
                                        <Pencil
                                            aria-hidden="true"
                                            className="h-4 w-4"
                                        />
                                        Edit
                                    </button>

                                    {!goal.highestPriority && (
                                        <button
                                            type="button"
                                            onClick={() =>
                                                openPopup("priority", goal)
                                            }
                                            className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-[#dce7e2] px-3 py-2 text-sm text-[#17324d] hover:bg-[#f7faf8]"
                                        >
                                            <Star
                                                aria-hidden="true"
                                                className="h-4 w-4"
                                            />
                                            Set Highest Priority
                                        </button>
                                    )}

                                    <button
                                        type="button"
                                        onClick={() =>
                                            openPopup("complete", goal)
                                        }
                                        className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-[#dce7e2] px-3 py-2 text-sm text-[#17324d] hover:bg-[#f7faf8]"
                                    >
                                        <CheckCircle2
                                            aria-hidden="true"
                                            className="h-4 w-4"
                                        />
                                        Mark Completed
                                    </button>
                                </>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => openPopup("reopen", goal)}
                                    className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-[#dce7e2] px-3 py-2 text-sm text-[#17324d] hover:bg-[#f7faf8]"
                                >
                                    <RotateCcw
                                        aria-hidden="true"
                                        className="h-4 w-4"
                                    />
                                    Reopen Goal
                                </button>
                            )}

                            <button
                                type="button"
                                onClick={() => openPopup("remove", goal)}
                                className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-[#f0cbd1] px-3 py-2 text-sm text-[#b53648] hover:bg-[#fce8eb]"
                            >
                                <Trash2
                                    aria-hidden="true"
                                    className="h-4 w-4"
                                />
                                Remove
                            </button>
                        </div>

                        {/* Sample goal activity */}
                        <details className="mt-4 border-t border-[#dce7e2] pt-4">
                            <summary className="cursor-pointer text-sm font-medium text-[#4e7069]">
                                Recent activity
                            </summary>

                            <ul className="mt-3 space-y-2 text-sm text-[#4e7069]">
                                {goal.activity.map((entry, index) => (
                                    <li key={`${goal.id}-${index}`}>
                                        {entry}
                                    </li>
                                ))}
                            </ul>
                        </details>
                    </article>
                ))}
            </div>

            {/* Empty view */}
            {visibleGoals.length === 0 && (
                <p className="px-5 pb-5 text-sm text-[#4e7069]">
                    No {view.toLowerCase()} goals to display.
                </p>
            )}

            {/* Shared popup for goal forms and confirmations */}
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
                        {popupMode ? popupTitles[popupMode] : ""}
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
                        key={`${popupMode}-${selectedGoal?.id ?? "new"}`}
                        ref={formRef}
                        onSubmit={(event) => {
                            event.preventDefault();

                            // UI only. 
                        }}
                        className="space-y-4 p-5"
                    >
                        {/* Create and edit goal fields */}
                        {isGoalForm && (
                            <>
                                <div>
                                    <label
                                        htmlFor={`${formId}-name`}
                                        className="mb-1 block text-sm font-medium text-[#4e7069]"
                                    >
                                        Goal name *
                                    </label>

                                    <input
                                        id={`${formId}-name`}
                                        name="name"
                                        type="text"
                                        required
                                        defaultValue={
                                            isEditing
                                                ? selectedGoal?.name ?? ""
                                                : ""
                                        }
                                        placeholder="For example, New Laptop"
                                        className={fieldClass}
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor={`${formId}-description`}
                                        className="mb-1 block text-sm font-medium text-[#4e7069]"
                                    >
                                        Description *
                                    </label>

                                    <textarea
                                        id={`${formId}-description`}
                                        name="description"
                                        required
                                        rows={3}
                                        defaultValue={
                                            isEditing
                                                ? selectedGoal?.description ?? ""
                                                : ""
                                        }
                                        placeholder="What are you saving for?"
                                        className={`${fieldClass} resize-y`}
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor={`${formId}-target`}
                                        className="mb-1 block text-sm font-medium text-[#4e7069]"
                                    >
                                        Target amount (USD) *
                                    </label>

                                    <input
                                        id={`${formId}-target`}
                                        name="targetAmount"
                                        type="number"
                                        required
                                        min="0.01"
                                        step="0.01"
                                        inputMode="decimal"
                                        defaultValue={
                                            isEditing
                                                ? selectedGoal?.targetAmount ?? ""
                                                : ""
                                        }
                                        placeholder="0.00"
                                        className={fieldClass}
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor={`${formId}-deadline`}
                                        className="mb-1 block text-sm font-medium text-[#4e7069]"
                                    >
                                        Deadline (optional)
                                    </label>

                                    <input
                                        id={`${formId}-deadline`}
                                        name="deadline"
                                        type="date"
                                        defaultValue={
                                            isEditing
                                                ? selectedGoal?.deadline ?? ""
                                                : ""
                                        }
                                        className={fieldClass}
                                    />
                                </div>

                                <label className="flex items-start gap-3 text-sm leading-6 text-[#4e7069]">
                                    <input
                                        name="highestPriority"
                                        type="checkbox"
                                        defaultChecked={
                                            isEditing
                                                ? selectedGoal?.highestPriority ?? false
                                                : false
                                        }
                                        className="mt-1 h-4 w-4 shrink-0 accent-[#3f8068]"
                                    />

                                    <span>
                                        Set as my highest-priority goal.
                                        This replaces the current priority goal.
                                    </span>
                                </label>

                                {isEditing && selectedGoal?.highestPriority && (
                                    <p className="text-xs leading-5 text-[#4e7069]">
                                        To choose a different priority goal, use
                                        Set Highest Priority on another active goal.
                                    </p>
                                )}
                            </>
                        )}

                        {/* Contribution fields */}
                        {popupMode === "contribute" && (
                            <>
                                <p className="text-sm text-[#4e7069]">
                                    Record a contribution toward{" "}
                                    <strong>{selectedGoal?.name}</strong>.
                                </p>

                                <div>
                                    <label
                                        htmlFor={`${formId}-contribution`}
                                        className="mb-1 block text-sm font-medium text-[#4e7069]"
                                    >
                                        Contribution amount (USD) *
                                    </label>

                                    <input
                                        id={`${formId}-contribution`}
                                        name="amount"
                                        type="number"
                                        required
                                        min="0.01"
                                        step="0.01"
                                        inputMode="decimal"
                                        placeholder="0.00"
                                        className={fieldClass}
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor={`${formId}-date`}
                                        className="mb-1 block text-sm font-medium text-[#4e7069]"
                                    >
                                        Contribution date *
                                    </label>

                                    <input
                                        id={`${formId}-date`}
                                        name="date"
                                        type="date"
                                        required
                                        className={fieldClass}
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor={`${formId}-note`}
                                        className="mb-1 block text-sm font-medium text-[#4e7069]"
                                    >
                                        Note (optional)
                                    </label>

                                    <textarea
                                        id={`${formId}-note`}
                                        name="note"
                                        rows={3}
                                        placeholder="Add a short note"
                                        className={`${fieldClass} resize-y`}
                                    />
                                </div>
                            </>
                        )}

                        {/* Priority confirmation */}
                        {popupMode === "priority" && (
                            <p className="text-sm leading-6 text-[#4e7069]">
                                Set <strong>{selectedGoal?.name}</strong> as your
                                highest-priority goal? Future monthly budget
                                adjustments will apply to this goal instead of
                                your current priority goal.
                            </p>
                        )}

                        {/* Completion confirmation */}
                        {popupMode === "complete" && (
                            <p className="text-sm leading-6 text-[#4e7069]">
                                Mark <strong>{selectedGoal?.name}</strong> as
                                completed? It will appear in your Completed view.
                            </p>
                        )}

                        {/* Reopening confirmation */}
                        {popupMode === "reopen" && (
                            <p className="text-sm leading-6 text-[#4e7069]">
                                Reopen <strong>{selectedGoal?.name}</strong>?
                                It will return to your Active view without
                                replacing your current highest-priority goal.
                            </p>
                        )}

                        {/* Removal confirmation */}
                        {popupMode === "remove" && (
                            <p className="text-sm leading-6 text-[#4e7069]">
                                Remove <strong>{selectedGoal?.name}</strong>?
                                This will remove the goal and its recorded
                                contribution history.
                            </p>
                        )}

                        {/* Replacement priority selection */}
                        {needsReplacement && (
                            <div>
                                <label
                                    htmlFor={`${formId}-replacement`}
                                    className="mb-1 block text-sm font-medium text-[#4e7069]"
                                >
                                    Choose your next highest-priority goal *
                                </label>

                                <select
                                    id={`${formId}-replacement`}
                                    name="replacementGoal"
                                    required
                                    defaultValue=""
                                    className={fieldClass}
                                >
                                    <option value="" disabled>
                                        Select an active goal
                                    </option>

                                    {replacementGoals.map((goal) => (
                                        <option key={goal.id} value={goal.id}>
                                            {goal.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
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
                                className={`min-h-11 rounded-lg px-4 py-2 text-sm font-semibold text-white ${popupMode === "remove"
                                        ? "bg-[#b53648] hover:bg-[#982d3c]"
                                        : "bg-[#008f73] hover:bg-[#007c64]"
                                    }`}
                            >
                                {submitLabels[popupMode]}
                            </button>
                        </div>
                    </form>
                )}
            </dialog>
        </section>
    );
}