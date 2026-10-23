
"use client";

import { useMemo } from "react";
import { useTransactionContext } from "@/app/(protected)/context";

const categoryColors: Record<string, string> = {
  Housing: "#5794f6",
  Food: "#ff8963",
  Transportation: "#ffce32",
  Tuition: "#48c4ac",
  Entertainment: "#c65be3",
  Utilities: "#7b6be8",
  Subscriptions: "#7437ed",
  Other: "#b978d9",
};

const fallbackColors = [
  "#5794f6",
  "#ff8963",
  "#ffce32",
  "#48c4ac",
  "#c65be3",
  "#7b6be8",
  "#7437ed",
  "#b978d9",
];

function formatMoney(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

export default function SpendingByCategory() {
  const { transactionsArr } = useTransactionContext();

  const categories = useMemo(() => {
    const totals = new Map<string, number>();

    for (const transaction of transactionsArr) {
      // Include expenses only.
      if (
        transaction.categories.transaction_type !== "expense"
      ) {
        continue;
      }

      const name = transaction.categories.name;
      const amount = Number(transaction.amount);

      if (!name || !Number.isFinite(amount) || amount <= 0) {
        continue;
      }

      totals.set(
        name,
        (totals.get(name) ?? 0) + amount
      );
    }

    const totalSpent = Array.from(totals.values()).reduce(
      (sum, amount) => sum + amount,
      0
    );

    return Array.from(totals.entries())
      .map(([name, amount], index) => ({
        name,
        amount,
        percent:
          totalSpent > 0
            ? (amount / totalSpent) * 100
            : 0,
        color:
          categoryColors[name] ??
          fallbackColors[index % fallbackColors.length],
      }))
      .sort((a, b) => b.amount - a.amount);
  }, [transactionsArr]);

  const totalSpent = categories.reduce(
    (sum, category) => sum + category.amount,
    0
  );

  let position = 0;

  const chartColors = categories
    .map((category) => {
      const start = position;

      const sliceSize =
        totalSpent > 0
          ? (category.amount / totalSpent) * 100
          : 0;

      position += sliceSize;

      return `${category.color} ${start}% ${position}%`;
    })
    .join(", ");

  return (
    <section className="self-start rounded-xl border border-[#dce7e2] bg-white p-5">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-[#17324d]">
          Spending by Category
        </h2>

        <span className="whitespace-nowrap rounded-lg border border-[#dce7e2] px-3 py-2 text-xs text-[#607394]">
          All Expenses
        </span>
      </div>

      {categories.length === 0 ? (
        <div className="my-7 flex h-52 items-center justify-center text-center">
          <p className="text-sm text-[#7185a1]">
            No expense transactions to display yet.
          </p>
        </div>
      ) : (
        <>
          <div className="my-7 flex justify-center">
            <div
              role="img"
              aria-label={`Spending by category. Total spent: ${formatMoney(totalSpent)}.`}
              className="flex h-52 w-52 items-center justify-center rounded-full"
              style={{
                background: `conic-gradient(${chartColors})`,
              }}
            >
              <div className="flex h-32 w-32 flex-col items-center justify-center rounded-full bg-white text-center">
                <strong className="text-xl text-[#17324d]">
                  {formatMoney(totalSpent)}
                </strong>

                <span className="mt-1 text-xs text-[#7185a1]">
                  Total Spent
                </span>
              </div>
            </div>
          </div>

          <ul className="space-y-3 text-sm">
            {categories.map((category) => (
              <li
                key={category.name}
                className="flex items-center gap-2 text-[#17324d]"
              >
                <span
                  className="h-3 w-3 shrink-0 rounded-full"
                  style={{ backgroundColor: category.color }}
                />

                <span className="min-w-0 flex-1">
                  {category.name}
                </span>

                <span className="font-medium">
                  {formatMoney(category.amount)}
                </span>

                <span className="w-9 text-right text-[#7185a1]">
                  {Math.round(category.percent)}%
                </span>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}
