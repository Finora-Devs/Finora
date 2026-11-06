import { useTransactionContext } from "@/app/(protected)/context";
import { Transaction, formatMoney, categoryBreakdown } from "@/lib/types_and_helpers";

type Props = {periodLabel: string };
export default function SpendingByCategory({
  periodLabel,
}: Props) {
  const {transactionsArr} = useTransactionContext();
  const categories = categoryBreakdown(transactionsArr);
  const total = categories.reduce((sum, category) => sum + category.amount, 0);
  let position = 0;
  const stops = categories
    .map((category) => {
      const start = position;
      position += total > 0 ? (category.amount / total) * 100 : 0;
      return `${category.color} ${start}% ${position}%`;
    })
    .join(", ");
  return (
    <section className="self-start rounded-xl border border-[#dce7e2] bg-white p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-[#17324d]">
          Spending by Category
        </h2>
        <span className="rounded-lg border border-[#dce7e2] px-3 py-2 text-xs text-[#607394]">
          {periodLabel}
        </span>
      </div>
      <div className="my-7 flex justify-center">
        <div
          role="img"
          aria-label={`Spending by category for ${periodLabel}. Total ${formatMoney(total)}. Amounts are listed below.`}
          className="flex h-52 w-52 items-center justify-center rounded-full"
          style={{
            background: total > 0 ? `conic-gradient(${stops})` : "#e5ebe8",
          }}
        >
          <div className="flex h-32 w-32 flex-col items-center justify-center rounded-full bg-white text-center">
            <strong className="text-xl text-[#17324d]">
              {formatMoney(total)}
            </strong>
            <span className="mt-1 text-xs text-[#7185a1]">Total Spent</span>
          </div>
        </div>
      </div>
      {total === 0 && (
        <p className="mb-5 text-center text-sm text-[#7185a1]">
          No expenses recorded for this month.
        </p>
      )}
      <ul className="space-y-3 text-sm">
        {categories.map((category) => (
          <li
            key={category.value}
            className="flex items-center gap-2 text-[#17324d]"
          >
            <span
              aria-hidden="true"
              className="h-3 w-3 shrink-0 rounded-full"
              style={{ backgroundColor: category.color }}
            />
            <span className="min-w-0 flex-1">{category.name}</span>
            <span className="font-medium">{formatMoney(category.amount)}</span>
            <span className="w-14 text-right text-[#7185a1]">
              {total > 0 ? ((category.amount / total) * 100).toFixed(1) : "0"}%
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
