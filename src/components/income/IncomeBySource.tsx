import { formatMoney, incomeCategories, incomeEntries, totalIncome } from "./incomeData";

const sources = incomeCategories.map((category) => {
  const amount = incomeEntries.filter((entry) => entry.category === category.name).reduce((sum, entry) => sum + entry.amount, 0);
  return { ...category, amount, percent: totalIncome > 0 ? (amount / totalIncome) * 100 : 0 };
});
const chartColors = sources.reduce<{ stops: string[]; position: number }>((result, source) => {
  const end = result.position + source.percent;
  result.stops.push(`${source.color} ${result.position}% ${end}%`);
  result.position = end;
  return result;
}, { stops: [], position: 0 }).stops.join(", ");

export default function IncomeBySource() {
  return (
    <section className="self-start rounded-xl border border-[#dce7e2] bg-white p-5">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-[#17324d]">Income by Source</h2>
        <span className="whitespace-nowrap rounded-lg border border-[#dce7e2] px-3 py-2 text-xs text-[#607394]">September 2026</span>
      </div>
      <div className="my-7 flex justify-center">
        <div role="img" aria-label="September 2026 income by source. Amounts and percentages are listed below."
          className="flex h-52 w-52 items-center justify-center rounded-full"
          style={{ background: totalIncome > 0 ? `conic-gradient(${chartColors})` : "#e5ebe8" }}>
          <div className="flex h-32 w-32 flex-col items-center justify-center rounded-full bg-white text-center">
            <strong className="text-xl text-[#17324d]">{formatMoney(totalIncome)}</strong>
            <span className="mt-1 text-xs text-[#7185a1]">Total Income</span>
          </div>
        </div>
      </div>
      <ul className="space-y-3 text-sm">
        {sources.map((source) => (
          <li key={source.name} className="flex items-center gap-2 text-[#17324d]">
            <span aria-hidden="true" className="h-3 w-3 shrink-0 rounded-full" style={{ backgroundColor: source.color }} />
            <span className="min-w-0 flex-1">{source.name}</span>
            <span className="font-medium">{formatMoney(source.amount)}</span>
            <span className="w-12 text-right text-[#7185a1]">{source.percent}%</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
