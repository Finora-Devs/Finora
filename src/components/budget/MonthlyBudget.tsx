"use client";

import {useEffect, useId, useRef, useState}from "react";
import {Bell, Pencil, Plus, X} from "lucide-react";

export default function MonthlyBudget() {
 
  const [formMode, setFormMode] = useState<
    "create" | "edit" | null
  >(null);

  
  const dialogRef = useRef<HTMLDialogElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const amountRef = useRef<HTMLInputElement>(null);

  
  const formId = useId();

  
  const isEditing = formMode === "edit";

 
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
    amountRef.current?.focus();

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
            Monthly Budget
          </h2>

          <p className="mt-1 text-sm text-[#4e7069]">
            Set an overall spending limit for the month.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setFormMode("create")}
            className="inline-flex items-center gap-2 rounded-lg bg-[#008f73] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#00765f]"
          >
            <Plus aria-hidden="true" className="h-4 w-4" />
            Create Budget
          </button>

          <button
            type="button"
            onClick={() => setFormMode("edit")}
            className="inline-flex items-center gap-2 rounded-lg border border-[#dce7e2] px-4 py-2.5 text-sm font-semibold text-[#4e7069] hover:bg-[#f7faf8]"
          >
            <Pencil aria-hidden="true" className="h-4 w-4" />
            Edit Budget
          </button>
        </div>
      </div>

     
      <div className="space-y-5 px-5 pb-5">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-sm text-[#4e7069]">
              Monthly spending limit
            </p>

            <p className="mt-2 text-3xl font-bold text-[#17324d]">
              $2,000.00
            </p>
          </div>

          <span className="rounded-full bg-[#e5f3ec] px-3 py-1 text-xs font-semibold text-[#28664f]">
            On track
          </span>
        </div>

        
        <div>
          <div className="mb-2 flex flex-wrap items-center justify-between gap-2 text-sm">
            <p className="text-[#4e7069]">
              $1,000.00 spent
            </p>

            <p className="font-semibold text-[#17324d]">
              50% used
            </p>
          </div>

          <div
            role="progressbar"
            aria-label="Monthly budget used"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={50}
            className="h-3 overflow-hidden rounded-full bg-[#edf3ef]"
          >
            <div
              className="h-full rounded-full bg-[#3f8068]"
              style={{ width: "50%" }}
            />
          </div>

          <p className="mt-2 text-sm text-[#4e7069]">
            <span className="font-semibold text-[#28664f]">
              $1,000.00
            </span>{" "}
            remaining this month.
          </p>
        </div>

        
        <div className="flex items-start gap-2 rounded-lg bg-[#f7faf8] p-3">
          <Bell
            aria-hidden="true"
            className="mt-0.5 h-4 w-4 shrink-0 text-[#3f8068]"
          />

          <p className="text-sm text-[#4e7069]">
            Email notifications are enabled for this budget.
          </p>
        </div>
      </div>

      
      <dialog
        ref={dialogRef}
        aria-labelledby={`${formId}-title`}
        aria-modal="true"
        onCancel={(event) => {
          event.preventDefault();
          setFormMode(null);
        }}
        className="fixed inset-0 m-auto max-h-[90dvh] w-[calc(100%_-_2rem)] max-w-md overflow-y-auto rounded-2xl border border-[#dce7e2] bg-white p-0 text-[#17324d] shadow-2xl backdrop:bg-black/40"
      >
        <div className="flex items-start justify-between gap-4 border-b border-[#e5ebe8] p-5">
          <div>
            <h2
              id={`${formId}-title`}
              className="text-xl font-semibold text-[#123c35]"
            >
              {isEditing
                ? "Edit Monthly Budget"
                : "Create Monthly Budget"}
            </h2>

            <p className="mt-1 text-sm text-[#4e7069]">
              Enter your monthly spending limit.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setFormMode(null)}
            aria-label="Close budget form"
            className="rounded-lg p-2 text-[#7185a1] hover:bg-[#f7faf8]"
          >
            <X aria-hidden="true" className="h-5 w-5" />
          </button>
        </div>

        <form
          ref={formRef}
          onSubmit={(event) => {
            event.preventDefault();

          
          }}
        >
          <div className="space-y-5 p-5">
            <div>
              <label
                htmlFor={`${formId}-amount`}
                className="block text-sm font-medium text-[#4e7069]"
              >
                Monthly budget amount (USD) *
              </label>

              <input
                ref={amountRef}
                id={`${formId}-amount`}
                name="amount"
                type="number"
                min="0.01"
                step="0.01"
                inputMode="decimal"
                required
                defaultValue={isEditing ? "2000.00" : ""}
                placeholder="Enter budget amount"
                className="mt-2 w-full rounded-lg border border-[#dce7e2] bg-[#f7faf8] px-3 py-2.5 text-sm text-[#17324d] placeholder:text-[#7185a1] focus:border-[#3f8068] focus:outline-none"
              />
            </div>

            <div className="flex items-start gap-3">
              <input
                id={`${formId}-notifications`}
                name="emailNotifications"
                type="checkbox"
                defaultChecked={isEditing}
                className="mt-1 h-4 w-4 shrink-0 accent-[#3f8068]"
              />

              <label
                htmlFor={`${formId}-notifications`}
                className="text-sm text-[#4e7069]"
              >
                Email me when spending approaches or exceeds
                my monthly budget.
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
              {isEditing ? "Save Changes" : "Create Budget"}
            </button>
          </div>
        </form>
      </dialog>
    </section>
  );
}